import axios from 'axios';
import {
    formatReferenceAnalysisPrompt,
    formatQueryGenerationPrompt,
    loadPromptTemplate
} from '../lib/promptUtils';
import { retryAsyncOperation } from '../lib/retryUtils';
import { Content } from '@google/generative-ai';

// --- Interfaces --- //

export interface LLMAnalysisResult {
    is_relevant: boolean;
    summary?: string;
    extracts?: string[];
    tags?: string[];
}

export interface LLMQueryGenerationResult {
    queries: string[];
}

// --- Helper Functions --- //

function parseAndValidateJsonResponse<T>(
    responseText: string | null,
    expectedKeys: (keyof T)[],
    context: string
): T | null {
    if (!responseText) {
        console.error(`LLM returned empty response for ${context}`);
        return null;
    }
    const cleanedJsonString = responseText.trim().replace(/^```json\n?|\n?```$/g, '');

    if (context.startsWith('Generating queries')) {
        console.log(`  [DEBUG] Cleaned JSON string for ${context}:`, cleanedJsonString);
    }

    try {
        const parsedJson = JSON.parse(cleanedJsonString);
        const missingKeys = expectedKeys.filter(key => !(key in parsedJson));
        if (missingKeys.length > 0) {
            console.warn(`LLM JSON response for ${context} missing keys: ${missingKeys.join(', ')}`);
            console.log(`  [DEBUG] Parsed JSON object with missing keys:`, parsedJson);
        }
        return parsedJson as T;
    } catch (parseError: any) {
        console.error(`Failed to parse LLM JSON response for ${context}:`, parseError.message);
        console.error("  Raw response text was:", responseText);
        return null;
    }
}

async function callGeminiAPI(promptContents: Content[], contextForLogging: string): Promise<string | null> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_GEMINI_API_KEY environment variable is not set.');
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: promptContents,
        generationConfig: {
            responseMimeType: "application/json",
        },
    };

    console.log(`  -> LLM: ${contextForLogging}`);

    try {
        const response = await retryAsyncOperation(
            async () => {
                return await axios.post(apiUrl, requestBody, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 60000
                });
            },
            {
                retries: 3,
                initialDelayMs: 1500,
                backoffFactor: 2,
                onRetry: (error, attempt) => {
                    let status = 'unknown';
                    if (axios.isAxiosError(error) && error.response) {
                        status = String(error.response.status);
                    }
                    console.warn(`    LLM call failed (attempt ${attempt}/${3 + 1}, status: ${status}). Retrying... Error: ${error.message}`);
                }
            }
        );

        const responseData = response.data;
        if (responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return responseData.candidates[0].content.parts[0].text;
        } else {
            console.warn(`  <- LLM: Response structure unexpected. Data:`, responseData);
            return null;
        }
    } catch (error: any) {
        console.error(`  <- LLM: API call failed definitively for ${contextForLogging}:`, error.message);
        if (axios.isAxiosError(error) && error.response) {
            console.error(`    LLM Error Status: ${error.response.status}`);
            console.error(`    LLM Error Data:`, error.response.data);
        }
        return null;
    }
}

// --- Exported Functions --- //

export async function generateSearchQueries(
    issueText: string,
    maxQueries: number = 3
): Promise<string[] | null> {
    const promptTemplate = await loadPromptTemplate('queryGeneration');
    if (!promptTemplate) return null;

    const context = `Generating queries for topic: "${issueText.substring(0, 50)}..."`;

    try {
        const parsedResult = await retryAsyncOperation(
            async () => {
                const promptContents = formatQueryGenerationPrompt(promptTemplate, issueText);
                const rawResponse = await callGeminiAPI(promptContents, context);
                const result = parseAndValidateJsonResponse<LLMQueryGenerationResult>(
                    rawResponse,
                    ['queries'],
                    context
                );
                if (!result || !result.queries || result.queries.length === 0) {
                    console.warn(`  Validation failed for query generation attempt: Result was null, missing 'queries', or empty.`);
                    throw new Error('LLM response validation failed for query generation (expected key: queries)');
                }
                return result;
            },
            {
                retries: 3,
                initialDelayMs: 2000,
                onRetry: (error, attempt) => {
                    console.warn(`  Query generation failed (attempt ${attempt}/${3 + 1}). Retrying... Error: ${error.message}`);
                }
            }
        );

        console.log(`  <- LLM: Generated ${parsedResult.queries.length} queries after validation.`);
        return parsedResult.queries;

    } catch (error) {
        console.error(`  <- LLM: Failed to get valid search queries definitively for topic: "${issueText.substring(0, 50)}..." Error: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}

export async function analyzeContent(
    htmlContent: string,
    originalIssueText: string,
    url: string
): Promise<LLMAnalysisResult | null> {
    const promptTemplate = await loadPromptTemplate('referenceAnalysis');
    if (!promptTemplate) return null;
    const promptContents = formatReferenceAnalysisPrompt(promptTemplate, htmlContent, originalIssueText, url);
    const context = `Analyzing content from URL: ${url} for topic: "${originalIssueText.substring(0, 50)}..."`;
    const rawResponse = await callGeminiAPI(promptContents, context);
    const parsedResult = parseAndValidateJsonResponse<LLMAnalysisResult>(
        rawResponse,
        ['is_relevant', 'summary', 'extracts', 'tags'],
        context
    );
    if (parsedResult) {
        console.log(`  <- LLM: Analysis complete for URL: ${url}. Relevant: ${parsedResult.is_relevant}`);
    } else {
        console.warn(`  <- LLM: Failed to get valid analysis for URL: ${url}`);
    }
    return parsedResult;
} 
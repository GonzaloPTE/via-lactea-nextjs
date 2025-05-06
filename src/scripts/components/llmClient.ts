import axios from 'axios';
import {
    formatReferenceAnalysisPrompt,
    formatQueryGenerationPrompt,
    formatIssueGroupingPrompt,
    formatBlogPostGenerationPrompt,
    loadPromptTemplate,
    formatMarkdownToHtmlPrompt
} from '../lib/promptUtils';
import { retryAsyncOperation } from '../lib/retryUtils';
import { Content } from '@google/generative-ai';
import { z } from 'zod';
import type { PostGenerationData } from '../steps/03-step-04-fetch-data-for-generation'; // Import for type usage

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

// Schema for Issue Grouping (matches expected JSON output from prompt)
const PostGroupSchema = z.object({
    titulo: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().min(1),
    tags: z.array(z.string()).min(1),
    issuesIds: z.array(z.number().int().positive()).min(1),
});
export const PostGroupArraySchema = z.array(PostGroupSchema);
export type PostGroupData = z.infer<typeof PostGroupSchema>;

// Input type for the grouping function
interface IssueInputForGrouping {
    id: number;
    issue_text: string;
    tags: string[] | null;
}

// Input types for blog post generation - using relevant parts from PostGenerationData
// No longer need BlogPostIssueInput or BlogPostReferenceInput here as PostGenerationData is more complete

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

async function callGeminiAPI(
    promptContents: Content[],
    contextForLogging: string,
    expectJson: boolean = true // Default to expecting JSON
): Promise<string | null> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_GEMINI_API_KEY environment variable is not set.');
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const generationConfig: { responseMimeType?: string } = {};
    if (expectJson) {
        generationConfig.responseMimeType = "application/json";
    }

    const requestBody = {
        contents: promptContents,
        generationConfig: generationConfig, // Use potentially modified config
    };

    console.log(`  -> LLM: ${contextForLogging} (Expecting ${expectJson ? 'JSON' : 'Text'})`);

    try {
        const response = await retryAsyncOperation(
            async () => {
                return await axios.post(apiUrl, requestBody, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 90000 // Increased timeout for potentially longer blog post generation
                });
            },
            {
                retries: 3,
                initialDelayMs: 2000, // Increased initial delay
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

export async function groupIssuesWithLLM(
    issues: IssueInputForGrouping[],
    validCategories: string[]
): Promise<PostGroupData[]> {
    const promptTemplate = await loadPromptTemplate('issueGrouping');
    if (!promptTemplate) return [];

    const promptContents = formatIssueGroupingPrompt(promptTemplate, issues, validCategories);
    const context = `Grouping ${issues.length} issues into blog posts (with categories)`;
    const rawResponse = await callGeminiAPI(promptContents, context);

    // Use a specialized parse function or adapt the generic one
    if (!rawResponse) {
        console.error(`LLM returned empty response for ${context}`);
        return [];
    }
    const cleanedJsonString = rawResponse.trim().replace(/^```json\n?|\n?```$/g, '');

    try {
        const parsedJson = JSON.parse(cleanedJsonString);
        const validationResult = PostGroupArraySchema.safeParse(parsedJson);
        if (validationResult.success) {
            console.log(`  <- LLM: Grouping successful. Found ${validationResult.data.length} groups.`);
            return validationResult.data;
        } else {
            console.error(`LLM response validation failed for ${context}:`, validationResult.error.errors);
            // console.log("  Raw response text was:", rawResponse); // Optional: log raw for debug
            return [];
        }
    } catch (parseError: any) {
        console.error(`Failed to parse LLM JSON response for ${context}:`, parseError.message);
        console.error("  Raw response text was:", rawResponse);
        return [];
    }
}

export async function generateBlogPostWithLLM(
    postGenData: PostGenerationData // Changed to accept the full PostGenerationData object
): Promise<string | null> {
    const promptTemplate = await loadPromptTemplate('blogPostGeneration');
    if (!promptTemplate) return null;

    // Pass all necessary fields from postGenData to the formatting function
    const promptContents = formatBlogPostGenerationPrompt(
        promptTemplate,
        postGenData.blogPostTitle,
        postGenData.slug,
        postGenData.category,
        postGenData.tags,
        postGenData.issues,
        postGenData.references
    );
    const context = `Generating blog post content for title: "${postGenData.blogPostTitle.substring(0, 50)}..."`;

    // Call API expecting text response
    const rawResponse = await callGeminiAPI(promptContents, context, false);

    if (rawResponse) {
        console.log(`  <- LLM: Blog post generation successful for "${postGenData.blogPostTitle.substring(0, 50)}..."`);
    } else {
         console.error(`  <- LLM: Blog post generation failed for "${postGenData.blogPostTitle.substring(0, 50)}..."`);
    }

    return rawResponse;
}

export async function convertMarkdownToHtmlWithLLM(
    markdownContent: string
): Promise<string | null> {
    const promptTemplate = await loadPromptTemplate('markdownToHtml');
    if (!promptTemplate) return null;

    const promptContents = formatMarkdownToHtmlPrompt(promptTemplate, markdownContent);
    const context = `Converting Markdown to HTML (length: ${markdownContent.length})`;

    // Call API expecting text response
    const rawResponse = await callGeminiAPI(promptContents, context, false); // Expecting text/html, not JSON

    if (rawResponse) {
        console.log(`  <- LLM: Markdown to HTML conversion successful.`);
        // Basic check: Does it look like HTML?
        if (!rawResponse.trim().startsWith('<')) {
            console.warn(`  LLM response for HTML conversion doesn't look like HTML:`, rawResponse.substring(0, 100));
            // Decide whether to return potentially incorrect response or null
            // For now, return it and let the caller decide/handle potential issues.
        }
    } else {
         console.error(`  <- LLM: Markdown to HTML conversion failed.`);
    }

    // Return the raw response, assuming it's the HTML fragment
    return rawResponse;
} 
import {
    formatReferenceAnalysisPrompt,
    formatQueryGenerationPrompt,
    formatIssueGroupingPrompt,
    formatBlogPostGenerationPrompt,
    loadPromptTemplate,
    formatMarkdownToHtmlPrompt,
    formatPromptForReferenceCorrection,
} from '../lib/promptUtils';
import { retryAsyncOperation } from '../lib/retryUtils';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content, GenerationConfig } from "@google/generative-ai";
import { z } from 'zod';
import type { PostGenerationData } from '../steps/03-step-04-fetch-data-for-generation';
import type { Database } from "../../types/supabase"; // Assuming Database type is primary export
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row']; // Define locally if not directly exported
import type { ReferenceContext } from "../steps/04-step-02-fetch-references-for-posts";

// --- Interfaces & Schemas ---
export interface LLMAnalysisResult {
    is_relevant: boolean;
    summary?: string | null;
    extracts?: string[] | null;
    tags?: string[] | null;
}

export interface LLMQueryGenerationResult {
    queries: string[];
}

const PostGroupSchema = z.object({
    titulo: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().min(1),
    tags: z.array(z.string()).min(1),
    issuesIds: z.array(z.number().int().positive()).min(1),
});
export const PostGroupArraySchema = z.array(PostGroupSchema);
export type PostGroupData = z.infer<typeof PostGroupSchema>;

interface IssueInputForGrouping {
    id: number;
    issue_text: string;
    tags: string[] | null;
}

export interface NumberedReference extends ReferenceContext {
    number: number;
}

// --- Configuration ---
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
if (!API_KEY) {
    console.warn(
        "GOOGLE_GEMINI_API_KEY is not set. LLM client will not function fully. " +
        "This is expected in some test environments where LLMs are mocked."
    );
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const DEFAULT_MODEL_NAME = "gemini-1.5-flash-latest";
const DEFAULT_RETRY_OPTIONS = {
    retries: 3,
    initialDelayMs: 2000,
    backoffFactor: 2,
};

// --- Helper Functions ---
function ensureStringPrompt(promptInput: string | Content[] | Content): string {
    if (typeof promptInput === 'string') {
        return promptInput;
    }
    if (Array.isArray(promptInput)) { // Content[]
        return promptInput.map(contentPart => 
            contentPart.parts.map(part => part.text || '').join('\n')
        ).join('\n');
    } 
    // Assuming it's a single Content object
    return promptInput.parts.map(part => part.text || '').join('\n');
}

function parseAndValidateJsonResponse<T>(
    responseText: string | null,
    context: string,
    schema?: z.ZodType<T, any, any> // Optional Zod schema for validation
): T | null {
    if (!responseText) {
        console.error(`LLM returned empty response for ${context}`);
        return null;
    }
    const cleanedJsonString = responseText.trim().replace(/^```json\n?|\n?```$/g, '');

    try {
        const parsedJson = JSON.parse(cleanedJsonString);
        if (schema) {
            const validationResult = schema.safeParse(parsedJson);
            if (validationResult.success) {
                return validationResult.data;
            } else {
                console.error(`LLM JSON response validation failed for ${context}:`, validationResult.error.errors);
                console.log("  [DEBUG] Raw response for failed validation:", responseText);
                return null;
            }
        }
        // If no schema, perform basic key check (original behavior, less robust)
        // const missingKeys = expectedKeys.filter(key => !(key in parsedJson));
        // if (missingKeys.length > 0) { ... }
        return parsedJson as T; // Use with caution if no schema
    } catch (parseError: any) {
        console.error(`Failed to parse LLM JSON response for ${context}:`, parseError.message);
        console.error("  Raw response text was:", responseText);
        return null;
    }
}

async function callGenerativeModel(prompt: string, modelName: string = DEFAULT_MODEL_NAME, expectJson: boolean = false): Promise<string | null> {
    if (!genAI) {
        console.error("LLM client not initialized because API_KEY is missing.");
        return null;
    }
    try {
        const generationConfig: GenerationConfig = expectJson ? { responseMimeType: "application/json" } : {};
        const model = genAI.getGenerativeModel({
             model: modelName,
             generationConfig: generationConfig,
        });
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];
        const result = await model.generateContent({ contents: [{role: "user", parts: [{text: prompt}]}], safetySettings });
        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error(`Error calling ${modelName} model:`, error.message);
        return null;
    }
}

// --- Exported Functions ---

export async function generateSearchQueriesLLM(
    issue: DiscoveredIssue
): Promise<string[] | null> {
    const promptTemplate = await loadPromptTemplate('queryGeneration');
    if (!promptTemplate) return null;
    const promptContentInput = formatQueryGenerationPrompt(promptTemplate, issue.issue_text);
    const stringPrompt = ensureStringPrompt(promptContentInput);
    const context = `Generating queries for topic: "${issue.issue_text.substring(0, 50)}..."`;
    const rawResponse = await callGenerativeModel(stringPrompt, DEFAULT_MODEL_NAME, true);
    const parsed = parseAndValidateJsonResponse<LLMQueryGenerationResult>(rawResponse, context, z.object({ queries: z.array(z.string()) }));
    return parsed ? parsed.queries : null;
}

export async function analyzeReferenceContentLLM(
    scrapedContent: string,
    issueText: string
): Promise<LLMAnalysisResult | null> {
    const promptTemplate = await loadPromptTemplate('referenceAnalysis');
    if (!promptTemplate) return null;
    const promptContentInput = formatReferenceAnalysisPrompt(promptTemplate, scrapedContent, issueText, '');
    const stringPrompt = ensureStringPrompt(promptContentInput);
    const context = `Analyzing reference content for topic: "${issueText.substring(0,50)}..."`;
    const rawResponse = await callGenerativeModel(stringPrompt, DEFAULT_MODEL_NAME, true);
    return parseAndValidateJsonResponse<LLMAnalysisResult>(
        rawResponse, 
        context,
        z.object({
            is_relevant: z.boolean(),
            summary: z.string().optional().nullable(),
            extracts: z.array(z.string()).optional().nullable(),
            tags: z.array(z.string()).optional().nullable(),
        })
    );
}

export async function groupIssuesWithLLM(
    issues: IssueInputForGrouping[],
    validCategories: string[]
): Promise<PostGroupData[]> { 
    const promptTemplate = await loadPromptTemplate('issueGrouping');
    if (!promptTemplate) return [];
    const promptContentInput = formatIssueGroupingPrompt(promptTemplate, issues, validCategories);
    const stringPrompt = ensureStringPrompt(promptContentInput);
    const context = `Grouping ${issues.length} issues into blog posts`;
    const rawResponse = await callGenerativeModel(stringPrompt, DEFAULT_MODEL_NAME, true);
    const parsed = parseAndValidateJsonResponse<PostGroupData[]>(rawResponse, context, PostGroupArraySchema);
    return parsed || [];
}

export async function generateBlogPostWithLLM(postData: PostGenerationData): Promise<string | null> {
    const promptTemplate = await loadPromptTemplate('blogPostGeneration');
    if (!promptTemplate) return null;
    const promptContentInput = formatBlogPostGenerationPrompt(
        promptTemplate, 
        postData.blogPostTitle, 
        postData.slug, 
        postData.category, 
        postData.tags, 
        postData.issues, 
        postData.references
    );
    const stringPrompt = ensureStringPrompt(promptContentInput);
    return callGenerativeModel(stringPrompt, DEFAULT_MODEL_NAME, false);
}

export async function convertMarkdownToHtmlWithLLM(markdownContent: string): Promise<string | null> {
    const promptTemplate = await loadPromptTemplate('markdownToHtml');
    if (!promptTemplate) return null;
    const promptContentInput = formatMarkdownToHtmlPrompt(promptTemplate, markdownContent);
    const stringPrompt = ensureStringPrompt(promptContentInput);
    return callGenerativeModel(stringPrompt, DEFAULT_MODEL_NAME, false);
}

export async function correctReferencesInHtmlWithLLM(
    htmlContent: string,
    numberedReferences: NumberedReference[],
): Promise<string | null> {
    const promptTemplateName = 'referenceCorrection';
    const promptTemplate = await loadPromptTemplate(promptTemplateName);
    if (!promptTemplate) {
        console.error(`[llmClient.correctReferencesInHtmlWithLLM] Failed to load prompt template: ${promptTemplateName}`);
        return null;
    }

    try {
        return await retryAsyncOperation(
            async () => {
                const promptContentInput = formatPromptForReferenceCorrection(promptTemplate, htmlContent, numberedReferences);
                if (!promptContentInput) {
                    console.error("[llmClient.correctReferencesInHtmlWithLLM] Failed to format prompt inside retry.");
                    throw new Error("Failed to format prompt for reference correction.");
                }
                const stringPrompt = ensureStringPrompt(promptContentInput);
                console.log(`[llmClient.correctReferencesInHtmlWithLLM] Attempting LLM call. Prompt length: ${stringPrompt.length}`);
                const correctedHtml = await callGenerativeModel(stringPrompt, DEFAULT_MODEL_NAME, false);
                if (correctedHtml === null) {
                    throw new Error('LLM returned null for HTML reference correction.');
                }
                
                if (correctedHtml === htmlContent) {
                    console.log("[llmClient.correctReferencesInHtmlWithLLM] LLM made no changes to HTML content.");
                } else {
                    console.log("[llmClient.correctReferencesInHtmlWithLLM] LLM returned corrected HTML content.");
                }
                return correctedHtml;
            },
            { 
                ...DEFAULT_RETRY_OPTIONS, 
                onRetry: (e,a) => console.warn(`HTML ref correction failed (attempt ${a}/${DEFAULT_RETRY_OPTIONS.retries + 1}). Retrying. Err: ${e.message}`)
            }
        );
    } catch (error) {
        console.error(`Failed to correct HTML references definitively for HTML (len: ${htmlContent.length}): ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
} 
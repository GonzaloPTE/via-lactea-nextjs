import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig, Content, GenerateContentResult } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import {
    loadPromptTemplate,
    formatReferenceAnalysisPrompt,
    formatQueryGenerationPrompt
} from '../lib/promptUtils'; // Use the new utility

// Adjust path to find .env.local at the project root relative to this file's location
dotenv.config({ path: path.resolve(__dirname, '/.env.local') });

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

// --- Prompt File Paths ---
// Resolve paths relative to the current file's directory
const PROMPTS_DIR = path.resolve(__dirname, '/.llm/contenidos/prompts');
const GENERADOR_QUERIES_PROMPT_PATH = path.join(PROMPTS_DIR, 'generador-queries.md');
const INVESTIGACION_REFERENCIAS_PROMPT_PATH = path.join(PROMPTS_DIR, 'investigacion-referencias.md');

// --- Interfaces ---
export interface LLMAnalysisResult {
    is_relevant: boolean;
    extracts: string[];
    tags: string[];
    summary: string;
}

interface QueryGenerationResult {
    queries: string[];
}

// --- Helper Functions ---
let genAI: GoogleGenerativeAI | null = null;

function getGenAIClient(): GoogleGenerativeAI {
    if (genAI) {
        return genAI;
    }
    if (!API_KEY) {
        throw new Error("Google Gemini API Key not found in environment variables.");
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    return genAI;
}

/**
 * Internal helper to call the Gemini API with common configurations.
 */
async function callGeminiAPI(
    promptContents: Content[],
    generationConfigOverrides?: Partial<GenerationConfig>
): Promise<GenerateContentResult> {
    if (!API_KEY) {
        throw new Error("LLMClient Error: GOOGLE_GEMINI_API_KEY is not set.");
    }
    const client = getGenAIClient();
    const model = client.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig: GenerationConfig = {
        responseMimeType: "application/json", // Default to JSON output
        temperature: 0.2, // Default low temp for consistency
        maxOutputTokens: 2048,
        ...generationConfigOverrides, // Apply specific overrides
    };

    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    return await model.generateContent({
        contents: promptContents,
        generationConfig,
        safetySettings,
    });
}

/**
 * Parses and validates the JSON response from the LLM.
 */
function parseAndValidateJsonResponse<T>(
    responseText: string,
    validator: (parsed: any) => parsed is T,
    context: string // For logging
): T | null {
    if (!responseText) {
        console.error(`LLM returned empty response for ${context}`);
        return null;
    }
    const cleanedJsonString = responseText.trim().replace(/^```json\n?|\n?```$/g, '');
    try {
        const parsedResult = JSON.parse(cleanedJsonString);
        if (validator(parsedResult)) {
            return parsedResult;
        } else {
             console.error(`Invalid JSON structure received for ${context}. Expected structure failed validation. Received:`, JSON.stringify(parsedResult));
            throw new Error(`Parsed JSON does not match expected structure for ${context}.`);
        }
    } catch (parseError: any) {
        console.error(`Failed to parse LLM JSON response for ${context}:`, parseError.message);
        console.error("Raw response text was:", responseText);
        return null;
    }
}

// --- API Call Functions ---

/**
 * Generates relevant search queries for a given topic using an LLM.
 */
export async function generateSearchQueries(topic: string): Promise<string[] | null> {
    const logContext = `query generation on topic "${topic.substring(0, 50)}..."`;
    console.log(`  -> LLM: Generating queries for topic: "${topic.substring(0, 50)}..."`);
    try {
        const promptTemplate = loadPromptTemplate('queryGeneration');
        const promptContents = formatQueryGenerationPrompt(promptTemplate, topic);

        const result = await callGeminiAPI(promptContents, {
             temperature: 0.5, // Override temperature for query generation
             maxOutputTokens: 1024, // Override max tokens
         });

        const responseText = result.response.text();
        const parsedResult = parseAndValidateJsonResponse<QueryGenerationResult>(
            responseText,
            (p): p is QueryGenerationResult => p && Array.isArray(p.queries),
            logContext
        );

        if (parsedResult) {
             console.log(`  <- LLM: Generated ${parsedResult.queries.length} queries.`);
             return parsedResult.queries;
        }
        return null; // Parsing or validation failed

    } catch (error: any) {
        console.error(`Error calling Google Gemini API for ${logContext}:`, error.message);
        return null;
    }
}

/**
 * Analyzes web content using the Google Gemini API based on a specific topic.
 */
export async function analyzeContent(
    content: string,
    topic: string,
    sourceUrl?: string
): Promise<LLMAnalysisResult | null> {
    const logContext = `content analysis of URL ${sourceUrl || 'unknown'}`;
    console.log(`  -> LLM: Analyzing content from URL: ${sourceUrl || 'unknown'} for topic: "${topic.substring(0, 50)}..."`);
    try {
        const promptTemplate = loadPromptTemplate('referenceAnalysis');
        const promptContents = formatReferenceAnalysisPrompt(promptTemplate, content, topic, sourceUrl);

        const result = await callGeminiAPI(promptContents); // Use default config

        const responseText = result.response.text();
        const parsedResult = parseAndValidateJsonResponse<LLMAnalysisResult>(
            responseText,
            (p): p is LLMAnalysisResult =>
                p != null &&
                typeof p.is_relevant === 'boolean' &&
                Array.isArray(p.extracts) &&
                Array.isArray(p.tags) &&
                typeof p.summary === 'string',
            logContext
        );

        if (parsedResult) {
            console.log(`  <- LLM: Analysis complete for URL: ${sourceUrl || 'unknown'}. Relevant: ${parsedResult.is_relevant}`);
            return parsedResult;
        }
        return null; // Parsing or validation failed

    } catch (error: any) {
        console.error(`Error calling Google Gemini API for ${logContext}:`, error.message);
        return null;
    }
} 
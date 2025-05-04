import fs from 'fs';
import path from 'path';
import { Content } from '@google/generative-ai';

// --- Constants ---
const PROMPTS_DIR = path.resolve(__dirname, '../../../.llm/contenidos/prompts');
const PROMPT_FILE_MAP = {
    queryGeneration: path.join(PROMPTS_DIR, 'generador-queries.md'),
    referenceAnalysis: path.join(PROMPTS_DIR, 'investigacion-referencias.md'),
};
const MAX_CONTENT_LENGTH = 15000; // Max characters for web content in prompts

// --- Public Functions ---

/**
 * Loads a specific prompt template file.
 * @param templateName The key corresponding to the prompt file.
 * @returns The content of the prompt template file.
 */
export function loadPromptTemplate(templateName: keyof typeof PROMPT_FILE_MAP): string {
    const filePath = PROMPT_FILE_MAP[templateName];

    // Add check for invalid template name before accessing fs
    if (!filePath) {
        throw new Error(`Invalid template name provided: ${templateName}`);
    }

    try {
        if (!fs.existsSync(filePath)) {
            // This case might be less likely now if PROMPT_FILE_MAP is accurate,
            // but keep it for robustness.
            throw new Error(`Prompt file not found at path: ${filePath}`);
        }
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error: any) {
        console.error(`Error accessing prompt file: ${filePath}`, error.message);
        throw new Error(`Failed to load prompt template: ${path.basename(filePath)}`);
    }
}

/**
 * Formats the prompt for reference analysis by replacing placeholders.
 */
export function formatReferenceAnalysisPrompt(
    template: string,
    webContent: string,
    topic: string,
    sourceUrl?: string
): Content[] {
    let formattedPrompt = template;

    const replacements: { [key: string]: string } = {
        '{{ incluir programáticamente el array de temas/issues de investigación }}': topic,
        '{{ incluir programáticamente la URL de la página web }}': sourceUrl || 'URL no proporcionada',
    };

    for (const placeholder in replacements) {
         while (formattedPrompt.includes(placeholder)) {
            formattedPrompt = formattedPrompt.replace(placeholder, replacements[placeholder]);
         }
    }

    const truncatedWebContent = webContent.length > MAX_CONTENT_LENGTH
        ? webContent.substring(0, MAX_CONTENT_LENGTH) + "... (contenido truncado)"
        : webContent;

    const contentPlaceholder = '{{ incluir programáticamente el contenido de la página web }}';
    while (formattedPrompt.includes(contentPlaceholder)) {
        formattedPrompt = formattedPrompt.replace(contentPlaceholder, truncatedWebContent);
    }

    // Basic check to remove example blocks if they exist (improves robustness slightly)
    formattedPrompt = formattedPrompt.replace(/```json\n\{.*?\n\}\n```/gs, '');

    return [{ role: "user", parts: [{ text: formattedPrompt }] }];
}

/**
 * Formats the prompt for query generation.
 */
export function formatQueryGenerationPrompt(template: string, topic: string): Content[] {
     // Append the topic to the template, ensuring a newline separation
     const separator = template.endsWith('\n') ? '' : '\n';
     const fullPrompt = template + separator + topic;
    return [{ role: "user", parts: [{ text: fullPrompt }] }];
} 
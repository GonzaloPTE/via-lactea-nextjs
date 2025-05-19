import fs from 'fs';
import path from 'path';
import { Content } from '@google/generative-ai';
import type { Database } from '../../types/supabase'; // For DiscoveredIssue type
import Handlebars from 'handlebars';
import type { NumberedReference } from '../components/llmClient'; // For the new formatter

// Explicitly define types from Supabase schema if not already imported broadly
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Define the specific subset of Reference needed for the prompt (as used in PostGenerationData)
interface ReferenceForPrompt {
    url: string;
    title: string | null;
    summary: string | null;
    extracts: string[] | null;
}

// Type for the keys of prompt templates - add new template keys here
export type PromptTemplateName = 
    | 'queryGeneration' 
    | 'referenceAnalysis' 
    | 'issueGrouping' 
    | 'blogPostGeneration' 
    | 'markdownToHtml'
    | 'referenceCorrection'; // Added new template name

// --- Constants ---
const PROMPTS_DIR = path.resolve(__dirname, '../../../.llm/contenidos/prompts');
const PROMPT_FILE_MAP: Record<PromptTemplateName, string> = {
    queryGeneration: path.join(PROMPTS_DIR, 'generador-queries.md'),
    referenceAnalysis: path.join(PROMPTS_DIR, 'investigacion-referencias.md'),
    issueGrouping: path.join(PROMPTS_DIR, 'agrupador-issues-en-blog-posts.md'),
    blogPostGeneration: path.join(PROMPTS_DIR, 'redactor-blog-posts.md'),
    markdownToHtml: path.join(PROMPTS_DIR, 'markdown-a-html.md'),
    referenceCorrection: path.join(PROMPTS_DIR, 'corrector-referencias-html.md'),
};
const MAX_CONTENT_LENGTH = 15000; // Max characters for web content in prompts

// --- Types for Formatting ---
interface IssueInputForGrouping {
    id: number;
    issue_text: string;
    tags: string[] | null;
}

// Type for blog post generation input (can be refined)
// These are no longer needed here as we use DiscoveredIssue and ReferenceForPrompt directly
// interface BlogPostIssueInput { ... }
// interface BlogPostReferenceInput { ... }

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

/**
 * Formats the prompt for issue grouping into blog posts.
 * @param template The raw prompt template.
 * @param issues The list of issues (id, text, tags) to include.
 * @param validCategories The list of valid categories for the issues.
 * @returns Formatted prompt content for the API.
 */
export function formatIssueGroupingPrompt(template: string, issues: IssueInputForGrouping[], validCategories: string[]): Content[] {
    // Format issues as a simple list or JSON string for the prompt
    // Using JSON string representation here for simplicity
    const issuesJsonString = JSON.stringify(
        issues.map(i => ({ id: i.id, texto: i.issue_text, tags: i.tags })), // Map to Spanish keys if needed by prompt
        null,
        2
    );

    // Format valid categories into a numbered list string
    const categoriesString = validCategories.map((category, index) => `${index + 1}. ${category}`).join('\n');

    let formattedPrompt = template;
    const issuesPlaceholder = '{{ AQUÍ SE INCLUIRÁ EL LOTE DE ISSUES (ID, TEXTO Y TAGS) QUE SE AGREGAREN AL BLOG POST. }}';
    const categoriesPlaceholder = '{{ AQUI SE INCLUIRAN LAS CATEGORIAS VALIDAS }}';

    // Replace the placeholders
    while (formattedPrompt.includes(issuesPlaceholder)) {
         formattedPrompt = formattedPrompt.replace(issuesPlaceholder, issuesJsonString);
    }
    while (formattedPrompt.includes(categoriesPlaceholder)) {
        formattedPrompt = formattedPrompt.replace(categoriesPlaceholder, categoriesString);
    }

    return [{ role: "user", parts: [{ text: formattedPrompt }] }];
}

/**
 * Formats the prompt for generating a full blog post.
 */
export function formatBlogPostGenerationPrompt(
    template: string,
    title: string,
    slug: string,
    category: string | null,
    tags: string[] | null,
    issues: DiscoveredIssue[],
    references: ReferenceForPrompt[]
): Content[] {
    // Format issues and references as readable strings for the prompt
    const issuesString = issues.map(i =>
        `- Issue ID: ${i.id}\n  Texto: ${i.issue_text}\n  Tags: ${i.tags?.join(', ') || 'N/A'}`
    ).join('\n\n');

    const refsString = references.map(r =>
        `- URL: ${r.url}\n  Título: ${r.title || 'N/A'}\n  Resumen: ${r.summary || 'N/A'}\n  Extractos: \n${r.extracts?.map(e => `    - ${e}`).join('\n') || '    N/A'}`
    ).join('\n\n');

    let formattedPrompt = template;
    const replacements = {
        '{{ AQUÍ SE INCLUIRÁ EL TÍTULO DEL BLOG POST. }}': title,
        '{{ AQUÍ SE INCLUIRÁ EL SLUG DEL BLOG POST. }}': slug,
        '{{ AQUÍ SE INCLUIRÁ LA CATEGORÍA DEL BLOG POST. }}': category || 'N/A',
        '{{ AQUÍ SE INCLUIRÁN LOS TAGS DEL BLOG POST. }}': tags?.join(', ') || 'N/A',
        '{{ AQUÍ SE INCLUIRÁN LOS ISSUES (ID, TEXTO Y TAGS) QUE SE AGREGAREN AL BLOG POST. }}': issuesString,
        '{{ AQUÍ SE INCLUIRÁN LAS REFERENCIAS COMPLETAS CON SUS RESUMENES LLM Y EXTRACTOS DISPONIBLES. }}': refsString,
    };

    for (const placeholder in replacements) {
        while (formattedPrompt.includes(placeholder)) {
            formattedPrompt = formattedPrompt.replace(placeholder, replacements[placeholder as keyof typeof replacements]);
        }
    }
    return [{ role: "user", parts: [{ text: formattedPrompt }] }];
}

/**
 * Formats the prompt for converting Markdown to HTML.
 */
export function formatMarkdownToHtmlPrompt(template: string, markdownContent: string): Content[] {
    let formattedPrompt = template;
    const placeholder = '{{ AQUI SE INCLUIRÁ EL CONTENIDO MARKDOWN }}';

    // Replace the placeholder, ensuring no infinite loop if placeholder is missing
    // Limit replacement just in case, although while loop is common practice here
    let safety = 0;
    while (formattedPrompt.includes(placeholder) && safety < 5) {
         formattedPrompt = formattedPrompt.replace(placeholder, markdownContent);
         safety++;
    }
    if (safety >= 5) {
        console.warn('[formatMarkdownToHtmlPrompt] Placeholder replacement limit reached. Check template or content.');
    }

    return [{ role: "user", parts: [{ text: formattedPrompt }] }];
}

/**
 * Formats the prompt for correcting HTML references.
 * @param templateContent The loaded prompt template content.
 * @param htmlContent The HTML content of the blog post.
 * @param numberedReferencesForPrompt Array of numbered reference objects.
 * @returns The formatted prompt string, or null if formatting fails.
 */
export function formatPromptForReferenceCorrection(
    templateContent: string,
    htmlContent: string,
    numberedReferencesForPrompt: NumberedReference[]
): string | null {
    try {
        const template = Handlebars.compile(templateContent);
        const data = {
            htmlContent,
            numberedReferencesForPrompt // Pass as is, template uses {{#each numberedReferencesForPrompt}}
        };
        return template(data);
    } catch (error: any) {
        console.error("Error compiling or executing Handlebars template for Reference Correction:", error.message);
        return null;
    }
} 
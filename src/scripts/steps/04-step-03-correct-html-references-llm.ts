import type { BlogPostWithContext } from './04-step-02-fetch-references-for-posts';
// import { correctReferencesInHtmlWithLLM as llmCorrectReferences } from '../components/correctionLlmClient'; // Old import, correctionLlmClient is deleted
import { correctReferencesInHtmlWithLLM as llmCorrectReferences } from '../components/llmClient'; // Corrected import to main llmClient

export interface CorrectedPostData {
    post_id: number;
    original_content_html: string;
    corrected_content_html: string | null; // Null if LLM fails or makes no changes
    current_version: number | null;
}

/**
 * Uses an LLM to correct references in the HTML content of blog posts.
 * @param postsWithContext An array of BlogPostWithContext objects.
 * @returns A Promise resolving to an array of CorrectedPostData objects.
 */
export async function correctHtmlReferencesLlm(
    postsWithContext: BlogPostWithContext[] | null
): Promise<CorrectedPostData[]> {
    if (!postsWithContext || postsWithContext.length === 0) {
        return [];
    }

    console.log(`[Step 04-03] Starting LLM reference correction for ${postsWithContext.length} posts.`);
    const correctedDataArray: CorrectedPostData[] = [];

    for (const post of postsWithContext) {
        console.log(`[Step 04-03] Processing post ID: ${post.id}`);
        if (!post.content_html || post.content_html.trim() === '') {
            console.log(`[Step 04-03] Post ID: ${post.id} has no HTML content. Skipping.`);
            correctedDataArray.push({
                post_id: post.id,
                original_content_html: post.content_html || '',
                corrected_content_html: post.content_html || '', // No change if no content
                current_version: post.current_version,
            });
            continue;
        }

        // Prepare numbered references for the prompt
        const numberedReferences = post.relevant_references.map((ref, index) => ({
            number: index + 1,
            ...ref,
        }));

        try {
            // Assume llmCorrectReferences takes the HTML content and the numbered references
            // and returns the corrected HTML string or null if it fails/makes no pertinent changes.
            const correctedHtml = await llmCorrectReferences(post.content_html, numberedReferences);

            if (correctedHtml === null) {
                console.log(`[Step 04-03] LLM call for post ID: ${post.id} returned null (no changes or error).`);
                correctedDataArray.push({
                    post_id: post.id,
                    original_content_html: post.content_html,
                    corrected_content_html: null, // Explicitly null if LLM returns null
                    current_version: post.current_version,
                });
            } else if (correctedHtml === post.content_html) {
                console.log(`[Step 04-03] LLM made no changes to HTML for post ID: ${post.id}.`);
                correctedDataArray.push({
                    post_id: post.id,
                    original_content_html: post.content_html,
                    corrected_content_html: post.content_html, // No change
                    current_version: post.current_version,
                });
            } else {
                console.log(`[Step 04-03] LLM successfully corrected HTML for post ID: ${post.id}.`);
                correctedDataArray.push({
                    post_id: post.id,
                    original_content_html: post.content_html,
                    corrected_content_html: correctedHtml,
                    current_version: post.current_version,
                });
            }
        } catch (error: any) {
            console.error(`[Step 04-03] Error during LLM correction for post ID ${post.id}:`, error.message);
            correctedDataArray.push({
                post_id: post.id,
                original_content_html: post.content_html,
                corrected_content_html: null, // Mark as null on error
                current_version: post.current_version,
            });
        }
    }

    console.log(`[Step 04-03] Finished LLM reference correction attempts for ${correctedDataArray.length} posts.`);
    return correctedDataArray;
} 
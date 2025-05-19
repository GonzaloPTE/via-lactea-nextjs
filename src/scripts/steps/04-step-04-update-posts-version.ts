import { getSupabaseClient } from '../lib/supabaseClient';
import type { CorrectedPostData } from './04-step-03-correct-html-references-llm';

export interface UpdateSummary {
    updated_count: number;
    error_count: number;
    skipped_count: number; // Posts where HTML was null or unchanged
}

/**
 * Cleans HTML content by removing specified code fence strings.
 * @param html The HTML string to clean.
 * @returns The cleaned HTML string.
 */
function cleanHtmlContent(html: string | null): string | null {
    if (html === null) return null;
    let cleanedHtml = html;
    // Replace ```html first, then the more general ```
    cleanedHtml = cleanedHtml.replace(/```html/g, '');
    cleanedHtml = cleanedHtml.replace(/```/g, '');
    return cleanedHtml;
}

/**
 * Updates blog posts with corrected HTML content and increments their version.
 * @param correctedPosts An array of CorrectedPostData objects.
 * @returns A Promise resolving to an UpdateSummary object.
 */
export async function updatePostsWithCorrections(
    correctedPosts: CorrectedPostData[] | null
): Promise<UpdateSummary> {
    const summary: UpdateSummary = { updated_count: 0, error_count: 0, skipped_count: 0 };
    if (!correctedPosts || correctedPosts.length === 0) {
        console.log('[Step 04-04] No corrected post data provided. Nothing to update.');
        return summary;
    }

    const supabase = getSupabaseClient();
    console.log(`[Step 04-04] Starting update process for ${correctedPosts.length} posts.`);

    for (const post of correctedPosts) {
        let htmlToSave = post.corrected_content_html;

        // Clean the HTML before further checks or saving
        if (typeof htmlToSave === 'string') {
            htmlToSave = cleanHtmlContent(htmlToSave);
        }

        if (htmlToSave === null) {
            console.log(`[Step 04-04] Post ID: ${post.post_id} has null corrected_content_html after cleaning (or was originally null). Skipping update.`);
            summary.skipped_count++;
            continue;
        }

        // Also clean the original HTML for a fair comparison if it wasn't cleaned before this stage
        const cleanedOriginalHtml = cleanHtmlContent(post.original_content_html);

        if (htmlToSave === cleanedOriginalHtml) {
            console.log(`[Step 04-04] Post ID: ${post.post_id} HTML content unchanged after cleaning. Skipping DB update.`);
            summary.skipped_count++;
            continue;
        }

        const newVersion = (post.current_version ?? 0) + 1;

        try {
            console.log(`[Step 04-04] Updating post ID: ${post.post_id}. New version: ${newVersion}.`);
            const { error } = await supabase
                .from('blog_posts')
                .update({
                    content_html: htmlToSave, // Use the cleaned HTML
                    "version": newVersion, 
                })
                .eq('id', post.post_id);

            if (error) {
                console.error(`[Step 04-04] Error updating post ID ${post.post_id}:`, error.message);
                summary.error_count++;
            } else {
                console.log(`[Step 04-04] Successfully updated post ID ${post.post_id}.`);
                summary.updated_count++;
            }
        } catch (e: any) {
            console.error(`[Step 04-04] Unexpected error during update for post ID ${post.post_id}:`, e.message);
            summary.error_count++;
        }
    }

    console.log(
        `[Step 04-04] Update process finished. Updated: ${summary.updated_count}, Skipped: ${summary.skipped_count}, Errors: ${summary.error_count}`
    );
    return summary;
} 
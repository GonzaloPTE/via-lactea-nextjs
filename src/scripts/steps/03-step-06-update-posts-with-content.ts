import { getSupabaseClient } from '../lib/supabaseClient';
import { convertMarkdownToHtmlWithLLM } from '../components/llmClient';
import type { BlogContentOutput } from './03-step-05-generate-content';

// --- Function ---
export async function processAndSaveGeneratedContent(
    blogPostId: number | null,
    generatedContent: BlogContentOutput | null
): Promise<boolean> {
    if (blogPostId === null || !generatedContent) {
        console.warn(`  Skipping post update due to invalid input. PostID: ${blogPostId}, Generated Content: ${generatedContent === null ? 'null' : 'present'}`);
        return false;
    }

    const { markdownContent, metaDescription } = generatedContent;

    if (typeof markdownContent !== 'string' || typeof metaDescription !== 'string') {
         console.warn(`  Skipping post update for PostID ${blogPostId} due to invalid content types. Markdown: ${typeof markdownContent}, Meta: ${typeof metaDescription}`);
        return false;
    }
    
    console.log(`  Processing generated content and updating post ID: ${blogPostId}`);

    let htmlContent: string | null = null;
    let conversionOk = true; // Flag to track success

    // 1. Attempt Markdown to HTML conversion
    if (markdownContent.trim().length > 0) {
        console.log(`    - Converting Markdown to HTML for post ${blogPostId}...`);
        try {
            htmlContent = await convertMarkdownToHtmlWithLLM(markdownContent);
            if (htmlContent === null) { // Check specifically for null return from LLM function
                console.error(`    - LLM conversion returned null for post ${blogPostId}. Proceeding without HTML.`);
                // Still treat as conversionOk=true, but htmlContent is null
            }
        } catch (error: any) {
            console.error(`    - Error during Markdown to HTML conversion for post ${blogPostId}: ${error.message}`);
            conversionOk = false; // Mark conversion as failed due to exception
        }
    } else {
        console.log(`    - Skipping HTML conversion for post ${blogPostId} due to empty Markdown content.`);
        htmlContent = ''; // Set HTML to empty string if Markdown is empty
    }

    // 2. Decide whether to update DB based on conversionOk flag
    if (!conversionOk) {
        console.log(`!!! Conversion failed, skipping DB update for post ${blogPostId} !!!`);
        return false; // Return false if conversion failed
    } else {
        // *** Proceed to Update Database ONLY if conversion was OK ***
        const supabase = getSupabaseClient();
        try {
            console.log(`    - Updating post ${blogPostId} in DB with content, meta description, HTML, and status...`);
            const { error } = await supabase
                .from('blog_posts')
                .update({
                    content: markdownContent,
                    meta_description: metaDescription,
                    content_html: htmlContent, // Use result (null if failed but allowed, '' if skipped)
                    status: 'draft_generated',
                })
                .eq('id', blogPostId);

            if (error) {
                 console.error(`  Database update error for post ${blogPostId}:`, error);
                 throw error; // Let the catch block below handle DB errors
            }
            console.log(`    - Update successful for post ${blogPostId}.`);
            return true;
        } catch (error: any) {
            // Log the specific DB error before returning false
            console.error(`  Caught error during DB update for post ${blogPostId}: ${error.message}`);
            return false;
        }
    }
}

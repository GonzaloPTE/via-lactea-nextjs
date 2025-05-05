import { getSupabaseClient } from '../lib/supabaseClient';

// --- Constants ---
const SEPARATOR = '---';

// --- Function ---

/**
 * Parses the raw LLM output and updates the blog post record in the database.
 * @param blogPostId The ID of the blog post to update.
 * @param rawContent The raw string output from the LLM (Step 5).
 * @returns True if update was successful, false otherwise.
 */
export async function parseAndUpdatePostContent(blogPostId: number | null, rawContent: string | null): Promise<boolean> {
    if (blogPostId === null || rawContent === null || typeof rawContent !== 'string') {
        console.warn(`  Skipping post update due to invalid input. PostID: ${blogPostId}, Content Type: ${typeof rawContent}`);
        return false;
    }

    console.log(`  Parsing content and updating post ID: ${blogPostId}`);

    // 1. Parse content and meta description
    let content = rawContent.trim(); // Start with trimmed raw content
    let metaDescription: string | null = null; // Default to null

    const separatorIndex = content.lastIndexOf(`\n${SEPARATOR}\n`); // Look for separator surrounded by newlines

    if (separatorIndex !== -1) {
        // Extract meta description (text after the last separator)
        metaDescription = content.substring(separatorIndex + SEPARATOR.length + 2).trim(); // +2 for \n\n
        // Extract content (text before the last separator)
        content = content.substring(0, separatorIndex).trim();
        console.log(`    - Separator found. Content length: ${content.length}, Meta description length: ${metaDescription.length}`);
    } else {
        console.warn(`  Separator "\n${SEPARATOR}\n" not found in raw content for post ${blogPostId}. Storing all as content, meta description will be null.`);
        // Keep all trimmed rawContent as content, metaDescription remains null
    }

    // 2. Update Database
    const supabase = getSupabaseClient();
    try {
        console.log(`    - Updating post ${blogPostId} in DB...`);
        const { error } = await supabase
            .from('blog_posts')
            .update({
                content: content,
                meta_description: metaDescription,
                status: 'draft_generated', // Update status to indicate content is present
            })
            .eq('id', blogPostId);

        if (error) throw error;

        console.log(`    - Update successful for post ${blogPostId}.`);
        return true;
    } catch (error: any) {
        console.error(`  Error updating post ${blogPostId} in DB: ${error.message}`);
        return false;
    }
} 
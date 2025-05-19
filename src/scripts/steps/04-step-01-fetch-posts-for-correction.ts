import { getSupabaseClient } from '../lib/supabaseClient';

// Define types locally
export type BlogPostForCorrection = {
    id: number;
    content_html: string;
    issue_ids: number[] | null; // issue_ids can be null
    current_version: number | null;
};

/**
 * Fetches a batch of blog posts that require reference correction.
 * It first determines the maximum version currently in the blog_posts table.
 * Then, it fetches posts with a version less than this maximum or with a null version,
 * filtering by status and ensuring content_html is present.
 *
 * @param batchSize The maximum number of posts to fetch.
 * @returns A Promise resolving to an array of BlogPostForCorrection objects, or null if no posts are found.
 */
export async function fetchPostsForCorrection(
    batchSize: number
): Promise<BlogPostForCorrection[] | null> {
    const supabase = getSupabaseClient();
    console.log(`[Step 04-01] Fetching posts for reference correction (batch size: ${batchSize}).`);

    try {
        // 1. Determine the current_max_version_from_db
        const { data: maxVersionData, error: maxVersionError } = await supabase
            .from('blog_posts')
            .select('"version"')
            .order('"version"', { ascending: false, nullsFirst: false })
            .limit(1)
            .single();

        if (maxVersionError && maxVersionError.code !== 'PGRST116') { // PGRST116: no rows found
            console.error('[Step 04-01] Error fetching max version:', maxVersionError);
            throw maxVersionError;
        }

        const current_max_version_from_db = maxVersionData?.version ?? 0;
        console.log(`[Step 04-01] Current max version in DB: ${current_max_version_from_db}`);

        let query = supabase
            .from('blog_posts')
            .select('id, content_html, issue_ids, "version"')
            .in('status', ['draft_generated', 'published'])
            .not('content_html', 'is', null)
            .neq('content_html', '');

        // Apply version filtering logic
        // This correctly translates to (version IS NULL OR version < current_max_version_from_db)
        query = query.or(`"version".is.null,"version".lt.${current_max_version_from_db}`);
        
        query = query.order('id', { ascending: true }).limit(batchSize);

        const { data: posts, error: postsError } = await query;

        if (postsError) {
            console.error('[Step 04-01] Error fetching posts for correction:', postsError);
            throw postsError;
        }

        if (!posts || posts.length === 0) {
            console.log('[Step 04-01] No posts found requiring correction in this batch.');
            return null;
        }

        console.log(`[Step 04-01] Fetched ${posts.length} posts for correction.`);
        return posts.map(post => ({
            id: post.id,
            content_html: post.content_html as string,
            issue_ids: post.issue_ids as number[] | null,
            current_version: post.version as number | null,
        }));

    } catch (error) {
        console.error('[Step 04-01] Unexpected error in fetchPostsForCorrection:', error);
        // Do not re-throw here, allow workflow to handle or log it as a step failure
        return null;
    }
} 
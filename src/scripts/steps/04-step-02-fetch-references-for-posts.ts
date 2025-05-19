import { getSupabaseClient } from '../lib/supabaseClient';
import type { BlogPostForCorrection } from './04-step-01-fetch-posts-for-correction';

// Define types locally
export type ReferenceContext = {
    url: string;
    title: string | null;
    summary: string | null;
    extracts: string[] | null;
};

export interface BlogPostWithContext extends BlogPostForCorrection {
    relevant_references: ReferenceContext[];
}

/**
 * Fetches relevant references for a list of blog posts.
 * @param posts An array of BlogPostForCorrection objects.
 * @returns A Promise resolving to an array of BlogPostWithContext objects.
 */
export async function fetchReferencesForPosts(
    posts: BlogPostForCorrection[] | null
): Promise<BlogPostWithContext[]> {
    if (!posts || posts.length === 0) {
        return [];
    }

    const supabase = getSupabaseClient();
    const results: BlogPostWithContext[] = [];
    const allIssueIds = posts.reduce((acc, post) => {
        if (post.issue_ids) {
            acc.push(...post.issue_ids);
        }
        return acc;
    }, [] as number[]);

    if (allIssueIds.length === 0) {
        console.log('[Step 04-02] No issue IDs found in the provided posts. Returning posts without references.');
        return posts.map(post => ({ ...post, relevant_references: [] }));
    }

    // Fetch all relevant references for all unique issue IDs in one go
    console.log(`[Step 04-02] Fetching relevant references for ${allIssueIds.length} unique issue IDs across ${posts.length} posts.`);
    const { data: referencesData, error: refsError } = await supabase
        .from('references')
        .select('discovered_issue_id, url, title, summary, extracts')
        .in('discovered_issue_id', [...new Set(allIssueIds)]) // Use Set to ensure unique IDs
        .eq('is_relevant', true);

    if (refsError) {
        console.error('[Step 04-02] Error fetching references:', refsError);
        // Proceed but posts might have empty references
        // return posts.map(post => ({ ...post, relevant_references: [] })); // Option: return with empty refs
        throw refsError; // Option: or throw to halt the workflow step
    }

    const referencesByIssueId = new Map<number, ReferenceContext[]>();
    if (referencesData) {
        for (const ref of referencesData) {
            if (ref.discovered_issue_id === null) continue;
            const currentRefs = referencesByIssueId.get(ref.discovered_issue_id) || [];
            currentRefs.push({
                url: ref.url,
                title: ref.title,
                summary: ref.summary,
                extracts: ref.extracts as string[] | null, // Cast as per schema or ensure type
            });
            referencesByIssueId.set(ref.discovered_issue_id, currentRefs);
        }
    }

    for (const post of posts) {
        let postSpecificReferences: ReferenceContext[] = [];
        if (post.issue_ids) {
            for (const issueId of post.issue_ids) {
                const refs = referencesByIssueId.get(issueId);
                if (refs) {
                    postSpecificReferences.push(...refs);
                }
            }
        }
        // Remove duplicate references by URL for the same post, if any (e.g. multiple issues pointing to same ref)
        const uniquePostSpecificReferences = Array.from(new Map(postSpecificReferences.map(ref => [ref.url, ref])).values());

        results.push({
            ...post,
            relevant_references: uniquePostSpecificReferences,
        });
    }
    console.log(`[Step 04-02] Successfully processed ${results.length} posts, attaching references.`);
    return results;
} 
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';

// Explicitly define types based on Supabase schema
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];
// type Reference = Database['public']['Tables']['references']['Row']; // Not directly used, subset is
type BlogPost = Database['public']['Tables']['blog_posts']['Row']; // For ensuring fields selected are valid

// Define the specific subset of Reference needed for the prompt
interface ReferenceForPrompt {
    url: string;
    title: string | null;
    summary: string | null;
    extracts: string[] | null;
}

// --- Types ---
export interface PostGenerationData {
    postId: number; // Added postId for easier reference later
    blogPostTitle: string;
    slug: string; // Added slug
    category: string | null; // Added category, assuming it can be null from DB
    tags: string[] | null; // Added tags, assuming it can be null from DB
    issues: DiscoveredIssue[]; 
    references: ReferenceForPrompt[]; 
}

// --- Function ---
export async function fetchDataForPostGeneration(blogPostId: number): Promise<PostGenerationData | null> {
    console.log(`  Fetching full data for blog post ID: ${blogPostId}`);
    const supabase = getSupabaseClient();

    try {
        // 1. Get blog post details
        const { data: post, error: postError } = await supabase
            .from('blog_posts')
            .select('id, title, slug, issue_ids, category, tags') // Added slug, category, tags
            .eq('id', blogPostId)
            .single();

        if (postError) {
            console.error(`  Error fetching blog post ${blogPostId}:`, postError.message);
            return null; 
        }
        if (!post) { // Simplified check, as single() returns null if not found
            console.warn(`  Blog post ${blogPostId} not found.`);
            return null;
        }
        if (!post.issue_ids || post.issue_ids.length === 0) {
            console.warn(`  Blog post ${blogPostId} found, but has no associated issue IDs.`);
            // Depending on requirements, might still want to proceed if other data is useful
            // For now, returning null as content generation heavily relies on issues.
            return null; 
        }

        // 2. Get full issue details for the associated issues
        const { data: issues, error: issuesError } = await supabase
            .from('discovered_issues')
            .select('*') 
            .in('id', post.issue_ids);

        if (issuesError) {
            console.error(`  Error fetching issues for post ${blogPostId}:`, issuesError.message);
            // Consider if this should throw or return null. Returning null for now to be consistent.
            return null; 
        }
        // It's possible issues array is empty or not all issues are found if DB is inconsistent
        if (!issues || issues.length === 0) {
            console.warn(`  No issues found for issue IDs [${post.issue_ids.join(', ')}] associated with post ${blogPostId}.`);
            // Decide if to proceed. For now, returning null if no issues.
            return null;
        }
        if (issues.length !== post.issue_ids.length) {
            console.warn(`  Could not find all issues for post ${blogPostId}. Found ${issues.length}/${post.issue_ids.length}.`);
            // Proceeding with the issues found.
        }

        // 3. Get relevant reference details for those issues
        const { data: referencesData, error: refsError } = await supabase
            .from('references')
            .select('url, title, summary, extracts') 
            .in('discovered_issue_id', post.issue_ids)
            .eq('is_relevant', true);

        if (refsError) {
            console.error(`  Error fetching references for post ${blogPostId}:`, refsError.message);
            // Proceeding without references if query fails
        }

        const references: ReferenceForPrompt[] = referencesData || [];

        console.log(`  Data fetched for post ${blogPostId}: ${issues.length} issues, ${references.length} relevant references.`);

        return {
            postId: post.id, // Added postId
            blogPostTitle: post.title,
            slug: post.slug, // Added slug
            category: post.category, // Added category
            tags: post.tags, // Added tags
            issues: issues, 
            references: references, 
        };

    } catch (error: any) {
        console.error(`  Unexpected error fetching data for post ${blogPostId}: ${error.message}`);
        return null;
    }
} 
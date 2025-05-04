import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';

// Explicitly define types based on Supabase schema
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];
type Reference = Database['public']['Tables']['references']['Row'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

// Define the specific subset of Reference needed for the prompt
interface ReferenceForPrompt {
    url: string;
    title: string | null;
    summary: string | null;
    extracts: string[] | null;
}

// --- Types ---
export interface PostGenerationData {
    blogPostTitle: string;
    issues: DiscoveredIssue[]; // Use actual type
    references: ReferenceForPrompt[]; // Use specific subset type
}

// --- Function ---
export async function fetchDataForPostGeneration(blogPostId: number): Promise<PostGenerationData | null> {
    console.log(`  Fetching full data for blog post ID: ${blogPostId}`);
    const supabase = getSupabaseClient();

    try {
        // 1. Get blog post title and issue IDs
        const { data: post, error: postError } = await supabase
            .from('blog_posts')
            .select('id, title, issue_ids')
            .eq('id', blogPostId)
            .single();

        if (postError) {
            console.error(`  Error fetching blog post ${blogPostId}:`, postError.message);
            return null; // Post not found or DB error
        }
        if (!post || !post.issue_ids || post.issue_ids.length === 0) {
            console.warn(`  Blog post ${blogPostId} found, but has no associated issue IDs.`);
            return null; // No issues to generate content from
        }

        // 2. Get full issue details for the associated issues
        const { data: issues, error: issuesError } = await supabase
            .from('discovered_issues')
            .select('*') // Select all fields for now
            .in('id', post.issue_ids);

        if (issuesError) {
            console.error(`  Error fetching issues for post ${blogPostId}:`, issuesError.message);
            throw issuesError; // Throw if we can't get issues
        }
        if (!issues || issues.length !== post.issue_ids.length) {
            // This case should be rare if issue IDs in post table are valid
            console.warn(`  Could not find all issues for post ${blogPostId}. Found ${issues?.length || 0}/${post.issue_ids.length}.`);
            // Proceeding with the issues found, but this might indicate data inconsistency.
        }

        // 3. Get relevant reference details for those issues
        const { data: referencesData, error: refsError } = await supabase
            .from('references')
            .select('url, title, summary, extracts') // Select only needed fields
            .in('discovered_issue_id', post.issue_ids)
            .eq('is_relevant', true);

        if (refsError) {
            console.error(`  Error fetching references for post ${blogPostId}:`, refsError.message);
            // Proceeding without references if query fails
        }

        const references: ReferenceForPrompt[] = referencesData || [];

        console.log(`  Data fetched for post ${blogPostId}: ${issues.length} issues, ${references.length} relevant references.`);

        return {
            blogPostTitle: post.title,
            issues: issues, // Pass full issue objects
            references: references, // Pass formatted reference objects
        };

    } catch (error: any) {
        console.error(`  Unexpected error fetching data for post ${blogPostId}: ${error.message}`);
        return null;
    }
} 
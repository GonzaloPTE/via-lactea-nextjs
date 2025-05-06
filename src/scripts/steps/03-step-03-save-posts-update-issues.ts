import type { PostGroupData } from './03-step-02-group-issues';
import { getSupabaseClient } from '../lib/supabaseClient';

// --- Function ---

/**
 * Saves new blog post drafts and updates the status of associated issues.
 * Returns an array of the newly created blog post IDs.
 */
export async function savePostsAndMarkIssues(postGroups: PostGroupData[]): Promise<number[]> {
    if (!postGroups || postGroups.length === 0) {
        return [];
    }
    console.log(`  Saving ${postGroups.length} post groups to DB and updating issues...`);
    const createdPostIds: number[] = [];
    const supabase = getSupabaseClient();

    for (const group of postGroups) {
        // Validate group data (basic check)
        if (!group || 
            !group.title || // Changed from titulo to match PostGroupData from 03-step-02
            !group.slug || 
            !group.issue_ids || // Changed from issuesIds to match PostGroupData
            group.issue_ids.length === 0 ||
            !group.category || // Added validation for category
            !group.tags || // Added validation for tags
            group.tags.length === 0
        ) {
            console.warn('  Skipping invalid post group (missing title, slug, issue_ids, category, or tags):', group);
            continue;
        }

        try {
            // Ideally, use a transaction (pg function) for atomicity, but for simplicity:

            // 1. Insert into blog_posts
            console.log(`    - Inserting post draft: "${group.title}" for issues [${group.issue_ids.join(', ')}]`);
            const { data: postData, error: postError } = await supabase
                .from('blog_posts')
                .insert({
                    title: group.title,
                    slug: group.slug,
                    issue_ids: group.issue_ids,
                    category: group.category, // Added category
                    tags: group.tags, // Added tags
                    status: 'draft_grouped', // Updated status as per plan
                    // content, meta_description, content_html are null by default
                    // is_featured is false by default in DB
                })
                .select('id')
                .single(); // Expecting only one row back

            if (postError) {
                // Handle potential unique constraint violation for slug
                if (postError.code === '23505') { // PostgreSQL unique violation code
                    console.warn(`    - Post with slug "${group.slug}" already exists. Skipping insertion.`);
                    // Optionally, find existing post ID?
                    continue; // Skip to next group
                } else {
                    throw postError; // Re-throw other errors
                }
            }
            if (!postData || !postData.id) {
                throw new Error('Failed to insert post or retrieve ID after insertion.');
            }

            const newPostId = postData.id;
            createdPostIds.push(newPostId);

            // 2. Update discovered_issues status
            console.log(`    - Updating status to 'blog_post_assigned' for issues [${group.issue_ids.join(', ')}]`);
            const { error: issueError } = await supabase
                .from('discovered_issues')
                .update({ status: 'blog_post_assigned' })
                .in('id', group.issue_ids);

            if (issueError) {
                // Log the error but maybe don't stop? Or should we try to rollback the post insert?
                // For now, log and continue, the post is created but issues aren't marked.
                console.error(`    - Failed to update status for issues [${group.issue_ids.join(', ')}]: ${issueError.message}`);
            }

        } catch (error: any) {
            console.error(`  Error processing group "${group.title}": ${error.message}`);
            // Log and continue with the next group
        }
    }

    console.log(`  Finished saving. Successfully created ${createdPostIds.length} post drafts.`);
    return createdPostIds;
} 
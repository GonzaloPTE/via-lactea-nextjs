import dotenv from 'dotenv';
import path from 'path';
import { savePostsAndMarkIssues } from './03-step-03-save-posts-update-issues';
import type { PostGroupData } from './03-step-02-group-issues';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Define types locally
type DiscoveredIssueInsert = Database['public']['Tables']['discovered_issues']['Insert'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup ---
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
let testIssueIds: number[] = [];
const testSourceType = 'test-step-03';
const initialIssueStatus = 'ref_analysis_done';
const finalIssueStatus = 'blog_post_assigned';

async function setupTestData() {
    await cleanupTestData(); // Start clean
    const issuesToInsert: DiscoveredIssueInsert[] = [
        { issue_text: 'Issue 901', status: initialIssueStatus, source_type: testSourceType },
        { issue_text: 'Issue 902', status: initialIssueStatus, source_type: testSourceType },
        { issue_text: 'Issue 903', status: initialIssueStatus, source_type: testSourceType },
    ];
    const { data, error } = await supabase.from('discovered_issues').insert(issuesToInsert).select('id');
    if (error) throw new Error(`Setup failed inserting issues: ${error.message}`);
    testIssueIds = data!.map((d: any) => d.id);
    if (testIssueIds.length !== 3) throw new Error('Failed to retrieve exactly 3 test issue IDs.');
    console.log('Test data setup complete.', testIssueIds);
}

async function cleanupTestData() {
    console.log('Cleaning up test data...');
    // Delete posts first (use slugs or issue IDs if possible)
    await supabase.from('blog_posts').delete().like('slug', 'test-post-%');
    await supabase.from('blog_posts').delete().like('slug', 'multi-post-%');
    // Delete issues
    await supabase.from('discovered_issues').delete().eq('source_type', testSourceType);
    console.log('Test data cleanup complete.');
    testIssueIds = [];
}

// Helper to fetch post and issue statuses
async function checkDbState(postIds: number[], issueIds: number[]): Promise<{ posts: BlogPost[], issues: DiscoveredIssue[] }> {
    let posts: BlogPost[] = [];
    let issues: DiscoveredIssue[] = [];

    if (postIds.length > 0) {
        const { data: postData, error: postError } = await supabase.from('blog_posts').select('*').in('id', postIds);
        if (postError) console.error('DB Check Error (Posts):', postError);
        posts = postData || [];
    }
    if (issueIds.length > 0) {
        const { data: issueData, error: issueError } = await supabase.from('discovered_issues').select('*').in('id', issueIds);
        if (issueError) console.error('DB Check Error (Issues):', issueError);
        issues = issueData || [];
    }
    return { posts, issues };
}

// --- Test Suite ---
describe('03-step-03-save-posts-update-issues Integration Tests', () => {
    jest.setTimeout(20000);

    beforeAll(async () => {
        await setupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    // Reset issue statuses before each test that modifies them
    beforeEach(async () => {
        await supabase
            .from('discovered_issues')
            .update({ status: initialIssueStatus })
            .in('id', testIssueIds);
        // Clean any posts potentially created by failed tests
        await supabase.from('blog_posts').delete().like('slug', 'test-post-%');
        await supabase.from('blog_posts').delete().like('slug', 'multi-post-%');
    });

    it('should insert new blog post with correct data', async () => {
        const postGroups: PostGroupData[] = [
            { titulo: 'Test Post 1', slug: 'test-post-1', issuesIds: [testIssueIds[0]] },
        ];
        const createdIds = await savePostsAndMarkIssues(postGroups);
        expect(createdIds).toHaveLength(1);
        const postId = createdIds[0];

        const { posts } = await checkDbState([postId], []);
        expect(posts).toHaveLength(1);
        const post = posts[0];
        expect(post.title).toBe('Test Post 1');
        expect(post.slug).toBe('test-post-1');
        expect(post.issue_ids).toEqual([testIssueIds[0]]);
        expect(post.status).toBe('draft');
        expect(post.content).toBeNull();
    });

    it('should update status of associated issues to blog_post_assigned', async () => {
        const issueIdsToUpdate = [testIssueIds[1], testIssueIds[2]];
        const postGroups: PostGroupData[] = [
            { titulo: 'Test Post 2', slug: 'test-post-2', issuesIds: issueIdsToUpdate },
        ];
        const createdIds = await savePostsAndMarkIssues(postGroups);
        expect(createdIds).toHaveLength(1);

        const { issues } = await checkDbState([], issueIdsToUpdate);
        expect(issues).toHaveLength(issueIdsToUpdate.length);
        expect(issues.every(i => i.status === finalIssueStatus)).toBe(true);
    });

    it('should handle multiple post groups in one call', async () => {
        const groups: PostGroupData[] = [
            { titulo: 'Multi Post A', slug: 'multi-post-a', issuesIds: [testIssueIds[0]] },
            { titulo: 'Multi Post B', slug: 'multi-post-b', issuesIds: [testIssueIds[1]] },
        ];
        const createdIds = await savePostsAndMarkIssues(groups);
        expect(createdIds).toHaveLength(2);

        const { posts, issues } = await checkDbState(createdIds, [testIssueIds[0], testIssueIds[1]]);
        expect(posts).toHaveLength(2);
        expect(issues).toHaveLength(2);
        expect(issues.every(i => i.status === finalIssueStatus)).toBe(true);
        expect(posts.find(p => p.slug === 'multi-post-a')).toBeDefined();
        expect(posts.find(p => p.slug === 'multi-post-b')).toBeDefined();
    });

    it('should return an empty array if input is empty', async () => {
        const createdIds = await savePostsAndMarkIssues([]);
        expect(createdIds).toEqual([]);
    });

    it('should skip groups with duplicate slugs but process others', async () => {
        // Insert first post
        const group1: PostGroupData = { titulo: 'Test Post Dup', slug: 'test-post-dup', issuesIds: [testIssueIds[0]] };
        const firstIds = await savePostsAndMarkIssues([group1]);
        expect(firstIds).toHaveLength(1);

        // Try inserting same slug again, plus a new one
        const group2: PostGroupData = { titulo: 'Test Post Dup Again', slug: 'test-post-dup', issuesIds: [testIssueIds[1]] };
        const group3: PostGroupData = { titulo: 'Test Post Other', slug: 'test-post-other', issuesIds: [testIssueIds[2]] };
        const secondIds = await savePostsAndMarkIssues([group2, group3]);

        // Should only return ID for the non-duplicate post
        expect(secondIds).toHaveLength(1);
        const { posts: postsAfter, issues: issuesAfter } = await checkDbState(secondIds, [testIssueIds[1], testIssueIds[2]]);
        expect(postsAfter).toHaveLength(1);
        expect(postsAfter[0].slug).toBe('test-post-other'); // Check the correct post was inserted
        expect(issuesAfter.find(i => i.id === testIssueIds[1])?.status).toBe(initialIssueStatus); // Issue status for skipped post should not change
        expect(issuesAfter.find(i => i.id === testIssueIds[2])?.status).toBe(finalIssueStatus); // Issue status for successful post should change
    });

}); 
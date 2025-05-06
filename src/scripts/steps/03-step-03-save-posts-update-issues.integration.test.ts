import dotenv from 'dotenv';
import path from 'path';
import { savePostsAndMarkIssues } from './03-step-03-save-posts-update-issues';
import type { PostGroupData } from './03-step-02-group-issues';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';

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
const testSourceType = 'test-step-03'; // Used for discovered_issues
const testBlogTag = 'test-data-step-03'; // Will be added to all test blog posts for cleanup
const initialIssueStatus = 'ref_analysis_done';
const finalIssueStatus = 'blog_post_assigned';

// Keep track of all post IDs created during the entire test suite run for a final cleanup in afterAll
let allCreatedPostIdsInSuite: number[] = [];

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
    console.log('Test data setup complete (issues inserted).', testIssueIds);
}

async function cleanupTestData() {
    console.log('Cleaning up test data...');
    // 1. Delete posts tagged for this test suite or matching common test slug patterns
    console.log(`Attempting to delete blog posts with tag: ${testBlogTag}`);
    const { error: postDeleteByTagError } = await supabase
        .from('blog_posts')
        .delete()
        .contains('tags', [testBlogTag]); // Assumes tags is an array
    if (postDeleteByTagError) {
        console.error(`Error deleting test blog_posts by tag '${testBlogTag}':`, postDeleteByTagError.message);
    }
    
    // Fallback/additional cleanup for slugs if tagging wasn't perfect or for older data
    const testSlugPatterns = ['test-post-%', 'multi-post-%', 'valid-group-%', 'invalid-group-%'];
    for (const pattern of testSlugPatterns) {
        console.log(`Attempting to delete blog posts with slug pattern: ${pattern}`);
        const { error: postDeleteByPatternError } = await supabase.from('blog_posts').delete().like('slug', pattern);
        if (postDeleteByPatternError) {
            console.error(`Error deleting test blog_posts by slug pattern '${pattern}':`, postDeleteByPatternError.message);
        }
    }
    
    // Explicitly delete any posts whose IDs were tracked if other methods fail
    if (allCreatedPostIdsInSuite.length > 0) {
        console.log(`Attempting to delete blog posts by tracked IDs: ${allCreatedPostIdsInSuite.join(', ')}`);
        const { error: postDeleteByIdsError } = await supabase.from('blog_posts').delete().in('id', allCreatedPostIdsInSuite);
        if (postDeleteByIdsError) {
            console.error('Error deleting test blog_posts by tracked IDs:', postDeleteByIdsError.message);
        }
    }

    // 2. Delete issues created by this test suite
    console.log(`Attempting to delete discovered_issues with source_type: ${testSourceType}`);
    const { error: issueDeleteError } = await supabase.from('discovered_issues').delete().eq('source_type', testSourceType);
    if (issueDeleteError) {
        console.error('Error deleting test discovered_issues:', issueDeleteError.message);
    }

    console.log('Test data cleanup attempt complete.');
    testIssueIds = [];
    allCreatedPostIdsInSuite = []; // Reset for next potential suite run in same session
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
    jest.setTimeout(20000); // Keep generous timeout

    beforeAll(async () => {
        await setupTestData(); // Calls cleanupTestData first
    });

    afterAll(async () => {
        await cleanupTestData(); // Final cleanup
    });

    beforeEach(async () => {
        // Reset issue statuses that might have been changed by a test
        if (testIssueIds.length > 0) {
            await supabase
                .from('discovered_issues')
                .update({ status: initialIssueStatus })
                .in('id', testIssueIds);
        }
        // The more general cleanup is now in beforeAll/afterAll via cleanupTestData()
        // No need for specific slug deletions here anymore.
    });

    // Modified test data to include the testBlogTag
    it('should insert new blog post with correct data, including category and tags', async () => {
        const postGroups: PostGroupData[] = [
            {
                title: 'Test Post 1',
                slug: 'test-post-1',
                issue_ids: [testIssueIds[0]],
                category: 'Sueño Infantil',
                tags: ['test', 'sleep', testBlogTag] // Added testBlogTag
            },
        ];
        const createdIds = await savePostsAndMarkIssues(postGroups);
        allCreatedPostIdsInSuite.push(...createdIds); // Track IDs
        expect(createdIds).toHaveLength(1);
        const postId = createdIds[0];

        const { posts } = await checkDbState([postId], []);
        expect(posts).toHaveLength(1);
        const post = posts[0];
        expect(post.title).toBe('Test Post 1');
        expect(post.slug).toBe('test-post-1');
        expect(post.issue_ids).toEqual([testIssueIds[0]]);
        expect(post.category).toBe('Sueño Infantil');
        expect(post.tags).toEqual(['test', 'sleep', testBlogTag]);
        expect(post.status).toBe('draft_grouped');
        expect(post.content).toBeNull();
    });

    it('should update status of associated issues to blog_post_assigned', async () => {
        const issueIdsToUpdate = [testIssueIds[1], testIssueIds[2]];
        const postGroups: PostGroupData[] = [
            {
                title: 'Test Post 2',
                slug: 'test-post-2',
                issue_ids: issueIdsToUpdate,
                category: 'Lactancia Materna y Alimentación',
                tags: ['test', 'feeding', testBlogTag] // Added testBlogTag
            },
        ];
        const createdIds = await savePostsAndMarkIssues(postGroups);
        allCreatedPostIdsInSuite.push(...createdIds); // Track IDs
        expect(createdIds).toHaveLength(1);

        const { issues } = await checkDbState([], issueIdsToUpdate);
        expect(issues).toHaveLength(issueIdsToUpdate.length);
        expect(issues.every(i => i.status === finalIssueStatus)).toBe(true);
    });

    it('should handle multiple post groups in one call', async () => {
        const groups: PostGroupData[] = [
            {
                title: 'Multi Post A',
                slug: 'multi-post-a',
                issue_ids: [testIssueIds[0]],
                category: 'Sueño Infantil',
                tags: ['test', 'multi-a', testBlogTag]
            },
            {
                title: 'Multi Post B',
                slug: 'multi-post-b',
                issue_ids: [testIssueIds[1]],
                category: 'Desarrollo y Crecimiento',
                tags: ['test', 'multi-b', testBlogTag]
            },
        ];
        const createdIds = await savePostsAndMarkIssues(groups);
        allCreatedPostIdsInSuite.push(...createdIds); // Track IDs
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
        // No IDs created, so nothing to add to allCreatedPostIdsInSuite
        expect(createdIds).toEqual([]);
    });

    it('should skip groups with duplicate slugs but process others', async () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const group1: PostGroupData = {
            title: 'Test Post Dup',
            slug: 'test-post-dup',
            issue_ids: [testIssueIds[0]],
            category: 'Sueño Infantil',
            tags: ['test', 'dup1', testBlogTag]
        };
        const firstIds = await savePostsAndMarkIssues([group1]);
        allCreatedPostIdsInSuite.push(...firstIds); // Track IDs
        expect(firstIds).toHaveLength(1);

        const group2: PostGroupData = { 
            title: 'Test Post Dup Again',
            slug: 'test-post-dup', 
            issue_ids: [testIssueIds[1]],
            category: 'Lactancia Materna y Alimentación',
            tags: ['test', 'dup2-skipped', testBlogTag]
        };
        const group3: PostGroupData = { 
            title: 'Test Post Other',
            slug: 'test-post-other',
            issue_ids: [testIssueIds[2]],
            category: 'Desarrollo y Crecimiento',
            tags: ['test', 'other', testBlogTag]
        };
        const secondIds = await savePostsAndMarkIssues([group2, group3]);
        allCreatedPostIdsInSuite.push(...secondIds); // Track IDs (only group3's ID will be here)

        expect(secondIds).toHaveLength(1);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Post with slug "test-post-dup" already exists. Skipping insertion.')
        );

        const { posts: postsAfter, issues: issuesAfter } = await checkDbState([firstIds[0], ...secondIds], [testIssueIds[0], testIssueIds[1], testIssueIds[2]]);
        
        // Should be 2 posts in DB: group1 and group3
        expect(postsAfter.length).toBe(2); 
        expect(postsAfter.find(p => p.slug === 'test-post-dup')).toBeDefined(); // from group1
        expect(postsAfter.find(p => p.slug === 'test-post-other')).toBeDefined(); // from group3
        
        const issueFromGroup1 = issuesAfter.find(i => i.id === testIssueIds[0]);
        expect(issueFromGroup1?.status).toBe(finalIssueStatus); 

        const issueFromGroup2 = issuesAfter.find(i => i.id === testIssueIds[1]);
        expect(issueFromGroup2?.status).toBe(initialIssueStatus);

        const issueFromGroup3 = issuesAfter.find(i => i.id === testIssueIds[2]);
        expect(issueFromGroup3?.status).toBe(finalIssueStatus);

        consoleWarnSpy.mockRestore();
    });

    it('should skip invalid post groups (e.g. missing title) and not process them', async () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const invalidGroupNoTitle = {
            slug: 'invalid-group-no-title',
            issue_ids: [testIssueIds[0]],
            category: 'Test Category',
            tags: ['test', 'invalid', testBlogTag] // Added tag for potential cleanup
        } as any; 

        const validGroup: PostGroupData = {
            title: 'Valid Group with Cat Tags',
            slug: 'valid-group-with-cat-tags',
            issue_ids: [testIssueIds[1]],
            category: 'Sueño Infantil',
            tags: ['test', 'valid', testBlogTag]
        };

        const resultPostIds = await savePostsAndMarkIssues([invalidGroupNoTitle, validGroup]);
        allCreatedPostIdsInSuite.push(...resultPostIds); // Track IDs
        
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Skipping invalid post group (missing title, slug, issue_ids, category, or tags):'),
            expect.objectContaining({ slug: 'invalid-group-no-title' })
        );
        
        expect(resultPostIds).toHaveLength(1);
        expect(resultPostIds[0]).toBeDefined();

        const { posts } = await checkDbState(resultPostIds, []);
        expect(posts).toHaveLength(1);
        expect(posts[0].slug).toBe('valid-group-with-cat-tags');

        consoleWarnSpy.mockRestore();
    });
}); 
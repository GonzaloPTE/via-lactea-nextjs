import dotenv from 'dotenv';
import path from 'path';
import { fetchDataForPostGeneration, PostGenerationData } from './03-step-04-fetch-data-for-generation';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Define types locally
type DiscoveredIssueInsert = Database['public']['Tables']['discovered_issues']['Insert'];
type ReferenceInsert = Database['public']['Tables']['references']['Insert'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup ---
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();

const testDataSource = 'test-step-04-fetch'; // Unique identifier for test data
let createdBlogPostId: number | null = null;
let createdIssueIds: number[] = [];
let createdReferenceIds: number[] = [];

async function setupTestData() {
    await cleanupTestData(); // Ensure a clean slate

    // 1. Create Discovered Issues
    const issuesToInsert: DiscoveredIssueInsert[] = [
        { issue_text: 'Test Issue 1 for Step 04', source_type: testDataSource, status: 'blog_post_assigned' },
        { issue_text: 'Test Issue 2 for Step 04', source_type: testDataSource, status: 'blog_post_assigned' },
    ];
    const { data: issuesData, error: issuesError } = await supabase
        .from('discovered_issues')
        .insert(issuesToInsert)
        .select('id');
    if (issuesError) throw new Error(`Setup: Failed to insert issues: ${issuesError.message}`);
    createdIssueIds = issuesData!.map(i => i.id);
    if (createdIssueIds.length !== 2) throw new Error('Setup: Did not get 2 issue IDs back.');

    // 2. Create References for these issues
    const referencesToInsert: ReferenceInsert[] = [
        // Relevant reference for issue 1
        { discovered_issue_id: createdIssueIds[0], url: 'http://example.com/ref1', title: 'Relevant Ref 1', summary: 'Summary 1', extracts: ['Extract 1.1', 'Extract 1.2'], is_relevant: true },
        // Irrelevant reference for issue 1
        { discovered_issue_id: createdIssueIds[0], url: 'http://example.com/ref2', title: 'Irrelevant Ref', is_relevant: false },
        // Relevant reference for issue 2
        { discovered_issue_id: createdIssueIds[1], url: 'http://example.com/ref3', title: 'Relevant Ref 2', summary: 'Summary 2', extracts: ['Extract 2.1'], is_relevant: true },
    ];
    const { data: refsData, error: refsError } = await supabase
        .from('references')
        .insert(referencesToInsert)
        .select('id');
    if (refsError) throw new Error(`Setup: Failed to insert references: ${refsError.message}`);
    createdReferenceIds = refsData!.map(r => r.id);

    // 3. Create a Blog Post linking to these issues
    const blogPostToInsert: BlogPostInsert = {
        title: 'Test Blog Post for Step 04',
        slug: `test-post-step-04-${Date.now()}`,
        issue_ids: [createdIssueIds[0], createdIssueIds[1]],
        category: 'Test Category Step 04',
        tags: ['test', 'step04', 'fetch-data'],
        status: 'draft_grouped',
        // content, meta_description, content_html, user_id, is_featured, view_count, published_at are null/default
    };
    const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .insert(blogPostToInsert)
        .select('id')
        .single();
    if (postError) throw new Error(`Setup: Failed to insert blog post: ${postError.message}`);
    if (!postData || !postData.id) throw new Error('Setup: Did not get blog post ID back.');
    createdBlogPostId = postData.id;

    console.log(`Setup complete: BlogPost ID ${createdBlogPostId}, Issues IDs ${createdIssueIds.join(', ')}`);
}

async function cleanupTestData() {
    console.log('Cleanup: Starting test data deletion...');
    if (createdBlogPostId) {
        const { error } = await supabase.from('blog_posts').delete().eq('id', createdBlogPostId);
        if (error) console.error('Cleanup: Error deleting blog post:', error.message);
        else console.log(`Cleanup: Deleted blog post ID ${createdBlogPostId}`);
    }
    if (createdReferenceIds.length > 0) {
        const { error } = await supabase.from('references').delete().in('id', createdReferenceIds);
        if (error) console.error('Cleanup: Error deleting references:', error.message);
        else console.log(`Cleanup: Deleted ${createdReferenceIds.length} references`);
    }
    if (createdIssueIds.length > 0) {
        const { error } = await supabase.from('discovered_issues').delete().in('id', createdIssueIds);
        if (error) console.error('Cleanup: Error deleting issues:', error.message);
        else console.log(`Cleanup: Deleted ${createdIssueIds.length} issues`);
    }
    // Fallback for issues if IDs weren't captured but source_type was set
    const { error: fallbackError } = await supabase.from('discovered_issues').delete().eq('source_type', testDataSource);
    if (fallbackError) console.error('Cleanup: Error in fallback issue deletion:', fallbackError.message);
    else console.log(`Cleanup: Fallback deletion for source_type ${testDataSource} attempted.`);

    createdBlogPostId = null;
    createdIssueIds = [];
    createdReferenceIds = [];
    console.log('Cleanup: Test data deletion attempt complete.');
}

describe('03-step-04-fetch-data-for-generation Integration Tests', () => {
    jest.setTimeout(25000); // Generous timeout for DB operations

    beforeAll(async () => {
        await setupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    it('should fetch all necessary data for post generation', async () => {
        if (!createdBlogPostId) {
            throw new Error('Test setup failed: createdBlogPostId is null.');
        }

        const result = await fetchDataForPostGeneration(createdBlogPostId);

        expect(result).not.toBeNull();
        const data = result as PostGenerationData;

        // Verify blog post details
        expect(data.postId).toBe(createdBlogPostId);
        expect(data.blogPostTitle).toBe('Test Blog Post for Step 04');
        expect(data.slug).toMatch(/^test-post-step-04-/);
        expect(data.category).toBe('Test Category Step 04');
        expect(data.tags).toEqual(['test', 'step04', 'fetch-data']);

        // Verify issues
        expect(data.issues).toHaveLength(2);
        expect(data.issues.map(i => i.id).sort()).toEqual([...createdIssueIds].sort());
        expect(data.issues.find(i => i.id === createdIssueIds[0])?.issue_text).toBe('Test Issue 1 for Step 04');
        expect(data.issues.find(i => i.id === createdIssueIds[1])?.issue_text).toBe('Test Issue 2 for Step 04');

        // Verify references (only relevant ones)
        expect(data.references).toHaveLength(2); // We inserted 2 relevant, 1 irrelevant
        const refUrls = data.references.map(r => r.url).sort();
        expect(refUrls).toEqual(['http://example.com/ref1', 'http://example.com/ref3'].sort());
        
        const ref1 = data.references.find(r => r.url === 'http://example.com/ref1');
        expect(ref1?.title).toBe('Relevant Ref 1');
        expect(ref1?.summary).toBe('Summary 1');
        expect(ref1?.extracts).toEqual(['Extract 1.1', 'Extract 1.2']);

        const ref3 = data.references.find(r => r.url === 'http://example.com/ref3');
        expect(ref3?.title).toBe('Relevant Ref 2');
        expect(ref3?.summary).toBe('Summary 2');
        expect(ref3?.extracts).toEqual(['Extract 2.1']);
    });

    it('should return null if blog post ID does not exist', async () => {
        const nonExistentId = -1; // Or a very large number unlikely to exist
        const result = await fetchDataForPostGeneration(nonExistentId);
        expect(result).toBeNull();
    });

    it('should return null if blog post has no issue_ids', async () => {
        // Setup: Create a temporary post with no issue_ids
        const tempPostNoIssues: BlogPostInsert = {
            title: 'Temp Post No Issues',
            slug: `temp-post-no-issues-${Date.now()}`,
            issue_ids: [], // Empty issue_ids
            category: 'Test Category',
            tags: ['test', 'no-issues'],
            status: 'draft_grouped',
        };
        const { data: postData, error: postError } = await supabase
            .from('blog_posts')
            .insert(tempPostNoIssues)
            .select('id')
            .single();
        if (postError || !postData) throw new Error('Failed to create temp post for no_issue_ids test');
        
        const result = await fetchDataForPostGeneration(postData.id);
        expect(result).toBeNull();

        // Cleanup this temporary post
        await supabase.from('blog_posts').delete().eq('id', postData.id);
    });

    // Add more test cases:
    // - What if issues linked in blog_posts.issue_ids do not exist in discovered_issues table?
    //   (Current code logs warning and proceeds with found issues, or returns null if NO issues are found)
    // - What if a post has issues but no relevant references?
    //   (Current code should return empty array for references, which is fine)
}); 
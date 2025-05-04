import dotenv from 'dotenv';
import path from 'path';
import { fetchDataForPostGeneration } from './03-step-04-fetch-data-for-generation';
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
let testPostId: number | null = null;
let testIssueIds: number[] = [];
let testRelevantRefUrls: string[] = [];
const testSourceType = 'test-step-04';
const testPostTitle = 'Test Post for Fetching';
const testPostSlug = 'test-post-for-fetching';

async function setupTestData() {
    await cleanupTestData(); // Start clean

    // 1. Create Issues
    const issuesToInsert: DiscoveredIssueInsert[] = [
        { issue_text: 'Issue T4-1', status: 'blog_post_assigned', source_type: testSourceType },
        { issue_text: 'Issue T4-2', status: 'blog_post_assigned', source_type: testSourceType },
    ];
    const { data: issuesData, error: issueError } = await supabase.from('discovered_issues').insert(issuesToInsert).select('id');
    if (issueError) throw new Error(`Setup failed inserting issues: ${issueError.message}`);
    testIssueIds = issuesData!.map((d: any) => d.id);
    if (testIssueIds.length !== 2) throw new Error('Failed to retrieve test issue IDs.');

    // 2. Create References (relevant and irrelevant)
    const refsToInsert: ReferenceInsert[] = [
        { discovered_issue_id: testIssueIds[0], url: 'http://relevant1.com', is_relevant: true, title: 'Relevant 1', summary: 'Summary 1', extracts: ['e1'] },
        { discovered_issue_id: testIssueIds[0], url: 'http://irrelevant1.com', is_relevant: false, title: 'Irrelevant 1' },
        { discovered_issue_id: testIssueIds[1], url: 'http://relevant2.com', is_relevant: true, title: 'Relevant 2', summary: 'Summary 2', extracts: ['e2'] },
        { discovered_issue_id: testIssueIds[1], url: 'http://relevant3.com', is_relevant: true, title: 'Relevant 3', summary: 'Summary 3', extracts: ['e3'] },
    ];
    testRelevantRefUrls = ['http://relevant1.com', 'http://relevant2.com', 'http://relevant3.com'];
    const { error: refError } = await supabase.from('references').insert(refsToInsert);
    if (refError) throw new Error(`Setup failed inserting references: ${refError.message}`);

    // 3. Create Blog Post linking to issues
    const postToInsert: BlogPostInsert = {
        title: testPostTitle,
        slug: testPostSlug,
        issue_ids: testIssueIds,
        status: 'draft',
    };
    const { data: postData, error: postError } = await supabase.from('blog_posts').insert(postToInsert).select('id').single();
    if (postError) throw new Error(`Setup failed inserting post: ${postError.message}`);
    testPostId = postData!.id;
    if (!testPostId) throw new Error('Failed to retrieve test post ID.');

    console.log('Test data setup complete.');
}

async function cleanupTestData() {
    console.log('Cleaning up test data...');
    await supabase.from('blog_posts').delete().eq('slug', testPostSlug);
    await supabase.from('discovered_issues').delete().eq('source_type', testSourceType);
    // References should be cleaned by cascade delete from issues if FK is set up correctly
    console.log('Test data cleanup complete.');
    testPostId = null;
    testIssueIds = [];
    testRelevantRefUrls = [];
}

// --- Test Suite ---
describe('03-step-04-fetch-data-for-generation Integration Tests', () => {
    jest.setTimeout(20000);

    beforeAll(async () => {
        await setupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    it('should return correct post title, full issues, and only relevant references', async () => {
        if (!testPostId) throw new Error('Test post ID not set during setup');
        const result = await fetchDataForPostGeneration(testPostId);

        expect(result).not.toBeNull();
        expect(result?.blogPostTitle).toBe(testPostTitle);

        // Check issues
        expect(result?.issues).toHaveLength(testIssueIds.length);
        const fetchedIssueIds = result!.issues.map(i => i.id).sort();
        expect(fetchedIssueIds).toEqual(testIssueIds.sort());
        // Check if full issue data is present (example: issue_text)
        expect(result?.issues[0].issue_text).toContain('Issue T4-');

        // Check references
        expect(result?.references).toBeDefined();
        expect(result?.references).toHaveLength(testRelevantRefUrls.length);
        const fetchedRefUrls = result!.references.map(r => r.url).sort();
        expect(fetchedRefUrls).toEqual(testRelevantRefUrls.sort());
        // Check if relevant fields are present
        expect(result?.references[0].summary).toContain('Summary');
        expect(result?.references[0].extracts).toBeDefined();
    });

    it('should return null if blog post ID does not exist', async () => {
        const result = await fetchDataForPostGeneration(999999); // Non-existent ID
        expect(result).toBeNull();
    });

    it('should return null if blog post has no associated issue IDs', async () => {
        // Insert a post with empty issue_ids
        const { data: postData, error } = await supabase
            .from('blog_posts')
            .insert({ title: 'Post No Issues', slug: 'post-no-issues', issue_ids: [] })
            .select('id').single();
        expect(error).toBeNull();
        const postIdWithNoIssues = postData!.id;

        const result = await fetchDataForPostGeneration(postIdWithNoIssues);
        expect(result).toBeNull();

        // Cleanup the extra post
        await supabase.from('blog_posts').delete().eq('id', postIdWithNoIssues);
    });

    it('should return empty references array if no relevant references found for issues', async () => {
        // Insert issues
        const { data: issuesData, error: issueErr } = await supabase
            .from('discovered_issues')
            .insert([{ issue_text: 'Issue No Refs 1', status: 'blog_post_assigned', source_type: testSourceType }, { issue_text: 'Issue No Refs 2', status: 'blog_post_assigned', source_type: testSourceType }])
            .select('id');
        expect(issueErr).toBeNull();
        const noRefIssueIds = issuesData!.map(i => i.id);

        // Insert ONLY irrelevant references for them
        await supabase.from('references').insert([
            { discovered_issue_id: noRefIssueIds[0], url: 'http://irrelevant_only1.com', is_relevant: false },
            { discovered_issue_id: noRefIssueIds[1], url: 'http://irrelevant_only2.com', is_relevant: false },
        ]);

        // Insert post linking to these issues
        const { data: postData, error: postErr } = await supabase
            .from('blog_posts')
            .insert({ title: 'Post No Relevant Refs', slug: 'post-no-relevant-refs', issue_ids: noRefIssueIds })
            .select('id').single();
        expect(postErr).toBeNull();
        const postIdWithNoRelevantRefs = postData!.id;

        // Fetch data
        const result = await fetchDataForPostGeneration(postIdWithNoRelevantRefs);
        expect(result).not.toBeNull();
        expect(result?.issues).toHaveLength(noRefIssueIds.length);
        expect(result?.references).toEqual([]); // Expect empty array

        // Cleanup the extra post (issues/refs cleaned by main afterAll)
        await supabase.from('blog_posts').delete().eq('id', postIdWithNoRelevantRefs);
    });

}); 
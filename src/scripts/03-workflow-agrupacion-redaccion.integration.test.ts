import dotenv from 'dotenv';
import path from 'path';
import { runWorkflow as runWorkflow3 } from './03-workflow-agrupacion-redaccion'; // Import the orchestrator
import { getSupabaseClient } from './lib/supabaseClient';
import type { Database } from '../types/supabase';
import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';

// Define types locally
type DiscoveredIssueInsert = Database['public']['Tables']['discovered_issues']['Insert'];
type ReferenceInsert = Database['public']['Tables']['references']['Insert'];

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// --- Test Setup --- //
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
// Add checks or warnings for necessary LLM API keys (e.g., GOOGLE_GEMINI_API_KEY)
if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn('Warning: GOOGLE_GEMINI_API_KEY not set. Workflow 3 LLM steps will likely fail or be mocked.');
    // Consider mocking LLM calls if keys are missing for CI/CD environments
}

const supabase = getSupabaseClient();
const testSourceType = 'test-workflow-03';
let testIssueIds: number[] = [];
let testBlogPostSlugs: string[] = []; // To track created posts for cleanup

async function setupTestData(count: number = 3) {
    await cleanupTestData(); // Start clean
    console.log(`Setting up ${count} test issues for Workflow 3...`);

    const issuesToInsert: DiscoveredIssueInsert[] = Array.from({ length: count }, (_, i) => ({
        issue_text: `Workflow 3 Test Issue ${i + 1} - ${Date.now()}`,
        status: 'ref_analysis_done', // Correct initial status for Workflow 3
        priority_score: 50 + i,
        sentiment: i - 1, // Some variation
        tags: [`test-wf3`, `group-${i % 2}`], // Tags for grouping
        source_type: testSourceType,
    }));
    const { data: issuesData, error: issueError } = await supabase
        .from('discovered_issues').insert(issuesToInsert).select('id');
    if (issueError) throw new Error(`Setup failed inserting issues: ${issueError.message}`);
    testIssueIds = issuesData!.map((d: any) => d.id);
    if (testIssueIds.length !== count) throw new Error(`Failed to retrieve exactly ${count} test issue IDs.`);

    // Add some relevant references for these issues
    const refsToInsert: ReferenceInsert[] = [];
    for (const issueId of testIssueIds) {
        refsToInsert.push({
            discovered_issue_id: issueId,
            url: `http://relevant.com/${issueId}`,
            is_relevant: true,
            title: `Relevant Ref for ${issueId}`,
            summary: `Summary for ${issueId}`,
            extracts: [`Extract for ${issueId}`]
        });
    }
    const { error: refError } = await supabase.from('references').insert(refsToInsert);
    if (refError) throw new Error(`Setup failed inserting references: ${refError.message}`);

    console.log('Test data setup complete. Issue IDs:', testIssueIds);
}

async function cleanupTestData() {
    console.log('Cleaning up test data for Workflow 3...');

    // Specific deletion for known problematic slugs from previous test patterns
    const knownProblematicSlugs = ['workflow-3-test-issues', 'problemas-con-el-workflow-3'];
    const { data: deletedProblemSlugs, error: problemSlugsDeleteError } = await supabase
        .from('blog_posts')
        .delete()
        .in('slug', knownProblematicSlugs)
        .select('id');
    if (problemSlugsDeleteError) {
        console.error('Cleanup: Error deleting known problematic slugs:', problemSlugsDeleteError.message);
    } else if (deletedProblemSlugs && deletedProblemSlugs.length > 0) {
        console.log(`  Deleted ${deletedProblemSlugs.length} known problematic posts by slug.`);
    }

    // 1. Find issues marked with the testSourceType
    const { data: testIssuesForCleanup, error: fetchIssuesError } = await supabase
        .from('discovered_issues')
        .select('id')
        .eq('source_type', testSourceType);

    if (fetchIssuesError) {
        console.error('Cleanup: Error fetching test issues for post deletion:', fetchIssuesError.message);
    } else if (testIssuesForCleanup && testIssuesForCleanup.length > 0) {
        const issueIdsForTestCleanup = testIssuesForCleanup.map(issue => issue.id);

        // 2. Delete blog posts that contain any of these issue IDs
        const { error: postDeleteByIssueIdsError } = await supabase
            .from('blog_posts')
            .delete()
            .contains('issue_ids', issueIdsForTestCleanup);

        if (postDeleteByIssueIdsError) {
            console.error('Cleanup: Error deleting blog posts linked to test issues:', postDeleteByIssueIdsError.message);
        } else {
            console.log(`  Attempted deletion of blog posts linked to ${issueIdsForTestCleanup.length} test issues.`);
        }
    }

    // Delete posts by tracked slugs (as a fallback or for posts not linked via current testSourceType issues)
    if (testBlogPostSlugs.length > 0) {
        const { data: deletedPostsBySlug, error: slugDeleteError } = await supabase
            .from('blog_posts')
            .delete()
            .in('slug', testBlogPostSlugs)
            .select('id'); // Select to confirm how many were deleted
        if (slugDeleteError) {
            console.error('Cleanup: Error deleting blog posts by tracked slug:', slugDeleteError.message);
        } else if (deletedPostsBySlug) {
            console.log(`  Deleted ${deletedPostsBySlug.length} blog posts by tracked slug.`);
        }
    }

    // Delete issues (references should cascade)
    const { error: issueDeleteError } = await supabase.from('discovered_issues').delete().eq('source_type', testSourceType);
    if (issueDeleteError) {
        console.error('Cleanup: Error deleting test issues by source_type:', issueDeleteError.message);
    } else {
        console.log('  Deleted test issues by source_type.');
    }

    console.log('Test data cleanup complete.');
    testIssueIds = []; // Reset global tracker
    testBlogPostSlugs = []; // Reset global tracker
}

// --- Test Suite --- //
describe('03-workflow-agrupacion-redaccion Integration Test', () => {
    jest.setTimeout(300000); // 5 minutes timeout for the full workflow with LLM calls

    beforeAll(async () => {
        // Setup with 3 issues by default
        await setupTestData(3);
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    it('should run the full workflow, create posts, update issues, and generate content', async () => {
        const initialIssueIds = [...testIssueIds]; // Copy IDs created by setup

        // Execute the workflow, passing the testSourceType
        const workflowResult = await runWorkflow3({ 
            batchSize: 5, // Process in one batch
            sourceType: testSourceType // Pass the filter
        }); 

        expect(workflowResult.success).toBe(true);
        expect(workflowResult.totalProcessedIssues).toBe(initialIssueIds.length);
        expect(workflowResult.totalPostsCreated).toBeGreaterThan(0);

        // --- Verification --- //
        console.log('Waiting 2 seconds before verification...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 1. Check Issue Statuses
        const { data: issuesAfter, error: issueFetchError } = await supabase
            .from('discovered_issues')
            .select('id, status') // Remove the problematic embedded select
            .in('id', initialIssueIds);
        expect(issueFetchError).toBeNull();
        expect(issuesAfter).toHaveLength(initialIssueIds.length);
        for (const issue of issuesAfter!) {
            expect(issue.status).toBe('blog_post_assigned');
            // Cannot check slug directly here anymore
        }

        // 2. Check Blog Posts
        // Need a way to identify posts created by this run. Using issue IDs:
        const { data: posts, error: postFetchError } = await supabase
             .from('blog_posts')
             .select('id, title, slug, issue_ids, content, meta_description, status, category, content_html, is_featured, tags') // Added new fields
             .contains('issue_ids', initialIssueIds); // Fetch posts containing any of the test issue IDs
        expect(postFetchError).toBeNull();
        expect(posts).toBeDefined();
        expect(posts!.length).toBeGreaterThan(0);
        testBlogPostSlugs = posts!.map(p => p.slug); // Store slugs for cleanup

        for (const post of posts!) {
            expect(post.title).toBeTruthy();
            expect(post.slug).toBeTruthy();
            expect(post.status).toBe('draft_generated'); // Final status after content generation
            expect(post.content).toBeTruthy();
            expect(post.content!.length).toBeGreaterThan(10); // Check for non-trivial content
            expect(post.meta_description).toBeTruthy();

            // Check new fields
            expect(post.issue_ids).toBeInstanceOf(Array);
            expect(post.issue_ids.length).toBeGreaterThan(0);
            expect(post.category).toBeDefined(); // Check if category exists (can be null or string)
            expect(post.content_html).toBeDefined(); // Check if HTML exists (can be null or string)
            expect(post.is_featured).toBe(false); // Should default to false
            expect(post.tags).toBeInstanceOf(Array); // Check if tags is an array (can be null or string[])
            // If source issues have tags, we might expect the post tags array to be non-empty
            // expect(post.tags?.length).toBeGreaterThan(0); 
        }

        console.log(`Workflow 3 verification passed. Created ${posts!.length} posts.`);
    });

    // TODO: Add tests for edge cases? (e.g., no issues found, LLM failing grouping/generation)

}); 
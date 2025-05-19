import dotenv from 'dotenv';
import path from 'path';
import { fetchReferencesForPosts } from './04-step-02-fetch-references-for-posts';
import type { BlogPostForCorrection } from './04-step-01-fetch-posts-for-correction';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, afterAll, beforeEach } from '@jest/globals';

// Define types locally
type DiscoveredIssueInsert = Database['public']['Tables']['discovered_issues']['Insert'];
type ReferenceInsert = Database['public']['Tables']['references']['Insert'];

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
const testDataSourceType = 'test-step-04-02'; 
let createdIssueIds: number[] = [];
let createdReferenceIds: number[] = [];

async function setupTestData(issuesWithRefsSetup: Array<{ issueText: string; refs: Partial<ReferenceInsert>[] }>) {
    createdIssueIds = [];
    createdReferenceIds = [];

    for (const setup of issuesWithRefsSetup) {
        const issueToInsert: DiscoveredIssueInsert = {
            issue_text: setup.issueText,
            source_type: testDataSourceType,
            status: 'blog_post_assigned' // Or any status, not directly relevant for this step's logic
        };
        const { data: issueData, error: issueError } = await supabase
            .from('discovered_issues').insert(issueToInsert).select('id').single();
        if (issueError || !issueData) throw new Error(`Setup: Failed to insert issue '${setup.issueText}': ${issueError?.message}`);
        const issueId = issueData.id;
        createdIssueIds.push(issueId);

        if (setup.refs && setup.refs.length > 0) {
            const refsToInsert = setup.refs.map(ref => ({
                ...ref,
                discovered_issue_id: issueId,
                url: ref.url || `http://example.com/testref-${Date.now()}-${Math.random()}`,
                is_relevant: ref.is_relevant ?? true, // Default to relevant
                title: ref.title ?? 'Test Reference Title',
                summary: ref.summary ?? 'Test summary.',
                extracts: ref.extracts ?? ['Test extract.'],
            }));
            const { data: refData, error: refError } = await supabase
                .from('references').insert(refsToInsert as ReferenceInsert[]).select('id');
            if (refError) throw new Error(`Setup: Failed to insert references for issue ${issueId}: ${refError.message}`);
            if (refData) createdReferenceIds.push(...refData.map(r => r.id));
        }
    }
    console.log(`[Test Setup] Created ${createdIssueIds.length} issues and ${createdReferenceIds.length} references.`);
}

async function cleanupTestData() {
    console.log('[Test Cleanup] Cleaning up test data for Step 04-02...');
    if (createdReferenceIds.length > 0) {
        await supabase.from('references').delete().in('id', createdReferenceIds);
    }
    if (createdIssueIds.length > 0) {
        await supabase.from('discovered_issues').delete().in('id', createdIssueIds);
    }
    // Fallback for any orphaned issues from this test source type
    await supabase.from('discovered_issues').delete().eq('source_type', testDataSourceType);
    createdIssueIds = [];
    createdReferenceIds = [];
    console.log('[Test Cleanup] Cleanup complete for Step 04-02.');
}

describe('04-step-02-fetch-references-for-posts Integration Tests', () => {
    jest.setTimeout(25000);

    beforeEach(async () => {
        await cleanupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    it('should return empty array if input posts array is null or empty', async () => {
        expect(await fetchReferencesForPosts(null)).toEqual([]);
        expect(await fetchReferencesForPosts([])).toEqual([]);
    });

    it('should return posts with empty relevant_references if no issue_ids are present', async () => {
        const posts: BlogPostForCorrection[] = [
            { id: 1, content_html: '<p>Post 1</p>', issue_ids: null, current_version: 1 },
            { id: 2, content_html: '<p>Post 2</p>', issue_ids: [], current_version: null },
        ];
        const results = await fetchReferencesForPosts(posts);
        expect(results).toHaveLength(2);
        expect(results[0].relevant_references).toEqual([]);
        expect(results[1].relevant_references).toEqual([]);
    });

    it('should attach relevant references to posts', async () => {
        await setupTestData([
            { issueText: 'Issue A', refs: [{ title: 'Ref A1', url: 'http://a1.com'}, {title: 'Ref A2 (irrelevant)', url: 'http://a2.com', is_relevant: false}] },
            { issueText: 'Issue B', refs: [{ title: 'Ref B1', url: 'http://b1.com'}] },
            { issueText: 'Issue C', refs: [] } // No refs
        ]);
        
        const postsInput: BlogPostForCorrection[] = [
            { id: 101, content_html: '<p>Blog Post 1</p>', issue_ids: [createdIssueIds[0]], current_version: 1 }, // Links to Issue A
            { id: 102, content_html: '<p>Blog Post 2</p>', issue_ids: [createdIssueIds[1], createdIssueIds[2]], current_version: null }, // Links to Issue B & C
            { id: 103, content_html: '<p>Blog Post 3</p>', issue_ids: [99999], current_version: 1 } // Non-existent issue ID
        ];

        const results = await fetchReferencesForPosts(postsInput);
        expect(results).toHaveLength(3);

        const post1Result = results.find(p => p.id === 101);
        expect(post1Result).toBeDefined();
        expect(post1Result!.relevant_references).toHaveLength(1);
        expect(post1Result!.relevant_references[0].title).toBe('Ref A1');

        const post2Result = results.find(p => p.id === 102);
        expect(post2Result).toBeDefined();
        expect(post2Result!.relevant_references).toHaveLength(1);
        expect(post2Result!.relevant_references[0].title).toBe('Ref B1');

        const post3Result = results.find(p => p.id === 103);
        expect(post3Result).toBeDefined();
        expect(post3Result!.relevant_references).toEqual([]);
    });

    it('should handle posts with some issues having no relevant references', async () => {
        await setupTestData([
            { issueText: 'Issue D', refs: [{ title: 'Ref D1', url: 'http://d1.com'}] },
            { issueText: 'Issue E', refs: [{ title: 'Ref E_IRRELEVANT', url: 'http://e_irr.com', is_relevant: false }] }
        ]);
        const postsInput: BlogPostForCorrection[] = [
            { id: 201, content_html: '<p>Blog Post D+E</p>', issue_ids: [createdIssueIds[0], createdIssueIds[1]], current_version: 1 }
        ];
        const results = await fetchReferencesForPosts(postsInput);
        expect(results[0].relevant_references).toHaveLength(1);
        expect(results[0].relevant_references[0].title).toBe('Ref D1');
    });

    it('should deduplicate references if multiple issues in a post link to the same reference URL', async () => {
        // This requires references to be distinct by discovered_issue_id but potentially same URL
        // For this test, we'll simulate this by having two issues whose references are identical
         await setupTestData([
            { issueText: 'Issue F', refs: [{ title: 'Shared Ref', url: 'http://shared.com', summary: 'S1', extracts: ['E1'] }] },
            { issueText: 'Issue G', refs: [{ title: 'Shared Ref', url: 'http://shared.com', summary: 'S1', extracts: ['E1'] }] }
        ]);
        const postsInput: BlogPostForCorrection[] = [
            { id: 301, content_html: '<p>Blog Post F+G</p>', issue_ids: [createdIssueIds[0], createdIssueIds[1]], current_version: 1 }
        ];
        const results = await fetchReferencesForPosts(postsInput);
        expect(results[0].relevant_references).toHaveLength(1);
        expect(results[0].relevant_references[0].url).toBe('http://shared.com');
    });

}); 
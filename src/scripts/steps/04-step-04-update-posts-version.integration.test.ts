import dotenv from 'dotenv';
import path from 'path';
import { updatePostsWithCorrections } from './04-step-04-update-posts-version';
import type { CorrectedPostData } from './04-step-03-correct-html-references-llm';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, afterAll, beforeEach, jest } from '@jest/globals';

// Define types locally
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
const testSlugPrefix = 'test-step-04-04-';
let createdPostIds: number[] = [];

interface TestPostSetup {
    title: string;
    slug: string;
    version?: number | null;
    content_html?: string;
    status?: string; 
    issue_ids?: number[];
}

async function setupTestPosts(postsToInsert: TestPostSetup[]) {
    createdPostIds = [];
    const postsWithDefaults = postsToInsert.map(p => ({
        title: p.title,
        slug: p.slug,
        version: p.version,
        content_html: p.content_html ?? '<p>Default HTML</p>',
        status: p.status ?? 'draft_generated',
        issue_ids: p.issue_ids ?? [],
    }));

    const { data, error } = await supabase
        .from('blog_posts')
        .insert(postsWithDefaults as unknown as BlogPostInsert[]) 
        .select('id');
    if (error) throw new Error(`Setup: Failed to insert posts: ${error.message}`);
    if (!data) throw new Error('Setup: No data from post insertion.');
    createdPostIds = data.map(p => p.id);
    console.log(`[Test Setup] Created ${createdPostIds.length} posts for Step 04-04: IDs ${createdPostIds.join(', ')}`);
}

async function cleanupTestData() {
    console.log('[Test Cleanup] Cleaning up for Step 04-04...');
    if (createdPostIds.length > 0) {
        await supabase.from('blog_posts').delete().in('id', createdPostIds);
    }
    await supabase.from('blog_posts').delete().like('slug', `${testSlugPrefix}%`);
    createdPostIds = [];
    console.log('[Test Cleanup] Complete for Step 04-04.');
}

async function getPostById(id: number): Promise<BlogPostRow | null> { 
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as BlogPostRow | null;
}

describe('04-step-04-update-posts-version Integration Tests', () => {
    jest.setTimeout(20000);

    beforeEach(async () => {
        await cleanupTestData();
        jest.restoreAllMocks(); 
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    it('should update content_html (after cleaning), version, and updated_at', async () => {
        const initialHtmlWithFences = '<p>Original ```html content``` and ```more```</p>';
        const expectedCleanedInitialHtml = '<p>Original  content and more</p>'; // What it becomes after cleaning, if it were saved
        const correctedHtmlWithFences = '<p>Corrected ```html version``` with ```fences```</p>';
        const expectedCleanedCorrectedHtml = '<p>Corrected  version with fences</p>';

        await setupTestPosts([
            { title: 'Post 1', slug: `${testSlugPrefix}post1`, version: 1, content_html: initialHtmlWithFences, status: 'draft_generated' },
        ]);
        const post1Id = createdPostIds[0];
        const post1BeforeUpdate = await getPostById(post1Id) as any; 
        const originalUpdatedAt = post1BeforeUpdate.updated_at; 
        await new Promise(resolve => setTimeout(resolve, 50)); 

        const correctedData: CorrectedPostData[] = [
            { post_id: post1Id, original_content_html: initialHtmlWithFences, corrected_content_html: correctedHtmlWithFences, current_version: 1 },
        ];

        const summary = await updatePostsWithCorrections(correctedData);
        expect(summary.updated_count).toBe(1);
        expect(summary.error_count).toBe(0);
        expect(summary.skipped_count).toBe(0);

        const post1After = await getPostById(post1Id) as any; 
        expect(post1After?.content_html).toBe(expectedCleanedCorrectedHtml); // Expect cleaned version
        expect(post1After?.version).toBe(2);
        if (originalUpdatedAt && post1After?.updated_at) {
             expect(new Date(post1After.updated_at).getTime()).toBeGreaterThan(new Date(originalUpdatedAt).getTime());
        } else {
            // This might happen if the DB doesn't have updated_at or it was null initially
            console.warn('Cannot verify updated_at change for post1 as original or new timestamp is missing or identical.');
        }
    });

    it('should skip update if cleaned corrected_content_html is same as cleaned original', async () => {
        const htmlWithFences = '<p>Content ```html with``` fences</p>';
        // const cleanedHtml = '<p>Content  with fences</p>'; // Not used directly, but for clarity

        await setupTestPosts([
            { title: 'Post Skip Same', slug: `${testSlugPrefix}skipSame`, version: 1, content_html: htmlWithFences }, // Initial content in DB might be uncleaned
        ]);
        const skipId = createdPostIds[0];

        const correctedData: CorrectedPostData[] = [
            // Both original and corrected will be cleaned by the function before comparison
            { post_id: skipId, original_content_html: htmlWithFences, corrected_content_html: htmlWithFences, current_version: 1 }, 
        ];

        const summary = await updatePostsWithCorrections(correctedData);
        expect(summary.updated_count).toBe(0);
        expect(summary.error_count).toBe(0);
        expect(summary.skipped_count).toBe(1);

        const postSkipAfter = await getPostById(skipId) as any; 
        // Content in DB should be the initial uncleaned version if no update happened
        // Or, if setupTestPosts also cleaned, then it would be the cleaned version.
        // Let's assume setupTestPosts stores it as is, and our function cleans for comparison.
        expect(postSkipAfter?.content_html).toBe(htmlWithFences); 
        expect(postSkipAfter?.version).toBe(1); 
    });

    it('should skip update if corrected_content_html (after cleaning) is null', async () => {
        await setupTestPosts([
            { title: 'Post Skip Null', slug: `${testSlugPrefix}skipNull`, version: 0, content_html: '<p>Some initial HTML</p>' },
        ]);
        const skipId = createdPostIds[0];
        const correctedData: CorrectedPostData[] = [
            { post_id: skipId, original_content_html: '<p>Some initial HTML</p>', corrected_content_html: null, current_version: 0 },      
        ];
        const summary = await updatePostsWithCorrections(correctedData);
        expect(summary.updated_count).toBe(0);
        expect(summary.error_count).toBe(0);
        expect(summary.skipped_count).toBe(1);
    });

    it('should handle empty input array', async () => {
        const summary = await updatePostsWithCorrections([]);
        expect(summary.updated_count).toBe(0);
        expect(summary.error_count).toBe(0);
        expect(summary.skipped_count).toBe(0);
    });

    it('should handle null input', async () => {
        const summary = await updatePostsWithCorrections(null);
        expect(summary.updated_count).toBe(0);
        expect(summary.error_count).toBe(0);
        expect(summary.skipped_count).toBe(0);
    });

    it('should correctly report errors if Supabase update fails for one post', async () => {
        await setupTestPosts([
            { title: 'Update Success Post', slug: `${testSlugPrefix}okPost`, version: 1, content_html: '<p>Original OK ```html```</p>' },
            { title: 'Update Fail Post', slug: `${testSlugPrefix}failPost`, version: 1, content_html: '<p>Original Fail</p>' },
        ]);
        const okPostId = createdPostIds[0];
        const failPostId = createdPostIds[1];

        const mockUpdateImplementation = jest.fn(async (updatePayload: any) => {
            if (mockUpdateImplementation.mock.calls.length === 1) { 
                 return { error: null, data: [{id: okPostId}] };
            } else { 
                return { error: { message: 'Simulated DB Error', code: 'TESTFAIL', details: '', hint: '' }, data: null };
            }
        });

        const fromSpy = jest.spyOn(supabase, 'from').mockReturnValue({
            update: jest.fn().mockReturnThis(), 
            eq: jest.fn().mockImplementation(mockUpdateImplementation) 
        } as any);

        const correctedData: CorrectedPostData[] = [
            { post_id: okPostId, original_content_html: '<p>Original OK ```html```</p>', corrected_content_html: '<p>Updated OK</p>', current_version: 1 },
            { post_id: failPostId, original_content_html: '<p>Original Fail</p>', corrected_content_html: '<p>Updated Fail Attempt</p>', current_version: 1 },
        ];

        const summary = await updatePostsWithCorrections(correctedData);
        
        expect(summary.updated_count).toBe(1);
        expect(summary.error_count).toBe(1);
        expect(summary.skipped_count).toBe(0);

        fromSpy.mockRestore();
    });

}); 
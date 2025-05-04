import dotenv from 'dotenv';
import path from 'path';
import { parseAndUpdatePostContent } from './03-step-06-update-posts-with-content';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Define types locally
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup ---
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
let testPostId: number | null = null;
const testSlugBase = 'test-post-step-6';

async function setupTestData(): Promise<number> {
    // Create a clean post draft
    const slug = `${testSlugBase}-${Date.now()}`;
    const postToInsert: BlogPostInsert = {
        title: 'Test Post for Update',
        slug: slug,
        issue_ids: [999], // Dummy issue ID
        status: 'draft',
        content: null,
        meta_description: null,
    };
    const { data, error } = await supabase.from('blog_posts').insert(postToInsert).select('id').single();
    if (error) throw new Error(`Setup failed inserting post: ${error.message}`);
    if (!data?.id) throw new Error('Failed to retrieve post ID after insertion');
    console.log(`Placeholder: Test data setup - created post ID ${data.id}`);
    return data.id;
}

async function cleanupTestData() {
    // Delete posts created by setup (using slug base)
    console.log(`Placeholder: Test data cleanup - deleting posts like ${testSlugBase}-%`);
    await supabase.from('blog_posts').delete().like('slug', `${testSlugBase}-%`);
    testPostId = null;
}

// Helper to fetch post content/meta
async function getPostDetails(postId: number): Promise<BlogPost | null> {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', postId).single();
    if (error) {
        console.error(`Error fetching post details for ID ${postId}:`, error.message);
        return null;
    }
    return data;
}

// --- Test Suite ---
describe('03-step-06-update-posts-with-content Integration Tests', () => {
    jest.setTimeout(20000);

    // Cleanup before and after all tests in the suite
    beforeAll(async () => await cleanupTestData());
    afterAll(async () => await cleanupTestData());

    // Setup a new post before each test
    beforeEach(async () => {
        testPostId = await setupTestData();
    });

    it('should correctly parse content and meta description and update DB', async () => {
        if (!testPostId) throw new Error('Test post ID not set');
        const rawContent = '## Title\n\nMain body.\n\n---\nThis is the meta description.';
        const success = await parseAndUpdatePostContent(testPostId, rawContent);

        expect(success).toBe(true);
        const details = await getPostDetails(testPostId);
        expect(details).not.toBeNull();
        expect(details?.content).toBe('## Title\n\nMain body.');
        expect(details?.meta_description).toBe('This is the meta description.');
        expect(details?.status).toBe('draft_generated');
    });

    it('should store all text as content if separator is missing', async () => {
        if (!testPostId) throw new Error('Test post ID not set');
        const rawContent = '## Title\n\nMain body without separator.';
        const success = await parseAndUpdatePostContent(testPostId, rawContent);

        expect(success).toBe(true);
        const details = await getPostDetails(testPostId);
        expect(details?.content).toBe(rawContent.trim()); // Function now trims input
        expect(details?.meta_description).toBeNull(); // Should be null if separator missing
        expect(details?.status).toBe('draft_generated');
    });

    it('should handle empty raw content string', async () => {
        if (!testPostId) throw new Error('Test post ID not set');
        const rawContent = '';
        const success = await parseAndUpdatePostContent(testPostId, rawContent);

        expect(success).toBe(true);
        const details = await getPostDetails(testPostId);
        expect(details?.content).toBe('');
        expect(details?.meta_description).toBeNull(); // Should be null for empty content
        expect(details?.status).toBe('draft_generated');
    });

    it('should truncate meta description longer than 160 chars', async () => {
        if (!testPostId) throw new Error('Test post ID not set');
        const longMeta = 'a'.repeat(200);
        const rawContent = `Content\n\n---\n${longMeta}`;
        const success = await parseAndUpdatePostContent(testPostId, rawContent);

        expect(success).toBe(true);
        const details = await getPostDetails(testPostId);
        expect(details?.meta_description).toHaveLength(160);
        expect(details?.meta_description).toBe(longMeta.substring(0, 160));
    });

    it('should return false if blogPostId is null', async () => {
        const success = await parseAndUpdatePostContent(null, 'some content');
        expect(success).toBe(false);
    });

    it('should return false if rawContent is null', async () => {
        if (!testPostId) throw new Error('Test post ID not set');
        const success = await parseAndUpdatePostContent(testPostId, null);
        expect(success).toBe(false);
    });

    it('should return false and not update DB if update fails', async () => {
        if (!testPostId) throw new Error('Test post ID not set');
        // Simulate DB error by trying to update a non-existent post ID inside the function call
        // (This requires modifying the function or mocking Supabase client)
        // Alternative: Test the catch block more directly if possible, or rely on logs

        // For now, we just check the return value when input is valid but assume DB fails
        // This isn't a true integration test of the failure path without deeper mocking/setup
        const supabaseMock = jest.spyOn(supabase, 'from');
        supabaseMock.mockImplementationOnce(() => ({
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: null, error: new Error('Simulated DB Error') })
        }) as any);

        const success = await parseAndUpdatePostContent(testPostId, 'Valid Content\n\n---\nValid Meta');
        expect(success).toBe(false);

        supabaseMock.mockRestore();
    });

}); 
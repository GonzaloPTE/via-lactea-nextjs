import dotenv from 'dotenv';
import path from 'path';
import { processAndSaveGeneratedContent } from './03-step-06-update-posts-with-content';
import type { BlogContentOutput } from './03-step-05-generate-content';
import * as llmClient from '../components/llmClient'; // To mock the HTML conversion
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, beforeAll, afterAll, jest, beforeEach } from '@jest/globals';

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
const testPostSlug = `test-post-step-06-${Date.now()}`;

// --- Mocking --- //
const mockConvertMarkdownToHtmlWithLLM = jest.spyOn(llmClient, 'convertMarkdownToHtmlWithLLM');

async function setupTestData() {
    await cleanupTestData(); // Ensure a clean slate

    // Create a Blog Post record to be updated
    const blogPostToInsert: BlogPostInsert = {
        title: 'Test Blog Post for Step 06',
        slug: testPostSlug,
        issue_ids: [99999], // Placeholder, not relevant for this step's test
        category: 'Test Category Step 06',
        tags: ['test', 'step06'],
        status: 'draft_grouped', // The status before this step runs
        content: null, // Ensure fields to be updated start as null
        meta_description: null,
        content_html: null,
    };
    const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .insert(blogPostToInsert)
        .select('id')
        .single();
    if (postError) throw new Error(`Setup: Failed to insert blog post: ${postError.message}`);
    if (!postData || !postData.id) throw new Error('Setup: Did not get blog post ID back.');
    testPostId = postData.id;
    console.log(`Setup complete: Created BlogPost ID ${testPostId}`);
}

async function cleanupTestData() {
    console.log('Cleanup: Starting test data deletion...');
    if (testPostId) {
        const { error } = await supabase.from('blog_posts').delete().eq('id', testPostId);
        if (error) console.error('Cleanup: Error deleting test blog post:', error.message);
    }
    // Also delete by slug in case ID wasn't captured
    const { error: slugError } = await supabase.from('blog_posts').delete().eq('slug', testPostSlug);
    if (slugError && slugError.code !== 'PGRST116') { // Ignore "No rows found" error
         console.error('Cleanup: Error deleting test blog post by slug:', slugError.message);
    }
    console.log('Cleanup: Test data deletion attempt complete.');
    testPostId = null;
}

describe('03-step-06-update-posts-with-content Integration Tests', () => {
    jest.setTimeout(20000); // Timeout for DB ops and potential mock delays

    beforeAll(async () => {
        await setupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    beforeEach(async () => {
        mockConvertMarkdownToHtmlWithLLM.mockClear();
        
        // Reset the test post to its initial state before each test
        if (testPostId) {
            const { error: resetError } = await supabase
                .from('blog_posts')
                .update({
                    status: 'draft_grouped',
                    content: null,
                    meta_description: null,
                    content_html: null,
                })
                .eq('id', testPostId);
            if (resetError) {
                console.error('beforeEach: Failed to reset test post state:', resetError.message);
                // Optionally throw an error to halt tests if reset is critical
                // throw new Error(`beforeEach: Failed to reset test post state: ${resetError.message}`);
            }
        }
    });

    it('should update post with content, meta, HTML, and status on success', async () => {
        if (!testPostId) throw new Error('Setup failed: testPostId is null');

        const mockInput: BlogContentOutput = {
            markdownContent: '# Title\n\nParagraph.',
            metaDescription: 'Test meta description.'
        };
        const mockHtmlOutput = '<h1>Title</h1><p>Paragraph.</p>';

        mockConvertMarkdownToHtmlWithLLM.mockResolvedValue(mockHtmlOutput);

        const success = await processAndSaveGeneratedContent(testPostId, mockInput);

        expect(success).toBe(true);
        expect(mockConvertMarkdownToHtmlWithLLM).toHaveBeenCalledTimes(1);
        expect(mockConvertMarkdownToHtmlWithLLM).toHaveBeenCalledWith(mockInput.markdownContent);

        // Verify DB state
        const { data: dbPost, error } = await supabase
            .from('blog_posts')
            .select('content, meta_description, content_html, status')
            .eq('id', testPostId)
            .single();
        
        expect(error).toBeNull();
        expect(dbPost).not.toBeNull();
        expect(dbPost?.content).toBe(mockInput.markdownContent);
        expect(dbPost?.meta_description).toBe(mockInput.metaDescription);
        expect(dbPost?.content_html).toBe(mockHtmlOutput);
        expect(dbPost?.status).toBe('draft_generated');
    });

    it('should update post correctly even if HTML conversion fails (null HTML)', async () => {
        if (!testPostId) throw new Error('Setup failed: testPostId is null');

        const mockInput: BlogContentOutput = {
            markdownContent: 'Some markdown.',
            metaDescription: 'Meta when HTML fails.'
        };
        mockConvertMarkdownToHtmlWithLLM.mockResolvedValue(null); // Simulate LLM failure

        const success = await processAndSaveGeneratedContent(testPostId, mockInput);

        expect(success).toBe(true); // Function should still succeed in updating DB

        // Verify DB state
        const { data: dbPost, error } = await supabase
            .from('blog_posts')
            .select('content, meta_description, content_html, status')
            .eq('id', testPostId)
            .single();
        
        expect(error).toBeNull();
        expect(dbPost?.content).toBe(mockInput.markdownContent);
        expect(dbPost?.meta_description).toBe(mockInput.metaDescription);
        expect(dbPost?.content_html).toBeNull(); // HTML should be null
        expect(dbPost?.status).toBe('draft_generated');
    });

    it('should skip HTML conversion and save empty HTML if markdown is empty', async () => {
        if (!testPostId) throw new Error('Setup failed: testPostId is null');

        const mockInput: BlogContentOutput = {
            markdownContent: ' ', // Empty/whitespace markdown
            metaDescription: 'Meta with empty markdown.'
        };
        // LLM mock should not be called

        const success = await processAndSaveGeneratedContent(testPostId, mockInput);

        expect(success).toBe(true);
        expect(mockConvertMarkdownToHtmlWithLLM).not.toHaveBeenCalled();

        // Verify DB state
        const { data: dbPost, error } = await supabase
            .from('blog_posts')
            .select('content, meta_description, content_html, status')
            .eq('id', testPostId)
            .single();
        
        expect(error).toBeNull();
        expect(dbPost?.content).toBe(' '); // Original whitespace markdown saved
        expect(dbPost?.meta_description).toBe(mockInput.metaDescription);
        expect(dbPost?.content_html).toBe(''); // HTML should be empty string
        expect(dbPost?.status).toBe('draft_generated');
    });

    it('should return false if input blogPostId is null', async () => {
        const success = await processAndSaveGeneratedContent(null, { markdownContent: 'md', metaDescription: 'meta' });
        expect(success).toBe(false);
    });

    it('should return false if input generatedContent is null', async () => {
        const success = await processAndSaveGeneratedContent(testPostId, null);
        expect(success).toBe(false);
    });

    it('should return false if database update fails or LLM conversion fails', async () => {
        if (!testPostId) throw new Error('Setup failed: testPostId is null');

        // Mock the LLM conversion to throw an error
        mockConvertMarkdownToHtmlWithLLM.mockRejectedValue(new Error('Simulated LLM Error'));

        const mockInput: BlogContentOutput = { markdownContent: 'md', metaDescription: 'meta' };

        // Call the function - it should catch the error from the LLM call
        const success = await processAndSaveGeneratedContent(testPostId, mockInput);
        expect(success).toBe(false);

        // Ensure DB wasn't updated (status should still be the initial one)
        const { data: dbPost, error } = await supabase
            .from('blog_posts')
            .select('status')
            .eq('id', testPostId)
            .single();
        expect(error).toBeNull();
        expect(dbPost?.status).toBe('draft_grouped'); // Or whatever the initial status was
    });
}); 
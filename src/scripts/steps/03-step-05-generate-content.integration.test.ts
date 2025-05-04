import { generateBlogPostContent } from './03-step-05-generate-content';
import type { PostGenerationData } from './03-step-04-fetch-data-for-generation';
// Updated imports for mocking
import * as llmClient from '../components/llmClient';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// --- Mocking --- //
// Mock the specific LLM function for blog post generation
const mockGenerateBlogPostWithLLM = jest.spyOn(llmClient, 'generateBlogPostWithLLM');

// --- Test Data --- //
// Make types more specific based on actual expected data
const mockPostData: PostGenerationData = {
    blogPostTitle: 'Test Post Title',
    // Completed mock issue with all required fields (using placeholders)
    issues: [{
        id: 1,
        issue_text: 'Issue 1 text',
        tags: ['tag1'],
        extracted_at: new Date().toISOString(), // Placeholder
        issue_type: null, // Placeholder
        priority_score: null, // Placeholder
        sentiment: null, // Placeholder
        source_id: null, // Placeholder
        source_type: 'test', // Placeholder
        source_url: null, // Placeholder
        status: 'ref_analysis_done' // Placeholder
    }],
    references: [{ url: 'ref1.com', title: 'Ref 1', summary: 'Summary', extracts: ['Extract'] }],
};

const mockLLMResponse = `## Test Post Title\n\nGenerated content based on issues and references.\n\nCall to action!\n\n---\nMeta description for test post.`;

// --- Test Suite --- //
describe('03-step-05-generate-content Tests', () => {

    beforeEach(() => {
        // Reset mocks
        mockGenerateBlogPostWithLLM.mockClear();
    });

    // afterEach(() => {
    //     jest.restoreAllMocks(); // Might interfere if other tests mock llmClient
    // });

    it('should call generateBlogPostWithLLM with correct arguments', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue(''); // Return empty for this test

        await generateBlogPostContent(mockPostData);

        expect(mockGenerateBlogPostWithLLM).toHaveBeenCalledTimes(1);
        expect(mockGenerateBlogPostWithLLM).toHaveBeenCalledWith(
            mockPostData.blogPostTitle,
            mockPostData.issues,
            mockPostData.references
        );
    });

    it('should return the raw string response from generateBlogPostWithLLM on success', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue(mockLLMResponse);

        const result = await generateBlogPostContent(mockPostData);
        expect(result).toBe(mockLLMResponse);
    });

    it('should return null if input postData is null', async () => {
        const result = await generateBlogPostContent(null);
        expect(result).toBeNull();
        expect(mockGenerateBlogPostWithLLM).not.toHaveBeenCalled();
    });

    it('should return null if generateBlogPostWithLLM returns null (e.g., API error)', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue(null);
        const result = await generateBlogPostContent(mockPostData);
        expect(result).toBeNull();
    });

    it('should return null if generateBlogPostWithLLM throws an error', async () => {
        const mockError = new Error('LLM API Error');
        mockGenerateBlogPostWithLLM.mockRejectedValue(mockError);

        const result = await generateBlogPostContent(mockPostData);
        expect(result).toBeNull();
    });

}); 
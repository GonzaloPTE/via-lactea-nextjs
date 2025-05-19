import { runWorkflow04 } from './04-workflow-correccion-referencias';
import * as step1Module from './steps/04-step-01-fetch-posts-for-correction';
import * as step2Module from './steps/04-step-02-fetch-references-for-posts';
import * as step3Module from './steps/04-step-03-correct-html-references-llm';
import * as step4Module from './steps/04-step-04-update-posts-version';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the step functions
const mockFetchPostsForCorrection = jest.spyOn(step1Module, 'fetchPostsForCorrection');
const mockFetchReferencesForPosts = jest.spyOn(step2Module, 'fetchReferencesForPosts');
const mockCorrectHtmlReferencesLlm = jest.spyOn(step3Module, 'correctHtmlReferencesLlm');
const mockUpdatePostsWithCorrections = jest.spyOn(step4Module, 'updatePostsWithCorrections');

// Helper to create mock data
const createMockBlogPostForCorrection = (id: number, version: number | null = null): step1Module.BlogPostForCorrection => ({
    id,
    content_html: `<p>Original HTML for ${id}</p>`,
    issue_ids: [id * 100],
    current_version: version,
});

const createMockBlogPostWithContext = (post: step1Module.BlogPostForCorrection): step2Module.BlogPostWithContext => ({
    ...post,
    relevant_references: post.id === 1 ? [{ url: 'http://ref1.com', title: 'Ref1', summary: 'S1', extracts: ['E1'] }] : [],
});

const createMockCorrectedPostData = (post: step2Module.BlogPostWithContext): step3Module.CorrectedPostData => ({
    post_id: post.id,
    original_content_html: post.content_html,
    corrected_content_html: post.id === 1 ? `<p>Corrected HTML for ${post.id}</p>` : post.content_html,
    current_version: post.current_version,
});


describe('04-workflow-correccion-referencias Integration Test', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        mockFetchPostsForCorrection.mockReset();
        mockFetchReferencesForPosts.mockReset();
        mockCorrectHtmlReferencesLlm.mockReset();
        mockUpdatePostsWithCorrections.mockReset();
    });

    it('should run successfully, processing posts in batches and calling all steps', async () => {
        const batch1Posts = [createMockBlogPostForCorrection(1, null), createMockBlogPostForCorrection(2, 0)];
        const batch2Posts = [createMockBlogPostForCorrection(3, 1)];

        mockFetchPostsForCorrection
            .mockResolvedValueOnce(batch1Posts)
            .mockResolvedValueOnce(batch2Posts)
            .mockResolvedValueOnce(null); // End of posts

        mockFetchReferencesForPosts.mockImplementation(async (posts) => {
            if (!posts) return []; // Added null check
            return posts.map(p => createMockBlogPostWithContext(p));
        });
        mockCorrectHtmlReferencesLlm.mockImplementation(async (posts) => {
            if (!posts) return []; // Added null check
            return posts.map(p => createMockCorrectedPostData(p));
        });
        mockUpdatePostsWithCorrections.mockImplementation(async (posts) => {
            if (!posts) return { updated_count: 0, skipped_count: 0, error_count: 0 }; // Added null check
            return {
                updated_count: posts.filter(p => p.corrected_content_html !== p.original_content_html).length,
                skipped_count: posts.filter(p => p.corrected_content_html === p.original_content_html).length,
                error_count: 0,
            };
        });

        const result = await runWorkflow04({ batchSize: 2 });

        expect(result.success).toBe(true);
        expect(result.batchesProcessed).toBe(3); // 2 batches with data, 1 to find no more data
        expect(result.totalPostsProcessedInLoop).toBe(3); // 2 in batch 1, 1 in batch 2
        expect(result.totalPostsSuccessfullyUpdated).toBe(1); // Only post 1 was "corrected"
        expect(result.totalSkippedNoChangeOrErrorInUpdate).toBe(2); // Posts 2 and 3 had no HTML change by mock
        expect(result.totalErrorsInUpdate).toBe(0);

        expect(mockFetchPostsForCorrection).toHaveBeenCalledTimes(3);
        expect(mockFetchReferencesForPosts).toHaveBeenCalledTimes(2);
        expect(mockCorrectHtmlReferencesLlm).toHaveBeenCalledTimes(2);
        expect(mockUpdatePostsWithCorrections).toHaveBeenCalledTimes(2);
    });

    it('should handle no posts found initially', async () => {
        mockFetchPostsForCorrection.mockResolvedValueOnce(null);

        const result = await runWorkflow04({ batchSize: 5 });

        expect(result.success).toBe(true);
        expect(result.batchesProcessed).toBe(1);
        expect(result.totalPostsProcessedInLoop).toBe(0);
        expect(result.totalPostsSuccessfullyUpdated).toBe(0);
        expect(mockFetchPostsForCorrection).toHaveBeenCalledTimes(1);
        expect(mockFetchReferencesForPosts).not.toHaveBeenCalled();
        expect(mockCorrectHtmlReferencesLlm).not.toHaveBeenCalled();
        expect(mockUpdatePostsWithCorrections).not.toHaveBeenCalled();
    });

    it('should handle errors from a step function and stop processing', async () => {
        const batch1Posts = [createMockBlogPostForCorrection(10)];
        mockFetchPostsForCorrection
            .mockResolvedValueOnce(batch1Posts)
            .mockResolvedValueOnce(null); // Subsequent calls return null
        
        mockFetchReferencesForPosts.mockImplementation(async (posts) => {
            if (!posts) return []; // Added null check
            return posts.map(p => createMockBlogPostWithContext(p));
        });
        // Simulate error in Step 3
        mockCorrectHtmlReferencesLlm.mockRejectedValueOnce(new Error('Simulated LLM Failure'));

        const result = await runWorkflow04({ batchSize: 1 });

        expect(result.success).toBe(false); // Workflow should be marked as not successful
        expect(result.batchesProcessed).toBe(1); // Only the first batch attempted
        expect(result.totalPostsProcessedInLoop).toBe(1);
        expect(result.totalPostsSuccessfullyUpdated).toBe(0);
        expect(result.totalErrorsInUpdate).toBe(0); // Error was before update step
        
        expect(mockFetchPostsForCorrection).toHaveBeenCalledTimes(1);
        expect(mockFetchReferencesForPosts).toHaveBeenCalledTimes(1);
        expect(mockCorrectHtmlReferencesLlm).toHaveBeenCalledTimes(1);
        expect(mockUpdatePostsWithCorrections).not.toHaveBeenCalled(); // Should not reach update step
    });

}); 
import { generateBlogPostContent, BlogContentOutput } from './03-step-05-generate-content';
import type { PostGenerationData } from './03-step-04-fetch-data-for-generation';
// Updated imports for mocking
import * as llmClient from '../components/llmClient';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import type { Database } from '../../types/supabase';

// Define DiscoveredIssue based on its actual structure (imported from DB types)
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// --- Mocking --- //
// Mock the specific LLM function for blog post generation
const mockGenerateBlogPostWithLLM = jest.spyOn(llmClient, 'generateBlogPostWithLLM');

// --- Test Data --- //
// Create a helper to ensure mock issues conform to DiscoveredIssue type
const createMockDiscoveredIssue = (id: number, text: string, issueTags: string[] | null): DiscoveredIssue => ({
    id,
    extracted_at: new Date().toISOString(),
    issue_text: text,
    source_type: 'test-data',
    status: 'ref_analysis_done',
    issue_type: null,
    priority_score: null,
    sentiment: null,
    source_id: null,
    source_url: null,
    tags: issueTags,
});

const completeMockPostData: PostGenerationData = {
    postId: 101,
    blogPostTitle: 'Test Post Title for Content Gen',
    slug: 'test-post-title-for-content-gen',
    category: 'Sueño Infantil',
    tags: ['test', 'content-gen'],
    issues: [
        createMockDiscoveredIssue(1, 'Issue 1: How to improve baby sleep?', ['sleep', 'baby']),
        createMockDiscoveredIssue(2, 'Issue 2: Understanding sleep regressions.', ['sleep', 'regression'])
    ],
    references: [
        { url: 'ref1.com', title: 'Ref 1 Title', summary: 'Ref 1 Summary', extracts: ['Ref 1 Extract 1'] },
        { url: 'ref2.com', title: 'Ref 2 Title', summary: 'Ref 2 Summary', extracts: ['Ref 2 Extract 1'] }
    ],
};

const mockLLMResponseWithSeparator = `## Test Post Title\n\nThis is the main markdown content.\n\nIt can have multiple lines.\n\n---\nThis is the meta description.`;
const mockLLMResponseWithoutSeparator = `## Test Post Title Without Separator\n\nThis is the markdown content only.`;

// --- Test Suite --- //
describe('03-step-05-generate-content Tests', () => {
    jest.setTimeout(15000); // Increased timeout for the suite

    beforeEach(() => {
        // Reset mocks
        mockGenerateBlogPostWithLLM.mockClear();
        // Suppress console.warn/error for cleaner test output if needed for specific tests
        // jest.spyOn(console, 'warn').mockImplementation(() => {}); 
        // jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Removed jest.restoreAllMocks(); from here
    });

    it('should call generateBlogPostWithLLM with the full PostGenerationData object', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue(''); // Irrelevant for this assertion
        await generateBlogPostContent(completeMockPostData);
        expect(mockGenerateBlogPostWithLLM).toHaveBeenCalledTimes(1);
        expect(mockGenerateBlogPostWithLLM).toHaveBeenCalledWith(completeMockPostData);
    });

    it('should parse markdown and meta description correctly when separator is present', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue(mockLLMResponseWithSeparator);
        const result = await generateBlogPostContent(completeMockPostData);
        expect(result).toEqual({
            markdownContent: '## Test Post Title\n\nThis is the main markdown content.\n\nIt can have multiple lines.',
            metaDescription: 'This is the meta description.'
        });
    });

    it('should handle missing separator by treating all content as markdown and empty meta description', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue(mockLLMResponseWithoutSeparator);
        const result = await generateBlogPostContent(completeMockPostData);
        expect(result).toEqual({
            markdownContent: '## Test Post Title Without Separator\n\nThis is the markdown content only.',
            metaDescription: ''
        });
    });

    it('should return null if PostGenerationData is null', async () => {
        const result = await generateBlogPostContent(null);
        expect(result).toBeNull();
        expect(mockGenerateBlogPostWithLLM).not.toHaveBeenCalled();
    });

    it('should return null if critical fields in PostGenerationData are missing (e.g., title, slug, issues)', async () => {
        const { issues: originalIssues, ...baseData } = completeMockPostData; // Destructure to easily modify

        const dataMissingTitle = { ...baseData, issues: originalIssues, blogPostTitle: undefined as any };
        let result = await generateBlogPostContent(dataMissingTitle as PostGenerationData);
        expect(result).toBeNull();
        expect(mockGenerateBlogPostWithLLM).not.toHaveBeenCalled();

        mockGenerateBlogPostWithLLM.mockClear(); // Clear mock for next invalid call
        const dataMissingSlug = { ...baseData, issues: originalIssues, blogPostTitle: completeMockPostData.blogPostTitle, slug: undefined as any };
        result = await generateBlogPostContent(dataMissingSlug as PostGenerationData);
        expect(result).toBeNull();
        expect(mockGenerateBlogPostWithLLM).not.toHaveBeenCalled();
        
        mockGenerateBlogPostWithLLM.mockClear();
        const dataMissingIssues = { ...baseData, blogPostTitle: completeMockPostData.blogPostTitle, slug: completeMockPostData.slug, issues: [] };
        result = await generateBlogPostContent(dataMissingIssues as PostGenerationData);
        expect(result).toBeNull();
        expect(mockGenerateBlogPostWithLLM).not.toHaveBeenCalled();
        
        mockGenerateBlogPostWithLLM.mockClear();
        const dataNullIssues = { ...baseData, blogPostTitle: completeMockPostData.blogPostTitle, slug: completeMockPostData.slug, issues: null as any };
        result = await generateBlogPostContent(dataNullIssues as PostGenerationData);
        expect(result).toBeNull();
        expect(mockGenerateBlogPostWithLLM).not.toHaveBeenCalled();
    });

    it('should return null if LLM call returns null', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue(null);
        const result = await generateBlogPostContent(completeMockPostData);
        expect(result).toBeNull();
    });

    it('should return null if LLM call throws an error', async () => {
        mockGenerateBlogPostWithLLM.mockRejectedValue(new Error('LLM API Error'));
        const result = await generateBlogPostContent(completeMockPostData);
        expect(result).toBeNull();
    });

    it('should handle empty string from LLM as empty markdown and meta description if separator present before end', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue('\n---\n');
        const result = await generateBlogPostContent(completeMockPostData);
        expect(result).toEqual({
            markdownContent: '',
            metaDescription: ''
        });
    });

    it('should handle empty string from LLM as empty markdown and empty meta if no separator', async () => {
        mockGenerateBlogPostWithLLM.mockResolvedValue('');
        const result = await generateBlogPostContent(completeMockPostData);
        expect(result).toEqual({
            markdownContent: '',
            metaDescription: ''
        });
    });
}); 
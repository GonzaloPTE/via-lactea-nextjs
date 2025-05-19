import { correctHtmlReferencesLlm } from './04-step-03-correct-html-references-llm';
import type { BlogPostWithContext, ReferenceContext } from './04-step-02-fetch-references-for-posts';
import * as llmClientModule from '../components/llmClient'; // Correct: main LLM client
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// --- Mocking --- //
// We spy on the module and then mock its specific exported function
const mockActualLlmCorrectReferences = jest.spyOn(llmClientModule, 'correctReferencesInHtmlWithLLM');

// Helper to create BlogPostWithContext objects for tests
const createMockPostWithContext = (
    id: number, 
    html: string, 
    refs: llmClientModule.NumberedReference[] = [], 
    version: number | null = null
): BlogPostWithContext => ({
    id,
    content_html: html,
    issue_ids: [id * 10], // Dummy issue_ids
    current_version: version,
    relevant_references: refs.map(({number, ...refCtx}) => refCtx as ReferenceContext) // Strip number for this type
});

const mockRef1: llmClientModule.NumberedReference = { number: 1, url: 'http://example.com/ref1', title: 'Ref 1', summary: 'S1', extracts: ['E1'] };
const mockRef2: llmClientModule.NumberedReference = { number: 2, url: 'http://example.com/ref2', title: 'Ref 2', summary: 'S2', extracts: ['E2'] };


describe('04-step-03-correct-html-references-llm Tests', () => {
    beforeEach(() => {
        mockActualLlmCorrectReferences.mockClear();
    });

    afterEach(() => {
        // It's good practice to restore mocks if they are not reset in beforeEach or if other test suites might be affected.
        // However, spyOn automatically restores if jest.config.js has restoreMocks: true (default is false)
        // For clarity, if not globally configured, one might do: mockActualLlmCorrectReferences.mockRestore();
    });

    it('should return empty array if input is null or empty', async () => {
        expect(await correctHtmlReferencesLlm(null)).toEqual([]);
        expect(await correctHtmlReferencesLlm([])).toEqual([]);
    });

    it('should process posts and return corrected HTML from mocked LLM', async () => {
        const posts: BlogPostWithContext[] = [
            createMockPostWithContext(1, '<p>[placeholder]</p>', [mockRef1], 1),
            createMockPostWithContext(2, '<p>No placeholder here.</p>', [], null),
        ];

        // Mock implementation for this test
        mockActualLlmCorrectReferences.mockImplementation(async (html, refs) => {
            if (html.includes("[placeholder]") && refs.length > 0 && refs[0].url) {
                return html.replace("[placeholder]", `<a href="${refs[0].url}" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[${refs[0].number}]</a> (Corrected by Mock)`);
            }
            return html; // No change
        });

        const results = await correctHtmlReferencesLlm(posts);
        expect(results).toHaveLength(2);
        expect(mockActualLlmCorrectReferences).toHaveBeenCalledTimes(2);

        // Post 1 should be corrected
        expect(results[0].post_id).toBe(1);
        expect(results[0].original_content_html).toBe('<p>[placeholder]</p>');
        expect(results[0].corrected_content_html).toBe('<p><a href="http://example.com/ref1" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[1]</a> (Corrected by Mock)</p>');
        expect(results[0].current_version).toBe(1);

        // Post 2 should have no changes
        expect(results[1].post_id).toBe(2);
        expect(results[1].original_content_html).toBe('<p>No placeholder here.</p>');
        expect(results[1].corrected_content_html).toBe('<p>No placeholder here.</p>');
        expect(results[1].current_version).toBeNull();
    });

    it('should handle LLM returning null (simulating error or no change decision)', async () => {
        const posts: BlogPostWithContext[] = [
            createMockPostWithContext(3, '<p>Content to process</p>', [mockRef1], 2),
        ];
        mockActualLlmCorrectReferences.mockResolvedValue(null);

        const results = await correctHtmlReferencesLlm(posts);
        expect(results).toHaveLength(1);
        expect(results[0].post_id).toBe(3);
        expect(results[0].corrected_content_html).toBeNull();
        expect(results[0].original_content_html).toBe('<p>Content to process</p>');
        expect(results[0].current_version).toBe(2);
    });

    it('should skip processing for posts with no HTML content', async () => {
        const posts: BlogPostWithContext[] = [
            createMockPostWithContext(4, '', [], 1), // Empty HTML
            createMockPostWithContext(5, '   ', [], null), // Whitespace HTML
        ];
        await correctHtmlReferencesLlm(posts);
        expect(mockActualLlmCorrectReferences).not.toHaveBeenCalled();
        
        const results = await correctHtmlReferencesLlm(posts);
        expect(results[0].corrected_content_html).toBe('');
        expect(results[1].corrected_content_html).toBe('   ');
    });

    it('should handle LLM throwing an error', async () => {
        const posts: BlogPostWithContext[] = [
            createMockPostWithContext(6, '<p>Error case</p>', [], 0),
        ];
        mockActualLlmCorrectReferences.mockRejectedValue(new Error('LLM API Failure'));

        const results = await correctHtmlReferencesLlm(posts);
        expect(results).toHaveLength(1);
        expect(results[0].post_id).toBe(6);
        expect(results[0].corrected_content_html).toBeNull(); // Should be null on error
        expect(results[0].original_content_html).toBe('<p>Error case</p>');
    });
}); 
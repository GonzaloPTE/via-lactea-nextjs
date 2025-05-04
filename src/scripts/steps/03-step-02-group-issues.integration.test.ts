import { groupIssuesIntoPosts, PostGroupData } from './03-step-02-group-issues';
import type { FetchedIssueData } from './03-step-01-fetch-processed-issues';
// Import the function to mock and Jest functions
import * as llmClient from '../components/llmClient';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// --- Mocking --- //
// Mock the specific LLM function
const mockGroupIssuesWithLLM = jest.spyOn(llmClient, 'groupIssuesWithLLM');

// --- Test Data --- //
const mockIssues: FetchedIssueData[] = [
    { id: 1, issue_text: 'Problem A about sleep', tags: ['sleep', 'baby'], reference_ids: [101] },
    { id: 2, issue_text: 'Question B about feeding', tags: ['feeding'], reference_ids: [102, 103] },
    { id: 3, issue_text: 'Another problem A about sleep regression', tags: ['sleep', 'regression'], reference_ids: [104] },
    { id: 4, issue_text: 'Issue C unrelated', tags: ['other'], reference_ids: [105] },
];

const mockLLMResponse: PostGroupData[] = [
    { titulo: 'Handling Baby Sleep Issues', slug: 'handling-baby-sleep-issues', issuesIds: [1, 3] },
    { titulo: 'Feeding Questions Answered', slug: 'feeding-questions-answered', issuesIds: [2] },
];

// --- Test Suite --- //
describe('03-step-02-group-issues Tests', () => {

    beforeEach(() => {
        // Reset mocks before each test
        mockGroupIssuesWithLLM.mockClear();
    });

    afterEach(() => {
        // Restore all mocks after each test suite run (if needed elsewhere)
        // jest.restoreAllMocks(); // Usually done in afterAll if mocking module-wide
    });

    it('should call groupIssuesWithLLM with correct input format', async () => {
        // Setup mock implementation for this test
        mockGroupIssuesWithLLM.mockResolvedValue([]); // Return empty for this test

        await groupIssuesIntoPosts(mockIssues);

        expect(mockGroupIssuesWithLLM).toHaveBeenCalledTimes(1);
        // Assert LLM client was called with expected arguments (formatted issues)
        const expectedLlmInput = mockIssues.map(i => ({ id: i.id, issue_text: i.issue_text, tags: i.tags }));
        expect(mockGroupIssuesWithLLM).toHaveBeenCalledWith(expectedLlmInput);
    });

    it('should return validated data from groupIssuesWithLLM on success', async () => {
        // Setup mock implementation
        mockGroupIssuesWithLLM.mockResolvedValue(mockLLMResponse);

        const result = await groupIssuesIntoPosts(mockIssues);
        expect(result).toEqual(mockLLMResponse);
    });

    it('should return empty array if groupIssuesWithLLM returns empty array', async () => {
        // Setup mock implementation
        mockGroupIssuesWithLLM.mockResolvedValue([]);

        const result = await groupIssuesIntoPosts(mockIssues);
        expect(result).toEqual([]);
    });

    it('should return empty array if groupIssuesWithLLM throws an error', async () => {
        // Setup mock implementation to throw
        const mockError = new Error('LLM API Error');
        mockGroupIssuesWithLLM.mockRejectedValue(mockError);

        const result = await groupIssuesIntoPosts(mockIssues);
        expect(result).toEqual([]);
        // Optionally check if the error was logged (would require spying on console.error)
    });

    it('should return empty array if input issue list is empty', async () => {
        const result = await groupIssuesIntoPosts([]);
        expect(result).toEqual([]);
        expect(mockGroupIssuesWithLLM).not.toHaveBeenCalled();
    });

}); 
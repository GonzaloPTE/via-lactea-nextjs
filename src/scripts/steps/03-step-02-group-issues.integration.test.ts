import { groupIssuesIntoPosts, PostGroupData } from './03-step-02-group-issues';
import type { FetchedIssueData } from './03-step-01-fetch-processed-issues';
// Import the function to mock and Jest functions
import * as llmClientModule from '../components/llmClient';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs'; // Import fs to mock its methods

// --- Mocking --- //
// Mock the fs module to control file reading during tests
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock the specific LLM function
const mockGroupIssuesWithLLM = jest.spyOn(llmClientModule, 'groupIssuesWithLLM');

// Define the expected raw LLM response type for the mock
// This is what the LLM is expected to return, before our script maps it.
interface MockLLMResponseItem {
    titulo: string;
    slug: string;
    issuesIds: number[];
    category: string;
    tags: string[];
}

// --- Test Data --- //
const mockIssues: FetchedIssueData[] = [
    { id: 1, issue_text: 'Problem A about sleep', tags: ['sleep', 'baby'], reference_ids: [101] },
    { id: 2, issue_text: 'Question B about feeding', tags: ['feeding'], reference_ids: [102, 103] },
    { id: 3, issue_text: 'Another problem A about sleep regression', tags: ['sleep', 'regression'], reference_ids: [104] },
    { id: 4, issue_text: 'Issue C unrelated', tags: ['other'], reference_ids: [105] },
];

const mockLLMRawResponse: MockLLMResponseItem[] = [
    { 
        titulo: 'Handling Baby Sleep Issues', 
        slug: 'handling-baby-sleep-issues', 
        issuesIds: [1, 3], 
        category: 'Sueño Infantil', 
        tags: ['sleep', 'baby', 'regression'] 
    },
    { 
        titulo: 'Feeding Questions Answered', 
        slug: 'feeding-questions-answered', 
        issuesIds: [2], 
        category: 'Lactancia Materna y Alimentación', 
        tags: ['feeding'] 
    },
];

// This is the expected output of groupIssuesIntoPosts AFTER mapping
const expectedMappedResponse: PostGroupData[] = [
    {
        title: 'Handling Baby Sleep Issues',
        slug: 'handling-baby-sleep-issues',
        issue_ids: [1, 3],
        category: 'Sueño Infantil',
        tags: ['sleep', 'baby', 'regression']
    },
    {
        title: 'Feeding Questions Answered',
        slug: 'feeding-questions-answered',
        issue_ids: [2],
        category: 'Lactancia Materna y Alimentación',
        tags: ['feeding']
    },
];

// Define mock categories that would be parsed from the mocked file content
const mockCategoriesContent = `
1. **Sueño Infantil**
2. **Lactancia Materna y Alimentación**
3. **Desarrollo y Crecimiento**
`;
const mockExpectedValidCategories = [
    'Sueño Infantil',
    'Lactancia Materna y Alimentación',
    'Desarrollo y Crecimiento'
];

// --- Test Suite --- //
describe('03-step-02-group-issues Tests', () => {

    beforeEach(() => {
        // Reset mocks before each test
        mockGroupIssuesWithLLM.mockClear();
        mockedFs.readFileSync.mockClear(); // Clear fs mock calls
    });

    afterEach(() => {
        // Restore all mocks after each test suite run (if needed elsewhere)
        // jest.restoreAllMocks(); // Usually done in afterAll if mocking module-wide
    });

    it('should call groupIssuesWithLLM with correct input format and categories', async () => {
        // Setup mock for fs.readFileSync to return our defined categories
        mockedFs.readFileSync.mockReturnValue(mockCategoriesContent);
        
        // Setup mock implementation for this test
        mockGroupIssuesWithLLM.mockResolvedValue([]); // Return empty for this test

        await groupIssuesIntoPosts(mockIssues);

        expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1);
        expect(mockGroupIssuesWithLLM).toHaveBeenCalledTimes(1);
        
        // Assert LLM client was called with expected arguments
        const expectedLlmInputIssues = mockIssues.map(i => ({ id: i.id, issue_text: i.issue_text, tags: i.tags }));
        expect(mockGroupIssuesWithLLM.mock.calls[0][0]).toEqual(expectedLlmInputIssues);
        expect(mockGroupIssuesWithLLM.mock.calls[0][1]).toEqual(mockExpectedValidCategories);
    });

    it('should return validated data from groupIssuesWithLLM on success', async () => {
        // Setup mock for fs.readFileSync as it's called in the function
        mockedFs.readFileSync.mockReturnValue(mockCategoriesContent);
        // Setup mock implementation to return the raw LLM format
        mockGroupIssuesWithLLM.mockResolvedValue(mockLLMRawResponse);

        const result = await groupIssuesIntoPosts(mockIssues);
        // The result of groupIssuesIntoPosts should be the mapped data
        expect(result).toEqual(expectedMappedResponse);
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
import dotenv from 'dotenv';
import path from 'path';
import { executeGoogleSearchForQueries, IssueWithSearchResults } from './02-step-03-execute-search';
import type { IssueWithQueries } from './02-step-02-generate-queries';

// Load environment variables from .env.test at the project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup --- //

// Ensure we have the Google Search API Keys for testing
if (!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || !process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID) {
    throw new Error('Google Search environment variables (API_KEY, ENGINE_ID) are not set in .env.test');
}

// --- Test Suite --- //

describe('02-step-03-execute-search Integration Tests', () => {

    // Increase timeout for tests involving external API calls
    jest.setTimeout(45000); // 45 seconds

    it('should execute searches and return results for issues with queries', async () => {
        const mockIssues: IssueWithQueries[] = [
            {
                id: 1, issue_text: 'Test Issue 1', source_type: 'test',
                status: 'new', // Add other required DiscoveredIssue fields as null/defaults
                source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: ['testing framework javascript', 'best practices unit tests']
            },
            {
                id: 2, issue_text: 'Test Issue 2', source_type: 'test',
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: ['how does promise all work']
            },
        ];

        const results = await executeGoogleSearchForQueries(mockIssues);

        expect(results).toHaveLength(mockIssues.length);

        // Check Issue 1 results
        const issue1Result = results.find(r => r.id === 1);
        expect(issue1Result).toBeDefined();
        expect(issue1Result!.searchError).toBeUndefined();
        expect(issue1Result!.searchResults).toBeDefined();
        expect(Array.isArray(issue1Result!.searchResults)).toBe(true);
        // Expecting results from 2 queries (up to 10 each, likely less)
        expect(issue1Result!.searchResults!.length).toBeGreaterThan(1);
        issue1Result!.searchResults!.forEach(item => {
            expect(typeof item.link).toBe('string');
            expect(item.link).not.toBe('');
            expect(typeof item.title).toBe('string');
            expect(typeof item.snippet).toBe('string');
        });

        // Check Issue 2 results
        const issue2Result = results.find(r => r.id === 2);
        expect(issue2Result).toBeDefined();
        expect(issue2Result!.searchError).toBeUndefined();
        expect(issue2Result!.searchResults).toBeDefined();
        expect(Array.isArray(issue2Result!.searchResults)).toBe(true);
        expect(issue2Result!.searchResults!.length).toBeGreaterThan(0);
    });

    it('should handle issues with no search queries', async () => {
        const mockIssues: IssueWithQueries[] = [
            {
                id: 3, issue_text: 'Test Issue 3', source_type: 'test',
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: [] // Empty queries array
            },
            {
                id: 4, issue_text: 'Test Issue 4', source_type: 'test',
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: undefined // Undefined queries
            },
        ];

        const results = await executeGoogleSearchForQueries(mockIssues);

        expect(results).toHaveLength(mockIssues.length);

        expect(results[0].searchResults).toEqual([]);
        expect(results[0].searchError).toContain('No queries available');

        expect(results[1].searchResults).toEqual([]);
        expect(results[1].searchError).toContain('No queries available');
    });

    it('should return an empty array for empty input', async () => {
        const results = await executeGoogleSearchForQueries([]);
        expect(results).toEqual([]);
    });

    // Test with a query likely to cause an error (e.g., maybe API quota)
    // This is hard to reliably trigger, so just test basic structure
    it('should capture search errors (if they occur)', async () => {
         const mockIssues: IssueWithQueries[] = [
            {
                id: 99, issue_text: 'Test Issue Error', source_type: 'test',
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: ['a query designed to potentially fail or return zero results'] // A potentially problematic query
            },
        ];
        // If the API call *does* fail, we expect searchError to be populated
        // If it succeeds, searchError should be undefined
        // We accept either outcome for this integration test
        const results = await executeGoogleSearchForQueries(mockIssues);
        expect(results).toHaveLength(1);
        expect(results[0].searchResults).toBeDefined(); // Should be an array, even if empty
    });
}); 
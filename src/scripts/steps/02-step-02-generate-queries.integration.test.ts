import dotenv from 'dotenv';
import path from 'path';
import { generateSearchQueriesForIssues, IssueWithQueries } from './02-step-02-generate-queries';
import type { Database } from '../../types/supabase';

// Define types locally
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Load environment variables from .env.test at the project root
// This assumes GOOGLE_GEMINI_API_KEY is defined there for the llmClient
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup --- //

// Ensure we have the Gemini API Key for testing the LLM call
if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY environment variable is not set in .env.test');
}

// --- Test Suite --- //

describe('02-step-02-generate-queries Integration Tests', () => {

    // Increase timeout for tests involving external API calls
    jest.setTimeout(30000); // 30 seconds

    it('should generate search queries for valid issues', async () => {
        const mockIssues: DiscoveredIssue[] = [
            {
                id: 1,
                issue_text: 'How to improve baby sleep without sleep training?',
                source_type: 'test', source_id: null, source_url: '',
                sentiment: 0, // Use a number for sentiment
                issue_type: 'Type A', // Use a string for issue_type
                tags: null,
                priority_score: null, // priority_score can be null
                extracted_at: new Date().toISOString(), // Use a valid date string
                status: 'new'
            },
            {
                id: 2,
                issue_text: 'Sudden bottle refusal breastfed baby',
                source_type: 'test', source_id: null, source_url: '',
                sentiment: -1, // Use a number for sentiment
                issue_type: 'Type B', // Use a string for issue_type
                tags: null,
                priority_score: null,
                extracted_at: new Date().toISOString(),
                status: 'new'
            },
        ];

        const results = await generateSearchQueriesForIssues(mockIssues);

        expect(results).toHaveLength(mockIssues.length);

        results.forEach(result => {
            expect(result.searchQueries).toBeDefined();
            // Expecting the LLM to return at least one query
            expect(Array.isArray(result.searchQueries)).toBe(true);
            expect(result.searchQueries!.length).toBeGreaterThan(0);
            result.searchQueries!.forEach(q => expect(typeof q).toBe('string'));
            expect(result.queryGenerationError).toBeUndefined();
        });
    });

    it('should handle issues with missing issue_text', async () => {
        const mockIssues: DiscoveredIssue[] = [
            {
                id: 1,
                issue_text: '', // Empty issue text
                source_type: 'test', source_id: null, source_url: '',
                sentiment: null, // Sentiment can be null
                issue_type: null, // issue_type can be null
                tags: null,
                priority_score: null,
                extracted_at: new Date().toISOString(),
                status: 'new'
            },
            {
                id: 2,
                // @ts-ignore - Simulate null issue text, still provide other required fields
                issue_text: null,
                source_type: 'test', source_id: null, source_url: '',
                sentiment: null, // Sentiment can be null
                issue_type: null, // issue_type can be null
                tags: null,
                priority_score: null,
                extracted_at: new Date().toISOString(),
                status: 'new'
            },
        ];

        const results = await generateSearchQueriesForIssues(mockIssues);

        expect(results).toHaveLength(mockIssues.length);

        // Check first result (empty string)
        expect(results[0].searchQueries).toBeUndefined(); // Should not attempt generation
        expect(results[0].queryGenerationError).toContain('Missing issue_text');

        // Check second result (null)
        expect(results[1].searchQueries).toBeUndefined(); // Should not attempt generation
        expect(results[1].queryGenerationError).toContain('Missing issue_text');
    });

    it('should return an empty array for empty input', async () => {
        const results = await generateSearchQueriesForIssues([]);
        expect(results).toEqual([]);
    });

    // Note: Testing actual LLM failure modes (e.g., API errors, safety blocks)
    // is complex in integration tests and better covered by llmClient tests.
}); 
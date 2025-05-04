import dotenv from 'dotenv';
import path from 'path';
import { filterAndPrepareUrls, IssuesWithFilteredUrls } from './02-step-04-filter-results';
import type { IssueWithSearchResults, SearchResultItem } from './02-step-03-execute-search';
import { getSupabaseClient, saveReference, ReferenceData } from '../lib/supabaseClient';
import type { DiscoveredIssue } from '../../types/supabase';

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup --- //
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
const testSourceType = 'test-step-04';
let testIssueIds: number[] = [];

async function setupTestData() {
    await cleanupTestData(); // Start clean
    const issuesToInsert: Partial<DiscoveredIssue>[] = [
        { issue_text: 'Issue 101 text', status: 'new', source_type: testSourceType },
        { issue_text: 'Issue 102 text', status: 'new', source_type: testSourceType },
    ];
    const { data, error } = await supabase.from('discovered_issues').insert(issuesToInsert).select('id');
    if (error) throw new Error(`Setup failed: ${error.message}`);
    testIssueIds = data!.map((d: any) => d.id);
    if (testIssueIds.length !== 2) throw new Error('Failed to retrieve exactly 2 test issue IDs.');

    // Insert an existing reference using the *actual* generated ID
    const existingRef: ReferenceData = {
        discovered_issue_id: testIssueIds[0], // Use actual ID of the first inserted issue
        url: 'http://existing.com/page1',
        is_relevant: true, extracts: [], tags: [], summary: 'Exists'
    };
    await saveReference(existingRef);
    console.log('Test data setup complete.');
}

async function cleanupTestData() {
    // Delete references first due to FK
    if (testIssueIds.length > 0) {
        await supabase.from('references').delete().in('discovered_issue_id', testIssueIds);
    }
    await supabase.from('discovered_issues').delete().eq('source_type', testSourceType);
    console.log('Test data cleanup complete.');
    testIssueIds = [];
}

// --- Test Suite --- //
describe('02-step-04-filter-results Integration Tests', () => {
    beforeAll(async () => {
        await setupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    it('should filter duplicates, existing references, and apply limits', async () => {
        const mockInput: IssueWithSearchResults[] = [
            {
                // Issue 101
                id: testIssueIds[0], issue_text: 'Issue 101 text', source_type: testSourceType,
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: ['q1'],
                searchResults: [
                    { link: 'http://a.com', title: 'A', snippet: '...' }, // Keep
                    { link: 'http://b.com', title: 'B', snippet: '...' }, // Keep
                    { link: 'http://existing.com/page1', title: 'Exists', snippet: '...' }, // Filter (DB)
                    { link: 'http://a.com', title: 'A Dup', snippet: '...' }, // Filter (Dup in issue)
                    { link: 'http://c.com', title: 'C', snippet: '...' }, // Keep
                    { link: 'http://d.com', title: 'D', snippet: '...' }, // Keep
                    { link: 'http://e.com', title: 'E', snippet: '...' }, // Keep
                    { link: 'http://f.com', title: 'F', snippet: '...' }, // Filter (Limit 5)
                ]
            },
            {
                // Issue 102
                id: testIssueIds[1], issue_text: 'Issue 102 text', source_type: testSourceType,
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: ['q2'],
                searchResults: [
                    { link: 'http://a.com', title: 'A Again', snippet: '...' }, // Filter (Dup global)
                    { link: 'http://g.com', title: 'G', snippet: '...' }, // Keep
                ]
            },
        ];

        const result = await filterAndPrepareUrls(mockInput);

        // Check Issue 101
        expect(result[testIssueIds[0]]).toBeDefined();
        const urls101 = result[testIssueIds[0]];
        expect(urls101).toHaveLength(5); // a, b, c, d, e (limited)
        expect(urls101.map(u => u.url)).toEqual(['http://a.com', 'http://b.com', 'http://c.com', 'http://d.com', 'http://e.com']);
        urls101.forEach(u => {
            expect(u.originalIssueId).toBe(testIssueIds[0]);
            expect(u.originalIssueText).toBe('Issue 101 text');
        });

        // Check Issue 102
        expect(result[testIssueIds[1]]).toBeDefined();
        const urls102 = result[testIssueIds[1]];
        expect(urls102).toHaveLength(1); // g only
        expect(urls102.map(u => u.url)).toEqual(['http://g.com']);
        expect(urls102[0].originalIssueId).toBe(testIssueIds[1]);
        expect(urls102[0].originalIssueText).toBe('Issue 102 text');
    });

     it('should handle issues with no search results', async () => {
         const mockInput: IssueWithSearchResults[] = [
            {
                id: testIssueIds[0], issue_text: 'Issue 101 text', source_type: testSourceType,
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: ['q1'], searchResults: []
            },
         ];
         const result = await filterAndPrepareUrls(mockInput);
         expect(result[testIssueIds[0]]).toBeDefined();
         expect(result[testIssueIds[0]]).toHaveLength(0);
     });

      it('should handle empty input array', async () => {
         const result = await filterAndPrepareUrls([]);
         expect(result).toEqual({});
     });

    it('should filter out PDF URLs', async () => {
        const mockInput: IssueWithSearchResults[] = [
            {
                id: testIssueIds[0], issue_text: 'Issue 101 PDF Test', source_type: testSourceType,
                status: 'new', source_id: null, source_url: null, sentiment: null, issue_type: null, tags: null, priority_score: null, extracted_at: null,
                searchQueries: ['pdf query'],
                searchResults: [
                    { link: 'http://normal.com/page', title: 'Normal Page', snippet: '...' }, // Keep
                    { link: 'http://example.com/document.pdf', title: 'PDF Document', snippet: '...' }, // Filter
                    { link: 'http://another.com/file.PDF', title: 'Uppercase PDF', snippet: '...' }, // Filter (case insensitive)
                    { link: 'http://end.com/notpdf', title: 'Not PDF', snippet: '...' }, // Keep
                ]
            },
        ];

        // Mock DB check to assume no references exist for simplicity
        const mockCheck = jest.spyOn(require('../lib/supabaseClient'), 'checkReferenceExistsForIssue');
        mockCheck.mockResolvedValue(false);

        const result = await filterAndPrepareUrls(mockInput);

        expect(result[testIssueIds[0]]).toBeDefined();
        const urls = result[testIssueIds[0]];
        expect(urls).toHaveLength(2); // Only normal.com and end.com should remain
        expect(urls.map(u => u.url)).toEqual(['http://normal.com/page', 'http://end.com/notpdf']);
        expect(urls.every(u => !u.url.toLowerCase().endsWith('.pdf'))).toBe(true);

        mockCheck.mockRestore(); // Clean up the mock
    });
}); 
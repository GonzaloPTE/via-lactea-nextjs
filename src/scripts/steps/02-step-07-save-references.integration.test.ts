import dotenv from 'dotenv';
import path from 'path';
import { saveRelevantReferences } from './02-step-07-save-references';
import type { AnalyzedPageData } from './02-step-06-analyze-content';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { DiscoveredIssue } from '../../types/supabase';

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup --- //
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
const testSourceType = 'test-step-07';
let testIssueIds: number[] = [];

async function setupTestData() {
    await cleanupTestData(); // Start clean
    const issuesToInsert: Partial<DiscoveredIssue>[] = [
        { issue_text: 'Issue 201 text', status: 'new', source_type: testSourceType },
        { issue_text: 'Issue 202 text', status: 'new', source_type: testSourceType },
    ];
    const { data, error } = await supabase.from('discovered_issues').insert(issuesToInsert).select('id');
    if (error) throw new Error(`Setup failed: ${error.message}`);
    testIssueIds = data!.map((d: any) => d.id);
    if (testIssueIds.length !== 2) throw new Error('Failed to retrieve exactly 2 test issue IDs.');
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
describe('02-step-07-save-references Integration Tests', () => {
    beforeEach(async () => {
        await setupTestData();
    });

    afterEach(async () => {
        await cleanupTestData();
    });

    it('should save only relevant references to the database', async () => {
        const issueId1 = testIssueIds[0];
        const issueId2 = testIssueIds[1];
        const mockInput: AnalyzedPageData[] = [
            {
                url: 'http://relevant1.com', originalIssueId: issueId1, originalIssueText: 'Issue 201',
                htmlContent: 'content1', analysis: { is_relevant: true, extracts: ['e1'], tags: ['t1'], summary: 's1' }
            },
            {
                url: 'http://irrelevant.com', originalIssueId: issueId1, originalIssueText: 'Issue 201',
                htmlContent: 'content2', analysis: { is_relevant: false, extracts: [], tags: [], summary: 's2' }
            },
            {
                url: 'http://relevant2.com', originalIssueId: issueId2, originalIssueText: 'Issue 202',
                htmlContent: 'content3', analysis: { is_relevant: true, extracts: ['e2', 'e3'], tags: ['t2'], summary: 's3' }
            },
            {
                url: 'http://no-analysis.com', originalIssueId: issueId2, originalIssueText: 'Issue 202',
                htmlContent: 'content4' // No analysis field
            },
             {
                url: 'http://analysis-null.com', originalIssueId: issueId2, originalIssueText: 'Issue 202',
                htmlContent: 'content5', analysis: null, analysisError: 'LLM Error'
            },
        ];

        const summary = await saveRelevantReferences(mockInput);

        // Check summary
        expect(summary.savedCount).toBe(2);
        expect(summary.errorCount).toBe(0);

        // Verify data in DB
        const { data: dbData, error } = await supabase
            .from('references')
            .select('url, discovered_issue_id, is_relevant, extracts, tags, summary')
            .in('discovered_issue_id', testIssueIds);

        expect(error).toBeNull();
        expect(dbData).toHaveLength(2);

        // Check saved reference 1
        const ref1 = dbData!.find(r => r.url === 'http://relevant1.com');
        expect(ref1).toBeDefined();
        expect(ref1?.discovered_issue_id).toBe(issueId1);
        expect(ref1?.is_relevant).toBe(true);
        expect(ref1?.extracts).toEqual(['e1']);
        expect(ref1?.tags).toEqual(['t1']);
        expect(ref1?.summary).toBe('s1');

        // Check saved reference 2
        const ref2 = dbData!.find(r => r.url === 'http://relevant2.com');
        expect(ref2).toBeDefined();
        expect(ref2?.discovered_issue_id).toBe(issueId2);
        expect(ref2?.is_relevant).toBe(true);
        expect(ref2?.extracts).toEqual(['e2', 'e3']);
        expect(ref2?.tags).toEqual(['t2']);
        expect(ref2?.summary).toBe('s3');
    });

    it('should return zero counts if no relevant pages are provided', async () => {
         const mockInput: AnalyzedPageData[] = [
            {
                url: 'http://irrelevant.com', originalIssueId: testIssueIds[0], originalIssueText: 'Issue 201',
                htmlContent: 'content2', analysis: { is_relevant: false, extracts: [], tags: [], summary: 's2' }
            },
            {
                url: 'http://no-analysis.com', originalIssueId: testIssueIds[1], originalIssueText: 'Issue 202',
                htmlContent: 'content4'
            },
        ];
         const summary = await saveRelevantReferences(mockInput);
         expect(summary.savedCount).toBe(0);
         expect(summary.errorCount).toBe(0);

         // Verify DB is still empty for these issues
         const { count } = await supabase.from('references').select('id', { count: 'exact' }).in('discovered_issue_id', testIssueIds);
         expect(count).toBe(0);
    });

    it('should handle empty input array', async () => {
        const summary = await saveRelevantReferences([]);
        expect(summary.savedCount).toBe(0);
        expect(summary.errorCount).toBe(0);
    });

    // Note: Testing the actual DB save error case is harder in integration
    // unless we force a constraint violation (like inserting the same URL twice).
}); 
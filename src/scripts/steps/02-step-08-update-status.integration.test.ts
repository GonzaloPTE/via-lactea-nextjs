import dotenv from 'dotenv';
import path from 'path';
import { updateIssueStatuses } from './02-step-08-update-status';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { DiscoveredIssue } from '../../types/supabase';

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup --- //
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
const testSourceType = 'test-step-08';
let testIssueIds: number[] = [];

async function setupTestData() {
    await cleanupTestData(); // Start clean
    const issuesToInsert: Partial<DiscoveredIssue>[] = [
        { issue_text: 'Issue 301 text', status: 'new', source_type: testSourceType },
        { issue_text: 'Issue 302 text', status: 'new', source_type: testSourceType },
        { issue_text: 'Issue 303 text', status: 'ref_analysis_done', source_type: testSourceType }, // Different initial status
    ];
    const { data, error } = await supabase.from('discovered_issues').insert(issuesToInsert).select('id');
    if (error) throw new Error(`Setup failed: ${error.message}`);
    testIssueIds = data!.map((d: any) => d.id);
    if (testIssueIds.length !== 3) throw new Error('Failed to retrieve exactly 3 test issue IDs.');
    console.log('Test data setup complete.');
}

async function cleanupTestData() {
    await supabase.from('discovered_issues').delete().eq('source_type', testSourceType);
    console.log('Test data cleanup complete.');
    testIssueIds = [];
}

// Helper to fetch status for verification
async function fetchStatuses(ids: number[]): Promise<{ [id: number]: string | null }> {
    const { data, error } = await supabase
        .from('discovered_issues')
        .select('id, status')
        .in('id', ids);
    if (error) throw error;
    return data!.reduce((acc, row) => {
        acc[row.id] = row.status;
        return acc;
    }, {} as { [id: number]: string | null });
}

// --- Test Suite --- //
describe('02-step-08-update-status Integration Tests', () => {
    beforeEach(async () => {
        await setupTestData();
    });

    afterEach(async () => {
        await cleanupTestData();
    });

    it('should update the status for specified issue IDs', async () => {
        const idsToUpdate = [testIssueIds[0], testIssueIds[1]]; // Update first two (initially 'new')
        const newStatus = 'ref_analysis_done';

        await updateIssueStatuses(idsToUpdate, newStatus);

        // Verify statuses in DB
        const statuses = await fetchStatuses(testIssueIds);
        expect(statuses[testIssueIds[0]]).toBe(newStatus);
        expect(statuses[testIssueIds[1]]).toBe(newStatus);
        expect(statuses[testIssueIds[2]]).toBe('ref_analysis_done'); // Should remain unchanged
    });

    it('should handle updating status to ERROR (without error message column)', async () => {
        const idsToUpdate = [testIssueIds[2]]; // Update the one already done
        const newStatus = 'ref_analysis_error';
        const errorMessage = 'Something bad happened';

        // Expect logs the error message, but doesn't try to save it if column missing
        await updateIssueStatuses(idsToUpdate, newStatus, errorMessage);

        // Verify status in DB
        const statuses = await fetchStatuses(testIssueIds);
        expect(statuses[testIssueIds[0]]).toBe('new');
        expect(statuses[testIssueIds[1]]).toBe('new');
        expect(statuses[testIssueIds[2]]).toBe(newStatus);
    });

    it('should not throw error for empty issue ID array', async () => {
        await expect(updateIssueStatuses([], 'ref_analysis_done')).resolves.not.toThrow();
    });

    it('should handle non-existent issue IDs gracefully (no update, no error)', async () => {
        const nonExistentIds = [99999, 88888];
        await expect(updateIssueStatuses(nonExistentIds, 'ref_analysis_done')).resolves.not.toThrow();

        // Verify statuses of original test data remain unchanged
         const statuses = await fetchStatuses(testIssueIds);
         expect(statuses[testIssueIds[0]]).toBe('new');
         expect(statuses[testIssueIds[1]]).toBe('new');
         expect(statuses[testIssueIds[2]]).toBe('ref_analysis_done');
    });
}); 
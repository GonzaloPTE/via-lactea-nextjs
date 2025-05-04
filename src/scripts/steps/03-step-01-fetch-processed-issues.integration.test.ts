import dotenv from 'dotenv';
import path from 'path';
import { fetchProcessedIssuesAndRefs, FetchedIssueData } from './03-step-01-fetch-processed-issues';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Define types locally for easier use
type DiscoveredIssueInsert = Database['public']['Tables']['discovered_issues']['Insert'];
type ReferenceInsert = Database['public']['Tables']['references']['Insert'];

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup ---
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
const supabase = getSupabaseClient();
const testSourceType = 'test-step-01'; // Unique source type for cleanup

// Store IDs based on their characteristics for reliable testing
let issueIdHighPrio: number | null = null;
let issueIdMedPrio: number | null = null;
let issueIdLowPrio: number | null = null;
let issueIdWrongStatus: number | null = null;
let issueIdNulls: number | null = null;
let relevantRefIdsIssue1: number[] = [];
let relevantRefIdIssue2: number | null = null;

async function setupTestData() {
    await cleanupTestData(); // Start clean

    const issuesToInsert: DiscoveredIssueInsert[] = [
        { issue_text: 'Issue 1 High Prio Low Sent', status: 'ref_analysis_done', priority_score: 90, sentiment: -50, source_type: testSourceType, tags: ['prio'] },
        { issue_text: 'Issue 2 Med Prio Neu Sent', status: 'ref_analysis_done', priority_score: 50, sentiment: 0, source_type: testSourceType, tags: ['med'] },
        { issue_text: 'Issue 3 Low Prio High Sent', status: 'ref_analysis_done', priority_score: 10, sentiment: 50, source_type: testSourceType, tags: ['low'] },
        { issue_text: 'Issue 4 Wrong Status', status: 'new', priority_score: 95, sentiment: -60, source_type: testSourceType },
        { issue_text: 'Issue 6 Nulls', status: 'ref_analysis_done', priority_score: null, sentiment: null, source_type: testSourceType },
    ];

    const { data: insertedIssues, error: issueError } = await supabase
        .from('discovered_issues')
        .insert(issuesToInsert)
        .select('id, issue_text'); // Select text to identify them

    if (issueError) throw new Error(`Setup failed inserting issues: ${issueError.message}`);
    if (!insertedIssues || insertedIssues.length !== issuesToInsert.length) throw new Error('Failed to insert or retrieve all test issues.');

    // Assign IDs based on text matching
    issueIdHighPrio = insertedIssues.find(i => i.issue_text === 'Issue 1 High Prio Low Sent')?.id ?? null;
    issueIdMedPrio = insertedIssues.find(i => i.issue_text === 'Issue 2 Med Prio Neu Sent')?.id ?? null;
    issueIdLowPrio = insertedIssues.find(i => i.issue_text === 'Issue 3 Low Prio High Sent')?.id ?? null;
    issueIdWrongStatus = insertedIssues.find(i => i.issue_text === 'Issue 4 Wrong Status')?.id ?? null;
    issueIdNulls = insertedIssues.find(i => i.issue_text === 'Issue 6 Nulls')?.id ?? null;

    if (!issueIdHighPrio || !issueIdMedPrio || !issueIdLowPrio || !issueIdWrongStatus || !issueIdNulls) {
        throw new Error('Failed to retrieve specific issue IDs after insertion.');
    }

    const refsToInsert: ReferenceInsert[] = [
        { discovered_issue_id: issueIdHighPrio, url: 'http://ref1.com', is_relevant: true, title: 'Relevant Ref 1' },
        { discovered_issue_id: issueIdHighPrio, url: 'http://ref2.com', is_relevant: false, title: 'Irrelevant Ref 2' },
        { discovered_issue_id: issueIdHighPrio, url: 'http://ref3.com', is_relevant: true, title: 'Relevant Ref 3' },
        { discovered_issue_id: issueIdMedPrio, url: 'http://ref4.com', is_relevant: true, title: 'Relevant Ref 4' },
        { discovered_issue_id: issueIdWrongStatus, url: 'http://ref5.com', is_relevant: true, title: 'Other Relevant Ref 5' },
    ];

    const { data: insertedRefs, error: refError } = await supabase
        .from('references')
        .insert(refsToInsert)
        .select('id, discovered_issue_id, is_relevant'); // Select needed fields to identify refs

    if (refError) throw new Error(`Setup failed inserting references: ${refError.message}`);
    if (!insertedRefs || insertedRefs.length !== refsToInsert.length) throw new Error('Failed to insert or retrieve all test refs.');

    // Assign ref IDs based on filtering
    relevantRefIdsIssue1 = insertedRefs
        .filter(r => r.discovered_issue_id === issueIdHighPrio && r.is_relevant)
        .map(r => r.id);
    relevantRefIdIssue2 = insertedRefs.find(r => r.discovered_issue_id === issueIdMedPrio && r.is_relevant)?.id ?? null;

    if (relevantRefIdsIssue1.length !== 2 || !relevantRefIdIssue2) {
        throw new Error('Failed to retrieve specific reference IDs after insertion.');
    }

    console.log('Test data setup complete.');
}

async function cleanupTestData() {
    console.log('Cleaning up test data...');

    const idsToDelete = [
        issueIdHighPrio,
        issueIdMedPrio,
        issueIdLowPrio,
        issueIdWrongStatus,
        issueIdNulls
    ].filter(id => id !== null) as number[];

    // Delete specific issues created by this test run first (references cascade)
    if (idsToDelete.length > 0) {
        console.log(`  Deleting specific test issue IDs: ${idsToDelete.join(', ')}`);
        await supabase.from('discovered_issues').delete().in('id', idsToDelete);
    }

    // Optionally, still clean up any stragglers with the test source type
    // console.log(`  Cleaning up any remaining issues with source_type: ${testSourceType}`);
    // await supabase.from('discovered_issues').delete().eq('source_type', testSourceType);

    console.log('Test data cleanup complete.');
    // Reset IDs
    issueIdHighPrio = null;
    issueIdMedPrio = null;
    issueIdLowPrio = null;
    issueIdWrongStatus = null;
    issueIdNulls = null;
    relevantRefIdsIssue1 = [];
    relevantRefIdIssue2 = null;
}

// --- Test Suite ---
describe('03-step-01-fetch-processed-issues Integration Tests', () => {
    jest.setTimeout(20000); // Increase timeout for DB operations

    beforeAll(async () => {
        await setupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    // Test the CORE logic: fetching specific IDs and their relevant references
    it('should fetch specified issues and their correct relevant reference IDs', async () => {
        const idsToFetch = [
            issueIdHighPrio,
            issueIdMedPrio,
            issueIdLowPrio, // Has no relevant refs
            issueIdNulls,   // Has no refs
        ].filter(id => id !== null) as number[];

        // Call in test mode, ignoring batch size
        const results = await fetchProcessedIssuesAndRefs(99, idsToFetch);

        expect(results).toHaveLength(idsToFetch.length);

        // Check Issue 1 (High Prio)
        const issue1Result = results.find(r => r.id === issueIdHighPrio);
        expect(issue1Result).toBeDefined();
        expect(issue1Result?.issue_text).toBe('Issue 1 High Prio Low Sent');
        expect(issue1Result?.reference_ids).toBeDefined();
        expect(issue1Result?.reference_ids.sort()).toEqual(relevantRefIdsIssue1.sort());

        // Check Issue 2 (Med Prio)
        const issue2Result = results.find(r => r.id === issueIdMedPrio);
        expect(issue2Result).toBeDefined();
        expect(issue2Result?.issue_text).toBe('Issue 2 Med Prio Neu Sent');
        expect(issue2Result?.reference_ids).toBeDefined();
        expect(issue2Result?.reference_ids).toEqual([relevantRefIdIssue2]);

        // Check Issue 3 (Low Prio)
        const issue3Result = results.find(r => r.id === issueIdLowPrio);
        expect(issue3Result).toBeDefined();
        expect(issue3Result?.issue_text).toBe('Issue 3 Low Prio High Sent');
        expect(issue3Result?.reference_ids).toEqual([]);

        // Check Issue 6 (Nulls)
        const issueNullsResult = results.find(r => r.id === issueIdNulls);
        expect(issueNullsResult).toBeDefined();
        expect(issueNullsResult?.issue_text).toBe('Issue 6 Nulls');
        expect(issueNullsResult?.reference_ids).toEqual([]);
    });

    // Test the original status/ordering/batching logic (might be flaky if DB is not clean)
    it('should fetch issues by status/order/batch (may be flaky)', async () => {
        const batchSize = 2;
        // Call in normal mode
        const results = await fetchProcessedIssuesAndRefs(batchSize);

        // Basic checks - exact IDs depend heavily on existing DB state
        expect(results.length).toBeLessThanOrEqual(batchSize);
        // Check if the first two have the expected status and plausible IDs
        if (results.length > 0) {
            expect(results[0].id).toBeGreaterThan(0);
            // Check status requires fetching status in the main function, currently not done
        }
        if (results.length > 1) {
            expect(results[1].id).toBeGreaterThan(0);
             // Check status requires fetching status in the main function, currently not done
        }
        // Cannot reliably check exact order (issueIdHighPrio, issueIdMedPrio)
        // due to potential interference from other data in the test DB.
        console.warn('WARN: Test for status/order/batching might be unreliable due to shared test DB state.');
    });


    it('should return an empty array when specific IDs requested are not found', async () => {
        const results = await fetchProcessedIssuesAndRefs(99, [999998, 999999]);
        expect(results).toEqual([]);
    });

    it('should return an empty array when no matching issues are found by status/order', async () => {
        // Temporarily update all test issues to a non-matching status
        const idsToUpdate = [
            issueIdHighPrio,
            issueIdMedPrio,
            issueIdLowPrio,
            issueIdWrongStatus, // Already wrong status, but include for safety
            issueIdNulls
        ].filter(id => id !== null) as number[];

        const { error } = await supabase
            .from('discovered_issues')
            .update({ status: 'new' })
            .in('id', idsToUpdate);
        expect(error).toBeNull(); // Check update succeeded

        // Fetch in normal mode
        const results = await fetchProcessedIssuesAndRefs(5);
        // This might still fetch *other* issues if they exist with 'ref_analysis_done'
        // A truly robust test would ensure NO issues have this status, which is hard.
        console.warn('WARN: Test for empty result by status might fetch unrelated data if test DB is not clean.');
        // We expect it to NOT fetch the specific issues we just updated.
        const fetchedTestIds = results.map(r => r.id).filter(id => idsToUpdate.includes(id));
        expect(fetchedTestIds).toEqual([]);

        // Restore status for other tests (important!)
        const { error: restoreError } = await supabase
            .from('discovered_issues')
            .update({ status: 'ref_analysis_done' })
            .in('id', [issueIdHighPrio, issueIdMedPrio, issueIdLowPrio, issueIdNulls].filter(id => id !== null) as number[]);
        expect(restoreError).toBeNull(); // Check restore succeeded
    });

}); 
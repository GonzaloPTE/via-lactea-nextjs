import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
    Issue,
    ReferenceData,
    getPendingIssues,
    checkReferenceExistsForIssue,
    saveReference,
} from './supabaseClient';

// Load environment variables from .env file
dotenv.config({ path: '../../../.env' }); // Adjust path relative to this file

// --- Test Configuration ---
const TEST_ISSUE_TEXT_PREFIX = '__TEST_ISSUE__';
const MAX_TEST_WAIT_TIME = 20000; // 20 seconds

// Use Service Role Key for setup/teardown if available and necessary
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Needed for cleanup
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key not provided in environment variables for testing.');
}

// Create a separate client instance for test setup/teardown
// Use service key if available for cleanup privileges, otherwise use anon key
const testAdminClient = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found. Test cleanup might fail if anon key lacks delete permissions.');
}

// --- Test Suite ---
describe('SupabaseClient Integration Tests', () => {
    let testIssues: Issue[] = [];
    let testReferences: ReferenceData[] = [];

    // Setup: Create unique test data before each test
    beforeEach(async () => {
        const uniqueTimestamp = Date.now();
        const issueText = `${TEST_ISSUE_TEXT_PREFIX}${uniqueTimestamp}`;

        // 1. Create a test issue in 'discovered_issues'
        // Assuming 'priority_score' and 'issue_text' are the main fields needed
        // Add other required fields based on your actual table schema
        const { data: issueData, error: issueError } = await testAdminClient
            .from('discovered_issues')
            .insert({
                issue_text: issueText,
                priority_score: 100, // High priority to likely be fetched by getPendingIssues
                // Add defaults for any other non-nullable columns if necessary
                subreddit: 'r/test', 
                thread_title: 'Test Thread',
                thread_url: `http://test.com/${uniqueTimestamp}`,
                sentiment: 0,
                type: 'Test',
                tags: ['test']
            })
            .select('id, issue_text') // Select needed fields
            .single(); // Expecting a single row

        if (issueError || !issueData) {
            console.error('Failed to create test issue:', issueError);
            throw new Error(`Test setup failed: Could not create test issue. ${issueError?.message}`);
        }
        testIssues.push(issueData as Issue);

    }, MAX_TEST_WAIT_TIME); // Increase timeout for setup

    // Teardown: Clean up all test data after each test
    afterEach(async () => {
        // Delete references first due to potential foreign key constraints
        for (const ref of testReferences) {
             // Delete based on URL and issue_id which should be unique together for the test
             const { error } = await testAdminClient
                .from('references')
                .delete()
                .match({ url: ref.url, issue_id: ref.issue_id });
             if (error) console.error(`Error deleting test reference ${ref.url}:`, error);
        }

        // Delete issues
        for (const issue of testIssues) {
            const { error } = await testAdminClient
                .from('discovered_issues')
                .delete()
                .eq('id', issue.id);
            if (error) console.error(`Error deleting test issue ${issue.id}:`, error);
        }

        // Clear arrays for next test
        testIssues = [];
        testReferences = [];
    }, MAX_TEST_WAIT_TIME); // Increase timeout for teardown

    // --- Test Cases ---

    test('getPendingIssues should retrieve recently added high-priority test issue', async () => {
        if (testIssues.length === 0) throw new Error('Test setup failed: No test issue available');
        const issueToFind = testIssues[0];

        // Call the function under test
        const pendingIssues = await getPendingIssues(5);

        // Assert: Check if the created test issue is in the results
        // Note: This depends on the function's current logic (limit, ordering)
        expect(pendingIssues).toBeInstanceOf(Array);
        const found = pendingIssues.some(issue => issue.id === issueToFind.id && issue.issue_text === issueToFind.issue_text);
        expect(found).toBe(true);

    }, MAX_TEST_WAIT_TIME);

    test('checkReferenceExistsForIssue should return true for existing reference, false otherwise', async () => {
        if (testIssues.length === 0) throw new Error('Test setup failed: No test issue available');
        const testIssueId = testIssues[0].id;
        const testUrl = `http://test.com/ref/${Date.now()}`;

        // 1. Insert a dummy reference for the test issue
        const { error: insertError } = await testAdminClient
            .from('references')
            .insert({ issue_id: testIssueId, url: testUrl, is_relevant: true, extracts: [], tags:[], summary: 'test'}); // Add required fields

        if(insertError) throw new Error(`Setup failed for checkReferenceExists: ${insertError.message}`);

        // Manually add to cleanup list as it wasn't created via saveReference
        testReferences.push({ url: testUrl, issue_id: testIssueId, is_relevant: true, extracts: [], tags:[], summary: 'test' });

        // 2. Assertions
        const exists = await checkReferenceExistsForIssue(testUrl, testIssueId);
        expect(exists).toBe(true);

        const nonExistentUrl = await checkReferenceExistsForIssue('http://nonexistent.com', testIssueId);
        expect(nonExistentUrl).toBe(false);

        const nonExistentIssue = await checkReferenceExistsForIssue(testUrl, '00000000-0000-0000-0000-000000000000'); // Assuming UUIDs
        expect(nonExistentIssue).toBe(false);

    }, MAX_TEST_WAIT_TIME);

    test('saveReference should insert a new reference into the database', async () => {
        if (testIssues.length === 0) throw new Error('Test setup failed: No test issue available');
        const testIssueId = testIssues[0].id;

        const referenceData: ReferenceData = {
            url: `http://test.com/save/${Date.now()}`,
            issue_id: testIssueId,
            is_relevant: true,
            extracts: ['snippet 1', 'snippet 2'],
            tags: ['tag1', 'tag2'],
            summary: 'This is a test summary.',
        };

        // Call the function under test
        await saveReference(referenceData);
        // Add to list for cleanup
        testReferences.push(referenceData);

        // Assert: Verify the data was inserted correctly by querying directly
        const { data: savedData, error } = await testAdminClient
            .from('references')
            .select('*')
            .eq('url', referenceData.url)
            .eq('issue_id', referenceData.issue_id)
            .single();

        expect(error).toBeNull();
        expect(savedData).not.toBeNull();
        expect(savedData.url).toEqual(referenceData.url);
        expect(savedData.issue_id).toEqual(referenceData.issue_id);
        expect(savedData.is_relevant).toEqual(referenceData.is_relevant);
        expect(savedData.extracts).toEqual(referenceData.extracts);
        expect(savedData.tags).toEqual(referenceData.tags);
        expect(savedData.summary).toEqual(referenceData.summary);

    }, MAX_TEST_WAIT_TIME);
}); 
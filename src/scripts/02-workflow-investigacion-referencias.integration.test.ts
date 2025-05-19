import dotenv from 'dotenv';
import path from 'path';
import { runWorkflow } from './02-workflow-investigacion-referencias'; // Import the orchestrator
import { getSupabaseClient } from './lib/supabaseClient';
import type { Database } from '../types/supabase'; // Import Database type

// Define DiscoveredIssue locally using the Database type
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// --- Test Setup --- //
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase test environment variables are not set.');
}
if (!process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || !process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn('Warning: External API keys (Google Custom Search / Gemini) are not fully set in .env.test. Workflow test might be limited.');
    // Consider mocking if keys are missing, but for true integration, they are needed.
}

const supabase = getSupabaseClient();
const testSourceType = 'test-workflow-02';
let testIssueIds: number[] = [];

async function setupTestData(count: number = 2) {
    await cleanupTestData(); // Start clean
    console.log(`Setting up ${count} test issues...`);
    const issuesToInsert: Partial<DiscoveredIssue>[] = Array.from({ length: count }, (_, i) => ({
        issue_text: `Workflow Test Issue ${i + 1} - Sleep problems ${Date.now()}`, // Add timestamp for uniqueness
        status: 'new', // Ensure they are picked up by Step 1
        source_type: testSourceType,
    }));
    const { data, error } = await supabase.from('discovered_issues').insert(issuesToInsert).select('id');
    if (error) throw new Error(`Setup failed: ${error.message}`);
    testIssueIds = data!.map((d: any) => d.id);
    if (testIssueIds.length !== count) throw new Error(`Failed to retrieve exactly ${count} test issue IDs.`);
    console.log('Test data setup complete. Issue IDs:', testIssueIds);
}

async function cleanupTestData(idsToClean: number[] = testIssueIds) {
    // If specific IDs are passed, use them; otherwise, use the global potentially stale ones (less ideal)
    const ids = idsToClean.length > 0 ? idsToClean : testIssueIds;
    console.log(`Cleaning up test data for issues: ${ids.join(', ') || 'none'}...`);
    if (ids.length > 0) {
        // Delete references first due to FK constraint
        const { error: refError } = await supabase.from('references').delete().in('discovered_issue_id', ids);
        if (refError) console.error('Error cleaning references:', refError.message);
        // Delete issues
        const { error: issueError } = await supabase.from('discovered_issues').delete().in('id', ids); // Delete by specific ID
        if (issueError) console.error('Error cleaning issues:', issueError.message);
    }
    // Reset global tracker AFTER cleaning up specific IDs if they were passed
    if (ids === testIssueIds) {
         testIssueIds = [];
    }
    console.log('Test data cleanup complete.');
}

// Helper to fetch status for verification
async function fetchStatuses(ids: number[]): Promise<{ [id: number]: string | null }> {
    if (ids.length === 0) return {};
    const { data, error } = await supabase
        .from('discovered_issues')
        .select('id, status')
        .in('id', ids);
    if (error) throw new Error(`Failed to fetch statuses: ${error.message}`);
    return data!.reduce((acc, row) => {
        acc[row.id] = row.status;
        return acc;
    }, {} as { [id: number]: string | null });
}

// Helper to count references for verification
async function countReferences(ids: number[]): Promise<number> {
     if (ids.length === 0) return 0;
     const { count, error } = await supabase
        .from('references')
        .select('id', { count: 'exact', head: true })
        .in('discovered_issue_id', ids);
    if (error) throw new Error(`Failed to count references: ${error.message}`);
    return count ?? 0;
}


// --- Test Suite --- //
describe('02-workflow-investigacion-referencias Integration Test', () => {
    // Increase timeout for the entire workflow
    jest.setTimeout(180000); // 3 minutes, adjust as needed

    beforeEach(async () => {
        // Setup with 2 issues by default before each test
        // Ensure testIssueIds is reset before setup if cleanup is moved
        testIssueIds = [];
        await setupTestData(2);
    });

    it('should run the full workflow successfully for a small batch of issues', async () => {
        const issuesToRequest = testIssueIds.length; // How many we asked setup to create
        // Keep track of the specific IDs created by setup for cleanup
        const createdIssueIds = [...testIssueIds]; 
        let actualProcessedIds: number[] = []; // Store IDs the workflow *actually* processed

        try {
            console.log(`Requesting workflow run for ${issuesToRequest} issues. Setup created IDs:`, createdIssueIds);

            // Execute the workflow, asking it to fetch the number created by setup
            // const workflowResult = await runWorkflow({ issuesToFetch: issuesToRequest });
            // Pass batchSize to ensure test issues are picked up. issuesToRequest is usually small (e.g., 2).
            const workflowResult = await runWorkflow({ batchSize: issuesToRequest }); 
            
            // Store the actual processed IDs from the result
            expect(workflowResult.success).toBe(true);
            actualProcessedIds = workflowResult.processedIssueIds;
            console.log(`Workflow completed successfully. Processed Issue IDs:`, actualProcessedIds);
            // It's possible it processed fewer than requested if there weren't enough 'new' ones,
            // or even different ones if old test data existed. 
            // We primarily care that *some* were processed and *those specific ones* were updated.
            expect(actualProcessedIds.length).toBeGreaterThan(0); // Ensure it processed at least one

            // --- Verification ---
            // Add a small delay to allow DB changes to propagate/commit (still useful)
            console.log('Waiting 2 seconds before verification...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 1. Check final status of the ACTUAL processed issues
            const finalStatuses = await fetchStatuses(actualProcessedIds); 
            console.log('Verifying final statuses for processed IDs:', finalStatuses);
            for (const issueId of actualProcessedIds) {
                expect(finalStatuses[issueId]).toBe('ref_analysis_done');
            }

            // 2. Check if references were created for the ACTUAL processed issues
            const referenceCount = await countReferences(actualProcessedIds); 
            console.log('Reference count for processed IDs:', referenceCount);
            expect(referenceCount).toBeGreaterThan(0); 

            console.log('Workflow success test completed for processed IDs.');

        } finally {
             // Ensure cleanup runs regardless of test success/failure, using the IDs created by *setup*
            console.log('Running cleanup within finally block for setup IDs...');
            await cleanupTestData(createdIssueIds); 
        }
    });

    // TODO: Add test case for failure scenario (e.g., if an API key is invalid or a step throws)
    // it('should mark issues as error if a step fails critically', async () => { ... });

}); 
import dotenv from 'dotenv';
import { fetchAndPrepareAnalysisQueue } from './steps/02-fetch-prepare-queue';
import { performParallelAnalysis } from './steps/02-parallel-analysis';
import { processAndSaveResults } from './steps/02-process-save-results';

// Load .env.local for standalone execution (Jest setup handles it for tests)
dotenv.config({ path: '../../.env.local' });

// --- Configuration ---
const ISSUES_TO_FETCH = 5;      // How many pending issues to process per run
const SEARCH_RESULTS_PER_ISSUE = 5; // How many Google search results to check per issue
// Concurrency limit for external APIs can be added here if needed

// --- Main Workflow Orchestrator ---

async function runWorkflow() {
    console.log('--- Starting Reference Research Workflow ---');
    try {
        // Step 1 & 2: Fetch issues and prepare analysis queue
        const analysisQueue = await fetchAndPrepareAnalysisQueue(
            ISSUES_TO_FETCH,
            SEARCH_RESULTS_PER_ISSUE
        );

        // Step 3: Perform parallel analysis
        const analysisResults = await performParallelAnalysis(analysisQueue);

        // Step 4: Process results and save to DB
        await processAndSaveResults(analysisResults);

        // Step 5: TODO (Optional): Update status of processed issues
        console.log('\n  TODO: Implement updating status for processed issues.');

    } catch (error) {
        console.error('\n--- Workflow failed due to unhandled error: ---', error);
        process.exit(1); // Exit with error code if a critical step failed
    }
    console.log('\n--- Reference Research Workflow Finished Successfully ---');
}

// Execute the workflow
runWorkflow().catch(error => {
    console.error('Unhandled error in workflow execution:', error);
    process.exit(1);
});

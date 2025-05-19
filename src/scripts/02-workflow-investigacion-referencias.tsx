import dotenv from 'dotenv';
// Import functions corresponding to the new 8-step plan
// (These files/functions will need to be created/refactored next)
import { fetchPendingIssues } from './steps/02-step-01-fetch-issues';
import { generateSearchQueriesForIssues } from './steps/02-step-02-generate-queries';
import { executeGoogleSearchForQueries } from './steps/02-step-03-execute-search';
import { filterAndPrepareUrls } from './steps/02-step-04-filter-results';
import { scrapeWebPages } from './steps/02-step-05-scrape-content';
import { analyzeScrapedContent } from './steps/02-step-06-analyze-content';
import { saveRelevantReferences } from './steps/02-step-07-save-references';
import { updateIssueStatuses } from './steps/02-step-08-update-status';
// Import necessary types
import type { Database } from '../types/supabase'; // Import Database type
import type { IssuesWithFilteredUrls, UrlToScrape } from './steps/02-step-04-filter-results';

// Define DiscoveredIssue locally
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Load .env.local for standalone execution
dotenv.config({ path: '../../.env.local' });

// --- Configuration ---
// Default batch size
const DEFAULT_ISSUES_BATCH_SIZE = 5; 

// --- Main Workflow Orchestrator ---

export async function runWorkflow(options?: { batchSize?: number }) {
    const batchSize = options?.batchSize ?? DEFAULT_ISSUES_BATCH_SIZE;
    console.log(`--- Starting Reference Research Workflow (v2) --- (Batch size: ${batchSize})`);
    let totalProcessedCount = 0;
    let currentBatchNumber = 0;
    const allProcessedIssueIds: number[] = []; // Added to collect all processed IDs

    while (true) {
        currentBatchNumber++;
        console.log(`\n--- Processing Batch ${currentBatchNumber} ---`);
        let currentBatchIds: number[] = [];
        let issuesInBatch: DiscoveredIssue[] = [];

        try {
            // Step 1: Fetch Batch of Pending Issues
            console.log(`\n[Step 1/8] Fetching up to ${batchSize} pending issues...`);
            const fetchedIssues: DiscoveredIssue[] | null = await fetchPendingIssues(batchSize);

            if (!fetchedIssues || fetchedIssues.length === 0) {
                console.log('  No more pending issues found. Workflow finished.');
                break; // Exit the loop
            }
            issuesInBatch = fetchedIssues;
            currentBatchIds = issuesInBatch.map((issue: DiscoveredIssue) => issue.id);
            console.log(`  Fetched ${issuesInBatch.length} issues for this batch with IDs: ${currentBatchIds.join(', ')}`);

            // --- Process the current batch --- 
            // Step 2: Generate Search Queries
            console.log('\n[Step 2/8] Generating search queries via LLM...');
            const issuesWithQueries = await generateSearchQueriesForIssues(issuesInBatch);
            console.log(`  Generated queries for ${issuesWithQueries.length} issues.`);

            // Step 3: Execute Google Search
            console.log('\n[Step 3/8] Executing Google searches...');
            const issuesWithSearchResults = await executeGoogleSearchForQueries(issuesWithQueries);
            console.log(`  Obtained search results for ${issuesWithSearchResults.length} issues.`);

            // Step 4: Filter Search Results
            console.log('\n[Step 4/8] Filtering search results and preparing URLs...');
            const issuesWithFilteredUrls: IssuesWithFilteredUrls = await filterAndPrepareUrls(issuesWithSearchResults);
            const urlCount = Object.values(issuesWithFilteredUrls).reduce((acc, urls: UrlToScrape[]) => acc + urls.length, 0);
            console.log(`  Prepared ${urlCount} total URLs for scraping across ${Object.keys(issuesWithFilteredUrls).length} issues.`);

            // Step 5: Scrape Web Content
            console.log('\n[Step 5/8] Scraping web content...');
            const scrapedPagesData = await scrapeWebPages(issuesWithFilteredUrls);
            const attemptCount = scrapedPagesData.length;
            const successCount = scrapedPagesData.filter(p => p.htmlContent).length;
            console.log(`  Finished scraping. Attempted: ${attemptCount}, Success: ${successCount}, Failures/Skipped: ${attemptCount - successCount}`);

            // Step 6: Analyze Content Relevance (LLM)
            console.log('\n[Step 6/8] Analyzing content relevance via LLM...');
            const analysisResults = await analyzeScrapedContent(scrapedPagesData);
            console.log(`  Analyzed ${analysisResults.length} pages.`);

            // Step 7: Save Relevant References
            console.log('\n[Step 7/8] Saving relevant references to database...');
            const saveSummary = await saveRelevantReferences(analysisResults);
            console.log(`  Saved ${saveSummary.savedCount} references. Encountered ${saveSummary.errorCount} errors during save.`);

            // Step 8: Update Issue Status for Successfully Processed Batch
            console.log('\n[Step 8/8] Updating status for successfully processed batch issues...');
            await updateIssueStatuses(currentBatchIds, 'ref_analysis_done');
            console.log(`  Marked ${currentBatchIds.length} issues from batch ${currentBatchNumber} as ref_analysis_done.`);
            
            allProcessedIssueIds.push(...currentBatchIds); // Accumulate processed IDs
            totalProcessedCount += currentBatchIds.length; // Increment total count
            // --- End processing the current batch --- 

        } catch (error: any) {
            console.error(`\n--- Error processing Batch ${currentBatchNumber} (IDs: ${currentBatchIds.join(', ') || 'N/A'}) ---`, error);
            console.log('Stopping workflow due to error in batch processing.');
            // Don't mark issues as error, let them be retried next time.
            // Re-throw the error to be caught by the final handler if needed, or just break.
            // throw error; // Option 1: Propagate error up
            break; // Option 2: Stop processing further batches
        }
    } // End while loop

    console.log(`\n--- Reference Research Workflow (v2) Finished ---`);
    console.log(`Total issues processed across all batches: ${totalProcessedCount}`);
    // Return success and total count
    return { success: true, totalProcessedCount: totalProcessedCount, processedIssueIds: allProcessedIssueIds }; 

} // End runWorkflow

// Execute the workflow only if the script is run directly
if (require.main === module) {
    runWorkflow()
        .then(({ totalProcessedCount }) => {
            console.log(`Workflow completed via direct execution. Processed ${totalProcessedCount} issues.`);
            process.exit(0);
        })
        .catch((error) => {
            console.error("Workflow failed during direct execution:", error);
            process.exit(1); // Exit with error code only if runWorkflow itself throws
        });
}

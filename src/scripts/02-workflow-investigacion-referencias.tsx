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
import type { DiscoveredIssue } from '../types/supabase';
import type { IssuesWithFilteredUrls, UrlToScrape } from './steps/02-step-04-filter-results';

// Load .env.local for standalone execution
dotenv.config({ path: '../../.env.local' });

// --- Configuration ---
const DEFAULT_ISSUES_TO_FETCH = 5; // Default value
// Add other relevant configuration if needed, e.g.:
// const MAX_QUERIES_PER_ISSUE = 3;
// const MAX_SEARCH_RESULTS_PER_QUERY = 5;
// const MAX_CONCURRENT_SCRAPES = 10;
// const MAX_CONCURRENT_ANALYSES = 5;

// --- Main Workflow Orchestrator ---

// Export the function to make it testable
export async function runWorkflow(options?: { issuesToFetch?: number }) {
    const issuesToFetch = options?.issuesToFetch ?? DEFAULT_ISSUES_TO_FETCH;
    console.log(`--- Starting Reference Research Workflow (v2) --- (Fetching up to ${issuesToFetch} issues)`);
    let processedIssueIds: number[] = []; // Keep track of issues processed
    let issuesToProcess: DiscoveredIssue[] = []; // Hold the fetched issues

    try {
        // Step 1: Fetch Pending Issues
        console.log(`\n[Step 1/8] Fetching up to ${issuesToFetch} pending issues...`);
        const fetchedIssues: DiscoveredIssue[] | null = await fetchPendingIssues(issuesToFetch);
        if (!fetchedIssues || fetchedIssues.length === 0) {
            console.log('  No pending issues found. Workflow finished early.');
            // Return empty processed IDs list
            return { success: true, processedIssueIds: [] };
        }
        issuesToProcess = fetchedIssues;
        processedIssueIds = issuesToProcess.map((issue: DiscoveredIssue) => issue.id);
        console.log(`  Fetched ${issuesToProcess.length} issues with IDs: ${processedIssueIds.join(', ')}`); // Log fetched IDs

        // Step 2: Generate Search Queries
        console.log('\n[Step 2/8] Generating search queries via LLM...');
        // Pass the correctly typed issuesToProcess
        const issuesWithQueries = await generateSearchQueriesForIssues(issuesToProcess);
        console.log(`  Generated queries for ${issuesWithQueries.length} issues.`);

        // Step 3: Execute Google Search
        console.log('\n[Step 3/8] Executing Google searches...');
        const issuesWithSearchResults = await executeGoogleSearchForQueries(issuesWithQueries);
        console.log(`  Obtained search results for ${issuesWithSearchResults.length} issues.`);

        // Step 4: Filter Search Results
        console.log('\n[Step 4/8] Filtering search results and preparing URLs...');
        const issuesWithFilteredUrls: IssuesWithFilteredUrls = await filterAndPrepareUrls(issuesWithSearchResults);
        // Correct logging for object map with explicit type
        const urlCount = Object.values(issuesWithFilteredUrls).reduce((acc, urls: UrlToScrape[]) => acc + urls.length, 0);
        console.log(`  Prepared ${urlCount} total URLs for scraping across ${Object.keys(issuesWithFilteredUrls).length} issues.`);

        // Step 5: Scrape Web Content
        console.log('\n[Step 5/8] Scraping web content...');
        // Note: Step 5 expects IssuesWithFilteredUrls and flattens internally
        // const allUrlsToScrape: UrlToScrape[] = Object.values(issuesWithFilteredUrls).flat(); // Removed pre-flattening
        const scrapedPagesData = await scrapeWebPages(issuesWithFilteredUrls); // Pass the map directly
        // Log based on actual results returned by scrapeWebPages
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
        console.log(`  Saved ${saveSummary.savedCount} references. Encountered ${saveSummary.errorCount} errors.`);

        // Step 8: Update Issue Status (Success)
        console.log('\n[Step 8/8] Updating status for processed issues...');
        await updateIssueStatuses(processedIssueIds, 'ref_analysis_done');
        console.log(`  Marked ${processedIssueIds.length} issues as ref_analysis_done.`);

        console.log('\n--- Reference Research Workflow (v2) Finished Successfully ---');
        // Return success and the actual IDs processed
        return { success: true, processedIssueIds: processedIssueIds };

    } catch (error: any) {
        console.error('\n--- Workflow failed ---', error);
        // Attempt to mark the initially fetched issues as ERROR
        if (processedIssueIds.length > 0) {
            try {
                console.log('\n[Step 8/8 - Failure] Attempting to mark issues as ref_analysis_error...');
                 // Update status column to error value (e.g., 'ref_analysis_error')
                await updateIssueStatuses(processedIssueIds, 'ref_analysis_error', error.message || 'Unknown workflow error');
                console.log(`  Marked ${processedIssueIds.length} issues as ref_analysis_error.`);
            } catch (updateError) {
                console.error('  Failed to update issue statuses to ERROR:', updateError);
                // Log this secondary error, but prioritize throwing the original workflow error
            }
        }
        // Instead of process.exit, throw the error so test runners can catch it
        // process.exit(1);
        throw error; // Re-throw the original error after attempting cleanup
    }
    // This line is technically unreachable due to return/throw paths, but satisfies linters/compilers
    // console.log('--- Reference Research Workflow (v2) Finished ---');
}

// Execute the workflow only if the script is run directly
if (require.main === module) {
    runWorkflow()
        .then(() => {
            console.log("Workflow completed via direct execution.");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Workflow failed during direct execution:", error);
            process.exit(1);
        });
}

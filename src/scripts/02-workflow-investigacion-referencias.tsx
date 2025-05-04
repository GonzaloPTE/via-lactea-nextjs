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
// Assuming a type definition exists
import type { DiscoveredIssue } from '../types/supabase';

// Load .env.local for standalone execution
dotenv.config({ path: '../../.env.local' });

// --- Configuration ---
const ISSUES_TO_FETCH = 5;      // How many pending issues to process per run
// Add other relevant configuration if needed, e.g.:
// const MAX_QUERIES_PER_ISSUE = 3;
// const MAX_SEARCH_RESULTS_PER_QUERY = 5;
// const MAX_CONCURRENT_SCRAPES = 10;
// const MAX_CONCURRENT_ANALYSES = 5;

// --- Main Workflow Orchestrator ---

async function runWorkflow() {
    console.log('--- Starting Reference Research Workflow (v2) ---');
    let processedIssueIds: number[] = []; // Keep track of issues processed

    try {
        // Step 1: Fetch Pending Issues
        console.log(`\n[Step 1/8] Fetching up to ${ISSUES_TO_FETCH} pending issues...`);
        const issues: DiscoveredIssue[] | null = await fetchPendingIssues(ISSUES_TO_FETCH);
        if (!issues || issues.length === 0) {
            console.log('  No pending issues found. Workflow finished early.');
            return;
        }
        processedIssueIds = issues.map((issue: DiscoveredIssue) => issue.id); // Store IDs for final status update
        console.log(`  Fetched ${issues.length} issues.`);

        // Step 2: Generate Search Queries
        console.log('\n[Step 2/8] Generating search queries via LLM...');
        const issuesWithQueries = await generateSearchQueriesForIssues(issues);
        console.log(`  Generated queries for ${issuesWithQueries.length} issues.`);

        // Step 3: Execute Google Search
        console.log('\n[Step 3/8] Executing Google searches...');
        const issuesWithSearchResults = await executeGoogleSearchForQueries(issuesWithQueries);
        console.log(`  Obtained search results for ${issuesWithSearchResults.length} issues.`);

        // Step 4: Filter Search Results
        console.log('\n[Step 4/8] Filtering search results and preparing URLs...');
        const issuesWithFilteredUrls = await filterAndPrepareUrls(issuesWithSearchResults);
        // Correct logging for object map
        const urlCount = Object.values(issuesWithFilteredUrls).reduce((acc, urls) => acc + urls.length, 0);
        console.log(`  Prepared ${urlCount} total URLs for scraping across ${Object.keys(issuesWithFilteredUrls).length} issues.`);

        // Step 5: Scrape Web Content
        console.log('\n[Step 5/8] Scraping web content...');
        const scrapedPagesData = await scrapeWebPages(issuesWithFilteredUrls);
        console.log(`  Attempted scraping for ${scrapedPagesData.length} URLs.`); // Log based on attempts

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
        // Update status column to success value (e.g., 'ref_analysis_done')
        await updateIssueStatuses(processedIssueIds, 'ref_analysis_done');
        console.log(`  Marked ${processedIssueIds.length} issues as ref_analysis_done.`);

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
            }
        }
        process.exit(1); // Exit with error code
    }
    console.log('\n--- Reference Research Workflow (v2) Finished Successfully ---');
}

// Execute the workflow
runWorkflow();

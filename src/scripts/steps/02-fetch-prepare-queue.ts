import {
    getPendingIssues,
    checkReferenceExistsForIssue,
    Issue
} from '../lib/supabaseClient';
import { searchWeb } from '../components/googleSearchClient';
import { fetchAndParseContent } from '../components/webScraper';

// Interface needed by this step and returned for the next step
export interface UrlToAnalyze {
    url: string;
    issue: Issue;
    content: string;
}

/**
 * Fetches pending issues and prepares the queue of URLs needing LLM analysis.
 */
export async function fetchAndPrepareAnalysisQueue(
    issuesToFetch: number,
    searchResultsPerIssue: number
): Promise<UrlToAnalyze[]> {
    console.log('Step 1: Fetching pending issues...');
    let pendingIssues: Issue[] = [];
    try {
        pendingIssues = await getPendingIssues(issuesToFetch);
        if (pendingIssues.length === 0) {
            console.log("  No pending issues found with status 'new'.");
            return [];
        }
        console.log(`  Fetched ${pendingIssues.length} pending issue(s).`);
    } catch (error) {
        console.error('  Error fetching pending issues:', error);
        throw error; // Re-throw to stop workflow if fetching fails
    }

    console.log('\nStep 2: Preparing analysis queue (searching, checking duplicates, fetching content)...');
    const analysisQueue: UrlToAnalyze[] = [];
    for (const issue of pendingIssues) {
        console.log(`  Processing Issue ID: ${issue.id}, Text: "${issue.issue_text.substring(0, 50)}..."`);
        try {
            const searchResults = await searchWeb(issue.issue_text, searchResultsPerIssue);
            console.log(`    Found ${searchResults.length} search results.`);

            for (const url of searchResults) {
                const alreadyExists = await checkReferenceExistsForIssue(url, issue.id);
                if (alreadyExists) {
                    console.log(`      - Skipping duplicate: ${url}`);
                    continue;
                }

                console.log(`      - Fetching content for: ${url}`);
                const content = await fetchAndParseContent(url);
                if (content) {
                    analysisQueue.push({ url, issue, content });
                } else {
                    console.log(`      - Failed to fetch/parse: ${url}`);
                }
            }
        } catch (error) {
            console.error(`    Error processing search/fetch for issue ${issue.id}:`, error);
            // Continue to the next issue
        }
    }
    console.log(`  Analysis queue prepared with ${analysisQueue.length} items.`);
    return analysisQueue;
} 
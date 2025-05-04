import type { IssueWithSearchResults } from './02-step-03-execute-search';
import { checkReferenceExistsForIssue } from '../lib/supabaseClient'; // Import DB check function

// Define placeholder input/output types
export interface UrlToScrape {
    url: string;
    originalIssueId: number;
    originalIssueText: string; // Added issue text for later analysis context
}

export interface IssuesWithFilteredUrls {
    [issueId: number]: UrlToScrape[]; // Map issue ID to list of URLs to scrape for it
}

/**
 * Filters search results for each issue:
 * - Deduplicates URLs across all issues being processed.
 * - Checks if a URL already exists as a reference for the specific issue in the DB.
 * - Applies a limit to the number of URLs to scrape per issue.
 */
export async function filterAndPrepareUrls(issues: IssueWithSearchResults[]): Promise<IssuesWithFilteredUrls> {
    console.log(`  Filtering results and preparing URLs for ${issues.length} issues...`);
    const potentialUrlsPerIssue: { [id: number]: UrlToScrape[] } = {};
    const urlsToCheckInDb = new Map<string, Set<number>>(); // Map<url, Set<issueId>>

    // First pass: Aggregate unique URLs per issue and identify URLs needing DB check
    for (const issue of issues) {
        if (!issue.searchResults || issue.searchResults.length === 0) {
            potentialUrlsPerIssue[issue.id] = [];
            continue;
        }
        const uniqueUrlsForThisIssue = new Map<string, UrlToScrape>();
        for (const result of issue.searchResults) {
            if (result.link && !uniqueUrlsForThisIssue.has(result.link)) {
                const urlData: UrlToScrape = {
                    url: result.link,
                    originalIssueId: issue.id,
                    originalIssueText: issue.issue_text,
                };
                uniqueUrlsForThisIssue.set(result.link, urlData);
                // Track which issues this URL appears for, to check DB existence later
                if (!urlsToCheckInDb.has(result.link)) {
                    urlsToCheckInDb.set(result.link, new Set());
                }
                urlsToCheckInDb.get(result.link)!.add(issue.id);
            }
        }
        potentialUrlsPerIssue[issue.id] = Array.from(uniqueUrlsForThisIssue.values());
    }

    // DB Check: Check existence for each URL against the specific issues it appeared for
    console.log(`  Checking ${urlsToCheckInDb.size} unique URLs against DB for relevant issues...`);
    const existingReferences = new Map<string, Set<number>>(); // Map<url, Set<issueId where it exists>>
    const checkPromises = Array.from(urlsToCheckInDb.entries()).map(async ([url, issueIds]) => {
        for (const issueId of issueIds) {
            try {
                const exists = await checkReferenceExistsForIssue(url, issueId);
                if (exists) {
                    if (!existingReferences.has(url)) {
                        existingReferences.set(url, new Set());
                    }
                    existingReferences.get(url)!.add(issueId);
                    // console.log(`    - Found existing reference in DB: ${url} for issue ${issueId}`); // Log less verbosely
                }
            } catch (error) {
                console.warn(`    - DB check failed for ${url}, issue ${issueId}:`, error);
            }
        }
    });
    await Promise.allSettled(checkPromises);
    console.log(`  Finished DB checks. Found existing references for ${existingReferences.size} unique URLs.`);

    // Second pass: Filter based on DB check and global uniqueness, and apply limit
    const finalUrlsPerIssue: IssuesWithFilteredUrls = {};
    const finalOutputUrls = new Set<string>(); // Track URLs added to the final output globally
    const MAX_URLS_PER_ISSUE = 5; // Configuration for limit

    // Process issues (e.g., by ID order) to ensure consistent global deduplication
    const sortedIssueIds = Object.keys(potentialUrlsPerIssue).map(id => parseInt(id, 10)).sort((a, b) => a - b);

    for (const issueId of sortedIssueIds) {
        const potentialUrls = potentialUrlsPerIssue[issueId];
        const filteredUrlsForIssue: UrlToScrape[] = [];

        for (const urlData of potentialUrls) {
            // Check 1: Already exists in DB for THIS issue?
            const existsForThisIssue = existingReferences.get(urlData.url)?.has(issueId);
            if (existsForThisIssue) {
                continue; // Skip if already exists for this specific issue
            }

            // Check 2: Already added to final output for a PREVIOUS issue?
            if (finalOutputUrls.has(urlData.url)) {
                continue; // Skip if already processed globally
            }

            // If passes checks and limit not reached for this issue
            if (filteredUrlsForIssue.length < MAX_URLS_PER_ISSUE) {
                filteredUrlsForIssue.push(urlData);
                finalOutputUrls.add(urlData.url); // Mark as processed globally
            }
        }
        finalUrlsPerIssue[issueId] = filteredUrlsForIssue;
    }

    const totalUrls = finalOutputUrls.size;
    console.log(`  Prepared ${totalUrls} final unique URLs for scraping across relevant issues.`);
    return finalUrlsPerIssue;
} 
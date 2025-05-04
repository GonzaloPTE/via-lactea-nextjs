import type { IssueWithQueries } from './02-step-02-generate-queries';
import { searchWeb, GoogleSearchResult } from '../components/googleSearchClient';

// Input type is IssueWithQueries
// Output type adds searchResults
export interface SearchResultItem extends GoogleSearchResult { }

export interface IssueWithSearchResults extends IssueWithQueries {
    searchResults?: SearchResultItem[];
    searchError?: string;
}

/**
 * Executes Google search for each query associated with each issue.
 * Aggregates search results per issue.
 */
export async function executeGoogleSearchForQueries(issues: IssueWithQueries[]): Promise<IssueWithSearchResults[]> {
    console.log(`  Executing Google Search for ${issues.length} issues...`);
    const results: IssueWithSearchResults[] = [];

    for (const issue of issues) {
        if (!issue.searchQueries || issue.searchQueries.length === 0) {
            console.log(`    Skipping search for issue ${issue.id} - no search queries generated.`);
            results.push({ ...issue, searchResults: [], searchError: issue.queryGenerationError || 'No queries available' });
            continue;
        }

        console.log(`    Searching for issue ${issue.id} with ${issue.searchQueries.length} queries...`);
        let aggregatedResults: SearchResultItem[] = [];
        let firstSearchError: string | undefined = undefined;

        // Could potentially parallelize queries per issue with Promise.all
        for (const query of issue.searchQueries) {
            try {
                // TODO: Consider adding limits/options to searchWeb if needed
                const searchResults = await searchWeb(query);
                if (searchResults) {
                    aggregatedResults = aggregatedResults.concat(searchResults);
                    console.log(`      - Query "${query.substring(0, 30)}..." returned ${searchResults.length} results.`);
                }
            } catch (error: any) {
                console.error(`      - Error searching for query "${query.substring(0, 30)}..." for issue ${issue.id}:`, error);
                if (!firstSearchError) {
                    firstSearchError = error.message || String(error);
                }
                // Decide whether to stop searching for this issue on first error or continue
                // break; // Option: Stop on first error
            }
        }
        results.push({ ...issue, searchResults: aggregatedResults, searchError: firstSearchError });
    }

    return results;
} 
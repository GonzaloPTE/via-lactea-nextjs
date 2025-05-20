import type { Database } from '../../types/supabase';
import { searchWeb, GoogleSearchResult } from '../components/googleSearchClient';
import type { IssueWithQueries } from './02-step-02-generate-queries';

// Define DiscoveredIssue locally
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Output type for this step
export interface IssueWithSearchResults extends IssueWithQueries {
    searchResults: GoogleSearchResult[];
    searchError?: string;
}

/**
 * Executes Google search for each query associated with each issue.
 * Aggregates search results per issue.
 */
export async function executeGoogleSearchForQueries(
    issues: IssueWithQueries[] | null
): Promise<IssueWithSearchResults[]> {
    if (!issues || issues.length === 0) {
        return [];
    }
    console.log(`[Step 02-03] Executing Google searches for ${issues.length} issues.`);
    const results: IssueWithSearchResults[] = [];

    for (const issue of issues) {
        if (!issue.search_queries || issue.search_queries.length === 0) { 
            console.log(`    Skipping search for issue ${issue.id} - no search queries generated.`);
            results.push({ 
                ...issue, 
                searchResults: [], 
                searchError: 'No queries available or previous error' 
            });
            continue;
        }

        const issueSearchResults: GoogleSearchResult[] = [];
        let firstError: string | undefined = undefined;

        const queriesToExecute = issue.search_queries.slice(0, 3);

        for (const query of queriesToExecute) {
            try {
                console.log(`    Executing search for issue ${issue.id}, query: "${query}"...`);
                const searchResultItems: GoogleSearchResult[] | null = await searchWeb(query);
                if (searchResultItems && searchResultItems.length > 0) {
                    issueSearchResults.push(...searchResultItems.map(item => ({ ...item, sourceQuery: query })));
                }
            } catch (error: any) {
                console.error(`    Error executing search for issue ${issue.id}, query "${query}":`, error.message);
                if (!firstError) firstError = error.message;
            }
        }
        results.push({ ...issue, searchResults: issueSearchResults, searchError: firstError });
    }
    console.log(`[Step 02-03] Finished Google searches for ${issues.length} issues.`);
    return results;
} 
import type { Database } from '../../types/supabase'; // Import Database
import { generateSearchQueriesLLM as generateSearchQueries } from '../components/llmClient'; // Import and alias the actual LLM client function

// Define DiscoveredIssue locally from Database
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Input type is DiscoveredIssue now
// Output type adds searchQueries
export interface IssueWithQueries extends DiscoveredIssue {
    search_queries: string[] | null;
}

// Updated stub implementation using issue_text
export async function generateSearchQueriesForIssues(
    issues: DiscoveredIssue[] | null
): Promise<IssueWithQueries[]> {
    if (!issues || issues.length === 0) {
        return [];
    }
    console.log(`[Step 02-02] Generating search queries for ${issues.length} issues.`);
    const results: IssueWithQueries[] = [];

    for (const issue of issues) {
        if (!issue.issue_text) {
            console.warn(`  Issue ID ${issue.id} has no issue_text. Skipping query generation.`);
            results.push({ ...issue, search_queries: null });
            continue;
        }
        try {
            // Pass the entire issue object, not just issue.issue_text
            const queries = await generateSearchQueries(issue); 
            results.push({ ...issue, search_queries: queries });
            if (queries) {
                console.log(`  Generated ${queries.length} queries for issue ID ${issue.id}.`);
            } else {
                console.warn(`  No queries generated for issue ID ${issue.id}.`);
            }
        } catch (error: any) {
            console.error(`  Error generating queries for issue ID ${issue.id}:`, error.message);
            results.push({ ...issue, search_queries: null }); // Add issue with null queries on error
        }
    }
    return results;
} 
import type { Database } from '../../types/supabase'; // Import Database
import { generateSearchQueries } from '../components/llmClient'; // Import the actual LLM client function

// Define DiscoveredIssue locally from Database
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];

// Input type is DiscoveredIssue now
// Output type adds searchQueries
export interface IssueWithQueries extends DiscoveredIssue {
    searchQueries?: string[] | null; // Allow null if generation fails
    queryGenerationError?: string;
}

// Updated stub implementation using issue_text
export async function generateSearchQueriesForIssues(issues: DiscoveredIssue[]): Promise<IssueWithQueries[]> {
    console.log(`  Generating search queries for ${issues.length} issues using 'issue_text'...`);

    const results: IssueWithQueries[] = [];
    for (const issue of issues) {
        // Use issue_text as the input topic for query generation
        const topic = issue.issue_text;
        if (!topic) {
            console.warn(`  Skipping query generation for issue ${issue.id} due to missing issue_text.`);
            results.push({ ...issue, queryGenerationError: 'Missing issue_text' });
            continue;
        }

        try {
            console.log(`    -> LLM: Generating queries for issue ${issue.id}...`);
            const queries = await generateSearchQueries(topic);
            if (queries) {
                console.log(`    <- LLM: Generated ${queries.length} queries for issue ${issue.id}.`);
                results.push({ ...issue, searchQueries: queries });
            } else {
                console.warn(`    <- LLM: Query generation returned null or empty for issue ${issue.id}.`);
                results.push({ ...issue, searchQueries: null, queryGenerationError: 'LLM returned no queries' });
            }
        } catch (error: any) {
            console.error(`    Error generating queries via LLM for issue ${issue.id}:`, error);
            results.push({ ...issue, searchQueries: null, queryGenerationError: error.message || String(error) });
        }
    }
    return results;
} 
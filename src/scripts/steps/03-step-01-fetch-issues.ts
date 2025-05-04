import { getIssuesByStatus, getReferencesForIssues } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';

// Define types locally
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];
type Reference = Database['public']['Tables']['references']['Row']; // Define Reference type
// Define the structure expected by the grouping step
export interface FetchedIssueData extends DiscoveredIssue {
    reference_ids: number[];
}

/**
 * Fetches a batch of discovered issues (with status 'ref_analysis_done') 
 * and their associated relevant reference IDs.
 * @param batchSize The maximum number of issues to fetch.
 * @param sourceType Optional source type to filter by (for testing).
 * @returns An array of FetchedIssueData objects or null if none are found.
 */
export async function fetchIssuesForGrouping(
    batchSize: number,
    sourceType: string | null = null // Add optional parameter
): Promise<FetchedIssueData[] | null> { // Return the correct type
    const targetStatus = 'ref_analysis_done';
    const sourceLog = sourceType ? ` and source_type = ${sourceType}` : '';
    console.log(`  Fetching up to ${batchSize} issues with status = ${targetStatus}${sourceLog} and their references...`);
    try {
        // 1. Fetch issues
        const issues = await getIssuesByStatus(targetStatus, batchSize, sourceType);

        if (!issues || issues.length === 0) {
            console.log("  No pending issues found for grouping.");
            return null;
        }

        // 2. Fetch relevant references for these issues
        const issueIds = issues.map(i => i.id);
        const references = await getReferencesForIssues(issueIds, true); // Fetch only relevant=true

        if (!references) {
             console.log("  No relevant references found for the fetched issues.");
             // Decide if we should proceed without refs or return null/empty
             // For now, proceed, assuming grouping can happen without refs, though generation might be poor.
        }

        // 3. Combine issues with their reference IDs
        const results: FetchedIssueData[] = issues.map(issue => {
            const issueRefs = references ? references.filter((ref: Reference) => ref.discovered_issue_id === issue.id) : [];
            return {
                ...issue,
                reference_ids: issueRefs.map((ref: Reference) => ref.id)
            };
        });

        return results;
    } catch (error) {
        console.error("Error fetching issues and references for grouping:", error);
        return null; // Or rethrow depending on desired error handling
    }
} 
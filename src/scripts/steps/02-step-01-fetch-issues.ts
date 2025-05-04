import { getPendingIssues } from '../lib/supabaseClient';
import type { DiscoveredIssue } from '../../types/supabase';

/**
 * Fetches a batch of discovered issues that are pending reference analysis.
 * @param limit The maximum number of issues to fetch.
 * @returns An array of DiscoveredIssue objects or null if none are found.
 */
export async function fetchPendingIssues(limit: number): Promise<DiscoveredIssue[] | null> {
    console.log(`  Fetching up to ${limit} issues with reference_analysis_status = PENDING...`);
    try {
        // We assume getPendingIssues selects the necessary fields defined in DiscoveredIssue
        const issues = await getPendingIssues(limit);
        if (!issues || issues.length === 0) {
            console.log("  No pending issues found for reference analysis.");
            return null;
        }
        console.log(`  Successfully fetched ${issues.length} pending issue(s).`);
        return issues;
    } catch (error) {
        console.error('  Error fetching pending issues from Supabase:', error);
        // Re-throw the error to halt the workflow if DB connection fails
        throw new Error(`Failed to fetch pending issues: ${error instanceof Error ? error.message : String(error)}`);
    }
} 
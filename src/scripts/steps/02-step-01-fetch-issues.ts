import { getPendingIssues } from '../lib/supabaseClient';
import type { DiscoveredIssue } from '../../types/supabase';

/**
 * Fetches a batch of discovered issues that are pending reference analysis.
 * @param limit The maximum number of issues to fetch, or null to fetch all.
 * @returns An array of DiscoveredIssue objects or null if none are found.
 */
export async function fetchPendingIssues(limit: number | null): Promise<DiscoveredIssue[] | null> {
    // Log based on limit
    const limitLog = limit === null ? 'all' : limit;
    console.log(`  Fetching up to ${limitLog} issues with status = new...`);
    try {
        // Pass the limit (which can be null) down to getPendingIssues
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
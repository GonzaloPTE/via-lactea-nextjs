import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase';

// TODO: Implement function to fetch processed issues and their reference IDs

export interface FetchedIssueData {
    id: number;
    issue_text: string;
    tags: string[] | null;
    reference_ids: number[];
}

type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];
type Reference = Database['public']['Tables']['references']['Row'];

export async function fetchProcessedIssuesAndRefs(batchSize: number, testIssueIds?: number[]): Promise<FetchedIssueData[]> {
    const supabase = getSupabaseClient();

    let query = supabase
        .from('discovered_issues')
        .select('id, issue_text, tags');

    // If testIssueIds are provided, fetch ONLY those issues, ignoring status/order/limit
    if (testIssueIds && testIssueIds.length > 0) {
        console.log(`  TEST MODE: Fetching specific issue IDs: [${testIssueIds.join(', ')}]`);
        query = query.in('id', testIssueIds);
    } else {
        // Original logic: Fetch based on status, order, and limit
        console.log(`  Fetching up to ${batchSize} issues with status 'ref_analysis_done'...`);
        query = query
            .eq('status', 'ref_analysis_done')
            // .neq('status', 'blog_post_assigned') // Add this once the status exists and is used
            .order('priority_score', { ascending: false, nullsFirst: false })
            .order('sentiment', { ascending: true, nullsFirst: false })
            .limit(batchSize);
    }

    // 1. Execute fetch for issues
    const { data: issues, error: issuesError } = await query;

    if (issuesError) {
        console.error('Error fetching issues:', issuesError);
        throw issuesError;
    }

    if (!issues || issues.length === 0) {
        console.log('  No matching issues found.');
        return [];
    }

    const issueIds = issues.map(i => i.id);
    console.log(`  Fetched ${issues.length} issue IDs: [${issueIds.join(', ')}]`);

    // 2. Fetch relevant reference IDs for these issues
    const { data: refs, error: refsError } = await supabase
        .from('references')
        .select('id, discovered_issue_id')
        .in('discovered_issue_id', issueIds)
        .eq('is_relevant', true);

    if (refsError) {
        console.error('Error fetching references:', refsError);
        // Decide how to handle: throw error or proceed without refs?
        // Let's proceed but log the error, returning issues with potentially empty ref lists.
    }

    // 3. Map references back to issues
    const refsByIssueId = new Map<number, number[]>();
    if (refs) {
        for (const ref of refs) {
            if (ref.discovered_issue_id) {
                const currentRefs = refsByIssueId.get(ref.discovered_issue_id) || [];
                currentRefs.push(ref.id);
                refsByIssueId.set(ref.discovered_issue_id, currentRefs);
            }
        }
    }

    // 4. Combine data
    const result: FetchedIssueData[] = issues.map(issue => ({
        id: issue.id,
        issue_text: issue.issue_text,
        tags: issue.tags,
        reference_ids: refsByIssueId.get(issue.id) || [], // Ensure empty array if no relevant refs
    }));

    console.log(`  Successfully prepared data for ${result.length} issues.`);
    return result;
} 
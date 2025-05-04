import { getSupabaseClient } from '../lib/supabaseClient';

// Define allowed status values for the 'status' column in discovered_issues
// These should match the actual meaningful values used in your table/workflows
type DiscoveredIssueStatus = 'new' | 'ref_analysis_processing' | 'ref_analysis_done' | 'ref_analysis_error' | string; // Add other statuses like 'theme_assigned' etc. if needed

/**
 * Updates the status column for a list of discovered issues.
 */
export async function updateIssueStatuses(
    issueIds: number[],
    status: DiscoveredIssueStatus,
    errorMessage?: string // Optional error message for ERROR status
): Promise<void> {
    if (!issueIds || issueIds.length === 0) {
        console.log('  No issue IDs provided for status update, skipping.');
        return;
    }

    console.log(`  Updating status to "${status}" for ${issueIds.length} issues...`);
    const updatePayload: { status: DiscoveredIssueStatus; error_message?: string } = { status };
    if (status === 'ref_analysis_error' && errorMessage) {
        // Assuming you have an 'error_message' column or similar to store details
        // If not, adjust this part or just log the error.
        // updatePayload.error_message = errorMessage.substring(0, 500); // Example truncation
        console.log(`  Error detail: ${errorMessage}`);
    }

    const client = getSupabaseClient();
    try {
        const { error } = await client
            .from('discovered_issues')
            .update(updatePayload)
            .in('id', issueIds);

        if (error) {
            console.error('  Error updating issue statuses in Supabase:', error);
            // Decide if we should throw here or just log
            throw error;
        }
        console.log(`  Successfully updated status for ${issueIds.length} issues.`);
    } catch (error) {
        // Catch potential errors from the update itself
        throw new Error(`Failed to update issue statuses: ${error instanceof Error ? error.message : String(error)}`);
    }
} 
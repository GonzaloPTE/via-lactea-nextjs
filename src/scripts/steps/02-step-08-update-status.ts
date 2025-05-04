import { getSupabaseClient } from '../lib/supabaseClient';
import type { Database } from '../../types/supabase'; // Import Database type

// Define types locally
type DiscoveredIssue = Database['public']['Tables']['discovered_issues']['Row'];
type DiscoveredIssueStatus = Database['public']['Tables']['discovered_issues']['Row']['status']; // More specific
// type DiscoveredIssueStatus = 'new' | 'ref_analysis_processing' | 'ref_analysis_done' | 'ref_analysis_error' | string; // Less strict

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
        console.log(`  Attempting to update issues ${issueIds.join(', ')} to status "${status}"...`);
        const { error: updateError } = await client
            .from('discovered_issues')
            .update(updatePayload)
            .in('id', issueIds);

        if (updateError) {
            console.error('  Error during Supabase update call:', updateError);
            throw updateError;
        }
        console.log(`  Supabase update call for status "${status}" completed without error.`);

        // *** Add immediate verification step ***
        console.log(`  Verifying status immediately after update for issues: ${issueIds.join(', ')}...`);
        const { data: verifyData, error: verifyError } = await client
            .from('discovered_issues')
            .select('id, status')
            .in('id', issueIds);

        if (verifyError) {
            console.error('  Error verifying status immediately after update:', verifyError);
            // Don't throw here, just log, as the update *might* have worked despite verification failing
        } else if (verifyData) {
            console.log('  Immediate verification result:', verifyData);
            // Check if any statuses are NOT the expected one
            const mismatched = verifyData.filter((row: Partial<DiscoveredIssue>) => row.status !== status);
            if (mismatched.length > 0) {
                console.warn('  WARNING: Immediate verification shows mismatched status for some rows:', mismatched);
            }
        } else {
            console.warn('  Immediate verification returned no data.');
        }
        // *** End verification step ***

    } catch (error) {
        console.error('  Caught error during updateIssueStatuses:', error);
        // Re-throw the original error if it occurred during the update itself or re-wrap otherwise
        throw new Error(`Failed to update issue statuses: ${error instanceof Error ? error.message : String(error)}`);
    }
} 
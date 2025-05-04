import dotenv from 'dotenv';
// Import step functions
import {
    fetchProcessedIssuesAndRefs,
    FetchedIssueData,
} from './steps/03-step-01-fetch-processed-issues';
import {
    groupIssuesIntoPosts,
    PostGroupData,
} from './steps/03-step-02-group-issues';
import { savePostsAndMarkIssues } from './steps/03-step-03-save-posts-update-issues';
import {
    fetchDataForPostGeneration,
    PostGenerationData,
} from './steps/03-step-04-fetch-data-for-generation';
import { generateBlogPostContent } from './steps/03-step-05-generate-content';
import { parseAndUpdatePostContent } from './steps/03-step-06-update-posts-with-content';

// Load .env.local for standalone execution
dotenv.config({ path: '../../.env.local' });

// --- Configuration ---
const DEFAULT_ISSUES_BATCH_SIZE = 10;

// --- Main Workflow Orchestrator ---

export async function runWorkflow(options?: { batchSize?: number }) {
    const batchSize = options?.batchSize ?? DEFAULT_ISSUES_BATCH_SIZE;
    console.log(`--- Starting Issue Grouping & Post Generation Workflow (v1) --- (Batch size: ${batchSize})`);
    let totalProcessedIssues = 0;
    let totalPostsCreated = 0;
    let currentBatchNumber = 0;

    while (true) {
        currentBatchNumber++;
        console.log(`\n--- Processing Batch ${currentBatchNumber} ---`);
        try {
            // Step 1: Fetch Processed Issues and their Relevant Reference IDs
            console.log(`\n[Step 1/6] Fetching up to ${batchSize} processed issues with refs...`);
            const issuesWithRefs: FetchedIssueData[] = await fetchProcessedIssuesAndRefs(batchSize);
            if (!issuesWithRefs || issuesWithRefs.length === 0) {
                console.log('  No more processed issues found to group. Workflow finished.');
                break; // Exit the loop
            }
            console.log(`  Fetched ${issuesWithRefs.length} issues for this batch.`);

            // Step 2: Group Issues into Posts (LLM)
            console.log('\n[Step 2/6] Grouping issues into blog posts via LLM...');
            const postGroups: PostGroupData[] = await groupIssuesIntoPosts(issuesWithRefs);
            console.log(`  LLM proposed ${postGroups.length} blog post groups.`);
            if (postGroups.length === 0) {
                console.log('  LLM did not group any issues, skipping batch.');
                // TODO: Potentially mark issues as needing manual review or change status?
                // For now, just continue to the next batch.
                continue;
            }

            // Step 3: Save Post Drafts and Mark Issues as Assigned
            console.log('\n[Step 3/6] Saving post drafts and updating issue statuses...');
            const createdPostIds: number[] = await savePostsAndMarkIssues(postGroups);
            console.log(`  Saved ${createdPostIds.length} post drafts to DB and marked associated issues.`);
            totalPostsCreated += createdPostIds.length;

            // Step 4-6: Generate Content for each new post
            // Note: Running these sequentially per post for simplicity.
            // Could be parallelized with Promise.allSettled for performance.
            console.log(`\n[Steps 4-6/6] Generating content for ${createdPostIds.length} new posts...`);
            for (const postId of createdPostIds) {
                try {
                    console.log(`  -> Processing Post ID: ${postId}`);
                    // Step 4: Fetch data needed for generation
                    console.log(`    [Step 4/6] Fetching data for generation...`);
                    const postData: PostGenerationData | null = await fetchDataForPostGeneration(postId);
                    if (!postData) {
                        console.warn(`    Skipping content generation for post ${postId} as data could not be fetched.`);
                        continue; // Skip to next post
                    }
                    // Step 5: Generate content via LLM
                    console.log(`    [Step 5/6] Generating content via LLM...`);
                    const rawContent: string | null = await generateBlogPostContent(postData);
                    if (!rawContent) {
                         console.warn(`    Skipping content update for post ${postId} as LLM generation failed.`);
                        continue; // Skip to next post
                    }
                    // Step 6: Parse and update DB
                    console.log(`    [Step 6/6] Parsing and updating post with content...`);
                    await parseAndUpdatePostContent(postId, rawContent);
                    console.log(`  <- Successfully generated and saved content for Post ID: ${postId}`);
                } catch (genError: any) {
                    console.error(`  Error during content generation pipeline for Post ID ${postId}:`, genError.message);
                    // Optionally update post status to 'generation_error'?
                }
            }
            console.log('  Finished content generation attempts for the batch.');

            totalProcessedIssues += issuesWithRefs.length; // Count issues processed in this batch
            // console.log('--- TEMPORARY BREAK ---'); break; // Keep commented out

        } catch (error: any) {
            console.error(`\n--- Error processing Batch ${currentBatchNumber} ---`, error);
            console.log('Stopping workflow due to error in batch processing.');
            break; // Stop processing further batches
        }
    } // End while loop

    console.log(`\n--- Issue Grouping & Post Generation Workflow (v1) Finished ---`);
    console.log(`Total issues processed batches: ${currentBatchNumber - 1}`);
    console.log(`Total potential issues considered: ${totalProcessedIssues}`);
    console.log(`Total blog posts created: ${totalPostsCreated}`);
    return { success: true, totalProcessedIssues, totalPostsCreated };

} // End runWorkflow

// Execute the workflow only if the script is run directly
if (require.main === module) {
    runWorkflow()
        .then(({ success, totalProcessedIssues, totalPostsCreated }) => {
            console.log(`Workflow ${success ? 'completed successfully' : 'finished'} via direct execution. Processed ${totalProcessedIssues} issues, created ${totalPostsCreated} posts.`);
            process.exit(success ? 0 : 1);
        })
        .catch((error) => {
            console.error("Workflow failed during direct execution:", error);
            process.exit(1);
        });
}

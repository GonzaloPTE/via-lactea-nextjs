import dotenv from 'dotenv';
// Import step functions


import {
    groupIssuesIntoPosts,
    PostGroupData,
} from './steps/03-step-02-group-issues';
import { savePostsAndMarkIssues } from './steps/03-step-03-save-posts-update-issues';
import {
    fetchDataForPostGeneration,
    PostGenerationData,
} from './steps/03-step-04-fetch-data-for-generation';
import { generateBlogPostContent, BlogContentOutput } from './steps/03-step-05-generate-content';
import { processAndSaveGeneratedContent as parseAndUpdatePostContent } from './steps/03-step-06-update-posts-with-content';
import { fetchIssuesForGrouping } from './steps/03-step-01-fetch-issues';

// Load .env.local for standalone execution
dotenv.config({ path: '../../.env.local' });

// --- Configuration ---
const DEFAULT_ISSUES_BATCH_SIZE = 10;

interface WorkflowOptions {
    batchSize?: number;
    sourceType?: string; // Add optional sourceType for testing
}

// Define the result structure
interface WorkflowResult {
    success: boolean;
    totalProcessedIssues: number;
    totalPostsCreated: number;
}

// --- Main Workflow Orchestrator ---

export async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
    const { batchSize = DEFAULT_ISSUES_BATCH_SIZE, sourceType = null } = options;
    let totalProcessedIssues = 0;
    let totalPostsCreated = 0;
    let batchesProcessed = 0;
    let totalErrors = 0;

    console.log("--- Starting Workflow 3: Issue Grouping & Blog Post Generation ---");
    console.log(`Processing in batches of up to ${batchSize} issues.`);
    if (sourceType) {
        console.log(`Filtering by source_type: ${sourceType}`); // Log if filtering
    }

    // Loop to process multiple batches
    while (true) {
        batchesProcessed++;
        console.log(`\n--- Starting Batch ${batchesProcessed} ---`);
        let currentBatchIssueCount = 0;
        let currentBatchPostsCreated = 0;

        try {
            // Step 1: Fetch issues ready for grouping
            console.log("Step 1: Fetching issues...");
            const issuesToGroup = await fetchIssuesForGrouping(batchSize, sourceType);

            if (!issuesToGroup || issuesToGroup.length === 0) {
                console.log("No more issues found with status 'ref_analysis_done'. Workflow finished.");
                break; // Exit the while loop
            }
            currentBatchIssueCount = issuesToGroup.length;
            console.log(`  Fetched ${currentBatchIssueCount} issues for this batch.`);

            // Step 2: Group Issues into Posts (LLM)
            console.log('\n[Step 2/6] Grouping issues into blog posts via LLM...');
            const postGroups: PostGroupData[] = await groupIssuesIntoPosts(issuesToGroup);
            console.log(`  LLM proposed ${postGroups.length} blog post groups.`);
            if (postGroups.length === 0) {
                console.log('  LLM did not group any issues, skipping batch. These issues may be re-fetched if their status has not changed.');
                continue; // Move to next iteration of the while loop
            }

            // Step 3: Save Post Drafts and Mark Issues as Assigned
            console.log('\n[Step 3/6] Saving post drafts and updating issue statuses...');
            const createdPostIds: number[] = await savePostsAndMarkIssues(postGroups);
            currentBatchPostsCreated = createdPostIds.length;
            console.log(`  Saved ${currentBatchPostsCreated} post drafts to DB and marked associated issues.`);

            // Step 4-6: Generate Content for each new post
            console.log(`\n[Steps 4-6/6] Generating content for ${createdPostIds.length} new posts...`);
            let generationErrorsInBatch = 0;
            for (const postId of createdPostIds) {
                try {
                    console.log(`  -> Processing Post ID: ${postId}`);
                    // Step 4: Fetch data needed for generation
                    console.log(`    [Step 4/6] Fetching data for generation...`);
                    const postData: PostGenerationData | null = await fetchDataForPostGeneration(postId);
                    if (!postData) {
                        console.warn(`    Skipping content generation for post ${postId} as data could not be fetched.`);
                        generationErrorsInBatch++;
                        continue; // Skip to next post
                    }
                    // Step 5: Generate content via LLM
                    console.log(`    [Step 5/6] Generating content via LLM...`);
                    const generatedBlogOutput: BlogContentOutput | null = await generateBlogPostContent(postData);
                    if (!generatedBlogOutput) {
                        console.warn(`    Skipping content update for post ${postId} as LLM generation failed.`);
                        generationErrorsInBatch++;
                        continue; // Skip to next post
                    }
                    // Step 6: Parse and update DB
                    console.log(`    [Step 6/6] Parsing and updating post with content...`);
                    const updateSuccess = await parseAndUpdatePostContent(postId, generatedBlogOutput);
                    if (updateSuccess) {
                        console.log(`  <- Successfully generated and saved content for Post ID: ${postId}`);
                    } else {
                        console.warn(`  <- Failed to save content for Post ID: ${postId} (update step returned false).`);
                        generationErrorsInBatch++; // Consider if this should also count as a generation error
                    }
                } catch (genError: any) {
                    console.error(`  Error during content generation pipeline for Post ID ${postId}:`, genError.message);
                    generationErrorsInBatch++;
                    // Optionally update post status to 'generation_error'?
                }
            }
            console.log(`  Finished content generation attempts for batch ${batchesProcessed}. Errors: ${generationErrorsInBatch}.`);

            // Update totals for the batch
            if (currentBatchPostsCreated > 0) {
                // Only count issues as processed for this batch if posts (and thus issue status updates) actually occurred.
                totalProcessedIssues += currentBatchIssueCount;
            }
            totalPostsCreated += currentBatchPostsCreated;

        } catch (batchError: any) {
            console.error(`\n--- Error processing Batch ${batchesProcessed} ---`, batchError);
            totalErrors++;
            // Decide whether to continue or stop on batch error
            // For now, log the error and continue to the next batch
            // Could add a threshold: if (totalErrors > MAX_CONSECUTIVE_ERRORS) break;
            console.log('Attempting to continue with the next batch...');
        }
    } // End while loop

    console.log(`\n--- Issue Grouping & Post Generation Workflow Finished ---`);
    console.log(`Total batches attempted: ${batchesProcessed - 1}`); // -1 because the last loop breaks on no issues
    console.log(`Total issues processed: ${totalProcessedIssues}`);
    console.log(`Total blog posts created: ${totalPostsCreated}`);
    console.log(`Total batch processing errors: ${totalErrors}`);

    // Success is true if at least one batch ran without error, or if no issues were found initially.
    const overallSuccess = totalErrors === 0 || (batchesProcessed > 1 && totalErrors < batchesProcessed -1);
    return { success: overallSuccess, totalProcessedIssues, totalPostsCreated };
}

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

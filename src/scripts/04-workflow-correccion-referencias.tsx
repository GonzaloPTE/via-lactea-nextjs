import dotenv from 'dotenv';
import { fetchPostsForCorrection, BlogPostForCorrection } from './steps/04-step-01-fetch-posts-for-correction';
import { fetchReferencesForPosts, BlogPostWithContext } from './steps/04-step-02-fetch-references-for-posts';
import { correctHtmlReferencesLlm, CorrectedPostData } from './steps/04-step-03-correct-html-references-llm';
import { updatePostsWithCorrections, UpdateSummary } from './steps/04-step-04-update-posts-version';

// Load .env.local for standalone execution
dotenv.config({ path: '../../.env.local' });

// --- Configuration ---
const DEFAULT_CORRECTION_BATCH_SIZE = 5;

interface Workflow04Result {
    success: boolean;
    totalPostsProcessedInLoop: number;
    totalPostsSuccessfullyUpdated: number;
    totalSkippedNoChangeOrErrorInUpdate: number;
    totalErrorsInUpdate: number;
    batchesProcessed: number;
}

// --- Main Workflow Orchestrator for Workflow 04 ---

export async function runWorkflow04(options?: { batchSize?: number }): Promise<Workflow04Result> {
    const batchSize = options?.batchSize ?? DEFAULT_CORRECTION_BATCH_SIZE;
    const resultSummary: Workflow04Result = {
        success: false,
        totalPostsProcessedInLoop: 0,
        totalPostsSuccessfullyUpdated: 0,
        totalSkippedNoChangeOrErrorInUpdate: 0,
        totalErrorsInUpdate: 0,
        batchesProcessed: 0,
    };

    console.log(`--- Starting Workflow 04: Reference Correction (Batch size: ${batchSize}) ---`);

    try {
        while (true) {
            resultSummary.batchesProcessed++;
            console.log(`\n--- Processing Batch ${resultSummary.batchesProcessed} (Workflow 04) ---`);

            const postsToCorrect: BlogPostForCorrection[] | null = await fetchPostsForCorrection(batchSize);

            if (!postsToCorrect || postsToCorrect.length === 0) {
                console.log('  No more posts found requiring correction. Workflow 04 finished.');
                resultSummary.success = true;
                break;
            }
            console.log(`  [WF04-Step1] Fetched ${postsToCorrect.length} posts for correction.`);
            resultSummary.totalPostsProcessedInLoop += postsToCorrect.length;

            const postsWithContext: BlogPostWithContext[] = await fetchReferencesForPosts(postsToCorrect);
            console.log(`  [WF04-Step2] Fetched references for ${postsWithContext.length} posts.`);
            
            const postsAfterLlm: CorrectedPostData[] = await correctHtmlReferencesLlm(postsWithContext);
            console.log(`  [WF04-Step3] LLM processing attempted for ${postsAfterLlm.length} posts.`);

            const updateStepSummary: UpdateSummary = await updatePostsWithCorrections(postsAfterLlm);
            console.log(`  [WF04-Step4] Update summary: ${updateStepSummary.updated_count} updated, ${updateStepSummary.skipped_count} skipped, ${updateStepSummary.error_count} errors.`);
            resultSummary.totalPostsSuccessfullyUpdated += updateStepSummary.updated_count;
            resultSummary.totalSkippedNoChangeOrErrorInUpdate += updateStepSummary.skipped_count;
            resultSummary.totalErrorsInUpdate += updateStepSummary.error_count;

        }
    } catch (error: any) {
        console.error("--- CRITICAL ERROR in Workflow 04 --- Stopping.", error);
        resultSummary.success = false;
    }

    console.log(`\n--- Workflow 04: Reference Correction Finished ---`);
    console.log(`Total Batches Processed: ${resultSummary.batchesProcessed}`);
    console.log(`Total Posts Processed in Loop: ${resultSummary.totalPostsProcessedInLoop}`);
    console.log(`Total Posts Successfully Updated in DB: ${resultSummary.totalPostsSuccessfullyUpdated}`);
    console.log(`Total Posts Skipped (no change/LLM error): ${resultSummary.totalSkippedNoChangeOrErrorInUpdate}`);
    console.log(`Total Errors during DB Update phase: ${resultSummary.totalErrorsInUpdate}`);
    console.log(`Overall Workflow Success: ${resultSummary.success}`);

    return resultSummary;
}

if (require.main === module) {
    runWorkflow04()
        .then((summary) => {
            console.log("Workflow 04 executed directly. Summary:", JSON.stringify(summary, null, 2));
            if (!summary.success || summary.totalErrorsInUpdate > 0) {
                process.exit(1);
            }
            process.exit(0);
        })
        .catch((error) => {
            console.error("Workflow 04 failed critically during direct execution:", error);
            process.exit(1);
        });
}
 
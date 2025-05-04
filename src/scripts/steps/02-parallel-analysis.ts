import { analyzeContent, LLMAnalysisResult } from '../components/llmClient';
import { UrlToAnalyze } from './02-fetch-prepare-queue'; // Import shared interface

// Define the type for the wrapped result used internally and by the next step
export type WrappedAnalysisResult = {
    status: 'fulfilled' | 'rejected';
    value?: LLMAnalysisResult | null;
    reason?: any;
    original: UrlToAnalyze;
};

/**
 * Performs LLM content analysis in parallel for the items in the queue.
 */
export async function performParallelAnalysis(
    queue: UrlToAnalyze[]
): Promise<PromiseSettledResult<WrappedAnalysisResult>[]> {
    if (queue.length === 0) {
        console.log('\nStep 3: Skipping LLM analysis (empty queue).');
        return [];
    }
    console.log(`\nStep 3: Analyzing content for ${queue.length} URL(s) in parallel...`);
    const analysisPromises = queue.map(item =>
        analyzeContent(item.content, item.issue.issue_text)
            .then(result => ({ status: 'fulfilled', value: result, original: item } as WrappedAnalysisResult))
            .catch(error => ({ status: 'rejected', reason: error, original: item } as WrappedAnalysisResult))
    );

    const settledResults = await Promise.allSettled(analysisPromises);
    console.log('  Parallel analysis finished.');
    // Type assertion needed because TS struggles with Promise.allSettled typing
    return settledResults as PromiseSettledResult<WrappedAnalysisResult>[];
} 
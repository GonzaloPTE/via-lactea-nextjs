import type { AnalyzedPageData } from './02-step-06-analyze-content';
import { saveReference, ReferenceData } from '../lib/supabaseClient';

export interface SaveSummary {
    savedCount: number;
    errorCount: number;
}

/**
 * Filters analyzed pages for relevance and saves them to the Supabase 'references' table.
 */
export async function saveRelevantReferences(analyzedPages: AnalyzedPageData[]): Promise<SaveSummary> {
    // Filter for pages that were successfully analyzed and marked as relevant
    const relevantPagesData = analyzedPages.filter(
        page => page.analysis && page.analysis.is_relevant === true
    );

    if (relevantPagesData.length === 0) {
        console.log('  No relevant pages found to save.');
        return { savedCount: 0, errorCount: 0 };
    }

    console.log(`  Preparing to save ${relevantPagesData.length} relevant references...`);

    // Map data to the structure expected by saveReference (ReferenceData)
    const referencesToSave: ReferenceData[] = relevantPagesData.map(page => ({
        url: page.url,
        discovered_issue_id: page.originalIssueId,
        is_relevant: true,
        extracts: page.analysis!.extracts ?? [],
        tags: page.analysis!.tags ?? [],
        summary: page.analysis!.summary ?? '',
        // title: page.analysis?.title // If title was added to LLMAnalysisResult
    }));

    let savedCount = 0;
    let errorCount = 0;
    try {
        // Attempt to save all references in a single batch call
        await saveReference(referencesToSave);
        savedCount = referencesToSave.length;
        console.log(`  Successfully saved ${savedCount} references.`);
    } catch (error: any) {
        console.error('  Error during batch save of references:', error);
        // In case of batch failure, we don't know which ones failed specifically
        // Mark all as errored for simplicity, or implement single-item saving with retry
        errorCount = referencesToSave.length;
        savedCount = 0;
        // Optionally re-throw or handle more gracefully
        // throw new Error(`Failed to save references: ${error.message}`);
    }

    return { savedCount, errorCount };
} 
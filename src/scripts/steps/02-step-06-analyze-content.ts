import type { ScrapedPageData } from './02-step-05-scrape-content';
import { analyzeContent, LLMAnalysisResult } from '../components/llmClient';

// Input type is ScrapedPageData
// Output adds analysis results or error
export interface AnalyzedPageData extends ScrapedPageData {
    analysis?: LLMAnalysisResult | null; // Allow null if LLM returns null
    analysisError?: string;
}

/**
 * Analyzes the relevance of scraped web content to the original issue text using an LLM.
 */
export async function analyzeScrapedContent(scrapedPages: ScrapedPageData[]): Promise<AnalyzedPageData[]> {
    console.log(`  Analyzing content relevance for ${scrapedPages.length} pages...`);
    const results: AnalyzedPageData[] = [];

    // Consider parallelizing using Promise.allSettled if performance is an issue
    for (const pageData of scrapedPages) {
        // Skip pages that failed scraping or have no content
        if (pageData.error || !pageData.htmlContent) {
            console.log(`    Skipping analysis for ${pageData.url} due to prior error or no content.`);
            results.push({ ...pageData, analysisError: `Skipped: ${pageData.error || 'No content'}` });
            continue;
        }

        try {
             console.log(`    -> LLM: Analyzing ${pageData.url} for issue ${pageData.originalIssueId}...`);
            // Pass content, original issue text, and URL to the LLM client
            const analysisResult = await analyzeContent(
                pageData.htmlContent,
                pageData.originalIssueText,
                pageData.url
            );

            if (analysisResult === null) {
                // Handle case where LLM explicitly returns null (e.g., parsing error, safety block)
                 console.warn(`    <- LLM: Analysis returned null for ${pageData.url}`);
                 results.push({ ...pageData, analysis: null, analysisError: 'LLM analysis returned null' });
            } else {
                console.log(`    <- LLM: Analysis complete for ${pageData.url}. Relevant: ${analysisResult.is_relevant}`);
                results.push({ ...pageData, analysis: analysisResult });
            }
        } catch (error: any) {
            console.error(`    <- LLM: Error analyzing content for ${pageData.url}:`, error);
            results.push({ ...pageData, analysis: null, analysisError: error.message || String(error) });
        }
    }

    const analyzedCount = results.filter(r => r.analysis !== undefined).length;
    console.log(`  Finished analysis. Attempted: ${analyzedCount}, Skipped: ${results.length - analyzedCount}`);
    return results;
} 
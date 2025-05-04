import dotenv from 'dotenv';
import path from 'path';
import { analyzeScrapedContent, AnalyzedPageData } from './02-step-06-analyze-content';
import type { ScrapedPageData } from './02-step-05-scrape-content';

// Load environment variables from .env.test (for GOOGLE_GEMINI_API_KEY)
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// --- Test Setup --- //
if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY environment variable is not set in .env.test');
}

// --- Test Suite --- //
describe('02-step-06-analyze-content Integration Tests', () => {

    jest.setTimeout(60000); // Allow 60 seconds for multiple LLM calls

    it('should analyze content and return relevance', async () => {
        const mockInput: ScrapedPageData[] = [
            {
                // Relevant example
                url: 'http://example-relevant.com', originalIssueId: 1, originalIssueText: 'baby sleep regression',
                htmlContent: '<html><body><h1>Dealing with the 4-Month Sleep Regression</h1><p>Many parents find their baby suddenly waking more often around 4 months...</p></body></html>'
            },
            {
                // Non-relevant example
                url: 'http://example-irrelevant.com', originalIssueId: 1, originalIssueText: 'baby sleep regression',
                htmlContent: '<html><body><h1>Latest Car Models Reviewed</h1><p>The new electric SUV offers great range...</p></body></html>'
            },
             {
                // Scraping error example
                url: 'http://example-error.com', originalIssueId: 2, originalIssueText: 'bottle refusal',
                error: 'Simulated scrape error'
            },
            {
                 // No content example
                url: 'http://example-nocontent.com', originalIssueId: 2, originalIssueText: 'bottle refusal',
                htmlContent: '' // Empty content
            },
        ];

        const results = await analyzeScrapedContent(mockInput);
        expect(results).toHaveLength(mockInput.length);

        // Find specific results
        const relevantResult = results.find(r => r.url.includes('relevant'));
        const irrelevantResult = results.find(r => r.url.includes('irrelevant'));
        const errorResult = results.find(r => r.url.includes('error'));
        const nocontentResult = results.find(r => r.url.includes('nocontent'));

        // Check relevant result
        expect(relevantResult).toBeDefined();
        expect(relevantResult!.analysisError).toBeUndefined();
        expect(relevantResult!.analysis).toBeDefined();
        expect(relevantResult!.analysis?.is_relevant).toBe(true);
        expect(relevantResult!.analysis?.summary?.length).toBeGreaterThan(10);
        expect(relevantResult!.analysis?.extracts?.length).toBeGreaterThan(0);
        expect(relevantResult!.analysis?.tags?.length).toBeGreaterThan(0);

        // Check irrelevant result
        expect(irrelevantResult).toBeDefined();
        expect(irrelevantResult!.analysisError).toBeUndefined();
        expect(irrelevantResult!.analysis).toBeDefined();
        expect(irrelevantResult!.analysis?.is_relevant).toBe(false);
        // Summary might still exist even if not relevant
        expect(typeof irrelevantResult!.analysis?.summary).toBe('string');

        // Check skipped result (scrape error)
        expect(errorResult).toBeDefined();
        expect(errorResult!.analysis).toBeUndefined();
        expect(errorResult!.analysisError).toContain('Skipped: Simulated scrape error');

        // Check skipped result (no content)
        expect(nocontentResult).toBeDefined();
        expect(nocontentResult!.analysis).toBeUndefined();
        expect(nocontentResult!.analysisError).toContain('Skipped: No content');
    });

    it('should return an empty array for empty input', async () => {
        const results = await analyzeScrapedContent([]);
        expect(results).toEqual([]);
    });

}); 
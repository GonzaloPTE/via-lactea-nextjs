import { scrapeWebPages } from './02-step-05-scrape-content';
import type { IssuesWithFilteredUrls } from './02-step-04-filter-results';

// --- Test Suite --- //
describe('02-step-05-scrape-content Integration Tests', () => {

    // Increase timeout for tests involving external network calls
    jest.setTimeout(30000); // 30 seconds

    it('should scrape content for valid URLs and handle errors for invalid URLs', async () => {
        const mockInput: IssuesWithFilteredUrls = {
            101: [
                { url: 'http://example.com', originalIssueId: 101, originalIssueText: 'Issue 101' },
                { url: 'http://invalid-url-that-does-not-exist-abc-123.xyz', originalIssueId: 101, originalIssueText: 'Issue 101' },
            ],
            102: [
                { url: 'https://google.com', originalIssueId: 102, originalIssueText: 'Issue 102' }, // Another valid one
            ],
        };

        const results = await scrapeWebPages(mockInput);

        // Should have one result per input URL
        const expectedTotalUrls = 3;
        expect(results).toHaveLength(expectedTotalUrls);

        // Find specific results (order might vary due to Promise.allSettled)
        const exampleResult = results.find(r => r.url === 'http://example.com');
        const invalidResult = results.find(r => r.url.includes('invalid-url'));
        const googleResult = results.find(r => r.url === 'https://google.com');

        // Check successful scrape (example.com)
        expect(exampleResult).toBeDefined();
        expect(exampleResult!.originalIssueId).toBe(101);
        expect(exampleResult!.originalIssueText).toBe('Issue 101');
        expect(exampleResult!.htmlContent).toBeDefined();
        expect(exampleResult!.htmlContent).toContain('Example Domain'); // Check for expected content
        expect(exampleResult!.error).toBeUndefined();

        // Check successful scrape (google.com)
         expect(googleResult).toBeDefined();
         expect(googleResult!.originalIssueId).toBe(102);
         expect(googleResult!.originalIssueText).toBe('Issue 102');
         expect(googleResult!.htmlContent).toBeDefined();
         expect(googleResult!.htmlContent!.length).toBeGreaterThan(100); // Google should have substantial content
         expect(googleResult!.error).toBeUndefined();

         // Check failed scrape (invalid URL)
        expect(invalidResult).toBeDefined();
        expect(invalidResult!.originalIssueId).toBe(101);
        expect(invalidResult!.originalIssueText).toBe('Issue 101');
        expect(invalidResult!.htmlContent).toBeUndefined();
        expect(invalidResult!.error).toBeDefined();
        // Error message might vary, just check it exists
        expect(typeof invalidResult!.error).toBe('string');
        expect(invalidResult!.error!.length).toBeGreaterThan(0);
    });

    it('should return an empty array if no URLs are provided', async () => {
        const mockInput: IssuesWithFilteredUrls = {};
        const results = await scrapeWebPages(mockInput);
        expect(results).toEqual([]);
    });

    it('should return an empty array if issues have empty URL lists', async () => {
        const mockInput: IssuesWithFilteredUrls = {
            101: [],
            102: [],
        };
        const results = await scrapeWebPages(mockInput);
        expect(results).toEqual([]);
    });
}); 
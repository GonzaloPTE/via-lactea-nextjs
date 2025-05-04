import type { IssuesWithFilteredUrls, UrlToScrape } from './02-step-04-filter-results';
import { fetchAndParseContent } from '../components/webScraper'; // Import the actual scraper

// Define placeholder output type
export interface ScrapedPageData {
    url: string;
    originalIssueId: number;
    originalIssueText: string; // Added from UrlToScrape
    htmlContent?: string;
    error?: string;
}

// Stub implementation
export async function scrapeWebPages(issuesWithUrls: IssuesWithFilteredUrls): Promise<ScrapedPageData[]> {
    const allUrlsToScrape: UrlToScrape[] = Object.values(issuesWithUrls).flat();
    console.log(`  Scraping content for ${allUrlsToScrape.length} URLs...`);

    if (allUrlsToScrape.length === 0) {
        return [];
    }

    // Use Promise.allSettled to scrape in parallel and handle individual failures
    const scrapePromises = allUrlsToScrape.map(async (urlData): Promise<ScrapedPageData> => {
        try {
            console.log(`    -> Scraping: ${urlData.url}`);
            const content = await fetchAndParseContent(urlData.url);
            if (content) {
                console.log(`    <- OK: Scraped ${urlData.url} (${(content.length / 1024).toFixed(1)} KB)`);
                return {
                    ...urlData, // Includes originalIssueId and originalIssueText
                    htmlContent: content,
                };
            } else {
                 console.warn(`    <- Failed: No content returned for ${urlData.url}`);
                 return {
                     ...urlData,
                     error: 'Scraper returned no content',
                 };
            }
        } catch (error: any) {
            console.error(`    <- Error scraping ${urlData.url}: ${error.message}`);
            return {
                ...urlData,
                error: error.message || String(error),
            };
        }
    });

    const settledResults = await Promise.allSettled(scrapePromises);

    // Process settled results to return a flat array of ScrapedPageData
    const results: ScrapedPageData[] = settledResults.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            // If the promise itself rejected unexpectedly (shouldn't happen with our catch block above)
            console.error(`  Unexpected scraping promise rejection for URL ${allUrlsToScrape[index]?.url}:`, result.reason);
            return {
                ...allUrlsToScrape[index],
                error: `Unexpected promise rejection: ${result.reason?.message || result.reason}`,
            };
        }
    });

    const successCount = results.filter(r => r.htmlContent).length;
    console.log(`  Finished scraping. Success: ${successCount}, Failures/Skipped: ${results.length - successCount}`);
    return results;
} 
import axios from 'axios';
import * as cheerio from 'cheerio';

// Basic configuration for axios requests
const axiosConfig = {
    timeout: 15000, // 15 seconds timeout
    headers: {
        // Set a common user-agent to avoid basic blocks
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    }
};

/**
 * Fetches the HTML content of a URL and parses its main textual content.
 * @param url The URL to scrape.
 * @returns Promise resolving to the extracted text content, or null if an error occurs.
 */
export async function fetchAndParseContent(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url, axiosConfig);
        const html = response.data;
        const $ = cheerio.load(html);

        // Remove script, style, nav, header, footer elements to reduce noise
        $('script, style, noscript, nav, header, footer, aside, form').remove();

        // Attempt to find common main content containers first
        let mainContent = $('article').text() || $('main').text();

        // If specific containers aren't found or are empty, fall back to body
        if (!mainContent || mainContent.trim().length < 100) { // Check for minimal length
            mainContent = $('body').text();
        }

        if (!mainContent) {
            console.warn(`Could not extract meaningful content from ${url}`);
            return null;
        }

        // Basic cleanup: replace multiple spaces/newlines with single ones
        const cleanedText = mainContent.replace(/\s\s+/g, ' ').trim();

        // Optional: Add more sophisticated cleaning (remove boilerplate, ads etc.) if needed

        return cleanedText;

    } catch (error: any) {
        // Handle different error types (network, status code, parsing)
        if (axios.isAxiosError(error)) {
            console.error(`Axios error fetching ${url}: ${error.message} (Status: ${error.response?.status})`);
        } else {
            console.error(`Error processing ${url}: ${error.message}`);
        }
        return null; // Return null on any error
    }
} 
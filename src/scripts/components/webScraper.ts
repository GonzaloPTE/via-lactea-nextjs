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
 * Fetches the HTML content of a URL and parses its main textual content after cleaning.
 * @param url The URL to scrape.
 * @returns Promise resolving to the cleaned text content, or null if an error occurs.
 */
export async function fetchAndParseContent(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url, axiosConfig);
        const html = response.data;
        const $ = cheerio.load(html);

        // --- Start Enhanced Cleaning ---

        // 1. Remove unwanted tags and their content
        const tagsToRemove = 'script, style, noscript, svg, iframe, header, footer, nav, aside, form, canvas, audio, video, meta, link';
        $(tagsToRemove).remove();

        // 2. Remove all attributes EXCEPT for a defined keep-list
        const attributesToKeep = ['href', 'src', 'alt']; // Keep essential attributes

        $(' * ').each((index, element) => {
            const elementNode = $(element);
            const attributes = { ...elementNode.attr() }; // Get all attributes as an object

            if (attributes) {
                Object.keys(attributes).forEach(attrName => {
                    if (!attributesToKeep.includes(attrName.toLowerCase())) {
                        elementNode.removeAttr(attrName);
                    }
                });
            }
        });

        // --- End Enhanced Cleaning ---

        // Attempt to find common main content containers first
        let mainContentText = $('article').text() || $('main').text();

        // If specific containers aren't found or are empty, fall back to body
        if (!mainContentText || mainContentText.trim().length < 50) { // Reduced length check after cleaning
            mainContentText = $('body').text();
        }

        if (!mainContentText) {
            console.warn(`Could not extract meaningful content from ${url} after cleaning.`);
            return null;
        }

        // 3. Normalize whitespace on the extracted text
        const cleanedText = mainContentText.replace(/\s\s+/g, ' ').trim();

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
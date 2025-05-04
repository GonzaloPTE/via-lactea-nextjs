import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Adjust path if needed to find .env at root

const GOOGLE_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

const SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

// Define and Export the structure of a single search result item
export interface GoogleSearchResult {
  link: string;
  title: string;
  snippet: string;
  // Add other fields from the API response if desired (e.g., displayLink, pagemap)
}

// Interface for the raw API response structure (internal use)
interface GoogleSearchItem {
  link?: string;
  title?: string;
  snippet?: string;
  // Other potential fields from Google API
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
  // Add error field if needed
}

/**
 * Performs a web search using the Google Custom Search API.
 * @param query The search query (e.g., the issue text).
 * @param numResults The number of search results to return (max 10 per query).
 * @returns Promise resolving to an array of GoogleSearchResult objects.
 */
export async function searchWeb(query: string, numResults: number = 10): Promise<GoogleSearchResult[]> {
  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
    throw new Error('Google Custom Search API Key or Search Engine ID not found in environment variables.');
  }

  if (numResults > 10) {
    console.warn('Google Custom Search API allows a maximum of 10 results per query. Requesting 10.');
    numResults = 10;
  }
  if (numResults <= 0) {
    return []; // No need to call API if 0 results requested
  }

  try {
    console.log(`  -> Google Search: Query="${query.substring(0, 50)}...", Num=${numResults}`);
    const response = await axios.get<GoogleSearchResponse>(SEARCH_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: numResults,
      },
    });

    if (response.data && response.data.items) {
      // Map API response items to our exported GoogleSearchResult structure
      const results = response.data.items
        .map((item) => ({
          link: item.link || '', // Provide default empty string if missing
          title: item.title || '',
          snippet: item.snippet || ''
        }))
        .filter(item => item.link); // Filter out items without a link
        
      console.log(`  <- Google Search: Found ${results.length} results for "${query.substring(0, 50)}..."`);
      return results;
    }

    console.log(`  <- Google Search: No results found for "${query.substring(0, 50)}..."`);
    return [];
  } catch (error: any) {
    // Log specific Axios error details if available
    const errorDetails = error.response?.data || error.message || String(error);
    console.error(`  <- Google Search: Error for query "${query.substring(0, 50)}...":`, errorDetails);
    // Re-throw a more informative error
    throw new Error(`Google Search API failed for query "${query.substring(0, 50)}...": ${errorDetails}`);
  }
} 
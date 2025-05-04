import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Adjust path if needed to find .env at root

const GOOGLE_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

const SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

interface GoogleSearchItem {
  link: string;
  // Add other fields if needed (title, snippet, etc.)
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
  // Add error field if needed
}

/**
 * Performs a web search using the Google Custom Search API.
 * @param query The search query (e.g., the issue text).
 * @param numResults The number of search results to return (max 10 for free tier per query).
 * @returns Promise resolving to an array of result URLs.
 */
export async function searchWeb(query: string, numResults: number = 10): Promise<string[]> {
  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
    throw new Error('Google Custom Search API Key or Search Engine ID not found in environment variables.');
  }

  if (numResults > 10) {
    console.warn('Google Custom Search API allows a maximum of 10 results per query. Requesting 10.');
    numResults = 10;
  }

  try {
    const response = await axios.get<GoogleSearchResponse>(SEARCH_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: numResults,
      },
    });

    if (response.data && response.data.items) {
      return response.data.items.map((item) => item.link).filter(link => !!link); // Extract links and filter out any potential undefined/empty links
    }

    return [];
  } catch (error) {
    console.error('Error calling Google Custom Search API:', error);
    // Consider more specific error handling based on API response if needed
    throw new Error(`Failed to perform Google search for query: "${query}"`);
  }
} 
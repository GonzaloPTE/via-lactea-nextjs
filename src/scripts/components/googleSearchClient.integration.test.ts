import { searchWeb } from './googleSearchClient';

// --- Test Configuration ---
const MAX_TEST_WAIT_TIME = 15000; // 15 seconds for API calls

// --- Test Suite ---
describe('GoogleSearchClient Integration Tests', () => {

    let apiKey: string | undefined;
    let engineId: string | undefined;

    beforeAll(() => {
        // Load environment variables needed for the test
        // Note: dotenv is loaded globally via jest.setup.ts
        apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
        engineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
    });

    // Test case - only runs if keys are present
    test('searchWeb should return an array of URLs for a valid query', async () => {
        // Skip test if environment variables are not set
        if (!apiKey || !engineId) {
            console.warn('Skipping GoogleSearchClient test: GOOGLE_CUSTOM_SEARCH_API_KEY or GOOGLE_CUSTOM_SEARCH_ENGINE_ID not set in .env.local');
            // Use test.skip() in Jest > 26.3 or just return for older versions
            // test.skip('Environment variables not set');
             return;
        }

        const query = 'lactancia materna primeros dias'; // A sample relevant query
        const numResults = 3;

        try {
            const results = await searchWeb(query, numResults);

            // Basic Assertions
            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
            // Allow fewer results if Google returns fewer than requested
            expect(results.length).toBeLessThanOrEqual(numResults);

            // Check if items look like URLs
            results.forEach(url => {
                expect(typeof url).toBe('string');
                expect(url.startsWith('http://') || url.startsWith('https://')).toBe(true);
                console.log(`  - Found URL: ${url}`); // Log found URLs for info
            });

        } catch (error: any) {
            // Fail the test explicitly if the API call itself throws an error
            console.error('Google Search API call failed during test:', error.message);
            throw error; // Re-throw to make Jest fail the test
        }

    }, MAX_TEST_WAIT_TIME); // Increase timeout for API call

    // Removed the simulated error test as it's better suited for unit tests
    // test('searchWeb should throw an error if keys are missing (simulated)', async () => { ... });

}); 
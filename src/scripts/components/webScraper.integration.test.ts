import { fetchAndParseContent } from './webScraper';

// --- Test Configuration ---
const MAX_TEST_WAIT_TIME = 20000; // 20 seconds for potential network latency
const STABLE_TEST_URL = 'https://example.com'; // A very stable and simple target
const INVALID_TEST_URL = 'http://nonexistent.invalid.domain/path'; // A URL guaranteed to fail

// --- Test Suite ---
describe('WebScraper Integration Tests', () => {

    test('fetchAndParseContent should return text content for a valid and simple URL', async () => {
        try {
            const content = await fetchAndParseContent(STABLE_TEST_URL);

            // Assertions
            expect(content).not.toBeNull(); // Should successfully fetch and parse
            expect(typeof content).toBe('string');
            expect(content!.length).toBeGreaterThan(10); // Expect some meaningful content length

            // Check for expected keywords from example.com
            expect(content).toContain('Example Domain');
            expect(content).toContain('illustrative examples');

            console.log(`Successfully fetched and parsed content snippet from ${STABLE_TEST_URL}:\n"${content!.substring(0, 100)}..."`);

        } catch (error: any) {
            // Fail the test explicitly if the call throws an unexpected error
            console.error(`Web scraper failed unexpectedly for ${STABLE_TEST_URL}:`, error.message);
            throw error;
        }
    }, MAX_TEST_WAIT_TIME);

    test('fetchAndParseContent should return null for an invalid or non-existent URL', async () => {
        try {
            const content = await fetchAndParseContent(INVALID_TEST_URL);

            // Assertion
            expect(content).toBeNull(); // Expect failure, returning null

        } catch (error: any) {
             // We expect errors here (like DNS resolution failure), but the function should handle them and return null.
             // If it throws instead of returning null, the test will fail, which is correct.
             console.error(`Web scraper threw an unexpected error for ${INVALID_TEST_URL} instead of returning null:`, error.message);
             throw error;
        }
    }, MAX_TEST_WAIT_TIME);

    // Optional: Add more tests with different URLs if needed
    // test('fetchAndParseContent should handle a more complex page (may be brittle)', async () => { ... });

}); 
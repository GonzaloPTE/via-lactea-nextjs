import { analyzeContent } from './llmClient';

// --- Test Configuration ---
const MAX_TEST_WAIT_TIME = 30000; // 30 seconds for LLM API calls

// --- Test Suite ---
describe('LLMClient Integration Tests', () => {

    let apiKey: string | undefined;

    beforeAll(() => {
        // Load environment variable needed for the test
        // Note: dotenv is loaded globally via jest.setup.ts
        apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    });

    // Test case - only runs if the API key is present
    test('analyzeContent should return a valid LLMAnalysisResult for relevant input', async () => {
        // Skip test if environment variable is not set
        if (!apiKey) {
            console.warn('Skipping LLMClient test: GOOGLE_GEMINI_API_KEY not set in .env.local');
            return;
        }

        // Sample relevant content and topic
        const sampleContent = `
            <h2>Cómo calmar a un bebé que llora por la noche</h2>
            <p>Es común que los bebés se despierten llorando. Una técnica útil es el colecho seguro, 
            asegurándose de que no haya mantas sueltas. Otra opción es establecer una rutina 
            relajante antes de dormir, como un baño tibio y canciones de cuna suaves. 
            A veces, simplemente necesitan sentir la cercanía y seguridad de sus padres. 
            La paciencia es clave durante las regresiones del sueño.
            </p>
        `;
        const sampleTopic = 'Problemas comunes de sueño infantil y cómo abordarlos';

        try {
            const result = await analyzeContent(sampleContent, sampleTopic);

            // Basic Assertions
            expect(result).not.toBeNull(); // Should get a response
            console.log('LLM Analysis Result:', JSON.stringify(result, null, 2));

            // Structure Assertions (check types and presence)
            expect(result).toHaveProperty('is_relevant');
            expect(typeof result!.is_relevant).toBe('boolean');

            expect(result).toHaveProperty('extracts');
            expect(Array.isArray(result!.extracts)).toBe(true);

            expect(result).toHaveProperty('tags');
            expect(Array.isArray(result!.tags)).toBe(true);

            expect(result).toHaveProperty('summary');
            expect(typeof result!.summary).toBe('string');

            // Content Assertions (optional, depends on prompt reliability)
            // For relevant input, we expect relevance and some content
            expect(result!.is_relevant).toBe(true);
            expect(result!.extracts.length).toBeGreaterThan(0);
            expect(result!.tags.length).toBeGreaterThan(0);
            expect(result!.summary.length).toBeGreaterThan(10);


        } catch (error: any) {
            // Fail the test explicitly if the API call itself throws an unexpected error
            console.error('Google Gemini API call failed unexpectedly during test:', error.message);
            throw error; // Re-throw to make Jest fail the test
        }

    }, MAX_TEST_WAIT_TIME); // Increase timeout for LLM API call

     test('analyzeContent should handle potentially non-relevant input gracefully', async () => {
        // Skip test if environment variable is not set
        if (!apiKey) {
            console.warn('Skipping LLMClient test: GOOGLE_GEMINI_API_KEY not set in .env.local');
            return;
        }

        // Sample non-relevant content
        const sampleContent = `
            <h1>Receta de Tarta de Manzana</h1>
            <p>Ingredientes: 4 manzanas, 200g de harina, 100g de azúcar...</p>
        `;
        const sampleTopic = 'Problemas comunes de sueño infantil y cómo abordarlos';

        try {
            const result = await analyzeContent(sampleContent, sampleTopic);

            expect(result).not.toBeNull(); // Should still get a structured response
            console.log('LLM Analysis Result (Non-Relevant):', JSON.stringify(result, null, 2));

            // Expect the LLM to identify it as non-relevant based on the prompt instructions
            expect(result!.is_relevant).toBe(false);
            expect(result!.extracts).toEqual([]);
            expect(result!.tags).toEqual([]);
            expect(result!.summary).toEqual('');

        } catch (error: any) {
            console.error('Google Gemini API call failed unexpectedly during non-relevant test:', error.message);
            throw error;
        }
     }, MAX_TEST_WAIT_TIME);

    // Add more tests if needed, e.g., for empty content, very long content (truncation test), etc.

}); 
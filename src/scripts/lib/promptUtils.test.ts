import fs from 'fs';
import {
    loadPromptTemplate,
    formatReferenceAnalysisPrompt,
    formatQueryGenerationPrompt
} from './promptUtils';

// Mock the fs module
jest.mock('fs');
const mockedFs = jest.mocked(fs);

// REMOVED path mock

// --- Constants for Mocking ---
// Keep these simple, just for template content, paths are handled dynamically
const MOCK_QUERY_TEMPLATE = 'Generate queries.\n**Temas:**\n';
const MOCK_REF_TEMPLATE = 'Analyze reference.\n**Temas/Issues de Investigación Asociados (related_issues):**\n{{ incluir programáticamente el array de temas/issues de investigación }}\n**URL de la Fuente (Opcional, para contexto):**\n{{ incluir programáticamente la URL de la página web }}\n**Contenido de la Página Web:**\n```html\n{{ incluir programáticamente el contenido de la página web }}\n```\nInstructions...';

// --- Test Suite ---
describe('promptUtils Tests (Clean File)', () => {

    beforeEach(() => {
        // Reset mocks before each test
        mockedFs.readFileSync.mockClear();
        mockedFs.existsSync.mockClear();

        // Mock existsSync to check if path ends with known filename
        mockedFs.existsSync.mockImplementation((filePathInput) => {
            const filePath = String(filePathInput);
            return filePath.endsWith('generador-queries.md') || filePath.endsWith('investigacion-referencias.md');
        });

        // Mock readFileSync based on filename ending
        mockedFs.readFileSync.mockImplementation((filePathInput) => {
            const filePath = String(filePathInput);
            if (filePath.endsWith('generador-queries.md')) return MOCK_QUERY_TEMPLATE;
            if (filePath.endsWith('investigacion-referencias.md')) return MOCK_REF_TEMPLATE;
            // Simulate ENOENT for unhandled paths
            const error = new Error(`ENOENT: no such file or directory, open '${filePath}'`);
            (error as any).code = 'ENOENT';
            throw error;
        });
    });

    describe('loadPromptTemplate', () => {
        test('should load query generation template', () => {
            const template = loadPromptTemplate('queryGeneration');
            expect(template).toBe(MOCK_QUERY_TEMPLATE);
            expect(mockedFs.readFileSync).toHaveBeenCalledWith(
                expect.stringMatching(/[\\/]generador-queries\.md$/), // More robust path sep check
                'utf-8'
            );
        });

        test('should load reference analysis template', () => {
            const template = loadPromptTemplate('referenceAnalysis');
            expect(template).toBe(MOCK_REF_TEMPLATE);
            expect(mockedFs.readFileSync).toHaveBeenCalledWith(
                expect.stringMatching(/[\\/]investigacion-referencias\.md$/), // More robust path sep check
                'utf-8'
            );
        });

        // Test the scenario where an invalid template name is provided
        test('should throw "Invalid template name" for unknown template keys', () => {
            const unknownTemplateName = 'nonExistentTemplate' as any;

            expect(() => loadPromptTemplate(unknownTemplateName)).toThrow(
                `Invalid template name provided: ${unknownTemplateName}`
            );
            // We don't need to check existsSync anymore as the function throws earlier
        });

        // Test the scenario where existsSync passes but readFileSync throws
        test('should throw "Failed to load" if readFileSync throws', () => {
            // Ensure existsSync will return true for 'queryGeneration' via default mock

            // Override readFileSync specifically for this test to throw an error
            mockedFs.readFileSync.mockImplementation((filePathInput) => {
                 const filePath = String(filePathInput);
                 if (filePath.endsWith('generador-queries.md')) {
                     throw new Error('Simulated Read Error'); // Simulate read error
                 }
                 // Fallback for other paths if needed (though test focuses on queryGeneration)
                 if (filePath.endsWith('investigacion-referencias.md')) return MOCK_REF_TEMPLATE;
                 throw new Error(`Unexpected path in readFileSync mock: ${filePath}`);
            });

            expect(() => loadPromptTemplate('queryGeneration')).toThrow(
                // Expect the specific error from the catch block
                'Failed to load prompt template: generador-queries.md'
            );
            // Verify readFileSync was called correctly before throwing
            expect(mockedFs.readFileSync).toHaveBeenCalledWith(
                expect.stringMatching(/[\\/]generador-queries\.md$/), // Check path ends with filename
                'utf-8'
            );
        });

        // Keep the old test name but point it to the new specific test for readFileSync failure
        test('should throw error if readFileSync fails', () => {
            // This test now effectively duplicates the one above.
            // We can keep it for compatibility or remove it.
            // Let's just call the implementation of the specific test above.
            mockedFs.readFileSync.mockImplementation((filePathInput) => {
                const filePath = String(filePathInput);
                if (filePath.endsWith('generador-queries.md')) {
                    throw new Error('Simulated Read Error');
                }
                if (filePath.endsWith('investigacion-referencias.md')) return MOCK_REF_TEMPLATE;
                throw new Error(`Unexpected path in readFileSync mock: ${filePath}`);
           });
           expect(() => loadPromptTemplate('queryGeneration')).toThrow(
               'Failed to load prompt template: generador-queries.md'
           );
           expect(mockedFs.readFileSync).toHaveBeenCalledWith(
               expect.stringMatching(/[\\/]generador-queries\.md$/),
               'utf-8'
           );
        });
    });

    describe('formatQueryGenerationPrompt', () => {
        test('should append topic correctly', () => {
            const topic = 'Test Topic';
            const separator = MOCK_QUERY_TEMPLATE.endsWith('\n') ? '' : '\n';
            const expectedPrompt = MOCK_QUERY_TEMPLATE + separator + topic;
            const result = formatQueryGenerationPrompt(MOCK_QUERY_TEMPLATE, topic);
            expect(result).toEqual([{ role: "user", parts: [{ text: expectedPrompt }] }]);
        });
    });

    describe('formatReferenceAnalysisPrompt', () => {
        const topic = 'Test Topic';
        const url = 'http://example.com';
        const longContent = 'A'.repeat(20000);
        const truncatedContent = 'A'.repeat(15000) + '... (contenido truncado)';

        test('should replace placeholders correctly', () => {
            const content = 'Sample Content';
            const result = formatReferenceAnalysisPrompt(MOCK_REF_TEMPLATE, content, topic, url);
            const promptText = result[0].parts[0].text!;

            expect(promptText).toContain('**Temas/Issues de Investigación Asociados (related_issues):**\n' + topic);
            expect(promptText).toContain('**URL de la Fuente (Opcional, para contexto):**\n' + url);
            expect(promptText).toContain('```html\n' + content + '\n```');
            expect(promptText).not.toContain('{{ incluir');
        });

        test('should handle missing URL', () => {
            const content = 'Sample Content';
            const result = formatReferenceAnalysisPrompt(MOCK_REF_TEMPLATE, content, topic);
            const promptText = result[0].parts[0].text!;
            expect(promptText).toContain('URL no proporcionada');
        });

        test('should truncate long content', () => {
            const result = formatReferenceAnalysisPrompt(MOCK_REF_TEMPLATE, longContent, topic, url);
            const promptText = result[0].parts[0].text!;
            expect(promptText).toContain(truncatedContent);
            expect(promptText.length).toBeLessThan(MOCK_REF_TEMPLATE.length + truncatedContent.length + topic.length + url.length + 100); // Rough check
        });
    });
});
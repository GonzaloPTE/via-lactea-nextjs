import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig, Content } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Adjust path if needed

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash-latest"; // Use the specific flash model

// Define the expected structure of the JSON output from the LLM
export interface LLMAnalysisResult {
    is_relevant: boolean;
    extracts: string[];
    tags: string[];
    summary: string;
}

let genAI: GoogleGenerativeAI | null = null;

function getGenAIClient(): GoogleGenerativeAI {
    if (genAI) {
        return genAI;
    }
    if (!API_KEY) {
        throw new Error("Google Gemini API Key not found in environment variables.");
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    return genAI;
}

// Function to build the prompt based on the template and inputs
function buildPrompt(webContent: string, topic: string): Content[] {
    // Based on .llm/contenidos/prompts/investigacion-referencias.md
    // Note: Using structured Content format for clarity
    const promptText = `
Eres un asistente de investigación experto en sueño infantil y lactancia. Has recibido el contenido de una página web y un tema de investigación específico. Tu tarea es analizar si el contenido es relevante para ese tema y extraer información clave en formato JSON.

**Tema/Issue de Investigación Asociado:**
${topic}

**Contenido de la Página Web:**
\`\`\`html
${webContent.substring(0, 10000)}...
\`\`\`

**Instrucciones Detalladas:**

1.  **Analiza el contenido:** Lee detenidamente el texto principal de la página web proporcionada.
2.  **Determina la Relevancia (\`is_relevant\`):** Evalúa si el contenido de la página web aborda **directa y significativamente** el **Tema/Issue de Investigación Asociado**. Responde con \`true\` si es relevante, \`false\` si no lo es.
3.  **Si es Relevante (\`is_relevant: true\`):**
    *   **Extrae Fragmentos Clave (\`extracts\`):** Identifica y extrae **textualmente** entre 3 y 5 fragmentos (snippets) del contenido que sean más representativos o respondan directamente al **Tema/Issue de Investigación Asociado**. Devuelve esto como un array de strings.
    *   **Genera Etiquetas (\`tags\`):** Crea una lista de 3 a 7 etiquetas (palabras clave) **en español** que describan y clasifiquen con precisión el contenido específico de **esta página web**. Devuelve esto como un array de strings. Ejemplos: ["rutinas de sueño", "lactancia nocturna", "colecho seguro", "bancos de leche", "regresión 4 meses"].
    *   **Crea un Resumen (\`summary\`):** Redacta un resumen conciso (aproximadamente 2-5 frases) **en español** que explique **cómo el contenido de esta página se relaciona específicamente con el Tema/Issue de Investigación Asociado**. Destaca los puntos clave o las respuestas que ofrece la página a dicho tema/issue. Debe ser un único string de texto.
4.  **Si NO es Relevante (\`is_relevant: false\`):** Los campos \`extracts\` y \`tags\` deben ser arrays vacíos (\`[]\`), y el campo \`summary\` debe ser un string vacío (\`\"\"\`).

**Formato de Salida Obligatorio:**
Devuelve **únicamente** un objeto JSON válido y completo que contenga las cuatro claves (\`is_relevant\`, \`extracts\`, \`tags\`, \`summary\`) según las instrucciones. No incluyas ninguna explicación adicional, comentarios, ni marques el JSON como bloque de código.

**Ejemplo de Salida (Si es Relevante):**
\`\`\`json
{
  "is_relevant": true,
  "extracts": [
    "El colecho seguro implica asegurar que no haya espacios entre el colchón y la pared...",
    "Se recomienda una superficie firme y evitar almohadas o edredones voluminosos cerca del bebé...",
    "Nunca practiques colecho si has consumido alcohol, drogas o medicamentos que provoquen somnolencia."
  ],
  "tags": ["colecho", "sueño seguro", "recién nacido", "prevención SMSL", "habitación compartida"],
  "summary": "El artículo detalla prácticas esenciales para el colecho seguro, respondiendo directamente a las preocupaciones sobre la seguridad del bebé en la cama familiar. Cubre la preparación del espacio, los factores de riesgo a evitar y las recomendaciones oficiales actualizadas."
}
\`\`\`

**Ejemplo de Salida (Si NO es Relevante):**
\`\`\`json
{
  "is_relevant": false,
  "extracts": [],
  "tags": [],
  "summary": ""
}
\`\`\`
`;

    // Truncate web content to avoid exceeding token limits (adjust limit as needed)
    // The exact token limit depends on the model version and complexity.
    // 10000 characters is a rough starting point.
    const truncatedWebContent = webContent.length > 15000 ? webContent.substring(0, 15000) + "... (contenido truncado)" : webContent;

    const fullPrompt = promptText.replace('${webContent.substring(0, 10000)}...', truncatedWebContent);

    return [{ role: "user", parts: [{ text: fullPrompt }] }];
}

/**
 * Analyzes web content using the Google Gemini API based on a specific topic.
 * @param content The scraped text content of the web page.
 * @param topic The research topic/issue text.
 * @returns Promise resolving to the structured LLMAnalysisResult or null on failure.
 */
export async function analyzeContent(content: string, topic: string): Promise<LLMAnalysisResult | null> {
    try {
        const client = getGenAIClient();
        const model = client.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig: GenerationConfig = {
            // Ensure JSON output if the model supports it directly
            // For Gemini, we instruct it via the prompt and parse the text response
            responseMimeType: "application/json", // Request JSON output directly
            temperature: 0.2,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const promptParts = buildPrompt(content, topic);

        const result = await model.generateContent({
            contents: promptParts,
            generationConfig,
            safetySettings,
        });

        const response = result.response;
        const responseText = response.text();

        // console.log("Raw LLM Response Text:", responseText); // For debugging

        if (!responseText) {
            console.error("LLM returned empty response for topic:", topic);
            return null;
        }

        // Clean potential markdown code block fences
        const cleanedJsonString = responseText.trim().replace(/^```json\n?|\\n?```$/g, '');

        // Attempt to parse the cleaned text as JSON
        let parsedResult: LLMAnalysisResult;
        try {
            parsedResult = JSON.parse(cleanedJsonString);
            // Basic validation
            if (typeof parsedResult.is_relevant !== 'boolean' || !Array.isArray(parsedResult.extracts) || !Array.isArray(parsedResult.tags) || typeof parsedResult.summary !== 'string') {
                throw new Error("Parsed JSON does not match expected LLMAnalysisResult structure.");
            }
            return parsedResult;
        } catch (parseError: any) {
            console.error(`Failed to parse LLM JSON response for topic "${topic}":`, parseError.message);
            console.error("Raw response text was:", responseText); // Log the raw text on parse failure
            return null;
        }

    } catch (error: any) {
        console.error(`Error calling Google Gemini API for topic "${topic}":`, error.message);
        // Log more details if available (e.g., error.response?.data)
        return null;
    }
} 
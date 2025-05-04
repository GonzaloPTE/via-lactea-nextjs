# Plan General: Implementación de Scripts de Workflows

**Objetivo:** Reimplementar los workflows definidos conceptualmente (originalmente para n8n) como scripts TypeScript (`.tsx`) ejecutables en el directorio `src/scripts/`, para mayor control y escalabilidad en el procesamiento de ítems.

**Estructura:**
*   Scripts principales de workflow: `src/scripts/`
*   Componentes reutilizables: `src/scripts/components/`
*   Utilidades compartidas (ej. cliente Supabase): `src/scripts/lib/`

**Workflow 1: Investigación de Referencias (`02-workflow-investigacion-referencias.tsx`)**

Este script automatizará el proceso de encontrar y analizar referencias web para temas/preguntas identificadas previamente.

**Fases:**

**Fase 1: Implementación de Componentes**

1.  **Estructura de Directorios y Setup Base:**
    *   Crear `src/scripts/components/` y `src/scripts/lib/` si no existen.
    *   Instalar dependencias: `axios`, `cheerio`, `dotenv`, `@supabase/supabase-js`, `@google-ai/generativelanguage`.

2.  **`SupabaseClient` (`src/scripts/lib/supabaseClient.ts`):**
    *   Inicializar cliente Supabase (desde variables de entorno).
    *   **Input:** Función `getPendingIssues(limit: number): Promise<Issue[]>` para obtener issues de la tabla `discovered_issues` que necesiten investigación (ej., sin referencias asociadas o marcados específicamente). Definir `Issue` type (incluyendo al menos `id`, `issue_text`).
    *   **Output:** Función `saveReference(data: ReferenceData): Promise<void>` para guardar los detalles de una referencia procesada en la tabla `references`. Definir `ReferenceData` type (incluyendo `url`, `issue_id`, `is_relevant`, `extracts`, `tags`, `summary`).
    *   **Check:** Función `checkReferenceExistsForIssue(url: string, issueId: string): Promise<boolean>` para verificar si una URL ya está asociada a un issue específico en `references`.

3.  **`GoogleSearchClient` (`src/scripts/components/googleSearchClient.ts`):**
    *   Función `searchWeb(query: string): Promise<string[]>`:
        *   Input: Texto del `issue_text`.
        *   Llamar a Google Custom Search API (usando API Key y Search Engine ID de env vars).
        *   Usar `axios` o `fetch`.
        *   Parsear respuesta y devolver array de URLs.
        *   Manejo de errores básico.

4.  **`WebScraper` (`src/scripts/components/webScraper.ts`):**
    *   Función `fetchAndParseContent(url: string): Promise<string | null>`:
        *   Input: URL.
        *   Descargar HTML con `axios` o `fetch`.
        *   Usar `cheerio` para cargar HTML y extraer contenido textual principal (ej., de `<article>`, `<main>`, o `<body>` limpiando scripts/styles).
        *   Devolver texto o `null` si falla.

5.  **`LLMClient` (`src/scripts/components/llmClient.ts`):**
    *   **Proveedor:** Google Gemini (gemini-1.5-flash).
    *   Definir `LLMAnalysisResult` type (con `is_relevant`, `extracts`, `tags`, `summary`).
    *   Función `analyzeContent(content: string, topic: string): Promise<LLMAnalysisResult | null>`:
        *   Input: Texto de la web (`content`), texto del issue (`topic`).
        *   Leer Google API Key de env vars.
        *   Construir prompt basado en `.llm/contenidos/prompts/investigacion-referencias.md`.
        *   Llamar a la API de Gemini usando `@google-ai/generativelanguage`.
        *   **Importante:** Configurar la llamada para que devuelva JSON.
        *   Parsear y validar la respuesta JSON contra `LLMAnalysisResult`.
        *   Manejo de errores (API, JSON inválido).
        *   Devolver objeto `LLMAnalysisResult` o `null`.

**Fase 2: Ensamblaje del Script Principal (`02-workflow-investigacion-referencias.tsx`)**

1.  **Setup:**
    *   Importar componentes de Fase 1.
    *   Cargar `dotenv`.
    *   Inicializar clientes (Supabase, Google Search, LLM).

2.  **Lógica Principal:**
    *   Llamar a `getPendingIssues` para obtener los temas a investigar desde `discovered_issues`.
    *   Iterar sobre cada `issue`:
        *   Llamar a `searchWeb` usando `issue.issue_text`.
        *   Iterar sobre cada `url` resultante:
            *   Llamar a `checkReferenceExistsForIssue(url, issue.id)`.
            *   Si no existe:
                *   Llamar a `fetchAndParseContent(url)`.
                *   Si se obtiene `content`:
                    *   Llamar a `analyzeContent(content, issue.issue_text)`.
                    *   Si se obtiene `analysisResult` y `analysisResult.is_relevant`:
                        *   Crear objeto `ReferenceData` con `url`, `issue.id`, y datos de `analysisResult`.
                        *   Llamar a `saveReference(referenceData)`.
        *   (Opcional) Marcar el `issue` como procesado en `discovered_issues`.
    *   Implementar logging detallado del progreso y errores.

**Workflow 2: Elicitación de Temas (Script Futuro: `01-workflow-elicitacion-temas.tsx`)**

*   (Plan por definir, similar al Workflow 1 de n8n: Monitorizar fuentes -> LLM para extraer -> Guardar en `discovered_issues`).

**Consideraciones Adicionales:**

*   **Manejo de Errores Robustos:** Implementar reintentos, backoff exponencial para APIs externas.
*   **Variables de Entorno:** Definir y documentar todas las variables necesarias (`.env.example`).
*   **Testing:** Considerar tests unitarios para componentes (especialmente parsers y clientes API).
*   **Escalabilidad:** Diseñar para poder procesar issues en batches o de forma concurrente si es necesario.
*   **Logging:** Usar un logger estándar (ej. `pino`) para registrar información útil.

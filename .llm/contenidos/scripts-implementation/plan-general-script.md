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

**Fase 3: Agrupación de temas y Redacción de Blog Posts (Script `03-workflow-agrupacion-redaccion.tsx`)**

*   (Plan definido en `@03-plan.md` y `@03-plan-nuevos-campos.md`). Este workflow se encarga de agrupar issues, generar borradores de posts, y poblar campos como `category`, `tags`, `content` (Markdown), `meta_description`, y `content_html`.

**Workflow 4: Corrección de Referencias en HTML (`04-workflow-correccion-referencias.tsx`)**

Este script se enfocará en mejorar la calidad del `content_html` de los blog posts, específicamente corrigiendo referencias mal formadas o placeholders.

**Fases (conceptuales):**

1.  **Implementación de Componentes/Pasos:**
    *   `04-step-01-fetch-posts-for-correction.ts`: Obtiene posts de `blog_posts` que necesitan corrección de referencias (basado en `status`, `version`, y si `content_html` existe).
    *   `04-step-02-fetch-references-for-posts.ts`: Para cada post, recupera las referencias (`url`, `title`, `summary`) de la tabla `references` asociadas a los `issue_ids` del post.
    *   `04-step-03-correct-html-references-llm.ts`: Utiliza un LLM para analizar el `content_html` junto con las referencias obtenidas. El LLM identificará placeholders o enlaces incorrectos y los reemplazará con etiquetas `<a>` correctas, usando la `url` y el `title`/`summary` de las referencias.
    *   `04-step-04-update-posts-version.ts`: Actualiza el `blog_posts` con el `content_html` corregido y incrementa la columna `version`.

2.  **Ensamblaje del Script Principal (`04-workflow-correccion-referencias.tsx`):**
    *   Orquesta la ejecución de los pasos anteriores.
    *   Maneja el procesamiento por lotes y el logging.

*   (Plan detallado en `@.llm/contenidos/scripts-implementation/04-plan.md`).

**Workflow 5: Generación de Publicaciones para Redes Sociales (`05-workflow-generacion-rrss.tsx`)**

Este script se encargará de tomar posts de blog existentes y generar múltiples (hasta 3) borradores de publicaciones cortas y atractivas para Instagram y Facebook, fomentando la interacción.

**Fases (conceptuales):**

1.  **Implementación de Componentes/Pasos:**
    *   `05-step-01-fetch-blog-posts.ts`: Obtiene posts de `blog_posts` que sean candidatos para generar publicaciones de redes sociales (ej. estado 'published' o 'draft_generated', y quizás un nuevo campo/estado para rastrear la generación de contenido para RRSS).
    *   `05-step-02-generate-social-media-posts-llm.ts`: Utiliza un LLM (con un nuevo prompt `.llm/contenidos/prompts/creador-publicacion-redes.md`) para generar hasta 3 variantes de texto para redes sociales a partir del contenido del blog post (`title`, `meta_description`, `content_html` o `content` Markdown).
    *   `05-step-03-save-social-media-posts.ts`: Guarda las publicaciones generadas en una nueva tabla (ej. `social_media_publications`) vinculada al `blog_post_id` original.

2.  **Ensamblaje del Script Principal (`05-workflow-generacion-rrss.tsx`):**
    *   Orquesta la ejecución de los pasos anteriores.
    *   Maneja el procesamiento por lotes y el logging.

*   (Plan detallado se creará en `@.llm/contenidos/scripts-implementation/05-plan.md`).

**Consideraciones Adicionales:**

*   **Manejo de Errores Robustos:** Implementar reintentos, backoff exponencial para APIs externas.
*   **Variables de Entorno:** Definir y documentar todas las variables necesarias (`.env.example`).
*   **Testing:** Considerar tests unitarios para componentes (especialmente parsers y clientes API).
*   **Escalabilidad:** Diseñar para poder procesar issues en batches o de forma concurrente si es necesario.
*   **Logging:** Usar un logger estándar (ej. `pino`) para registrar información útil.

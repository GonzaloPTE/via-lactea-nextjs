### Workflow 03: Agrupación de Issues y Redacción de Posts

**Objetivo:** Agrupar issues procesados (`ref_analysis_done`) en temas de blog posts y generar el contenido inicial para cada uno.

**Pasos:**

1.  **Fetch Issues Procesados:**
    *   Obtener lotes (batch size: 10) de issues desde `discovered_issues`.
    *   **Filtro:** `status = 'ref_analysis_done'` y `status != 'blog_post_assigned'` (o un estado similar para evitar reprocesar).
    *   **Orden:** `priority_score DESC`, `sentiment ASC`.
    *   Para cada issue en el lote, obtener sus datos esenciales (ID, texto, tags) y también los IDs de sus referencias relevantes (`references` donde `is_relevant = true`).

2.  **Agrupar Issues en Posts (LLM):**
    *   Paralelamente para el lote de issues obtenidos:
    *   Llamar a la API de Gemini con el prompt `.llm/contenidos/prompts/agrupador-issues-en-blog-posts.md`.
    *   **Input:** Lista de issues del lote (solo ID, texto, tags).
    *   **Output:** Array JSON de objetos `{ "titulo": "...", "slug": "...", "issuesIds": [id1, id2,...] }`.
    *   **Acción:** Por cada objeto en la respuesta JSON:
        *   Guardar un nuevo registro en la tabla `blog_posts` con el `title`, `slug`, y `issue_ids` proporcionados. El campo `content` y `meta_description` quedarán `NULL` inicialmente. `status` será `draft`.
        *   Actualizar el `status` de los `discovered_issues` correspondientes a los `issuesIds` a `blog_post_assigned` (o similar) para marcarlos como procesados por este workflow.

3.  **Generar Contenido del Post (LLM):**
    *   Paralelamente para cada nuevo `blog_post` creado en el paso anterior:
    *   Obtener los detalles completos de los `discovered_issues` asociados a ese `blog_post` (usando `issue_ids`).
    *   Obtener los detalles completos de todas las referencias (`references`) asociadas a esos issues (donde `is_relevant = true`).
    *   Llamar a la API de Gemini con el prompt `.llm/contenidos/prompts/redactor-blog-posts.md`.
    *   **Input:** Título del post, detalles completos de los issues, detalles completos de las referencias (incluyendo título, url, resumen LLM, extractos).
    *   **Output:** Contenido del artículo en formato Markdown, seguido de `---` y la meta descripción.
    *   **Acción:**
        *   Parsear la respuesta para separar el contenido Markdown de la meta descripción.
        *   Actualizar el registro correspondiente en `blog_posts`, rellenando los campos `content` y `meta_description`.
        *   (Opcional) Cambiar el `status` del `blog_post` si la generación fue exitosa (ej., a `draft_generated`).

**Consideraciones:**
*   Manejo de errores robusto en llamadas a API y operaciones de DB.
*   Gestión de estados (`status`) en `discovered_issues` y `blog_posts` para asegurar la idempotencia y evitar reprocesamientos.
*   Optimización del número de llamadas a la DB y a la API (paralelización donde sea seguro).

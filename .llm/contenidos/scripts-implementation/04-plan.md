### Workflow 04: Corrección y Mejora de Referencias en Blog Posts

**Objetivo:** Analizar el `content_html` de los posts del blog para identificar y corregir referencias incorrectamente formateadas o placeholder, utilizando un LLM y la información de las referencias asociadas al post. Actualizar el `content_html` y la `version` del post.

**Disparador/Input:** Posts de la tabla `blog_posts` que no estén en la última versión de corrección.

**Tabla Principal:** `public.blog_posts`

**Pasos del Workflow:**

1.  **Paso 1 (`04-step-01-fetch-posts-for-correction.ts`):**
    *   **Acción:** Consultar la tabla `blog_posts`.
    *   **Lógica de Filtro Previo:**
        *   Primero, determinar la `current_max_version_from_db = MAX(version)` existente en la tabla `blog_posts`. Si no hay posts con versión (todos `NULL`), `current_max_version_from_db` puede considerarse 0.
    *   **Filtro Principal:** Seleccionar posts que requieran corrección:
        *   `status IN ('draft_generated', 'published')` (o cualquier estado donde el `content_html` esté presente y pueda necesitar corrección).
        *   `content_html IS NOT NULL` Y `content_html != ''`.
        *   `(version IS NULL OR version < current_max_version_from_db)`.
    *   **Seleccionar Campos:** Obtener `id` (del post), `content_html`, `issue_ids`, `version`.
    *   **Lógica:** Implementar paginación o limitar por lotes (`batchSize`). Si no se encuentran posts que cumplan el filtro, el workflow puede terminar.
    *   **Salida:** Un array de objetos `BlogPostForCorrection` (`{ id, content_html, issue_ids, current_version: version }`).

2.  **Paso 2 (`04-step-02-fetch-references-for-posts.ts`):**
    *   **Acción:** Para cada `BlogPostForCorrection` del Paso 1, obtener sus referencias relevantes.
    *   **Lógica:**
        *   Utilizar los `issue_ids` de cada post para consultar la tabla `references`.
        *   **Filtro:** `is_relevant = true`.
        *   **Seleccionar Campos:** `url`, `title`, `summary` (o cualquier otro campo que ayude al LLM a contextualizar la referencia, como `extracts`).
    *   **Salida:** Un array de objetos `BlogPostWithContext` (`{ id, content_html, issue_ids, current_version: number | null, relevant_references: [{ url, title, summary, extracts }, ...] }`). Si un post no tiene `issue_ids` o estos no tienen referencias relevantes, `relevant_references` será un array vacío.

3.  **Paso 3 (`04-step-03-correct-html-references-llm.ts`):**
    *   **Acción:** Para cada `BlogPostWithContext`, utilizar un LLM para corregir las referencias en `content_html`.
    *   **Lógica:**
        *   Formatear un prompt para un LLM (ej. Gemini) usando una nueva plantilla (ej. `.llm/contenidos/prompts/corrector-referencias-html.md`).
        *   **Inyectar en el Prompt:**
            *   El `content_html` actual del post.
            *   La lista de `relevant_references` (con `url`, `title`, `summary`, `extracts`), numeradas secuencialmente (ej. Ref 1: ..., Ref 2: ...).
        *   **Instruir al LLM:**
            *   Identificar placeholders de referencias o enlaces incorrectos en el HTML (ej. `[descripción]`, `(Fuente: texto sin enlace)`, `<a href="#">texto</a>`, `<a href="[placeholder]">texto</a>`).
            *   Basándose en el contexto del placeholder y la lista numerada de referencias provista, hacer coincidir el placeholder con la referencia más adecuada.
            *   Reemplazar el placeholder/enlace incorrecto con una cita numerada y enlazada. **Estilo de Cita Común:**
                *   La cita en el texto debe ser un número entre corchetes: `[1]`, `[2]`, etc.
                *   Este número debe ser un enlace a la URL de la referencia correspondiente.
                *   Formato HTML del enlace: `<a href="URL_REAL_DE_REFERENCIA_N" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[N]</a>`, donde `N` es el número de la referencia en la lista provista.
            *   **Ejemplos de Transformación:**
                1.  **Original:** `...como indica el estudio sobre sueño infantil (ver estudio sobre microsiestas)...`
                    **Si "estudio sobre microsiestas" coincide con la Ref 3 (URL: http://example.com/microsiestas):**
                    **Transformado:** `...como indica el estudio sobre sueño infantil<a href="http://example.com/microsiestas" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[3]</a>...`
                2.  **Original:** `...según la OMS [enlace a OMS lactancia]...`
                    **Si "enlace a OMS lactancia" coincide con la Ref 1 (URL: http://who.int/lactancia):**
                    **Transformado:** `...según la OMS<a href="http://who.int/lactancia" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[1]</a>...`
                3.  **Original:** `... (Fuente: KidsHealth, siestas)...`
                    **Si "KidsHealth, siestas" coincide con la Ref 5 (URL: http://kidshealth.org/siestas):**
                    **Transformado:** `... <a href="http://kidshealth.org/siestas" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[5]</a>...` (El texto original "Fuente: ..." se reemplaza por la cita enlazada).
                4.  **Original:** `... <a href="#">un artículo reciente</a> mencionó...`
                    **Si "un artículo reciente" coincide con la Ref 2 (URL: http://articulos.com/reciente):**
                    **Transformado:** `... <a href="http://articulos.com/reciente" target="_blank" rel="noopener noreferrer" class="via-lactea-reference">[2]</a> mencionó...` (Se reemplaza el enlace incorrecto y su texto por la cita enlazada).
            *   Si no se encuentra una referencia adecuada para un placeholder, el LLM podría ser instruido para:
                *   Dejar el placeholder/texto original como está.
                *   Eliminar el placeholder/texto original.
                *   Envolver el texto del placeholder con una etiqueta especial para revisión manual (ej. `<span class="needs-review">texto original</span>`).
            *   Asegurar que la salida sea únicamente el `content_html` modificado, manteniendo la estructura general del HTML.
            *   Prestar atención a no romper el HTML existente y a codificar correctamente los caracteres en URLs.
        *   **Llamada al LLM:** Ejecutar la llamada.
        *   **Parsear Respuesta:** Obtener el `corrected_content_html`.
    *   **Salida:** Un array de objetos `CorrectedPostData` (`{ post_id: number, original_content_html: string, corrected_content_html: string | null, current_version: number | null }`). `corrected_content_html` es `null` si el LLM falla o no hace cambios.

4.  **Paso 4 (`04-step-04-update-posts-version.ts`):**
    *   **Acción:** Actualizar los posts en la tabla `blog_posts` con el HTML corregido y la nueva versión.
    *   **Lógica:**
        *   Iterar sobre el array `CorrectedPostData`.
        *   Para cada post donde `corrected_content_html` no sea `null` y sea diferente del `original_content_html`:
            *   **Actualizar Post:**
                *   `content_html = corrected_content_html`
                *   `version = (COALESCE(current_version, 0) + 1)` (utilizando `current_version` del objeto `CorrectedPostData`).
                *   Opcionalmente, actualizar `status` (ej. a `draft_corrected` o `published_reviewed`) o `updated_at`.
        *   Utilizar transacciones si es posible para cada actualización.
    *   **Salida:** Un resumen de los posts actualizados (ej. `{ updated_count: number, error_count: number }`).

**Orquestador (`04-workflow-correccion-referencias.tsx`):**

*   Llamará a los pasos en secuencia.
*   Manejará la lógica de lotes.
*   Realizará el logging del progreso y errores.

**Consideraciones Adicionales:**

*   **Prompt Engineering:** El prompt para el LLM en el Paso 3 será crítico. Deberá ser muy específico sobre los patrones a buscar y cómo formatear la salida.
*   **Calidad del LLM:** La capacidad del LLM para hacer coincidir correctamente los placeholders con las referencias y generar HTML válido es crucial. Podría requerir un modelo más avanzado o ajuste fino.
*   **Casos No Encontrados:** Definir claramente cómo manejar los placeholders para los cuales el LLM no puede encontrar una referencia adecuada.
*   **Revisión Manual:** Podría ser necesario un paso de revisión manual para los posts corregidos, especialmente al principio.
*   **Idempotencia:** El uso de la columna `version` y la comparación del HTML antes/después de la corrección ayudará a evitar reprocesamientos innecesarios o bucles.
*   **Coste:** Múltiples llamadas al LLM para corrección pueden ser costosas. Optimizar el batching y la selectividad de los posts a procesar.
*   **HTML Parsing/Manipulation:** En lugar de depender únicamente del LLM para la salida HTML, se podría considerar usar una librería de parsing HTML (como `jsdom` o `cheerio` en un entorno Node.js si el script se ejecuta allí) para analizar la estructura devuelta por el LLM o para hacer reemplazos más seguros si el LLM solo identifica los cambios. Sin embargo, el plan actual se inclina por el LLM generando el HTML completo modificado.
*   **Alternativa al LLM para reemplazo:** Si el LLM puede identificar de forma fiable el placeholder y la URL/título correctos, el reemplazo podría hacerse mediante código con expresiones regulares o manipulación del DOM, en lugar de que el LLM reescriba todo el HTML. Esto podría ser más seguro pero menos flexible. El plan actual favorece la flexibilidad del LLM.
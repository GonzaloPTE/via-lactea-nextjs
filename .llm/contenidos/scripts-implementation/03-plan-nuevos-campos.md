# Plan de Implementación: Workflow 3 Mejorado (Agrupación, Redacción y Nuevos Campos)

Este documento detalla el flujo de trabajo y las modificaciones necesarias para el script `03-workflow-agrupacion-redaccion.tsx` y sus pasos asociados, incorporando los nuevos campos `category`, `tags`, `content_html` y `is_featured` en la tabla `blog_posts`.

**Objetivo:** Agrupar issues procesados (`status = 'ref_analysis_done'`), generar borradores de posts de blog con contenido Markdown y HTML, asignar categorías y etiquetas, y marcar los issues como procesados.

**Tabla Principal:** `public.blog_posts` (con las nuevas columnas ya añadidas por migraciones).

**Pasos del Workflow:**

1.  **Paso 1 (`03-step-01-fetch-issues.ts`):**
    *   **Acción:** Consultar la tabla `discovered_issues`.
    *   **Filtro:** Seleccionar issues con `status = 'ref_analysis_done'`.
    *   **Seleccionar Campos:** Obtener `id`, `issue_text`, `tags` y cualquier otro campo relevante para la agrupación (ej. `priority_score`).
    *   **Lógica:** Implementar paginación o limitar por lotes (`batchSize`) para manejar grandes volúmenes.
    *   **Salida:** Un array de objetos `IssueForGrouping` (conteniendo al menos `id`, `issue_text`, `tags`).
    *   **Modificaciones:** No se esperan cambios funcionales principales en este paso, pero asegurar que se seleccionan los `tags` del issue.

2.  **Paso 2 (`03-step-02-group-issues.ts`):**
    *   **Acción:** Procesar el array de `IssueForGrouping` para agruparlos temáticamente en posts de blog propuestos.
    *   **Lógica:**
        *   Leer y parsear la lista de categorías válidas desde `.llm/contenidos/scripts-implementation/categorias-blog-posts.md`.
        *   Formatear un prompt para un LLM (ej. Gemini) usando la plantilla `agrupador-issues-en-blog-posts.md`.
        *   **Inyectar en el Prompt:** La lista de issues (con su texto y tags) y la lista de categorías válidas.
        *   **Instruir al LLM:** Pedirle que agrupe los issues, genere un `title` y `slug` para cada grupo, seleccione **una única `category`** de la lista proporcionada, y consolide una lista de `tags` relevantes para cada grupo propuesto a partir de los tags de los issues agrupados.
        *   **Llamada al LLM:** Ejecutar la llamada al LLM.
        *   **Parsear Respuesta:** Interpretar la respuesta del LLM (probablemente JSON) para extraer la información de cada grupo (`title`, `slug`, `issue_ids`, `category`, `tags`).
        *   **Validación:** (Opcional pero recomendado) Validar que la `category` devuelta por el LLM exista en la lista original de categorías válidas.
    *   **Salida:** Un array de objetos `PostGroupData` (`{ title, slug, issue_ids, category, tags }`).
    *   **Modificaciones:** Lógica para leer categorías, actualizar plantilla de prompt, actualizar función de formateo de prompt, actualizar parseo de respuesta LLM, actualizar tipo `PostGroupData`.

3.  **Paso 3 (`03-step-03-save-posts-update-issues.ts`):**
    *   **Acción:** Guardar los borradores de post en la tabla `blog_posts` y actualizar el estado de los issues correspondientes.
    *   **Lógica:**
        *   Iterar sobre el array `PostGroupData` recibido del Paso 2.
        *   Para cada grupo:
            *   **Insertar Post:** Crear un nuevo registro en `blog_posts` con `title`, `slug`, `issue_ids`, `category`, `tags`. Los campos `content`, `meta_description`, `content_html` serán `NULL` inicialmente. `status` será `'draft_grouped'` (o un nuevo estado intermedio). `is_featured` será `false` (por defecto).
            *   **Actualizar Issues:** Actualizar la tabla `discovered_issues`, estableciendo `status = 'blog_post_assigned'` para todos los `issue_ids` asociados a este post.
        *   Utilizar transacciones si es posible para asegurar la atomicidad entre la inserción del post y la actualización de los issues.
    *   **Salida:** Un array de los `id` de los posts recién creados.
    *   **Modificaciones:** Actualizar la función para aceptar `category` y `tags`, actualizar la sentencia `INSERT` para incluir estos nuevos campos.

4.  **Paso 4 (`03-step-04-fetch-data-for-generation.ts`):**
    *   **Acción:** Para un `postId` dado (del array devuelto por Paso 3), obtener toda la información necesaria para generar el contenido del post.
    *   **Lógica:**
        *   Consultar `blog_posts` por `postId` para obtener `title`, `slug`, `issue_ids`, `category`, `tags`.
        *   Consultar `discovered_issues` usando los `issue_ids` para obtener `issue_text`.
        *   Consultar `references` usando los `issue_ids` (JOIN o subconsulta) para obtener las referencias relevantes (`url`, `title`, `summary`, `extracts` donde `is_relevant = true`).
    *   **Salida:** Un objeto `PostGenerationData` que contenga toda la información recopilada (título, slug, categoría, tags, textos de issues, referencias relevantes).
    *   **Modificaciones:** Añadir `category` y `tags` al `SELECT` de `blog_posts` y a la estructura `PostGenerationData`.

5.  **Paso 5 (`03-step-05-generate-content.ts`):**
    *   **Acción:** Generar el contenido del post en Markdown y la meta descripción usando un LLM.
    *   **Lógica:**
        *   Recibir el objeto `PostGenerationData`.
        *   Formatear un prompt para un LLM (ej. Gemini) usando la plantilla `redactor-blog-posts.md`.
        *   **Inyectar en el Prompt:** Título, slug, categoría, tags, textos de issues, referencias relevantes.
        *   **Instruir al LLM:** Pedirle que redacte un post de blog completo y coherente en formato **Markdown**, y que genere una `meta_description` concisa y atractiva para SEO.
        *   **Llamada al LLM:** Ejecutar la llamada.
        *   **Parsear Respuesta:** Extraer el contenido Markdown y la meta descripción de la respuesta del LLM.
    *   **Salida:** Un objeto `{ markdownContent: string, metaDescription: string }` (o una única string si el LLM devuelve ambos claramente separados).
    *   **Modificaciones:** Actualizar plantilla de prompt para incluir `category` y `tags` como contexto. Actualizar función de formateo. Ajustar parseo si es necesario.

6.  **Paso 6 (`03-step-06-update-posts-with-content.ts`):**
    *   **Acción:** Convertir el Markdown a HTML usando un LLM y actualizar el registro del post en `blog_posts`.
    *   **Lógica:**
        *   Recibir el `postId` y el objeto `{ markdownContent, metaDescription }` del Paso 5.
        *   **Llamada LLM (HTML):** Formatear un nuevo prompt (plantilla `markdown-a-html.md`) pasándole `markdownContent`. Instruir al LLM para que devuelva únicamente el HTML correspondiente, aplicando clases o estilos si se desea.
        *   **Parsear Respuesta HTML:** Obtener el `content_html` de la respuesta.
        *   **Actualizar DB:** Actualizar el registro en `blog_posts` con `id = postId`, estableciendo:
            *   `content = markdownContent`
            *   `meta_description = metaDescription`
            *   `content_html = content_html`
            *   `status = 'draft_generated'`
    *   **Salida:** Void o booleano indicando éxito.
    *   **Modificaciones:** Añadir lógica para la segunda llamada LLM (HTML). Actualizar la sentencia `UPDATE` para incluir `content`, `content_html`, `meta_description` y el nuevo `status`.

**Orquestador (`03-workflow-agrupacion-redaccion.tsx`):**

*   Llama a los pasos en secuencia, pasando los datos necesarios entre ellos.
*   Maneja el procesamiento por lotes y la lógica de finalización.
*   Realiza el logging general del progreso y los errores.
*   **Modificaciones:** Probablemente mínimas o ninguna, asumiendo que las interfaces y firmas de los pasos se actualizan correctamente.

**Consideraciones Adicionales:**

*   **Manejo de Errores:** Mejorar el manejo de errores en cada paso (ej. reintentos para llamadas LLM, marcado de posts con `status = 'error'` si falla la generación/actualización).
*   **Coste/Latencia LLM:** La adición de una segunda llamada LLM en el Paso 6 incrementará el coste y la latencia del proceso por post.
*   **Validación:** Añadir validaciones más robustas a las respuestas de los LLMs.
*   **Alternativa HTML:** Si la llamada LLM para HTML resulta poco fiable o costosa, se podría reconsiderar usar una librería como `marked` dentro del Paso 6, aceptando el riesgo de fallos con Markdown malformado.

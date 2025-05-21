### Workflow 05: Generación de Publicaciones para Redes Sociales

**Objetivo:** A partir de posts de blog existentes (`blog_posts`), generar automáticamente hasta 3 variantes de texto optimizadas para publicaciones en redes sociales (Instagram/Facebook), con el fin de promocionar el contenido del blog e incentivar la interacción.

**Disparador/Input:** Posts de la tabla `blog_posts` que cumplan criterios de selección (ej. `status = 'published'` o `status = 'draft_generated'`) y que aún no hayan tenido (o no suficientes) publicaciones de RRSS generadas. Se podría usar una nueva columna en `blog_posts` como `social_posts_generated_count` o un estado específico.

**Nueva Tabla:** `public.social_media_posts`
*   `id` (SERIAL, PK)
*   `blog_post_id` (INTEGER, FK to `blog_posts.id`, ON DELETE CASCADE)
*   `platform` (TEXT, e.g., 'Instagram', 'Facebook', 'General' - inicialmente 'General' si el texto es el mismo)
*   `post_text` (TEXT, el contenido generado para la red social)
*   `generated_at` (TIMESTAMP WITH TIME ZONE, default `NOW()`)
*   `status` (TEXT, e.g., 'draft', 'scheduled', 'published', 'error', default 'draft')
*   `llm_prompt_version` (TEXT, opcional, para versionar el prompt usado)
*   `notes` (TEXT, opcional, para notas adicionales o feedback de revisión)

**Pasos del Workflow:**

1.  **Paso 0 (Migración): Crear tabla `social_media_posts`**
    *   **Acción:** Definir y aplicar una migración SQL para crear la tabla `social_media_posts` con las columnas especificadas arriba.

2.  **Paso 1 (`05-step-01-fetch-blog-posts-for-social.ts`):**
    *   **Acción:** Consultar la tabla `blog_posts`.
    *   **Filtro:**
        *   Posts con `status IN ('published', 'draft_generated')` (o el estado que se decida como fuente).
        *   Opcional: Que no tengan un número suficiente de publicaciones asociadas en `social_media_posts` (ej. `COUNT(social_media_posts.id) < 3` agrupando por `blog_post_id`). Esto requeriría una subconsulta o join.
        *   Opcional: Un nuevo campo en `blog_posts` como `social_content_status = 'pending'`.
    *   **Seleccionar Campos Clave del Blog Post:** `id` (del blog post), `title`, `meta_description`, `content` (Markdown), `tags`, `category`.
    *   **Lógica:** Paginación o lotes (`batchSize`).
    *   **Salida:** Un array de objetos `BlogPostForSocialMedia` (`{ id, title, meta_description, content, tags, category }`).

3.  **Paso 2 (`05-step-02-generate-social-media-text-llm.ts`):**
    *   **Acción:** Para cada `BlogPostForSocialMedia`, usar un LLM para generar hasta 3 variantes de texto para redes sociales.
    *   **Lógica:**
        *   Formatear un prompt para un LLM (ej. Gemini) usando la plantilla `.llm/contenidos/prompts/creador-publicacion-redes.md`.
        *   **Inyectar en el Prompt:** `title`, `meta_description`, un resumen o los primeros N párrafos del `content` del blog post, `tags`, y `category`.
        *   **Instruir al LLM:**
            *   Generar hasta 3 textos de publicación distintos y atractivos.
            *   Cada texto debe ser adecuado para Instagram y Facebook.
            *   Cada texto debe ser conciso (ej. máximo 280-300 caracteres, o especificar límites para cada plataforma si fueran diferentes más adelante).
            *   Incluir hashtags relevantes derivados de los `tags` del post y el contenido.
            *   **Fomentar la interacción:** Terminar con una pregunta abierta, una llamada a la acción (ej. "Lee más en el blog", "¿Qué opinas?"), o un pequeño reto.
            *   Adaptar el tono para que sea amigable y cercano.
            *   Devolver la respuesta en formato JSON, un array de strings, donde cada string es una variante de publicación.
        *   **Llamada al LLM:** Ejecutar la llamada.
        *   **Parsear Respuesta:** Obtener el array de textos generados (ej. `string[]`).
    *   **Salida:** Un array de objetos `GeneratedSocialMediaTexts` (`{ blog_post_id: number, social_texts: string[] }`).

4.  **Paso 3 (`05-step-03-save-social-media-posts.ts`):**
    *   **Acción:** Guardar los textos generados en la tabla `social_media_posts`.
    *   **Lógica:**
        *   Iterar sobre cada objeto en `GeneratedSocialMediaTexts`.
        *   Para cada `social_text` en `social_texts`:
            *   Insertar un nuevo registro en `social_media_posts` con:
                *   `blog_post_id`
                *   `platform = 'General'` (o 'Instagram, Facebook')
                *   `post_text = social_text`
                *   `status = 'draft'`
        *   Opcional: Actualizar el `blog_posts` para marcar que se ha generado contenido para RRSS (ej. incrementar `social_posts_generated_count` o cambiar `social_content_status = 'processed'`).
    *   **Salida:** Resumen de inserciones (ej. `{ created_count: number, error_count: number }`).

**Orquestador (`05-workflow-generacion-rrss.tsx`):**

*   Llamará a los pasos en secuencia (después de la migración inicial).
*   Manejará la lógica de lotes.
*   Realizará el logging del progreso y errores.

**Consideraciones Adicionales:**

*   **Prompt Engineering para RRSS:** El prompt para el LLM en el Paso 2 será clave para obtener textos que realmente enganchen y se adapten bien al formato de redes.
*   **Variedad:** Asegurar que el LLM genere variantes significativamente diferentes si se piden múltiples publicaciones.
*   **Imágenes/Media:** Este workflow se centra en el texto. La selección de imágenes/videos para las publicaciones de RRSS sería un proceso separado o manual.
*   **Acortador de Enlaces:** Considerar la integración de un acortador de enlaces para los links al blog post si se incluyen directamente en el texto de RRSS.
*   **Programación/Publicación:** Este workflow solo genera los borradores. La programación o publicación real en las plataformas de RRSS es un paso posterior (potencialmente otro workflow o herramienta).
*   **Idempotencia y Reprocesamiento:** La estrategia de filtrado en el Paso 1 (usando conteos o estados) es importante para evitar generar posts duplicados para el mismo blog post innecesariamente.


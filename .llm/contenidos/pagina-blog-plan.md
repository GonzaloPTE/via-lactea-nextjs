Las etiquetas (tags) son muy valiosas para el SEO de los posts del blog. Permiten:

1.  **Agrupación Temática:** Ayudan a los motores de búsqueda (y a los usuarios) a entender los temas principales de cada post.
2.  **Descubrimiento:** Facilitan la creación de páginas de archivo por etiqueta (ej. `/blog/tag/lactancia-nocturna`), lo que crea más puntos de entrada indexables para tu contenido.
3.  **Relevancia:** Pueden reforzar la relevancia de un post para ciertas palabras clave.
4.  **Datos Estructurados:** Se pueden incluir en los metadatos Schema.org (`keywords`) para dar más contexto a los buscadores.

**Propuesta:**

La forma más directa y eficiente de implementar esto, dado que ya generas los posts a partir de `discovered_issues` que *sí* tienen tags, es:

1.  **Añadir una columna `tags TEXT[] NULL` a la tabla `blog_posts`:**
    *   Esto almacenará un array de strings (las etiquetas) directamente asociado a cada post.
    *   Permite flexibilidad: pueden ser una combinación de las etiquetas de los `issues` originales, o refinadas/añadidas durante el proceso de redacción.
    *   Usamos `NULL` para permitir posts sin etiquetas si fuera necesario.
2.  **Modificar el Workflow 3 (Redacción):**
    *   En el paso donde se genera el contenido del post (probablemente Step 5 o 6), se deben recopilar las etiquetas relevantes de los `discovered_issues` asociados (`issue_ids`).
    *   Se puede hacer un `DISTINCT` para evitar duplicados.
    *   Guardar este array de etiquetas en la nueva columna `tags` de la tabla `blog_posts`.
3.  **Actualizar el Frontend (`/src/app/blog/page.tsx` y `BlogCard3`):**
    *   Modificar la query en `getBlogData` para incluir el campo `tags` en el `SELECT`.
    *   Actualizar la interfaz `IBlogPost` para incluir `tags: string[] | null;`.
    *   Mostrar las etiquetas en `BlogCard3` (y eventualmente en la página del post individual).

**¿Por qué esta opción?**

*   **Eficiencia:** Evita tener que hacer JOINs complejos con `discovered_issues` cada vez que necesitas mostrar las etiquetas de un post.
*   **Flexibilidad:** Permite que las etiquetas del blog post puedan diferir ligeramente de las etiquetas originales de los issues si es necesario.
*   **SEO:** Facilita el uso de las etiquetas en el frontend y para generar páginas de archivo por tag.

**Próximos Pasos:**

1.  Crear una nueva migración SQL para añadir la columna `tags` a `blog_posts`.
2.  Actualizar los tipos TypeScript.
3.  Modificar el script de backend (Workflow 3) para poblar este campo.
4.  Actualizar el frontend para mostrar las etiquetas.

---

## Plan para la Página de Detalle del Artículo de Blog (`/blog/[slug]`)

Esta sección detalla la planificación para la página que mostrará un artículo de blog individual.

**Elementos Clave a Mostrar (basado en campos disponibles):**

*   **Navegación Principal (Header):** Consistente con el resto del sitio (`ViaLacteaNavbar`).
*   **Título del Artículo (`title`):** Prominente, como `<h1>`.
*   **Metadatos del Artículo:**
    *   Autor: Miriam Rubio (inicialmente codificado).
    *   Fecha de Publicación: `published_at` (o `created_at` si `published_at` es `null`).
    *   Categoría: `category` (enlazable a página de archivo de categoría).
*   **Imagen de Encabezado (Hero):**
    *   Se mostrará una imagen de stock relevante (de un pool de 30-50 imágenes) como parte de un nuevo componente `BlogPostHero`.
    *   La lógica para seleccionar la imagen residirá en `BlogPostHero` o se pasará como prop. No se almacenará una URL de imagen específica por post en la base de datos por ahora.
*   **Contenido Principal del Artículo:**
    *   Cuerpo del artículo, renderizando `content_html`.
*   **Etiquetas (`tags`):**
    *   Lista de `tags` asociadas al post, enlazables a páginas de archivo de etiquetas.
*   **Botones de Compartir en Redes Sociales.**
*   **Sección de "Artículos Relacionados".**
*   **Barra Lateral (`BlogSidebar`):** Reutilizada de la página de listado, pero modificada para mostrar **solo las etiquetas del post actual** y un enlace a una página de índice de etiquetas (`/blog/tag`).
*   **Comentarios:** Omitido por ahora.
*   **Pie de Página (`ViaLacteaFooter`):** Consistente con el resto del sitio.

**Estructura Visual y Componentes Clave (Inspirado en `Blog6.tsx`):**

*   **Layout General:** Estructura de dos columnas:
    *   Columna principal (izquierda, más ancha): Contenido del artículo.
    *   Columna lateral (derecha, más estrecha): `BlogSidebar`.
*   **Componente `BlogPostHero` (Nuevo):**
    *   En la parte superior de la columna principal.
    *   Mostrará el `title` del post.
    *   Incluirá la imagen de stock.
    *   Podría mostrar `category` y `published_at`.
*   **Contenido del Artículo:** Debajo del `BlogPostHero`, mostrará `content_html`.
*   **Metadatos Adicionales (debajo del contenido o integrados):** Autor, `tags`.

---

**Plan de Implementación y Estructura de Archivos:**

**1. Estructura de Directorios y Archivos Propuesta:**

*   **Página de Detalle del Blog:**
    *   `src/app/blog/[slug]/page.tsx` (Componente principal de la página, Server Component)
*   **Componentes Específicos del Detalle del Blog:**
    *   `src/components/blocks/hero/BlogPostHero.tsx` (Nuevo componente para la cabecera del post)
*   **Componentes Reutilizables (Nuevos o a verificar):**
    *   `src/components/reuseable/SocialShareButtons.tsx`
    *   `src/components/reuseable/RelatedArticles.tsx`
    *   Se podrán reutilizar `BlogCard3` u otros cards existentes para los artículos relacionados.
*   **Tipos:**
    *   Considerar mover `IBlogPost` de `src/app/blog/page.tsx` a un archivo global (ej. `src/types/blog.ts` o `src/types/supabase.ts` si es específico de la DB).

**2. Pasos de Implementación:**

    a.  **Definición de Tipos:**
        *   Asegurar/Actualizar `IBlogPost` para que incluya todos los campos necesarios: `id`, `title`, `slug`, `content_html`, `category`, `tags`, `published_at`, `meta_description`, `created_at`.
        *   Definir props para los nuevos componentes: `BlogPostHeroProps`, `SocialShareButtonsProps`, `RelatedArticlesProps`.

    b.  **Función de Obtención de Datos del Post (`getPostBySlug`):**
        *   Crear en `src/lib/supabase/blog.ts` (o similar) una función asíncrona `getPostBySlug(supabase: SupabaseClient, slug: string): Promise<IBlogPost | null>`.
        *   Consultará `blog_posts` por `slug`, seleccionando todos los campos necesarios.
        *   Manejará el caso de post no encontrado (devolver `null`).

    c.  **Creación del Componente `BlogPostHero.tsx`:**
        *   Recibirá props: `title: string`, `category?: string | null`, `publishedDate: string` (ya formateada), `imageUrl: string` (para la imagen de stock).
        *   **Diseño Visual (inspirado en la sección de título de `sandbox-ts-v3.1.0/src/app/(blogs)/blog-details-1/page.tsx`):
            *   Contenedor principal con clases `wrapper bg-soft-primary`.
            *   Contenedor de texto con padding ajustado (ej. `pt-10 pb-19 pt-md-14 pb-md-20 text-center`).
            *   Div `post-header` centrado (`col-md-10 col-xl-8 mx-auto`).
            *   **Categoría:** Mostrar como un enlace (usar `next/link`, `href` temporal "#") dentro de un `div.post-category.text-line`.
            *   **Título:** `h1.display-1.mb-4`.
            *   **Metadatos (`ul.post-meta.mb-5.list-unstyled`):
                *   Fecha de publicación: `li.post-date` con ícono de calendario (ej. `<i className="uil uil-calendar-alt" />`) y el texto de `publishedDate` dentro de un tag `<time>`.
                *   Autor: `li.post-author` con ícono de usuario (ej. `<i className="uil uil-user" />`) y el texto "Por Miriam Rubio" (enlace opcional futuro).
            *   No incluir contadores de "likes" o "comments" del ejemplo.
        *   Renderizará la `imageUrl` proporcionada (la imagen de stock) debajo de la sección de metadatos, posiblemente ocupando el ancho completo o de forma destacada.
        *   La lógica para seleccionar una `imageUrl` del pool de imágenes de stock residirá en el componente de página (`page.tsx`) que lo llama y pasará la URL seleccionada como prop.

    d.  **Creación del Componente `SocialShareButtons.tsx`:**
        *   Props: `url: string` (para Facebook share), `title: string` (para Facebook share), `instagramProfileUrl: string`.
        *   Renderizará un enlace para compartir en Facebook y un enlace al perfil de Instagram de Vía Láctea. 
        *   Se utilizará el estilo de iconos de `SocialLinks.tsx` (ej. etiquetas `<i>` con clases `uil uil-facebook-f`, `uil uil-instagram`).
        *   Los enlaces se mostrarán como texto con icono, no como botones con fondo de color.

    e.  **Creación del Componente `RelatedArticles.tsx`:**
        *   Props: `currentPostId: number`, `category?: string | null`, `tags?: string[] | null`.
        *   Obtendrá 2-3 posts relacionados de Supabase (misma categoría, tags comunes, más recientes, excluyendo `currentPostId`).
        *   Usará `BlogCard3` (o similar) para mostrar los posts.
        *   **Layout de Cards:** Se mostrarán en un layout de 2 columnas en pantallas medianas y grandes (ej. `col-md-6 col-lg-6`) para dar más espacio a cada card, en lugar de 3 columnas en pantallas grandes.

    f.  **Desarrollo de la Página `src/app/blog/[slug]/page.tsx`:**
        *   Server Component `async function Page({ params }: { params: { slug: string } })`.
        *   Obtendrá el `slug`.
        *   Creará una instancia del cliente Supabase.
        *   Llamará a `getPostBySlug(supabase, slug)`.
        *   Si no hay post, usará `notFound()` de `next/navigation`.
        *   **Layout:**
            *   `ViaLacteaNavbar`, `ViaLacteaFooter`.
            *   Estructura de `div.row > div.col-lg-8 + div.col-lg-4` (similar a `Blog6.tsx`).
        *   **Contenido Principal (`col-lg-8`):**
            *   Formatear `published_at` (o `created_at`).
            *   Seleccionar una imagen del pool de stock.
            *   Renderizar `<BlogPostHero />`.
            *   Mostrar autor.
            *   Renderizar `content_html` usando `dangerouslySetInnerHTML={{ __html: post.content_html }}` (asumiendo que el HTML es seguro o será sanitizado antes de guardarlo).
            *   **Mostrar `tags`:** Como una lista de enlaces de texto (ej. `#etiqueta1 #etiqueta2`). Cada etiqueta enlazará a `/blog/tag/[slug-etiqueta]`. No usar badges.
            *   Renderizar `<SocialShareButtons />` (simplificado a Facebook share y enlace a perfil de Instagram).
            *   Renderizar `<RelatedArticles />`.
        *   **Sidebar (`col-lg-4`):**
            *   Renderizar `<BlogSidebar tags={post.tags} />`, pasándole las etiquetas del post actual.

    g.  **Gestión de Imágenes de Stock:**
        *   Definir un array de URLs de imágenes de stock en un archivo de constantes o similar.
        *   En `page.tsx` o `BlogPostHero.tsx`, seleccionar una imagen de este array (ej. basado en el `id` del post módulo el número de imágenes).

    h.  **Estilos y Pruebas:**
        *   Asegurar consistencia con el tema.
        *   Probar con diferentes posts y en varios dispositivos.

    i.  **Metadatos SEO (`generateMetadata`):**
        *   En `src/app/blog/[slug]/page.tsx`, implementar `async function generateMetadata({ params }: { params: { slug: string } })`.
        *   Obtendrá el post por slug.
        *   Devolverá `{ title: post.title, description: post.meta_description }`.
        *   Manejar el caso de post no encontrado.

    j.  **Implementación de Schema.org (`BlogPosting`):**
        *   En `src/app/blog/[slug]/page.tsx`, generar dinámicamente un script JSON-LD para el schema `BlogPosting`.
        *   **Propiedades a incluir:**
            *   `@context: "https://schema.org"`
            *   `@type: "BlogPosting"`
            *   `mainEntityOfPage`: URL canónica del post (ej. `{"@type": "WebPage", "@id": "https://vialacteasuenoylactancia.com/blog/${post.slug}"}`).
            *   `headline`: `post.title`.
            *   `description`: `post.meta_description`.
            *   `image`: URL de la imagen de stock seleccionada para el `BlogPostHero`.
            *   `author`: Referencia al `@id` del schema `Person` de Miriam Rubio (ej. `{"@type": "Person", "@id": "https://vialacteasuenoylactancia.com/#person-miriam-rubio"}`). Si el `@id` no está disponible, usar `{"@type": "Person", "name": "Miriam Rubio"}`.
            *   `publisher`: Referencia al `@id` del schema `Organization` de Vía Láctea (ej. `{"@type": "Organization", "@id": "https://vialacteasuenoylactancia.com/#organization"}`).
            *   `datePublished`: `post.published_at` (formateado en ISO 8601).
            *   `dateModified`: `post.updated_at` (si se añade este campo en el futuro, o usar `published_at` si no hay modificaciones; formateado en ISO 8601).
        *   Incrustar este script en el `<head>` de la página o al final del `<body>`.
        *   **Validación:** Una vez implementado, validar la estructura usando el [Google Rich Results Test](https://search.google.com/test/rich-results) y el [Schema Markup Validator](https://validator.schema.org/) para asegurar que Google puede interpretarlo correctamente y que la página es elegible para resultados enriquecidos de artículo de blog.
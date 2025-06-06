# Plan de Implementación: Páginas de Categorías y Etiquetas del Blog

Este documento detalla los pasos para crear páginas dedicadas a listar categorías y etiquetas de los posts del blog, así como las páginas que filtran posts por una categoría o etiqueta específica.

## I. Refactorizar la Creación del Cliente Supabase [COMPLETADO]

**Objetivo:** Centralizar la lógica de creación del cliente Supabase para Server Components.

1.  **Crear archivo de utilidad:** `src/lib/supabase/server.ts` - **HECHO**
2.  **Definir función reutilizable:** `createSupabaseServerClient` - **HECHO**
3.  **Actualizar archivos existentes:** `src/app/blog/page.tsx` y `src/app/blog/[slug]/page.tsx` - **HECHO**

## II. Funciones de Obtención de Datos (en `src/lib/supabase/blog.ts`) [COMPLETADO - DEBUGGING PENDIENTE]

**Objetivo:** Crear funciones específicas para obtener datos de categorías, etiquetas y posts filtrados.

1.  **`getAllUniqueCategories(): Promise<string[]>`** - **HECHO** (Filtro `status = 'published'` comentado temporalmente para testing).
2.  **`getAllUniqueTags(): Promise<string[]>`** - **HECHO** (Filtro `status = 'published'` comentado temporalmente para testing).
3.  **`getPostsByCategoryOrTag(...): Promise<{ posts: IBlogPost[], ... }>`** - **HECHO** (Filtros `status = 'published'` para `queryCount`, `queryData` y obtención de nombres originales comentados temporalmente para testing).
4.  **`getPostBySlug(...): Promise<IBlogPost | null>`** - **REVISADO** (Filtro `status = 'published'` comentado temporalmente para testing).
5.  **`getRelatedPosts(...): Promise<IBlogPost[]>`** - **REVISADO** (Filtros `status = 'published'` comentados temporalmente para testing).

## III. Página: `/src/app/blog/categorias/page.tsx` [COMPLETADO - PENDIENTE MEJORA VISUAL]

**Objetivo:** Mostrar una lista de todas las categorías únicas del blog.

1.  **Estructura de Archivo:** `src/app/blog/categorias/page.tsx` - **HECHO**
2.  **Obtención de Datos (Server Component):** Usar `createSupabaseServerClient()` y `getAllUniqueCategories()` - **HECHO**
3.  **UI:** Incluir `ViaLacteaNavbar`, `ViaLacteaFooter`, `PageHeader`. Listar categorías como links. - **HECHO** (Creado `PageHeader.tsx` como placeholder/componente básico).
4.  **SEO (`generateMetadata`):** Título y descripción estáticos. - **HECHO**

## IV. Página: `/src/app/blog/tags/page.tsx` [COMPLETADO]

**Objetivo:** Mostrar una lista de todas las etiquetas únicas del blog.

1.  **Estructura de Archivo:** `src/app/blog/tags/page.tsx` - **HECHO**
2.  **Obtención de Datos (Server Component):** Usar `createSupabaseServerClient()` y `getAllUniqueTags()` - **HECHO**
3.  **UI:** Similar a categorías, estilo "nube de tags" o lista simple. - **HECHO**
4.  **SEO (`generateMetadata`):** Título y descripción estáticos. - **HECHO**

## V. Página: `/src/app/blog/categorias/[slug]/page.tsx` [COMPLETADO]

**Objetivo:** Mostrar posts filtrados por una categoría específica.

1.  **Estructura de Archivo:** `src/app/blog/categorias/[slug]/page.tsx` - **HECHO**
2.  **Props y Obtención de Datos:** Usar `createSupabaseServerClient()`, `params.slug`, `searchParams`, `getPostsByCategoryOrTag('category', ...)` - **HECHO**
3.  **UI:** Reutilizar estructura de `blog/page.tsx` (`PageHeader`, `BlogCard3`, `PaginationClientWrapper`, `BlogSidebar`). - **HECHO**
4.  **SEO (`generateMetadata`):** Dinámico con nombre de categoría. - **HECHO**

## VI. Página: `/src/app/blog/tags/[slug]/page.tsx` [COMPLETADO]

**Objetivo:** Mostrar posts filtrados por una etiqueta específica.

1.  **Estructura de Archivo:** `src/app/blog/tags/[slug]/page.tsx` - **HECHO**
2.  **Props y Obtención de Datos:** Similar a `categorias/[slug]`, pero con `getPostsByCategoryOrTag('tag', ...)` - **HECHO**
3.  **UI:** Similar a `categorias/[slug]`. - **HECHO**
4.  **SEO (`generateMetadata`):** Dinámico con nombre de etiqueta. - **HECHO**

## VII. Utilidades Adicionales [COMPLETADO]

1.  **`slugify(text: string): string`:**
    *   Asumido disponible y funcional en `src/lib/utils.ts`. - **HECHO**
2.  **`unslugify(slug: string): string` (Opcional/Consideración):**
    *   Actualmente no es necesario ya que `getPostsByCategoryOrTag` devuelve el nombre original.

## VIII. Componentes UI [COMPLETADO (BÁSICO) - PENDIENTE REFINAMIENTO SIDEBAR]

1.  **`PageHeader.tsx` (Reutilizable):**
    *   Creado como componente básico. Podría requerir mejoras o estilización. - **HECHO (BÁSICO)**
2.  **Adaptar `BlogCard3`, `PaginationClientWrapper`:** Reutilizados. - **HECHO**
3.  **`BlogSidebar.tsx`:** Ver sección IX.

## IX. Actualizaciones a `BlogSidebar.tsx` [COMPLETADO]

**Objetivo:** Hacer el sidebar más contextual y útil.

1.  **Nuevas Props (Opcionales):** `currentCategory?`, `currentTag?`. Prop `allTags` eliminada. - **HECHO**
2.  **Lógica de Visualización:** Adaptada según la página actual. Widgets de Categorías y Tags dinámicos. Obtención de datos propia para populares, todas las categorías y todos los tags (populares, contextuales a categoría). - **HECHO**
3.  **Refinamiento Tags Populares:** Implementada la función `getPopularTags` en `blog.ts` para obtener tags por frecuencia, opcionalmente filtrados por categoría. `BlogSidebar` ahora muestra "Etiquetas Populares" contextualmente. - **HECHO**

## X. Constantes y Configuración [COMPLETADO]

*   `PAGE_SIZE` para la paginación (e.g., 6). Definido en páginas de filtrado. Considerar centralizar si se usa en más lugares. - **HECHO (EN PÁGINAS)**

Este plan proporciona una hoja de ruta detallada. La implementación se realizará paso a paso, comenzando por la refactorización del cliente Supabase y las funciones de obtención de datos.

## XI. Mejora Visual: Página de Listado de Categorías (`/blog/categorias`) [COMPLETADO]

**Objetivo:** Mejorar la presentación visual de la lista de categorías utilizando un diseño basado en `BlogCard3`.

1.  **Adaptar `src/app/blog/categorias/page.tsx`:**
    *   Iterar sobre las categorías obtenidas. - **HECHO**
    *   Para cada categoría, renderizar un componente `CategoryCard` (versión simplificada de `BlogCard3`). - **HECHO**
    *   Props para `CategoryCard`:
        *   `title`: Nombre de la categoría. - **HECHO**
        *   `link`: `/blog/categorias/${slugify(categoryName)}`. - **HECHO**
        *   `image`: Seleccionar una imagen de `DUMMY_IMAGE_POOL` de forma determinista. - **HECHO**
        *   ~~`description`~~: Eliminada por el usuario.
        *   No incluir `date` o metadatos de post. - **HECHO**
    *   Layout de grid responsivo (2-3 columnas). - **HECHO**
2.  **Estilos:** Asegurar integración con el diseño general. - **HECHO**
3.  **Sidebar:** Eliminado por el usuario para simplificar. - **HECHO**

## XII. Mejoras SEO: Páginas de Categorías y Tags [PARCIALMENTE COMPLETADO]

**Objetivo:** Optimizar metadatos y añadir datos estructurados (Schema.org) a las páginas de listado y filtrado de categorías y tags.

1.  **Metadatos (`generateMetadata`) para `/blog/categorias` y `/blog/tags` (Listados Generales):** - **HECHO**
    *   `title`: "Categorías del Blog | Vía Láctea" y "Etiquetas del Blog | Vía Láctea".
    *   `description`: "Explora todos los artículos de nuestro blog organizados por categorías/etiquetas..."
    *   `keywords`: Incluir "categorías blog", "tags blog", etc.
    *   `alternates.canonical`: URL canónica.
    *   Open Graph y Twitter cards.
2.  **Metadatos (`generateMetadata`) para `/blog/categorias/[slug]` y `/blog/tags/[slug]` (Páginas Filtradas):** - **HECHO**
    *   `title`: `Posts sobre ${categoryName} | Blog Vía Láctea` y `Posts con la etiqueta ${tagName} | Blog Vía Láctea`.
    *   `description`: Dinámica con nombre de categoría/tag.
    *   `keywords`: Dinámicos con nombre de categoría/tag.
    *   `alternates.canonical`: URL canónica.
    *   Open Graph y Twitter cards.
3.  **Datos Estructurados (Schema.org):**
        *   Implementar `BreadcrumbList` en las 4 páginas (listados generales y filtrados). - **HECHO**
        *   Páginas de listado general (`/blog/categorias`, `/blog/tags`):
            *   Implementar schema `WebPage` básico, si no está cubierto ya por `BreadcrumbList` u otros schemas globales. - **HECHO** (Incluye `name`, `description`, `url`, referencia a `BreadcrumbList` y `mainEntityOfPage` como `ItemList` de las categorías/tags).
            *   Copy revisado y optimizado para SEO. - **HECHO**
        *   Páginas filtradas (`/blog/categorias/[slug]`, `/blog/tags/[slug]`):
            *   Investigar e implementar schema `CollectionPage` (que es un tipo específico de `WebPage`). - **HECHO** (Implementada versión descriptiva. Listado explícito de posts como `mainEntity` o `hasPart` podría ser una mejora futura si se considera necesario y se facilita el acceso a los datos de los posts en `generateMetadata` o se pasa desde el componente de página).
4.  **Contenido H1:** Asegurar que sean descriptivos (ya gestionado por `PageHeader`). - **HECHO**
5.  **Sidebar:** Eliminado de páginas de listado general (`/blog/categorias`, `/blog/tags`) por el usuario. - **HECHO**

## XIII. Refinamiento y Pruebas Finales [PARCIALMENTE COMPLETADO]

**Objetivo:** Realizar pruebas exhaustivas, validar SEO y re-habilitar filtros de 'published'.

1.  **Pruebas Funcionales:** Probar todas las páginas y funcionalidades en diversos escenarios.
2.  **Revisión `BlogSidebar`:** Ajustar lógica de tags si es necesario. - **HECHO**
3.  **Re-habilitar Filtros `status = 'published'`:** - **HECHO**
    *   `getAllUniqueCategories` (`src/lib/supabase/blog.ts`) - **HECHO**
    *   `getAllUniqueTags` (`src/lib/supabase/blog.ts`) - **HECHO**
    *   `getPostsByCategoryOrTag` (para posts y nombres) (`src/lib/supabase/blog.ts`) - **HECHO**
    *   `getPostBySlug` (`src/lib/supabase/blog.ts`) - **HECHO**
    *   `getRelatedPosts` (`src/lib/supabase/blog.ts`) - **HECHO**
    *   `getSidebarData` (para `popularPosts` y `popularTags` en `BlogSidebar.tsx`) - **HECHO**
    *   `getPopularTags` (`src/lib/supabase/blog.ts`) - **HECHO**
    *   `getBlogData` (para `totalCount` y `allPosts` en `src/app/blog/page.tsx`) - **HECHO**
4.  **Pruebas Post-Filtros:** Asegurar que solo se muestre contenido publicado. - **HECHO** (Confirmado por el usuario)
5.  **Validación SEO:** Usar Google Rich Results Test y Schema Markup Validator. Revisar Google Search Console post-indexación. [PENDIENTE - A realizar post-despliegue]
6.  **Procesamiento de Contenido HTML:** Asegurar que los enlaces en `content_html` de los posts (`/blog/[slug]`) se normalicen a `https://` si no tienen esquema y no son relativos/anclas. - **HECHO** (Implementado en `src/lib/utils.ts` y usado en `src/app/blog/[slug]/page.tsx`).
7.  **Generación Determinista de Fechas:** Asegurar que todos los posts tengan una fecha (`published_at`, `created_at`) generada de forma determinista si falta en la BD, para una correcta visualización y ordenación inicial. - **HECHO** (Implementado en `src/lib/utils.ts` e integrado en `src/lib/supabase/blog.ts`, `src/app/blog/page.tsx` y `src/components/reuseable/BlogSidebar.tsx`. Se corrigió la lógica de distribución para cubrir todo el rango de fechas deseado).
8.  **Ordenación Avanzada Post-Procesamiento de Fechas:** Modificar la obtención de posts para que primero se obtengan todos los posts relevantes (filtrados por categoría/tag si aplica), luego se procesen/generen las fechas, después se ordenen en memoria por la fecha final (más recientes primero por defecto), y finalmente se aplique la paginación en memoria. - **HECHO**
    *   Afecta a: `getPostsByCategoryOrTag` en `src/lib/supabase/blog.ts`. - **HECHO**
    *   Afecta a: `getBlogData` en `src/app/blog/page.tsx`. - **HECHO**
9.  **Visibilidad del Blog en Navbar:** Asegurar que el enlace al Blog sea visible en el componente `ViaLacteaNavbar.tsx`. - **HECHO** (Descomentado en `src/data/via-lactea-navigation.ts`).
10. **Eliminación Widget Archivo Sidebar:** Quitar la sección "Archivo" del `BlogSidebar.tsx`. - **HECHO**

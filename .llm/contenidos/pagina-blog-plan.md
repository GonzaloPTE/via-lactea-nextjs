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
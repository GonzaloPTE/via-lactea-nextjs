# Schema.org Implementations and Plans

Este documento cataloga los diferentes tipos de Schema.org implementados y planeados en el sitio web `vialacteasuenoylactancia.com`, su ubicación y su estructura JSON-LD.

**Objetivo General:** Mejorar la comprensión del sitio por parte de Google y habilitar la aparición de Rich Results (Resultados Enriquecidos) en las búsquedas.

**Herramientas de Validación:**
*   **Google Rich Results Test:** Para validar la implementación y previsualizar posibles resultados enriquecidos.
*   **Schema Markup Validator (de Schema.org):** Otra herramienta de validación útil.

---

## Esquemas Implementados

A continuación se detallan los schemas que ya han sido implementados en la aplicación.

### 1. Organization Schema

*   **Tipo:** `Organization`
*   **Objetivo:** Identificar el sitio como perteneciente a una organización/negocio. Ayuda a construir el Knowledge Panel de Google.
*   **Ubicación:** `src/app/layout.tsx` (inyectado en todas las páginas).
*   **JSON-LD Implementado:**
    ```json
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://vialacteasuenoylactancia.com/#organization",
      "name": "Vía Láctea - Asesoría de Sueño Infantil y Lactancia",
      "url": "https://vialacteasuenoylactancia.com/",
      "logo": "https://vialacteasuenoylactancia.com/img/via-lactea/svg/via-lactea-logo.svg",
      "sameAs": [
        "https://www.instagram.com/vialacteasuenoylactancia/",
        "https://www.facebook.com/vialacteasuenoylactancia"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contacto@vialacteasuenoylactancia.com",
        "contactType": "Customer Support"
      }
    }
    ```

### 2. Person Schema (Miriam Rubio)

*   **Tipo:** `Person`
*   **Objetivo:** Identificar a Miriam Rubio como la profesional clave detrás de los servicios y contenidos.
*   **Ubicación:** `src/components/blocks/about/ViaLacteaAbout.tsx` (utilizado, por ejemplo, en la página de inicio).
*   **JSON-LD Implementado:**
    ```json
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Miriam Rubio",
      "jobTitle": "Asesora de Sueño Infantil Respetuoso Certificada, Asesora de Lactancia Certificada, Enfermera",
      "knowsAbout": ["Sueño Infantil Respetuoso", "Lactancia Materna", "Enfermería Pediátrica"],
      "worksFor": {
        "@type": "Organization",
        "@id": "https://vialacteasuenoylactancia.com/#organization" // Enlaza a la Organization schema
      },
      "image": "https://vialacteasuenoylactancia.com/img/via-lactea/photos/perfil-hero.png",
      "url": "https://vialacteasuenoylactancia.com/", // Podría apuntar a una página "Sobre Mí" más específica si existe
      "sameAs": [] // Espacio para perfiles sociales personales si aplica (ej. LinkedIn)
    }
    ```
*   **Nota Importante:** Para una mejor referenciación desde otros schemas (como `BlogPosting.author`), se recomienda añadir una propiedad `@id` única a este schema `Person`. Por ejemplo: `"@id": "https://vialacteasuenoylactancia.com/#person-miriam-rubio"`.

### 3. Service Schema

*   **Tipo:** `Service`
*   **Objetivo:** Describir detalladamente cada servicio ofrecido para que los motores de búsqueda comprendan su naturaleza, proveedor y, opcionalmente, precio y área de servicio.
*   **Ubicación:** `src/app/servicios/[slug]/page.tsx` (generado dinámicamente para cada página de detalle de servicio).
*   **Estructura JSON-LD Implementada (Ejemplo Genérico):**
    ```json
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Nombre del Servicio (dinámico)",
      "description": "Descripción del servicio (dinámica)",
      "url": "URL canónica del servicio (dinámica)",
      "provider": {
        "@type": "Organization",
        "@id": "https://vialacteasuenoylactancia.com/#organization" // Enlaza a la Organization schema
      },
      "serviceType": "Tipo de servicio (dinámico, ej. Asesoría de Sueño Infantil)",
      "areaServed": {
        "@type": "Country",
        "name": "ES" // Ajustar si es global o múltiple
      },
      "offers": { // Condicional, si el servicio tiene precio
        "@type": "Offer",
        "price": "Precio del servicio (dinámico)",
        "priceCurrency": "EUR"
      },
      "image": "URL de la imagen del servicio (dinámica, si aplica)" // Condicional
    }
    ```

### 4. FAQPage Schema

*   **Tipo:** `FAQPage`
*   **Objetivo:** Marcar secciones de Preguntas Frecuentes para que puedan aparecer como Rich Results en las búsquedas, mejorando la visibilidad.
*   **Ubicación:** `src/components/blocks/faq/ViaLacteaFAQ.tsx` (utilizado en páginas que contienen una sección de FAQ, como la página de inicio).
*   **Estructura JSON-LD Implementada (Ejemplo Genérico):**
    ```json
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Texto de la Pregunta 1 (dinámico)",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Texto de la Respuesta 1 (dinámico)"
          }
        },
        {
          "@type": "Question",
          "name": "Texto de la Pregunta 2 (dinámico)",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Texto de la Respuesta 2 (dinámico)"
          }
        }
        // ... más preguntas y respuestas
      ]
    }
    ```

---

## Esquemas Planeados

A continuación se detallan los schemas cuya implementación está planeada.

### 1. BlogPosting Schema

*   **Tipo:** `BlogPosting` (subtipo de `Article`)
*   **Objetivo:** Describir artículos de blog individuales para mejorar su comprensión por los motores de búsqueda y habilitar Rich Results específicos para artículos.
*   **Ubicación Planeada:** `src/app/blog/[slug]/page.tsx` (a implementar para cada página de detalle de artículo de blog).
*   **Estructura JSON-LD Planeada:**
    ```json
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "URL_CANONICA_DEL_POST_DE_BLOG" // ej. https://vialacteasuenoylactancia.com/blog/mi-post
      },
      "headline": "Título del Post de Blog (dinámico)",
      "description": "Meta descripción del Post de Blog (dinámica)",
      "image": "URL_IMAGEN_DESTACADA_DEL_POST_DE_BLOG (dinámica)",
      "author": {
        "@type": "Person",
        // "@id": "https://vialacteasuenoylactancia.com/#person-miriam-rubio" // Idealmente referenciar por @id
        "name": "Miriam Rubio" // Fallback si Person no tiene @id
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://vialacteasuenoylactancia.com/#organization" // Referenciar por @id
      },
      "datePublished": "FECHA_DE_PUBLICACION_ISO8601 (dinámica)",
      "dateModified": "FECHA_DE_MODIFICACION_ISO8601 (dinámica, o igual a datePublished si no hay mods)"
    }
    ```
*   **Notas de Implementación:**
    *   Asegurar que las URLs (mainEntityOfPage, image) sean absolutas y canónicas.
    *   Para `author`, es preferible referenciar el `@id` del schema `Person` de Miriam Rubio una vez que este lo tenga.
    *   Para `publisher`, referenciar el `@id` del schema `Organization` existente.
    *   Las fechas deben estar en formato ISO 8601.

---

**Fase de Validación y Monitorización (General para todos los Schemas):**

6.  **Validación:**
    *   Después de implementar o modificar cualquier schema y desplegar los cambios (o en un entorno de prueba), usar el **Google Rich Results Test** introduciendo las URLs de las páginas modificadas.
    *   Verificar que Google detecta el schema correctamente y si la página es elegible para Rich Results.
    *   Usar el **Schema Markup Validator** para una validación técnica más detallada del JSON-LD.
    *   **Acción:** Probar URLs clave en ambas herramientas.

7.  **Monitorización:**
    *   Una vez que Google haya rastreado e indexado las páginas actualizadas, revisar los informes en **Google Search Console**.
    *   Buscar secciones como "Mejoras" o informes específicos para "FAQ", "Productos", "Artículos de Blog", etc.
    *   Monitorizar errores o advertencias que Google pueda reportar sobre los datos estructurados.
    *   **Acción:** Revisar GSC periódicamente tras la implementación.

---

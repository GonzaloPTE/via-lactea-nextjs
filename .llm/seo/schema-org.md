# Schema.org

Aquí tienes un plan detallado para implementar Schema.org (datos estructurados) en tu sitio, centrándonos en los tipos más relevantes y beneficiosos para `vialacteasuenoylactancia.com`, utilizando el formato JSON-LD inyectado en el `<head>` o cuerpo de las páginas relevantes.

**Objetivo:** Mejorar la comprensión del sitio por parte de Google y habilitar la aparición de Rich Results (Resultados Enriquecidos) en las búsquedas.

**Herramientas:**
*   **Schema.org:** Para consultar los tipos y propiedades disponibles.
*   **Google Rich Results Test:** Para validar la implementación y previsualizar posibles resultados enriquecidos.
*   **Schema Markup Validator (de Schema.org):** Otra herramienta de validación útil.

---

**Plan de Implementación:**

**Fase 1: Schema Básico (Sitio Completo)**

1.  **Schema `Organization`:**
    *   **Objetivo:** Identificar el sitio como perteneciente a una organización/negocio. Ayuda a construir el Knowledge Panel.
    *   **Tipo:** `Organization` (o `MedicalBusiness` si aplica estrictamente, pero `Organization` es más seguro).
    *   **Ubicación:** `src/app/layout.tsx` (para que aparezca en todas las páginas).
    *   **Implementación:** Añadir un script JSON-LD en el `<body>` o `<head>` del layout.
    *   **Contenido (Ejemplo):**
        ```json
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://vialacteasuenoylactancia.com/#organization", // ID único
          "name": "Vía Láctea - Asesoría de Sueño Infantil y Lactancia",
          "url": "https://vialacteasuenoylactancia.com/",
          "logo": "https://vialacteasuenoylactancia.com/img/via-lactea/logo-principal.png", // URL completa de tu logo
          "sameAs": [ // Enlaces a redes sociales (opcional pero recomendado)
            "https://www.instagram.com/vialacteasuenoylactancia/",
            "https://www.facebook.com/profile.php?id=61575517253913"
            // Añadir otros si existen
          ],
          "contactPoint": { // Opcional
            "@type": "ContactPoint",
            "email": "info@vialacteasuenoylactancia.com", // Tu email de contacto
            "contactType": "Customer Support" // O tipo apropiado
          }
        }
        ```
    *   **Acción:** Editar `src/app/layout.tsx` para incluir este script.

**Fase 2: Schema de Contenido Específico (Página Principal - `app/page.tsx`)**

2.  **Schema `Person`:**
    *   **Objetivo:** Identificar a Miriam Rubio como la persona clave detrás del servicio.
    *   **Tipo:** `Person`
    *   **Ubicación:** Dentro del componente `<ViaLacteaAbout />` o directamente en `app/page.tsx` donde se usa este componente.
    *   **Implementación:** Añadir un script JSON-LD.
    *   **Contenido (Ejemplo):**
        ```json
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Miriam Rubio",
          "jobTitle": "Asesora de Sueño Infantil Respetuoso Certificada, Asesora de Lactancia Certificada, Enfermera", // Combinar títulos
          "knowsAbout": ["Sueño Infantil Respetuoso", "Lactancia Materna", "Enfermería Pediátrica"], // Áreas de expertise
          "worksFor": {
             "@type": "Organization",
             "@id": "https://vialacteasuenoylactancia.com/#organization" // Enlaza a la organización definida antes
          },
          "image": "https://vialacteasuenoylactancia.com/img/via-lactea/photos/perfil-hero.png", // URL de su foto
          "url": "https://vialacteasuenoylactancia.com/", // O URL de la sección "Sobre mí" si existe
          "sameAs": [ // Enlaces personales si los hubiera (LinkedIn, etc.) - Opcional
             // "https://linkedin.com/in/miriamrubio"
          ]
        }
        ```
    *   **Acción:** Identificar dónde se renderiza la información "Sobre mí" y añadir este script JSON-LD allí (probablemente modificando `ViaLacteaAbout.tsx`).

3.  **Schema `FAQPage`:**
    *   **Objetivo:** Marcar la sección de Preguntas Frecuentes para optar a Rich Results de FAQ.
    *   **Tipo:** `FAQPage`
    *   **Ubicación:** Dentro del componente `<ViaLacteaFAQ />` o directamente en `app/page.tsx`.
    *   **Implementación:** Añadir un script JSON-LD. Necesitará acceder a los datos de las FAQs (`viaLacteaFAQList1`).
    *   **Contenido (Ejemplo - requiere generación dinámica):**
        ```json
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            // Mapear sobre viaLacteaFAQList1 para generar esto dinámicamente:
            {
              "@type": "Question",
              "name": "Texto de la Pregunta 1 (item.heading)",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Texto de la Respuesta 1 (item.body)"
              }
            },
            {
              "@type": "Question",
              "name": "Texto de la Pregunta 2 (item.heading)",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Texto de la Respuesta 2 (item.body)"
              }
            }
            // ... más preguntas
          ]
        }
        ```
    *   **Acción:** Modificar `ViaLacteaFAQ.tsx` para generar y renderizar este script JSON-LD basado en los datos de las FAQs.

**Fase 3: Schema de Servicios (Páginas de Servicios)**

4.  **Schema `Service` (Páginas Individuales - `app/servicios/[slug]/page.tsx`):**
    *   **Objetivo:** Describir detalladamente cada servicio ofrecido.
    *   **Tipo:** `Service`
    *   **Ubicación:** En el componente del servidor `app/servicios/[slug]/page.tsx` (o en el componente cliente `ServiceDetailClient` si es más fácil pasar los datos).
    *   **Implementación:** Generar dinámicamente un script JSON-LD basado en los datos del servicio (`service`) obtenidos con `getServiceBySlug`.
    *   **Contenido (Ejemplo - requiere generación dinámica):**
        ```json
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "description": service.longDescription || service.shortDescription, // Usar la descripción más completa
          "url": `https://vialacteasuenoylactancia.com/servicios/${service.slug}`,
          "provider": {
             "@type": "Organization",
             "@id": "https://vialacteasuenoylactancia.com/#organization" // Enlaza a la organización
          },
          "serviceType": "Asesoría de Sueño Infantil Respetuoso", // O "Asesoría de Lactancia", etc. (puede ser dinámico)
          "areaServed": { // Para servicios online
             "@type": "Country",
             "name": "ES" // O "World" si es global, o lista de países
          },
           "offers": { // Opcional pero bueno si tienes precio fijo
             "@type": "Offer",
             "price": service.price.toString(),
             "priceCurrency": "EUR"
           },
           "image": service.heroImageUrl // Opcional
           // Puedes añadir "audience", "serviceOutput", etc. si aplica
        }
        ```
    *   **Acción:** Modificar `app/servicios/[slug]/page.tsx` (o `ServiceDetailClient.tsx`) para generar y renderizar este script basado en los datos del `service`.

5.  **Schema para la página de listado (`app/servicios/page.tsx`):** (Opcional / Menor Prioridad)
    *   **Objetivo:** Indicar que esta página lista los servicios ofrecidos.
    *   **Tipo:** Podría ser `WebPage` con una descripción clara, o usar `ItemList` para listar los servicios (aunque puede ser redundante si las páginas individuales ya están marcadas). Otra opción es `OfferCatalog`.
    *   **Implementación:** Por simplicidad inicial, podríamos omitir un schema específico aquí y confiar en que Google entienda que es una página que lista servicios ofrecidos por la `Organization` ya definida. Si se desea, se puede añadir un `ItemList` simple.
    *   **Acción:** Considerar más adelante si es necesario. Enfocarse primero en las páginas individuales.

**Fase 4: Validación y Monitorización**

6.  **Validación:**
    *   Después de implementar cada tipo de schema y desplegar los cambios (o en un entorno de prueba), usar el **Google Rich Results Test** introduciendo las URLs de las páginas modificadas (la principal, una página de servicio, la página de FAQ).
    *   Verificar que Google detecta el schema correctamente y si la página es elegible para Rich Results (especialmente para FAQPage).
    *   Usar el **Schema Markup Validator** para una validación técnica más detallada del JSON-LD.
    *   **Acción:** Probar URLs clave en ambas herramientas.

7.  **Monitorización:**
    *   Una vez que Google haya rastreado e indexado las páginas actualizadas, revisar los informes en **Google Search Console**.
    *   Buscar secciones como "Mejoras" o informes específicos para "FAQ", "Productos" (a veces los servicios caen aquí), etc.
    *   Monitorizar errores o advertencias que Google pueda reportar sobre los datos estructurados.
    *   **Acción:** Revisar GSC periódicamente tras la implementación.

---

Este plan prioriza los tipos de schema con mayor impacto potencial (Organization, Person, FAQ, Service individual). Se implementa usando JSON-LD, el método preferido por Google, y se integra con la estructura de tu aplicación Next.js.

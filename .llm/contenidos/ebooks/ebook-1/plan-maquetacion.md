# Plan de Maquetación: Ebook "Dulces Sueños" (Markdown a PDF con Pandoc y WeasyPrint)

Este plan detalla los pasos para convertir los archivos Markdown del ebook "Dulces Sueños: Guía Práctica para un Descanso Infantil Respetuoso" a un formato PDF con diseño profesional, utilizando Pandoc para la conversión inicial a HTML y WeasyPrint (o PrinceXML) para la generación final del PDF con estilos CSS.

**Objetivo Principal:** Producir un PDF visualmente atractivo, coherente con la marca "Vía Láctea Sueño y Lactancia", fácil de leer y listo para ser utilizado como lead magnet.

**Herramientas Principales:**
*   **Pandoc:** Para convertir Markdown a HTML.
*   **WeasyPrint:** (Alternativa: PrinceXML) Para convertir HTML+CSS a PDF.
*   **Editor de Texto/Código:** Para editar archivos HTML, CSS y Markdown.

## Fases del Proyecto:

### Fase 1: Preparación y Configuración

1.  **Instalación de Software:**
    *   Asegurarse de tener **Pandoc** instalado y funcionando. (Ver [https://pandoc.org/installing.html](https://pandoc.org/installing.html))
    *   Instalar **WeasyPrint**. (Ver [https://weasyprint.org/start/](https://weasyprint.org/start/))
        *   *(Alternativa: Si se opta por PrinceXML, instalarlo desde [https://www.princexml.com/download/](https://www.princexml.com/download/))*
2.  **Consolidación del Contenido Markdown:**
    *   Crear un único archivo `ebook_completo.md`.
    *   Combinar todos los archivos de contenido del ebook en este archivo, en el siguiente orden:
        1.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/portada.md`
        2.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/indice.md` (Este contenido se usará como base, pero el índice final idealmente será generado por Pandoc).
        3.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/introduccion.md` (El contenido de la introducción real, después del texto de portada e índice).
        4.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/capitulo-1.md`
        5.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/capitulo-2.md`
        6.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/capitulo-3.md`
        7.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/capitulo-4.md`
        8.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/capitulo-5.md`
        9.  `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/conclusion.md`
        10. `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/capitulos/recursos-adicionales.md`
    *   Revisar `ebook_completo.md` para asegurar que la sintaxis Markdown es correcta y que los saltos entre secciones son claros.
3.  **Preparación de Imágenes:**
    *   Confirmar la ubicación de las imágenes disponibles en `public/img/via-lactea/photos/blog/`.
    *   Durante el proceso de diseño, se seleccionarán imágenes específicas para cada placeholder.

### Fase 2: Conversión Inicial y Estructura HTML

1.  **Conversión de Markdown a HTML con Pandoc:**
    *   Ejecutar el siguiente comando en la terminal (desde el directorio raíz del proyecto o donde se encuentre `ebook_completo.md`):
        ```bash
        pandoc via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/ebook_completo.md -s --toc --metadata title="Dulces Sueños: Guía Práctica para un Descanso Infantil Respetuoso" -o via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/ebook_maquetacion.html
        ```
        *   `-s` (o `--standalone`): Crea un archivo HTML completo con `<head>` y `<body>`.
        *   `--toc` (o `--table-of-contents`): Intenta generar una tabla de contenidos.
        *   `--metadata title="..."`: Establece el título del documento HTML.
        *   `-o .../ebook_maquetacion.html`: Especifica el archivo de salida.
2.  **Revisión Inicial del HTML:**
    *   Abrir `ebook_maquetacion.html` en un navegador para revisar la estructura básica.
    *   Identificar las secciones principales (portada, índice, introducción, capítulos, etc.).
    *   Pandoc asignará IDs a los encabezados, útiles para el CSS y la navegación.

### Fase 3: Diseño y Estilizado con CSS

1.  **Creación del Archivo CSS:**
    *   Crear un archivo `via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/estilos_ebook.css`.
    *   Enlazar este archivo CSS en la sección `<head>` de `ebook_maquetacion.html`:
        ```html
        <link rel="stylesheet" href="estilos_ebook.css">
        ```
2.  **Definición de Estilos (en `estilos_ebook.css`):**
    *   **Generales:**
        *   `@charset "UTF-8";`
        *   `@page { size: A4; margin: 2cm; }` (Define tamaño de página y márgenes base para WeasyPrint).
        *   `body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }` (Usar fuentes de marca si están disponibles y son web-safe o se pueden embeber).
    *   **Portada:**
        *   Estilos específicos para `#title`, `#subtitle`, `#author` (si Pandoc los genera o si se añaden `divs` específicos).
        *   Ejemplo para imagen de portada (se requerirá un `div` específico en el HTML):
            ```css
            .portada-container { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; /* O altura de página A4 en cm/mm */
                text-align: center; 
            }
            .portada-imagen { 
                background-image: url('../../../public/img/via-lactea/photos/blog/lindo-bebe-durmiendo.jpg'); /* Ajustar ruta */
                background-size: cover;
                background-position: center;
                width: 100%; 
                height: 200mm; /* Ejemplo de altura */
            }
            /* ... más estilos para el texto de portada ... */
            ```
    *   **Índice (`#TOC`):**
        *   `#TOC ul { list-style-type: none; padding-left: 0; }`
        *   `#TOC li a { text-decoration: none; color: #555; }`
        *   `#TOC li { margin-bottom: 0.5em; }`
    *   **Encabezados (`h1`, `h2`, `h3`):**
        *   Definir familia de fuentes, tamaños, colores, márgenes.
        *   Ejemplo: `h1 { font-size: 2.5em; color: #2c3e50; margin-top: 1.5em; page-break-before: always; }` (Salto de página antes de cada capítulo principal).
    *   **Párrafos (`p`):**
        *   Ajustar `margin-bottom`, `text-align: justify;` (si se desea).
    *   **Listas (`ul`, `ol`):**
        *   Márgenes, padding, tipo de marcador.
    *   **Tablas (`table`, `th`, `td`):**
        *   Bordes, padding, alineación para la tabla de necesidades de sueño.
    *   **Placeholders de Ilustraciones:**
        *   En `ebook_maquetacion.html`, reemplazar los textos `[PLACEHOLDER PARA ILUSTRACIÓN...]` por `divs` con una clase, o directamente por `img` tags con `src` apuntando a imágenes de ejemplo.
        *   Ejemplo en HTML:
            ```html
            <div class="ilustracion-container">
                <img src="../../../public/img/via-lactea/photos/blog/vista-superior-lindo-bebe-peluche_23-2150573668.jpg" alt="Ilustración: Esquema ciclo de sueño" class="ilustracion-ebook">
                <p class="prompt-ilustracion"><em>Prompt: Esquema muy simplificado y visual de un ciclo de sueño de bebé...</em></p>
            </div>
            ```
        *   Ejemplo en CSS:
            ```css
            .ilustracion-ebook { 
                max-width: 80%; 
                display: block; 
                margin: 1.5em auto; 
                border: 1px solid #eee; 
            }
            .ilustracion-container { text-align: center; }
            .prompt-ilustracion { font-size: 0.9em; color: #777; margin-top: 0.5em; }
            ```
        *   Asignar diferentes imágenes de `public/img/via-lactea/photos/blog/` a diferentes placeholders para variar. Por ejemplo:
            *   Ciclo de sueño (Cap 1): `vista-superior-lindo-bebe-peluche_23-2150573668.jpg`
            *   Entorno seguro (Cap 2): `padres-durmiendo-bebe.jpg`
            *   Bienestar padres (Cap 5): `madre-cansada-bebe-durmiendo.jpg`
            *   Conclusión / Recursos: `mano-acercandose-al-pequeno-bebe_23-2148341998.jpg`
    *   **Encabezados y Pies de Página (CSS para Paginación con WeasyPrint):**
        *   Referirse a la documentación de WeasyPrint sobre `@page` para contenido en márgenes.
        *   Ejemplo para números de página:
            ```css
            @page {
                @bottom-center {
                    content: counter(page);
                    font-size: 0.8em;
                    color: #666;
                }
            }
            @page :first { /* Para no tener número en la portada */
                @bottom-center { content: normal; }
            }
            ```
3.  **Ajustes del HTML (si es necesario):**
    *   Después de la conversión inicial, puede ser necesario editar `ebook_maquetacion.html` para añadir `divs` contenedores con clases específicas si la estructura generada por Pandoc no es suficiente para el CSS deseado (ej. para la portada, secciones especiales).
    *   Mover el contenido de `portada.md` y `indice.md` a secciones estructuralmente adecuadas si Pandoc no lo maneja como se espera. La portada debería ser la primera página, seguida por el índice generado.

### Fase 4: Generación del PDF y Refinamiento

1.  **Generación del PDF con WeasyPrint:**
    *   Ejecutar el siguiente comando en la terminal:
        ```bash
        weasyprint via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/ebook_maquetacion.html via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/Dulces_Suenos_Ebook_v1.pdf -s via-lactea-nextjs/.llm/contenidos/ebooks/ebook-1/estilos_ebook.css
        ```
        *   `-s estilos_ebook.css`: especifica la hoja de estilos a aplicar.
2.  **Revisión y Ajuste Iterativo:**
    *   Abrir `Dulces_Suenos_Ebook_v1.pdf` y revisar cuidadosamente:
        *   Apariencia general, fuentes, colores.
        *   Legibilidad.
        *   Colocación y tamaño de imágenes.
        *   Funcionamiento del índice.
        *   Saltos de página entre capítulos.
        *   Márgenes, encabezados y pies de página.
        *   Formato de tablas y listas.
    *   Modificar `estilos_ebook.css` (y `ebook_maquetacion.html` si es necesario) para corregir problemas.
    *   Regenerar el PDF y repetir el proceso hasta que el resultado sea satisfactorio.
    *   Prestar atención a "viudas" y "huérfanos" (líneas sueltas al inicio o final de página) y ajustar márgenes o espaciado si es necesario.

### Fase 5: Finalización

1.  **Revisión Final del PDF:**
    *   Una última lectura completa del PDF generado.
    *   Comprobar todos los enlaces internos (índice) y externos.
2.  **Metadatos del PDF (Opcional pero Recomendado):**
    *   Investigar cómo Pandoc o herramientas de edición de PDF pueden añadir metadatos como Autor ("Miriam Rubio, Vía Láctea Sueño y Lactancia"), Título, Asunto, Palabras Clave.
3.  **Consideraciones de Accesibilidad:**
    *   Aunque WeasyPrint intenta generar PDFs etiquetados (Tagged PDF), para una accesibilidad óptima, se podrían necesitar herramientas adicionales o una revisión más profunda. Por ahora, centrarse en una estructura semántica clara en HTML.

**Cronograma Estimado (Ejemplo):**
*   Fase 1 (Preparación): 1-2 horas
*   Fase 2 (Conversión HTML): 0.5 horas
*   Fase 3 (Diseño CSS - versión inicial): 4-8 horas (dependiendo de la complejidad del diseño y familiaridad con CSS)
*   Fase 4 (Generación PDF y Refinamiento): 3-6 horas (varias iteraciones)
*   Fase 5 (Finalización): 1-2 horas

Este plan proporciona una hoja de ruta. La clave será la iteración entre la edición de CSS/HTML y la generación/revisión del PDF.
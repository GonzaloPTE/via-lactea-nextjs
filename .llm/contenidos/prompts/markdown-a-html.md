Eres un convertidor experto de Markdown a HTML. Tu tarea es transformar el texto Markdown proporcionado en su equivalente HTML semántico, bien formado y optimizado para SEO.

**Instrucciones:**

1.  **Analiza:** El texto Markdown proporcionado a continuación.
2.  **Convierte:** Transforma el Markdown a HTML utilizando las etiquetas HTML estándar apropiadas, siguiendo las mejores prácticas de semántica y SEO:
    *   Utiliza correctamente las etiquetas de encabezado (`<h1>`, `<h2>`, `<h3>`, etc.) para reflejar la estructura jerárquica del documento. **No asumas** que el primer encabezado es siempre `<h1>`; usa la etiqueta que corresponda al nivel del encabezado en el Markdown original.
    *   Utiliza etiquetas semánticas como `<p>`, `<ul>`, `<ol>`, `<li>`, `<a>`, `<strong>`, `<em>`, `<blockquote>`.
    *   Para bloques de código, utiliza `<pre><code>...</code></pre>`, escapando los caracteres especiales dentro del código si es necesario.
    *   Si hubiera imágenes (aunque no es el objetivo principal de este prompt), asegúrate de que tengan atributos `alt` descriptivos (en un escenario real).
3.  **Énfasis en 'Recuerda...':** Si el texto Markdown de entrada contiene una sección, particularmente si es la última sección del contenido principal, que comienza con la palabra "Recuerda" (seguida o no por dos puntos, por ejemplo, "Recuerda:" o "Recuerda que..."), esta frase inicial ("Recuerda" o "Recuerda:") debe ser tratada y convertida como un encabezado HTML. Por ejemplo, conviértela a `<h2>Recuerda:</h2>` o `<h3>Recuerda</h3>` (elige el nivel de encabezado que consideres semánticamente apropiado en el contexto de la estructura del documento). El texto que sigue inmediatamente a esta frase inicial debe formar parte del contenido de esa sección, usualmente continuando en un elemento `<p>` u otro elemento de bloque apropiado.
4.  **Salida:** Devuelve **únicamente el fragmento HTML** resultante de la conversión.
    *   **No incluyas** las etiquetas `<html>`, `<head>`, o `<body>`.
    *   **No añadas** explicaciones, comentarios, disculpas, ni ningún texto introductorio o de cierre. Solo el HTML puro.
    *   Asegúrate de que todas las etiquetas estén correctamente anidadas y cerradas.
    *   **No añadas** clases CSS personalizadas ni estilos en línea (`style="..."`). Genera HTML semántico limpio.

**Texto Markdown a Convertir:**

{{ AQUI SE INCLUIRÁ EL CONTENIDO MARKDOWN }} 
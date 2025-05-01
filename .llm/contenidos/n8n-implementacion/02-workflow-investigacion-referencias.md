# Workflow 2: Investigación, Preprocesamiento y Almacenamiento de Referencias

**Objetivo:** Dado un conjunto de temas/preguntas, generar consultas de búsqueda, buscar referencias web relevantes, verificar duplicados, preprocesar las nuevas referencias (determinar relevancia, extraer snippets, etiquetas, resumen) y almacenarlas en la tabla `references` de Supabase.

**Disparador (Trigger):**

*   `Manual Trigger` ("Iniciar Manualmente"): Iniciar manualmente.

**Pasos / Nodos:**

1.  **`Set` (Nodo "Definir Temas"):**
    *   **Propósito:** Definir la(s) pregunta(s) o tema(s) inicial(es) a investigar.
    *   **Configuración:** Campo `tema_investigacion` (probablemente un array de strings).
    *   **Output:** JSON con `tema_investigacion`.

2.  **`ChainLlm` (Nodo "Generador de queries (LLM)"):**
    *   **Propósito:** Crear consultas de búsqueda optimizadas para Google basadas en los temas definidos.
    *   **Input:** `{{ $('Definir Temas').item.json.tema_investigacion }}`.
    *   **Chat Model:** `Google Gemini Chat Model`.
    *   **Prompt:** Instruye al LLM para generar 3 consultas relevantes y devolverlas en formato JSON `{"queries": [...]}`.
    *   **Output:** JSON con la clave `queries` conteniendo una lista de strings de consulta.

3.  **`Code` (Nodo "Parsear Respuesta Queries"):**
    *   **Propósito:** Extraer la lista de queries del JSON devuelto por el LLM y construir una query compleja si es necesario (actualmente no se usa la compleja).
    *   **Input:** Texto JSON del nodo "Generador de queries (LLM)".
    *   **Output:** Objeto JSON con la lista `queries` y `complexQuery`.

4.  **`HttpRequest` (Nodo "Buscar en Google"):**
    *   **Propósito:** Ejecutar una búsqueda en Google Custom Search usando la primera query generada.
    *   **Input:** `{{ $json.queries[0] }}` del nodo "Parsear Respuesta Queries".
    *   **Configuración:** URL de Google Custom Search API, API Key, CX ID, query (`q`), número de resultados (`num`).
    *   **Output:** Respuesta de la API de Google Search, incluyendo una lista `items` con los resultados.

5.  **`SplitOut` (Nodo "Obtener resultados"):**
    *   **Propósito:** Separar cada resultado de búsqueda en un item individual.
    *   **Input:** Campo `items` de la respuesta del nodo "Buscar en Google".
    *   **Output:** Items individuales, cada uno representando un resultado de búsqueda (con `link`, `title`, `snippet`, etc.).

6.  **`SplitInBatches` (Nodo "Iterar por cada resultado"):**
    *   **Propósito:** Procesar cada resultado de búsqueda individualmente (inicio del bucle).
    *   **Input:** Items individuales del nodo "Obtener resultados".
    *   **Configuración:** Tamaño de lote 1.

7.  **`Supabase` (Nodo "Verificar Duplicado (Supabase)"):**
    *   **Propósito:** Comprobar si la URL (`link`) del resultado de búsqueda actual ya existe en la tabla `references`.
    *   **Input:** `{{ $json.link }}` del item actual en el bucle.
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `getAll` (equivalente a SELECT).
        *   Tabla: `references`.
        *   Filtros: Filtrar por `url` igual a `{{ $json.link }}`.
        *   Límite: 1.
    *   **Output:** Lista con un item si la URL existe, lista vacía si no existe.

8.  **`IF` (Nodo "¿Es Nueva Referencia?"):**
    *   **Propósito:** Dirigir el flujo basado en si la referencia es nueva o un duplicado.
    *   **Input:** Salida del nodo "Verificar Duplicado (Supabase)".
    *   **Condición:** Comprobar si el resultado `isNotEmpty()` (es decir, si la lista *no* está vacía).
    *   **Output:**
        *   **True:** La URL ya existe (duplicado) -> Se dirige de nuevo al nodo "Iterar por cada resultado" para pasar al siguiente item (rama superior en el editor).
        *   **False:** La URL es nueva (la lista estaba vacía) -> Proceder a preprocesamiento (rama inferior en el editor).

9.  **`HttpRequest` (Nodo "Obtener Contenido Web") - _Sólo en la rama FALSE del IF_:**
    *   **Propósito:** Descargar el contenido HTML de la URL de la nueva referencia.
    *   **Input:** `{{ $('Iterar por cada resultado').item.json.link }}`.
    *   **Configuración:** `continueOnFail: true` para manejar errores si no se puede obtener la página.
    *   **Output:** Contenido HTML de la página (o error).

10. **`ChainLlm` (Nodo "Preprocesador de Referencia (LLM)") - _Sólo en la rama FALSE del IF_:**
    *   **Propósito:** Analizar el contenido HTML y extraer información clave basada en los temas originales.
    *   **Input:**
        *   Contenido HTML (`{{ $json.data }}` del nodo "Obtener Contenido Web").
        *   Temas originales (`{{ $('Definir Temas').item.json.tema_investigacion }}`).
        *   URL (`{{ $('Iterar por cada resultado').item.json.link }}`).
    *   **Chat Model:** `Google Gemini Chat Model`.
    *   **Prompt:** Instruye al modelo para:
        *   Leer el contenido HTML.
        *   Determinar la relevancia (`is_relevant`: boolean) respecto a `tema_investigacion`.
        *   Si es relevante, extraer `extracts` (array de strings JSON), `tags` (array de strings) y `summary` (string de texto).
        *   Si no es relevante, devolver arrays vacíos y string vacío para `extracts`, `tags` y `summary`.
        *   Devolver **únicamente** un objeto JSON con las claves `is_relevant`, `extracts`, `tags`, `summary`.
    *   **Configuración:** `onError: continueRegularOutput`.
    *   **Output:** Texto JSON con la estructura definida en el prompt.

11. **`Code` (Nodo "Parsear Respuesta Preprocesador") - _Sólo en la rama FALSE del IF_:**
    *   **Propósito:** Parsear la respuesta JSON del LLM preprocesador.
    *   **Input:** Texto JSON del nodo "Preprocesador de Referencia (LLM)".
    *   **Lógica:** Intenta parsear el JSON. Si `is_relevant` es `true`, devuelve el objeto parseado. Si es `false` o hay un error de parseo, devuelve un objeto vacío `{}` (esto podría necesitar ajustes si el nodo siguiente espera campos específicos).
    *   **Output:** Objeto JSON con los datos preprocesados (si es relevante) o `{}`.

12. **`Supabase` (Nodo "Guardar Referencia Preprocesada (Supabase)") - _Sólo en la rama FALSE del IF_:**
    *   **Propósito:** Insertar la nueva referencia con sus datos preprocesados en la base de datos.
    *   **Input:**
        *   Datos originales del bucle: `link`, `title`.
        *   Tema original: `tema_investigacion` del nodo "Definir Temas".
        *   Datos preprocesados: `is_relevant`, `extracts`, `tags`, `summary` del nodo "Parsear Respuesta Preprocesador".
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `Insert`.
        *   Tabla: `references`.
        *   Columnas: Mapear los inputs a las columnas de la tabla:
            *   `url` <- `link`
            *   `title` <- `title`
            *   `related_issues` <- `tema_investigacion`
            *   `is_relevant` <- `is_relevant`
            *   `extracts` <- `extracts`
            *   `tags` <- `tags`
            *   `summary` <- `summary`
    *   **Output:** Resultado de la inserción.

13. **Fin del Bucle:** El flujo desde "Guardar Referencia Preprocesada" (o desde la rama TRUE del IF) regresa al nodo "Iterar por cada resultado" para procesar el siguiente item de búsqueda.

**Consideraciones Adicionales:**

*   **Tabla Supabase (`references`):** Asegúrate de que la tabla en Supabase exista y tenga las columnas definidas en el DDL final: `id` (BIGSERIAL PK), `url` (TEXT UNIQUE NOT NULL), `title` (TEXT), `related_issues` (TEXT[]), `is_relevant` (BOOLEAN), `extracts` (JSONB), `tags` (TEXT[]), `summary` (TEXT), `created_at` (TIMESTAMPTZ).
*   **Obtención de Contenido Web:** El paso 9 ("Obtener Contenido Web") es clave y puede fallar (paywalls, bloqueos, JS dinámico). La opción `continueOnFail` permite que el workflow siga, pero el LLM en el paso 10 recibirá "Contenido no disponible", resultando probablemente en `is_relevant: false`.
*   **Coste:** Este workflow implica llamadas a API:
    *   1 llamada LLM para generar queries (por ejecución).
    *   1 llamada a Google Custom Search API (por ejecución).
    *   1 llamada HTTP para obtener contenido web (por cada *nueva* referencia).
    *   1 llamada LLM para preprocesar (por cada *nueva* referencia con contenido web obtenido).
    *   Llamadas a Supabase (varias por referencia).
*   **Manejo de Errores:** Se ha configurado `continueOnFail` para obtener contenido web y `onError: continueRegularOutput` para el LLM preprocesador. El nodo "Parsear Respuesta Preprocesador" intenta manejar errores de parseo. Se podrían añadir más mecanismos de control si es necesario.
*   **Dependencias:** Necesitas credenciales válidas para Supabase, Google Cloud (para Gemini y Google Search API).


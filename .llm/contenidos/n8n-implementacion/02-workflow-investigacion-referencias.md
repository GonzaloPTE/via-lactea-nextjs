# Workflow 2: Investigación, Preprocesamiento y Almacenamiento de Referencias

**Objetivo:** Identificar un tema/pregunta, buscar referencias relevantes, **verificar duplicados**, **preprocesar las nuevas referencias** (extraer snippets, etiquetas) y almacenarlas en Supabase.

**Disparador (Trigger):**

*   `Manual Trigger`: Iniciar manualmente con un tema/pregunta.
*   *Alternativa Futura:* `Schedule Trigger` + Nodos para identificar temas automáticamente.

**Pasos / Nodos:**

1.  **`Set` (Nodo "Definir Tema"):**
    *   **Propósito:** Introducir manualmente la pregunta o tema a investigar.
    *   **Configuración:** Campo de texto `tema_investigacion`.
    *   **Output:** JSON con `tema_investigacion`.

2.  **`AI Agent` (Nodo "Buscador de Referencias"):**
    *   **Propósito:** Encontrar URLs relevantes sobre el tema.
    *   **Input:** `{{ $json.tema_investigacion }}`.
    *   **Herramientas (Tools):** Necesita herramienta de búsqueda web (integración n8n o API vía `HTTP Request`).
    *   **Chat Model:** Conectar modelo (OpenAI, Claude, etc.).
    *   **Prompt:** Realizar búsquedas, priorizar fuentes fiables, extraer 5-10 URLs más relevantes (y opcionalmente título/snippet inicial).
    *   **Output:** Lista de objetos JSON con al menos `url` (y opcionalmente `title`, `snippet_inicial`).

3.  **`SplitInBatches` (Nodo "Iterar Referencias Encontradas"):**
    *   **Propósito:** Procesar cada referencia encontrada individualmente.
    *   **Input:** Lista de referencias del `AI Agent`.
    *   **Configuración:** Tamaño de lote 1.

4.  **`Supabase` (Nodo "Verificar Duplicado"):**
    *   **Propósito:** Comprobar si la URL de la referencia actual ya existe en la base de datos.
    *   **Input:** URL de la referencia actual (`{{ $json.url }}`).
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `Select`.
        *   Tabla: `referencias`.
        *   Columnas: `id` (o cualquier columna para confirmar existencia).
        *   Filtros: Filtrar por `url` igual a `{{ $json.url }}`.
        *   Límite: 1.
    *   **Output:** Lista vacía si no existe, o lista con un item si existe.

5.  **`IF` (Nodo "¿Es Nueva Referencia?"):**
    *   **Propósito:** Dirigir el flujo basado en si la referencia es nueva.
    *   **Input:** Salida del nodo "Verificar Duplicado".
    *   **Condición:** Comprobar si la longitud de la lista es 0 (`{{ $json.length === 0 }}`).
    *   **Output:**
        *   **True:** La referencia es nueva -> Proceder a preprocesamiento.
        *   **False:** La referencia ya existe -> Opcional: Registrar/ignorar, detener rama.

6.  **`AI Agent` (Nodo "Preprocesador de Referencia") - _Sólo en la rama TRUE del IF_:**
    *   **Propósito:** Extraer información clave del *contenido* de la nueva referencia.
    *   **Input:**
        *   URL de la referencia nueva (`{{ $json.url }}` del nodo `SplitInBatches`).
        *   Tema original (`{{ $node['Definir Tema'].json.tema_investigacion }}`).
    *   **Herramientas (Tools):** Necesita herramienta para **obtener el contenido web** de la URL (ej. scraping vía `HTTP Request` o herramienta específica). ¡Esto es crucial!
    *   **Chat Model:** Conectar modelo.
    *   **Prompt:** Instruir al modelo para:
        *   Acceder y leer el contenido principal de la URL proporcionada.
        *   Identificar y extraer 3-5 **extractos literales clave** relevantes para `tema_investigacion`.
        *   Sugerir 3-7 **etiquetas (tags)** relevantes para clasificar esta referencia.
        *   Asociar la referencia explícitamente con `tema_investigacion`.
        *   *Opcional:* Extraer Preguntas/Respuestas si están claramente estructuradas en el texto.
    *   **Output:** JSON con `extractos` (lista de strings), `tags` (lista de strings), `tema_asociado` (`tema_investigacion`).

7.  **`Supabase` (Nodo "Guardar Referencia Preprocesada") - _Sólo en la rama TRUE del IF, después del Preprocesador_:**
    *   **Propósito:** Insertar la nueva referencia con sus datos preprocesados.
    *   **Input:**
        *   Datos originales: URL, Título (si se obtuvo antes) del nodo `SplitInBatches`.
        *   Datos preprocesados: `extractos`, `tags`, `tema_asociado` del nodo "Preprocesador".
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `Insert`.
        *   Tabla: `referencias`.
        *   Columnas: Mapear los datos a las columnas `url`, `title`, `extractos` (puede ser tipo JSONB o Text[] en Supabase), `tags` (Text[]), `tema_asociado`, `estado` ('procesada'), `fecha_creacion`.
    *   **Output:** Resultado de la inserción.

8.  **(Opcional) Nodo de Notificación Final:**
    *   **Propósito:** Notificar al final del workflow completo (después del `SplitInBatches`) cuántas referencias nuevas se procesaron para el tema.

**Consideraciones Adicionales:**

*   **Tabla Supabase:** La tabla `referencias` necesitará columnas para `extractos` y `tags` (por ejemplo, `TEXT[]` o `JSONB` son buenas opciones en PostgreSQL/Supabase).
*   **Herramienta de Scraping:** El paso 6 es el más complejo técnicamente, ya que requiere obtener el contenido web. Esto puede fallar (paywalls, bloqueos de scraping, contenido dinámico). Hay que manejar errores aquí (ej. usando la opción "Continue on Fail" en el nodo `AI Agent` o en el nodo que haga el scraping, y guardando la referencia con estado 'error_procesamiento').
*   **Coste:** El paso 6 (preprocesamiento) implica una llamada adicional al LLM y potencialmente una herramienta de scraping por *cada nueva* referencia, aumentando el coste y tiempo de ejecución del workflow.

Este workflow es ahora mucho más completo y robusto, abordando la duplicidad y el preprocesamiento como solicitaste.

**Consideraciones Supabase:**

*   Necesitarás configurar una tabla en tu proyecto Supabase (ej. `referencias`) con las columnas adecuadas (`id`, `url`, `title`, `snippet`, `extractos` (JSONB o TEXT[]), `tags` (TEXT[]), `tema_asociado`, `estado`, `fecha_creacion`, etc.).
*   Obtener las credenciales de API de Supabase (URL del proyecto y `anon key` o `service_role key` según los permisos necesarios) para configurar el nodo `Supabase` en n8n. 
# Workflow 4: Redacción del Borrador del Blog

**Objetivo:** Generar un borrador de blog post basado en un tema y las referencias previamente recopiladas en Supabase.

**Disparador (Trigger):**

*   `Manual Trigger`: Iniciar manualmente seleccionando un tema cuya investigación ya se completó.
*   *Alternativa Futura:* Un trigger que se active automáticamente al finalizar el Workflow 1 (ej. usando `Execute Workflow` al final del Workflow 1, o un webhook si se notifica de alguna manera).

**Pasos / Nodos:**

1.  **`Set` (Nodo "Definir Tema a Redactar"):**
    *   **Propósito:** Especificar el tema para el cual se generará el borrador.
    *   **Configuración:** Campo de texto `tema_redaccion`. Este debe coincidir con el `tema_asociado` guardado en Supabase.
    *   **Output:** JSON con `tema_redaccion`.

2.  **`Supabase` (Nodo "Obtener Referencias"):**
    *   **Propósito:** Recuperar las referencias guardadas para el tema especificado.
    *   **Input:** `{{ $json.tema_redaccion }}`.
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `Select`.
        *   Tabla: `referencias`.
        *   Columnas: Seleccionar las columnas necesarias (ej. `url`, `title`, `snippet`).
        *   Filtros (Filters): Filtrar por la columna `tema_asociado` igual a `{{ $json.tema_redaccion }}`.
        *   *Opcional:* Limitar el número de referencias a usar (ej. `limit` = 10).
    *   **Output:** Una lista de objetos JSON, cada uno representando una referencia.

3.  **`Edit Fields` o `Item Lists` (Nodo "Formatear Referencias para Prompt"):**
    *   **Propósito:** Convertir la lista de referencias JSON en un formato de texto simple que el LLM pueda entender fácilmente dentro del prompt.
    *   **Input:** La lista de referencias del nodo `Supabase`.
    *   **Configuración:** Iterar sobre la lista y crear un string formateado, por ejemplo:
        ```
        Referencia 1:
        Título: [Título de la referencia 1]
        URL: [URL de la referencia 1]
        Snippet: [Snippet de la referencia 1]

        Referencia 2:
        Título: [Título de la referencia 2]
        URL: [URL de la referencia 2]
        Snippet: [Snippet de la referencia 2]
        ...
        ```
    *   **Output:** JSON con un campo `referencias_texto` conteniendo el string formateado.

4.  **`AI Agent` (Nodo "Redactor de Blog con Referencias"):**
    *   **Propósito:** Generar el borrador del artículo, utilizando las referencias.
    *   **Input:**
        *   `{{ $node["Definir Tema a Redactar"].json.tema_redaccion }}`
        *   `{{ $node["Formatear Referencias para Prompt"].json.referencias_texto }}`
    *   **Chat Model:** Conectar un modelo de lenguaje.
    *   **Prompt:** Diseñar un prompt claro que instruya al modelo a:
        *   Escribir un borrador de artículo de blog detallado y bien estructurado sobre el `tema_redaccion`.
        *   **Utilizar la información de las `referencias_texto` proporcionadas como base principal para las afirmaciones.**
        *   **Citar las fuentes:** Indicar claramente de dónde proviene la información, haciendo referencia a las URLs o Títulos proporcionados. (Ej. "Según [Título Referencia X] ([URL Referencia X]), ..." o usar notas al pie/sección de bibliografía).
        *   Adoptar el tono y estilo de Vía Láctea.
        *   Optimizar para SEO.
        *   Incluir sugerencia de meta título y meta descripción.
        *   Formato de salida: Markdown.
    *   **Output:** Texto del borrador en formato Markdown, meta título y meta descripción sugeridos.

5.  **`Set` (Nodo "Preparar Notificación de Borrador"):**
    *   **Propósito:** Formatear los datos para la notificación de revisión.
    *   **Input:** Salida del nodo `AI Agent`.
    *   **Configuración:** Similar al Workflow 1, preparar asunto, cuerpo, etc.
    *   **Output:** JSON listo para la notificación.

6.  **Nodo de Notificación (Elegir uno):**
    *   **`Email` / `Discord` / `Airtable` / `Google Sheets` etc.**
    *   **Propósito:** Alertar al humano de que hay un borrador (basado en referencias) listo para revisar y aprobar.

**Punto de Control Humano:** El workflow termina aquí. El humano revisa el borrador, verifica el uso correcto de las citas y la calidad general antes de publicar. 
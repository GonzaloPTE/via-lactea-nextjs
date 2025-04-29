# Workflow 1: Elicitación, Procesamiento y Almacenamiento de Issues

**Objetivo:** Monitorizar Reddit, extraer hilos y sus issues, traducir los issues al español y almacenarlos de forma individualizada en Supabase para su posterior análisis y priorización.

**Disparador (Trigger):**

*   `Schedule Trigger`: Ejecutar periódicamente (ej. diariamente, semanalmente).
*   `Manual Trigger`: Para ejecuciones bajo demanda.

**Pasos / Nodos:**

1.  **`AI Agent` (Nodo "Buscador Reddit"):**
    *   Propósito: Buscar hilos/posts relevantes y extraer metadatos y issues.
    *   Herramientas (Tools): `Reddit`.
    *   Chat Model: Conectar modelo.
    *   Prompt: `prompts/elicitacion-temas-reddit-prompt.md`.
    *   Output: Objeto JSON principal con `status` y `results` (lista de hilos con metadatos y lista `issues`).

2.  **`IF` (Nodo "¿Agente Completado?"):**
    *   Propósito: Verificar que el agente terminó.
    *   Condición: `{{ $json.status === "completed" }}`.
    *   Output:
        *   True: Continuar.
        *   False: Detener/Error.

3.  **`SplitInBatches` (Nodo "Iterar Hilos") - _Sólo en la rama TRUE del IF_:**
    *   Propósito: Procesar cada hilo de Reddit encontrado.
    *   Input: El array `results` de la salida del "Buscador Reddit" (Ej: `{{ $node["Buscador Reddit"].json.results }}`).
    *   Configuración: Tamaño de lote 1.

4.  **`Supabase` (Nodo "Guardar Hilo Reddit") - _Dentro del loop de Hilos_:**
    *   Propósito: Insertar los metadatos del hilo actual en `reddit_discovered_threads`.
    *   Input: Datos del hilo actual (subreddit, title, title_es, url, score, comments, created_utc).
    *   Configuración:
        *   Operación: `Insert`.
        *   Tabla: `reddit_discovered_threads`.
        *   Columnas: Mapear inputs. Importante: **Seleccionar `id` en "Columns to Return"**.
        *   Manejo de Conflictos (Upsert): Opcional, se podría hacer `Upsert` en `thread_url` para manejar casos donde el agente devuelva un hilo ya existente, aunque el chequeo de duplicados ahora está en el workflow de referencias.
    *   Output: Devuelve el `id` del registro insertado/actualizado.

5.  **`Item Lists` (Nodo "Extraer Issues del Hilo") - _Dentro del loop de Hilos_:**
    *   Propósito: Obtener la lista de `issues` del hilo actual para procesarlos.
    *   Input: El objeto del hilo actual del nodo "Iterar Hilos".
    *   Configuración: Operación "Get Items from Key", Clave: `issues`.
    *   Output: Una lista de los objetos `issue` para este hilo.

6.  **`SplitInBatches` (Nodo "Iterar Issues") - _Dentro del loop de Hilos_:**
    *   Propósito: Procesar cada issue individualmente.
    *   Input: La lista de `issues` del nodo anterior ("Extraer Issues del Hilo").
    *   Configuración: Tamaño de lote 1.

7.  **`Supabase` (Nodo "Guardar Issue") - _Dentro del loop de Issues_:**
    *   Propósito: Insertar el issue individual en `discovered_issues`.
    *   Input:
        *   `source_type`: 'reddit' (fijo para esta rama).
        *   `source_id`: El `id` devuelto por el nodo "Guardar Hilo Reddit" (Paso 4). Asegúrate de que este ID se pase correctamente al contexto de este loop interno.
        *   `source_url`: La `thread_url` del hilo (del nodo "Iterar Hilos").
        *   `issue_text`: El texto del issue **en español** (del objeto issue actual).
        *   `sentiment`: La puntuación de sentimiento numérica (-100 a 100) (del objeto issue actual).
        *   `issue_type`: El tipo de issue (del objeto issue actual).
        *   `tags`: El array de tags **en español** (del objeto issue actual).
        *   `priority_score`: La puntuación de prioridad (del objeto issue actual).
    *   Configuración:
        *   Operación: `Insert`.
        *   Tabla: `discovered_issues`.
        *   Columnas: Mapear inputs.
    *   Output: Resultado de la inserción.

8.  **`AI Agent` (Nodo "Analista de Temas") - _Fuera de los loops, después del Merge si hubiera otras ramas_:**
    *   Propósito: Analizar los issues acumulados para identificar y priorizar temas.
    *   Input: **Idealmente, leería directamente de la tabla `discovered_issues`** (usando un nodo `Supabase Select` previo) para obtener todos los issues con `status = 'new'`. (**Nota:** Ahora tendrá acceso a `issue_text` en español, `sentiment` (numérico), `issue_type`, `tags` y `priority_score` para un análisis más rico).
    *   Chat Model: Conectar modelo.
    *   Prompt: Instruir al modelo para:
        *   Analizar la lista de issues (considerando `issue_text`, `sentiment` (numérico), `issue_type`, `tags`, `priority_score`).
        *   Identificar los **temas o preguntas principales** recurrentes.
        *   Agrupar issues similares bajo un mismo tema (usando `tags` como ayuda).
        *   **Priorizar** los temas/preguntas (podría basarse en `priority_score` promedio/máximo, frecuencia, `sentiment` promedio/predominante, etc.).
        *   Extraer la lista estructurada de temas priorizados (`prioritized_theme`, `priority_score`, etc.).
    *   Output: Lista de temas priorizados.
    *   *Consideración:* Tras el análisis, se podría actualizar el `status` de los issues analizados en Supabase a 'theme_assigned' o similar.

9.  **(Opcional) `Supabase` / `Airtable` (Nodo "Registrar Temas"):**
    *   Propósito: Guardar los temas priorizados identificados.
    *   Configuración: Insertar en tabla `temas_potenciales`.

10. **Nodo de Notificación (Elegir uno):**
    *   Propósito: Enviar la lista priorizada al humano.

**Consideraciones:**
*   **Flujo Anidado:** El workflow ahora tiene loops anidados (hilos -> issues), lo cual es manejable en n8n.
*   **Traducción Integrada:** La traducción se ha movido al agente inicial ("Buscador Reddit"). Esto simplifica el flujo pero concentra más lógica (y posible coste/tiempo) en ese primer nodo AI.
*   **Input Analista:** Cambiar el input del Analista para leer de Supabase es más escalable y desacopla los pasos.
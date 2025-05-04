# Workflow 3: Planificación de Blog Posts

**Objetivo:** Analizar los issues descubiertos y las referencias disponibles para definir planes estructurados de blog posts, agrupando temas coherentes y asegurando suficiente material de referencia antes de almacenarlos para su posterior redacción.

**Disparador (Trigger) (Elegir uno):**

*   `Manual Trigger`: Para ejecuciones bajo demanda.
*   `Schedule Trigger`: Ejecutar periódicamente (ej. cada pocos días) para planificar nuevo contenido automáticamente.

**Pasos / Nodos:**

1.  **`Supabase` (Nodo "Leer Issues Priorizados"):**
    *   **Propósito:** Obtener los issues pendientes de análisis desde la base de datos, ordenados por prioridad.
    *   **Input:** Ninguno directo (se configura en el nodo).
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `getAll` (SELECT).
        *   Tabla: `discovered_issues`.
        *   Columnas: Seleccionar todas las columnas necesarias para el análisis y para guardar en el plan (`id`, `issue_text`, `tags`, `sentiment`, `priority_score`, etc.).
        *   Filtros: Filtrar por `status` = 'new'.
        *   Orden (Sorts): Ordenar por `priority_score` DESC, luego por `sentiment` ASC.
        *   Límite (Limit): Opcional, limitar el número de issues a procesar por ejecución (ej. 50).
    *   **Output:** Lista de objetos JSON, cada uno representando un issue priorizado.

2.  **`Supabase` (Nodo "Leer Referencias Relevantes"):**
    *   **Propósito:** Obtener todas las referencias marcadas como relevantes.
    *   **Input:** Ninguno directo.
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `getAll` (SELECT).
        *   Tabla: `references`.
        *   Columnas: Seleccionar todas las columnas necesarias para el análisis y para guardar en el plan (`id`, `url`, `title`, `related_issues`, `tags`, `summary`, `extracts`).
        *   Filtros: Filtrar por `is_relevant` = `true`.
    *   **Output:** Lista de objetos JSON, cada uno representando una referencia relevante.

3.  **`ChainLlm` (Nodo "Agrupar Issues por Tema"):**
    *   **Propósito:** Usar IA para agrupar los issues priorizados en clusters temáticos coherentes.
    *   **Input:**
        *   Lista de issues del nodo "Leer Issues Priorizados". (Formateada si es necesario por un nodo `Code` previo).
    *   **Chat Model:** Conectar un modelo de lenguaje (ej. Google Gemini).
    *   **Prompt:** Instruir al modelo para:
        *   Analizar la lista de issues (`issue_text`, `tags`).
        *   Identificar grupos de issues que traten temas muy relacionados o que puedan abordarse conjuntamente en un único artículo.
        *   Basarse principalmente en la coherencia semántica de los `tags` y el `issue_text`.
        *   Devolver una estructura JSON que represente los grupos, por ejemplo: `{"grupos": [[issue_obj_1, issue_obj_5], [issue_obj_2, issue_obj_3]]}` conteniendo los objetos issue completos para cada grupo.
    *   **Output:** Texto JSON con la estructura de grupos definida.

4.  **`Code` (Nodo "Parsear y Preparar Grupos"):**
    *   **Propósito:** Extraer la lista de grupos del JSON del LLM y prepararla para la iteración.
    *   **Input:** Salida JSON del nodo "Agrupar Issues por Tema".
    *   **Lógica:** Parsear el JSON. Asegurarse de que la salida sea una lista de arrays (cada array interno es un grupo de objetos issue).
    *   **Output:** Lista de grupos (ej. `[[issue_obj_1, issue_obj_5], [issue_obj_2, issue_obj_3]]`).

5.  **`SplitInBatches` (Nodo "Iterar Grupos de Issues"):**
    *   **Propósito:** Procesar cada grupo temático identificado individualmente.
    *   **Input:** La lista de grupos del nodo "Parsear y Preparar Grupos".
    *   **Configuración:** Tamaño de lote 1. Cada item de salida será un array representando un grupo de issues.

6.  **`Code` (Nodo "Seleccionar Referencias para Grupo") - _Dentro del loop_:**
    *   **Propósito:** Filtrar las referencias relevantes obtenidas al inicio para encontrar las que aplican al grupo de issues actual.
    *   **Input:**
        *   Grupo actual de issues (item del nodo "Iterar Grupos de Issues").
        *   Lista completa de referencias relevantes (del nodo "Leer Referencias Relevantes"). Es importante asegurarse de que esta lista esté disponible en el contexto del loop (ej. usando Expresiones o Merge).
    *   **Lógica:**
        *   Extraer todos los `tags` y/o `issue_text` del grupo actual de issues.
        *   Iterar sobre la lista completa de referencias relevantes.
        *   Seleccionar una referencia si sus `related_issues` contienen alguno de los `issue_text` del grupo O si sus `tags` tienen coincidencias significativas con los `tags` del grupo. (La lógica exacta de matching puede refinarse).
    *   **Output:** Lista de objetos JSON de las referencias seleccionadas para este grupo específico.

7.  **`ChainLlm` (Nodo "Evaluar Cobertura") - _Dentro del loop_:**
    *   **Propósito:** Usar IA para determinar si las referencias seleccionadas son suficientes para cubrir los issues del grupo actual.
    *   **Input:**
        *   Grupo actual de issues (del item del loop).
        *   Lista de referencias seleccionadas para el grupo (del nodo anterior). (Formatear si es necesario).
    *   **Chat Model:** Conectar un modelo de lenguaje.
    *   **Prompt:** Instruir al modelo para:
        *   Analizar los issues y las referencias proporcionadas (considerar cantidad de referencias, ~3-5 ideal, y la cantidad/calidad de `extracts` totales).
        *   Evaluar si las referencias cubren adecuadamente los puntos clave de los issues.
        *   Devolver una decisión simple en formato JSON, ej: `{"decision": "Suficiente"}` o `{"decision": "Insuficiente"}` o `{"decision": "Demasiado Denso"}`.
    *   **Output:** Texto JSON con la decisión.

8.  **`Code` (Nodo "Parsear Decisión Cobertura") - _Dentro del loop_:**
    *   **Propósito:** Extraer la decisión del JSON del LLM.
    *   **Input:** Salida JSON del nodo "Evaluar Cobertura".
    *   **Lógica:** Parsear el JSON y extraer el valor de `decision`.
    *   **Output:** String con la decisión (ej. "Suficiente").

9.  **`IF` (Nodo "¿Cobertura Suficiente?") - _Dentro del loop_:**
    *   **Propósito:** Dirigir el flujo basado en la decisión de cobertura.
    *   **Input:** La decisión del nodo anterior.
    *   **Condición:** Comprobar si la decisión es igual a "Suficiente".
    *   **Output:**
        *   **True:** Proceder a definir y guardar el plan.
        *   **False:** (Opcional) Marcar issues/grupo para revisión, loguear, o simplemente terminar esta rama del loop. Por ahora, solo la rama TRUE continúa.

10. **`Code` (Nodo "Definir Plan") - _Rama TRUE del IF_:**
    *   **Propósito:** Estructurar los datos finales para el plan del blog post.
    *   **Input:**
        *   Grupo actual de issues (del item del loop).
        *   Lista de referencias seleccionadas para el grupo (del nodo "Seleccionar Referencias para Grupo").
    *   **Lógica:**
        *   Crear un objeto JSON que representará la fila en `blog_post_plans`.
        *   Generar un `planned_title` tentativo (podría ser simple basado en los issues/tags, o incluso otra llamada LLM si se desea más sofisticación).
        *   Establecer `status` a 'planned'.
        *   Copiar los objetos completos de los issues del grupo al campo `issues` (será `JSONB[]`).
        *   Copiar los objetos completos de las referencias seleccionadas al campo `references` (será `JSONB[]`).
    *   **Output:** Objeto JSON único representando el plan completo.

11. **`Supabase` (Nodo "Guardar Plan") - _Rama TRUE del IF_:**
    *   **Propósito:** Insertar el plan definido en la tabla `blog_post_plans`.
    *   **Input:** El objeto JSON del plan del nodo anterior.
    *   **Configuración:**
        *   Credenciales de Supabase.
        *   Operación: `Insert`.
        *   Tabla: `blog_post_plans`.
        *   Columnas: Mapear los campos del objeto plan (`planned_title`, `status`, `issues`, `references`) a las columnas correspondientes.
    *   **Output:** Resultado de la inserción.

12. **(Opcional) `Supabase` (Nodo "Actualizar Estado Issues") - _Rama TRUE del IF_:**
    *   **Propósito:** Marcar los issues incluidos en el plan como 'planned' en la tabla `discovered_issues`.
    *   **Input:** IDs de los issues del grupo actual.
    *   **Configuración:** Operación `Update`, Tabla `discovered_issues`, Filtro por `id` IN (lista de IDs), Set `status` = 'planned'.

13. **Fin del Bucle:** El flujo regresa al nodo "Iterar Grupos de Issues" para procesar el siguiente grupo.

**Consideraciones Adicionales:**

*   **Tabla Supabase (`blog_post_plans`):** Necesitará columnas como `plan_id` (PK, ej. BIGSERIAL), `planned_title` (TEXT), `status` (TEXT), `issues` (JSONB[]), `references` (JSONB[]), `created_at` (TIMESTAMPTZ).
*   **Disponibilidad de Datos en Loops:** Asegúrate de que la lista completa de referencias relevantes esté accesible dentro del loop de grupos. Puede requerir usar `Merge` o referencias de expresión más complejas si los nodos están muy separados.
*   **Complejidad LLM:** Este workflow utiliza dos llamadas a LLM por cada *grupo* de issues (agrupación y evaluación). Ajusta los prompts y modelos según sea necesario.
*   **Lógica de Selección de Referencias:** El paso 6 ("Seleccionar Referencias para Grupo") puede necesitar una lógica de coincidencia más sofisticada (ej. embeddings si se vuelve complejo) dependiendo de cómo estén estructurados los `tags` y `related_issues`. Empezar con matching simple de `tags` puede ser suficiente.
*   **Manejo Rama FALSE del IF:** La descripción actual solo continúa si la cobertura es "Suficiente". Se necesita definir qué hacer en los casos "Insuficiente" o "Demasiado Denso" (¿loggear?, ¿marcar issues con otro estado?).

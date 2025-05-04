# Plan General de Implementación en n8n: Táctica Redes Sociales -> Blog

**Objetivo:** Implementar el flujo descrito en `tactica-redes-sociales.md` utilizando n8n, siguiendo las mejores prácticas para agentes eficientes.

**Fases Principales:**

1.  **Workflow 1: Elicitación de Temas y Preguntas:**
    *   Disparador: Programado (`Schedule Trigger`) o Manual.
    *   Monitorización: Acceder a fuentes de datos (Reddit inicialmente).
    *   Extracción y Procesamiento: Usar LLM/Agente con herramientas para obtener hilos/posts e identificar `issues` dentro de ellos. Traducir issues al español.
    *   Almacenamiento Detallado: Guardar hilos y **issues individuales** en tablas separadas de Supabase (`reddit_discovered_threads`, `discovered_issues`).
    *   Análisis y Priorización: Usar LLM/Agente leyendo de la tabla `discovered_issues` para identificar y priorizar temas emergentes (basado en `priority_score`, `sentiment`, `tags`, etc.).
    *   Almacenamiento (Opcional): Guardar temas priorizados en Supabase (`temas_potenciales`).
    *   Notificación: Informar al humano sobre los temas/preguntas más relevantes encontrados.

2.  **Workflow 2: Investigación y Recopilación de Referencias:**
    *   Disparador: Manual (seleccionando un tema/grupo de issues del Workflow 1) o automático.
    *   Input: Array de Temas/Preguntas específicas (`tema_investigacion`).
    *   Generación de Consultas: Usar LLM (`ChainLlm`) para crear queries de búsqueda.
    *   Búsqueda Web: Ejecutar búsqueda (ej. Google Search vía `HttpRequest`).
    *   Verificación Duplicados: Consultar tabla `references` en Supabase por URL.
    *   Obtención Contenido: Descargar HTML de nuevas URLs (`HttpRequest`).
    *   Preprocesamiento: Usar LLM (`ChainLlm`) para analizar contenido, determinar `is_relevant`, extraer `extracts` (JSONB), `tags` (TEXT[]), y generar `summary` (TEXT) en relación a los `related_issues` (el `tema_investigacion` original).
    *   Almacenamiento de Referencias: Guardar referencias preprocesadas en la tabla `references` de Supabase.

3.  **Workflow 3: Planificación de Blog Posts:**
    *   **Disparador:** Manual o Programado (`Schedule Trigger`).
    *   **Propósito:** Decidir qué blog posts crear, qué issues tratarán y qué referencias usarán.
    *   **Inputs (Lectura de Supabase):**
        *   Issues de `discovered_issues` (filtrados por estado 'new', ordenados por `priority_score`, `sentiment`).
        *   Referencias de `references` (filtradas por `is_relevant = true`).
    *   **Lógica Principal:**
        *   **Priorizar Issues:** Leer issues de `discovered_issues` (filtrados por estado 'new'). Ordenar descendentemente por `priority_score` y luego ascendentemente por `sentiment` (los más negativos primero). Seleccionar un grupo inicial de issues priorizados.
        *   **Agrupar Issues:** Usar un LLM (`ChainLlm`) para procesar lotes de issues priorizados, clusterizándolos en grupos coherentes basados en la relación semántica de sus `tags`.
        *   **Seleccionar Referencias:** Para cada grupo coherente de issues, consultar en Supabase las `references` relevantes (`is_relevant = true`). La selección se basará en las `related_issues` de las referencias.
        *   **Evaluar Cobertura (LLM):** Para cada grupo de issues con sus referencias asociadas, usar otro LLM (`ChainLlm`) para determinar si la cobertura es suficiente para un blog post.
            *   *Criterio:* El LLM evaluará si hay una cantidad adecuada de referencias (ej. 3-5) y si el número total de `extracts` entre todas ellas proporciona suficiente material.
            *   *Decisión del LLM:*
                *   *Suficiente:* Proceder a definir el plan.
                *   *Insuficiente:* Marcar el grupo para más investigación (podría disparar Workflow 2) o sugerir combinar con otro grupo si es coherente.
                *   *Demasiado Denso:* Sugerir dividir el grupo de issues/referencias en múltiples planes de posts.
        *   **Definir Plan:** Para los grupos con cobertura suficiente, crear un plan detallado. Este plan incluirá un título tentativo y contendrá los datos completos "planchados" de los issues y referencias seleccionados.
    *   **Almacenamiento:** Guardar los planes en una nueva tabla de Supabase (ej. `blog_post_plans`) con columnas como `plan_id`, `planned_title`, `status` ('planned'), `issues` (JSONB[], conteniendo objetos issue completos), `references` (JSONB[], conteniendo objetos reference completos).
    *   **Notificación:** Eliminada (no necesaria).

4.  **Workflow 4: Redacción del Borrador del Blog:**
    *   Disparador: Manual (seleccionando un `plan_id` de `blog_post_plans`) o automático post-Workflow 2.5.
    *   Input: `plan_id` del post a redactar.
    *   Obtención de Datos: Leer de Supabase los detalles del plan: `planned_title`, `issue_ids`, `reference_ids`. Luego, obtener los textos completos de esos issues y referencias.
    *   Formateo: Preparar los textos de issues y referencias para el prompt del LLM.
    *   Redacción: Usar LLM (`ChainLlm` o similar) para generar el borrador del artículo, basándose **específicamente** en los issues y referencias del plan. El prompt debe instruir al LLM para citar las referencias proporcionadas.
    *   Notificación para Revisión Humana: Enviar borrador para aprobación.

5.  **Workflow 5: Generación de Borrador de Respuesta Social:**
    *   Disparador: Manual (post publicación del blog) o Webhook.
    *   Input: URL del post del blog y contexto original (ej. ID del hilo de Reddit si aplica).
    *   Generación: Crear borrador de respuesta social (ej. para Reddit) usando LLM, enlazando al post del blog.
    *   Notificación para Revisión Humana: Enviar borrador para publicación manual.

6.  **Workflow 6 (Futuro): Reutilización de Contenido:**
    *   Disparador: Programado (`Schedule Trigger`).
    *   Análisis: Leer posts publicados (de Supabase o CMS) y sugerir estructuras para guías/módulos.
    *   Notificación para Revisión Humana.

**Principios Clave (de Anthropic):**

*   **Simplicidad:** Empezar con flujos sencillos y añadir complejidad gradualmente.
*   **Composición:** Usar nodos específicos (Monitorizar -> Analizar -> Investigar -> Planificar -> Referenciar -> Redactar -> Notificar).
*   **Human-in-the-loop:** Puntos de control humano *obligatorios*.
*   **Transparencia:** Diseñar workflows claros.

**Herramientas n8n Principales:**

*   `Schedule Trigger` / `Manual Trigger` / `Webhook Trigger`
*   `ChainLlm` / Nodos específicos de modelos
*   `Supabase` Node
*   Nodos de notificación (`Email`, `Discord`, etc.)
*   Nodos de lógica (`IF`, `Code`, `Switch`)
*   `HttpRequest`
*   `Set` / `Edit Fields` / `Item Lists` / `SplitOut` / `SplitInBatches`
*   Herramientas/Nodos de búsqueda web, Reddit, etc. 
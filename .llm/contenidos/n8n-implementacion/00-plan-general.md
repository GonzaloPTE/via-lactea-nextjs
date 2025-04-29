# Plan General de Implementación en n8n: Táctica Redes Sociales -> Blog

**Objetivo:** Implementar el flujo descrito en `tactica-redes-sociales.md` utilizando n8n, siguiendo las mejores prácticas para agentes eficientes.

**Fases Principales:**

1.  **Workflow 1: Elicitación de Temas y Preguntas:**
    *   Disparador: Programado (`Schedule Trigger`) o Manual.
    *   Monitorización: Acceder a fuentes de datos (Reddit inicialmente).
    *   Extracción y Procesamiento: Usar `AI Agent` para obtener hilos/posts e identificar `issues` dentro de ellos. Traducir issues al español.
    *   Almacenamiento Detallado: Guardar hilos y **issues individuales** en tablas separadas de Supabase (`reddit_discovered_threads`, `discovered_issues`).
    *   Análisis y Priorización: Usar `AI Agent` leyendo de la tabla `discovered_issues` para identificar y priorizar temas emergentes.
    *   Almacenamiento (Opcional): Guardar temas priorizados en Supabase (`temas_potenciales`).
    *   Notificación: Informar al humano sobre los temas/preguntas más relevantes encontrados.

2.  **Workflow 2: Investigación y Recopilación de Referencias:**
    *   Disparador: Manual (seleccionando un tema del Workflow 1) o automático.
    *   Input: Tema/Pregunta específica.
    *   Búsqueda de Referencias: Usar `AI Agent` con herramientas de búsqueda web.
    *   Verificación Duplicados: Consultar tabla `referencias` en Supabase.
    *   Preprocesamiento: Usar `AI Agent` para extraer snippets/tags de nuevas referencias.
    *   Almacenamiento de Referencias: Guardar referencias preprocesadas en Supabase.

3.  **Workflow 3: Redacción del Borrador del Blog:**
    *   Disparador: Manual o automático post-Workflow 2.
    *   Input: Tema/Pregunta y referencias asociadas (de Supabase).
    *   Redacción: Generar borrador usando `AI Agent`, citando referencias.
    *   Notificación para Revisión Humana: Enviar borrador para aprobación.

4.  **Workflow 4: Generación de Borrador de Respuesta Social:**
    *   Disparador: Manual (post publicación) o Webhook.
    *   Input: URL del post y contexto original.
    *   Generación: Crear borrador de respuesta con `AI Agent`.
    *   Notificación para Revisión Humana: Enviar borrador para publicación manual.

5.  **Workflow 5 (Futuro): Reutilización de Contenido:**
    *   Disparador: Programado (`Schedule Trigger`).
    *   Análisis: Leer posts publicados y sugerir estructuras para guías/módulos.
    *   Notificación para Revisión Humana.

**Principios Clave (de Anthropic):**

*   **Simplicidad:** Empezar con flujos sencillos y añadir complejidad gradualmente.
*   **Composición:** Usar nodos específicos (Monitorizar -> Analizar -> Investigar -> Referenciar -> Redactar -> Notificar).
*   **Human-in-the-loop:** Puntos de control humano *obligatorios*.
*   **Transparencia:** Diseñar workflows claros.

**Herramientas n8n Principales:**

*   `Schedule Trigger` / `Manual Trigger` / `Webhook Trigger`
*   `AI Agent` / Nodos específicos de modelos
*   `Supabase` Node / `Airtable` Node
*   Nodos de notificación
*   Nodos de lógica
*   `HTTP Request`
*   `Set` / `Edit Fields`
*   Nodos de búsqueda web / RSS Reader / Social Media Triggers (si aplican) 
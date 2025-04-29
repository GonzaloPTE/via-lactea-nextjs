# Workflow 1: Elicitación de Temas y Preguntas

**Objetivo:** Monitorizar fuentes de información para identificar y priorizar temas y preguntas relevantes para la audiencia de Vía Láctea.

**Disparador (Trigger):**

*   `Schedule Trigger`: Ejecutar periódicamente (ej. diariamente, semanalmente).
*   `Manual Trigger`: Para ejecuciones bajo demanda.

**Pasos / Nodos:**

1.  **Recopilación de Datos (Varias Ramas en Paralelo o Secuencial):**
    *   **Rama A: Google Trends / Búsqueda Web:**
        *   `HTTP Request` (o nodo específico si existe): Consultar APIs como Google Trends para términos clave ("problemas sueño bebé", "dolor lactancia", etc.).
        *   `AI Agent` con Herramienta de Búsqueda: Buscar "preguntas frecuentes sobre [tema]" en la web.
    *   **Rama B: Foros / Comunidades (Requiere cuidado/scraping):**
        *   `RSS Reader`: Monitorizar feeds RSS de foros relevantes si están disponibles.
        *   `HTTP Request` (con scraping cuidadoso y respetando ToS): Extraer títulos de hilos recientes de subreddits específicos (ej. r/lactanciamaterna, r/crianzarespetuosa) o grupos públicos.
    *   **Rama C: Redes Sociales (Si hay APIs disponibles):**
        *   Nodos específicos (`Twitter`, etc.) o `HTTP Request`: Buscar hashtags relevantes o monitorizar menciones (si las APIs lo permiten y son asequibles).
    *   **Rama D: Datos Internos:**
        *   `HTTP Request`: Consultar API de búsqueda del propio blog para ver qué buscan los usuarios.
        *   `Google Search Console Node` (si existe/se configura): Obtener términos de búsqueda que llevan al sitio.

2.  **`Merge` (Nodo "Unificar Datos Crudos"):**
    *   **Propósito:** Combinar los resultados de las diferentes ramas de recopilación.
    *   **Configuración:** Modo "Append" o "Combine" según cómo se estructuren los datos.

3.  **`AI Agent` (Nodo "Analista de Temas"):**
    *   **Propósito:** Procesar los datos crudos unificados para extraer y priorizar temas/preguntas.
    *   **Input:** Los datos combinados del nodo `Merge`.
    *   **Chat Model:** Conectar modelo.
    *   **Prompt:** Instruir al modelo para:
        *   Analizar la lista de textos, títulos, preguntas y términos de búsqueda.
        *   Identificar los **temas o preguntas principales** que se repiten o parecen generar más interés/dudas.
        *   Agrupar preguntas similares bajo un mismo tema.
        *   **Priorizar** los temas/preguntas basándose en la frecuencia, urgencia aparente (ej. menciones de "ayuda", "urgente"), o relevancia para el negocio de Vía Láctea (sueño, lactancia).
        *   Extraer una lista limpia de los 5-10 temas/preguntas más prioritarios.
    *   **Output:** Lista de temas/preguntas priorizados (ej. lista de strings o JSON con `tema` y `prioridad`).

4.  **(Opcional) `Supabase` / `Airtable` (Nodo "Registrar Temas"):**
    *   **Propósito:** Guardar los temas identificados para seguimiento y evitar reprocesar los mismos inmediatamente.
    *   **Configuración:** Insertar los temas/preguntas en una tabla específica (ej. `temas_potenciales`) con estado "pendiente_investigacion". Se podría incluir la fuente o la prioridad.

5.  **Nodo de Notificación (Elegir uno):**
    *   **`Email` / `Discord` / etc.**
    *   **Propósito:** Enviar la lista de temas/preguntas priorizados al humano para que decida cuál investigar a continuación (activando manualmente el Workflow 2).

**Consideraciones:**

*   **Complejidad:** Este workflow puede volverse complejo dependiendo de cuántas fuentes se monitoricen y la fiabilidad de la extracción de datos (especialmente scraping).
*   **Coste:** Múltiples llamadas a API (Trends, Search, LLM) pueden incrementar el coste.
*   **APIs y ToS:** Verificar la disponibilidad y términos de servicio de las APIs o sitios web antes de intentar acceder a ellos automáticamente.
*   **Empezar Simple:** Se puede empezar monitorizando solo 1 o 2 fuentes fiables (ej. Google Trends y un foro con RSS) e ir añadiendo más gradualmente. 
# Workflow 5: Generación de Borrador de Respuesta Social

**Objetivo:** Generar un borrador de respuesta para un foro/red social, basado en un blog post publicado, para revisión y publicación manual.

**Disparador (Trigger) (Elegir uno):**

*   `Manual Trigger`: La opción más sencilla. Se activa manualmente cuando el post está publicado.
*   `Webhook Trigger`: Si tu CMS puede enviar un webhook cuando se publica un post. Requeriría configuración adicional en el CMS y en n8n para capturar la URL.

**Pasos / Nodos:**

1.  **`Set` (Nodo "Definir Inputs"):**
    *   **Propósito:** Introducir los datos necesarios para generar la respuesta.
    *   **Configuración:**
        *   Campo `url_post`: Pegar la URL del blog post publicado.
        *   Campo `contexto_pregunta` (Opcional): Pegar el texto o enlace de la pregunta original en el foro/red social.
        *   Campo `plataforma_destino`: (Opcional, pero útil) Especificar dónde se publicará (ej. "Reddit", "Grupo Facebook Crianza") para adaptar el tono/longitud.
    *   **Output:** JSON con `url_post`, `contexto_pregunta`, `plataforma_destino`.

2.  **`AI Agent` (Nodo "Redactor de Respuesta Social"):**
    *   **Propósito:** Generar el borrador de la respuesta.
    *   **Input:** Datos del nodo anterior (`{{ $json.url_post }}`, `{{ $json.contexto_pregunta }}`, `{{ $json.plataforma_destino }}`).
    *   **Chat Model:** Conectar un modelo de lenguaje (el mismo o uno diferente al del Workflow 1).
    *   **Prompt:** Instruir al modelo para:
        *   Leer (o basarse en el contenido inferido de la URL/contexto) el blog post en `url_post`.
        *   Escribir una respuesta útil y concisa para la `contexto_pregunta` (si se proporcionó).
        *   Integrar el `url_post` de forma natural y contextual como recurso adicional ("para más detalles", "explico esto más a fondo aquí:").
        *   Adaptar el tono y longitud a la `plataforma_destino` (si se especificó).
        *   **MUY IMPORTANTE:** Recordarle que NO use lenguaje de spam, que aporte valor real en la respuesta directa, y que respete las posibles normas de la comunidad (aunque el prompt no las conozca, debe ser cauto).
    *   **Output:** Texto del borrador de la respuesta social.

3.  **`Set` (Nodo "Preparar Notificación Revisión Social"):**
    *   **Propósito:** Formatear los datos para la notificación de revisión.
    *   **Input:** Salida del `AI Agent` y datos del primer `Set`.
    *   **Configuración:** Crear campos como `asunto_notificacion`, `cuerpo_notificacion` incluyendo el borrador de la respuesta, la URL del post original y el contexto/plataforma de destino.
    *   **Output:** JSON listo para la notificación.

4.  **Nodo de Notificación (Igual que en Workflow 1):**
    *   **`Email` / `Discord` / `Airtable` / `Google Sheets` etc.**
    *   **Propósito:** Alertar al humano de que hay un borrador de respuesta social listo para revisar y **publicar manualmente**.

**Punto de Control Humano CRÍTICO:** El workflow termina aquí. El humano **DEBE** revisar el borrador, asegurarse de que es apropiado, útil, no viola normas de la comunidad, y **publicarlo manualmente** en la plataforma correspondiente. La automatización de la publicación directa es muy arriesgada. 
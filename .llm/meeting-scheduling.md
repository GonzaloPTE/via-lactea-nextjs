# Configuración de Agendamiento de Reuniones para Vía Láctea

**Fecha de decisión:** 2025-04-16

## Herramienta Seleccionada:

*   **Calendly (Free Tier)**

## Propósito:

*   Gestionar la reserva de la "Valoración Gratuita" inicial ofrecida en la página de inicio.

## Configuración y Funcionalidades Clave (Free Tier):

*   **Tipo de Evento:** Se configurará un único tipo de evento activo para la "Valoración Gratuita".
    *   *Limitación:* El plan gratuito solo permite 1 tipo de evento activo a la vez.
*   **Integración Web:** Se utilizará el código de embebido (iframe o widget popup) de Calendly para mostrar el calendario directamente en la página de inicio de NextJS.
*   **Sincronización de Calendario:** Se conectará con el calendario principal (Google Calendar / Microsoft 365) para mostrar disponibilidad real y evitar dobles reservas.
*   **Notificaciones:** Se utilizarán las notificaciones por email automáticas de Calendly (confirmación para el cliente y la asesora).
    *   *Limitación:* Estas notificaciones incluirán la marca de Calendly.
*   **Formulario de Admisión:** Se pueden añadir preguntas básicas al formulario de reserva de Calendly para recopilar información inicial del cliente.

## Integración con CRM:

*   **Requisito Crítico:** Es necesario configurar la integración nativa entre Calendly y **HubSpot Free CRM**.
*   **Objetivo de la Integración:** Asegurar que cada vez que se reserve una "Valoración Gratuita" a través de Calendly, se cree o actualice automáticamente un registro de contacto en HubSpot CRM con los detalles proporcionados.

## Razón de la Elección (sobre HubSpot Meetings Free):

*   Se percibe que la experiencia de usuario y las funcionalidades *específicas de agendamiento* del plan gratuito de Calendly son preferibles o más adecuadas para las necesidades iniciales del proyecto, a pesar de la limitación de un solo tipo de evento.
*   Se acepta la necesidad de gestionar la integración con HubSpot CRM (también gratuito) para mantener una base de datos de clientes centralizada.

## Limitaciones Aceptadas:

*   Presencia de la marca "Calendly" en la interfaz de reserva y en las notificaciones.
*   Restricción a un único tipo de evento activo simultáneamente.

## Código de Embedding:

### Opción 1: Widget Inline (Calendario embebido en la página)

```html
<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" data-url="https://calendly.com/vialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba" style="min-width:320px;height:700px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
<!-- Calendly inline widget end -->
```

**Notas sobre el código de embedding inline:**
* El parámetro `primary_color=605dba` establece el color morado/uva (grape) que coincide con la identidad visual.
* El parámetro `hide_gdpr_banner=1` oculta el banner de GDPR que normalmente aparece en la UE.
* La altura de 700px es apropiada para mostrar el calendario completo sin scroll excesivo.
* Este código deberá adaptarse al componente correspondiente en Next.js.

### Opción 2: Widget Popup (Enlace que abre un popup)

```html
<!-- Calendly link widget begin -->
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
<a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/vialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba'});return false;">Agenda YA tu valoración GRATUITA</a>
<!-- Calendly link widget end -->
```

**Notas sobre el código de link popup:**
* Usa los mismos parámetros de personalización que el widget inline.
* Ocupa mucho menos espacio en la página, mostrando solo un enlace en lugar del calendario completo.
* Es ideal para integrar en botones de llamada a la acción o en secciones donde el espacio es limitado.
* El usuario debe hacer clic para ver las opciones de calendario en un popup.

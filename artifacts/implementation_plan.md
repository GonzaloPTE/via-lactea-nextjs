# Diseño del Componente de Reservas (Alternativa a Calendly)

El objetivo de este plan es detallar la arquitectura y el diseño del nuevo componente en React/Next.js que sustituirá el flujo actual de Calendly para agendar citas (como la "Valoración gratuita"). 

Este componente será una solución nativa, completamente integrada en el diseño de la web y sin mostrar opciones de pago en esta etapa, manteniendo la estética limpia y sencilla de las imágenes proporcionadas. La funcionalidad anterior de Calendly no será eliminada, simplemente se ocultará mediante banderas/comentarios en el código original.

## Requisitos de la Interfaz Estructurada en Dos Paneles
Se propone un diseño estructurado en un contenedor principal con dos columnas divisibles (tipo "splitview"), usando el sistema de grillas de Bootstrap 5 (`row` y `col`).

### Panel Izquierdo (Resumen del Servicio - Fijo)
Esta sección mostrará la información estática del servicio que el usuario está a punto de reservar.
- Logo/Imagen de cabecera.
- Nombre/Foto de la asesora.
- Título del servicio (ej. "Valoración gratuita").
- Detalles en formato lista con iconos (usando `Unicons` de la plantilla, prefijo `uil uil-*`):
  - <i class="uil uil-clock"></i> Duración (ej. 30 min)
  - <i class="uil uil-phone"></i> Tipo (Llamada telefónica, videollamada, etc.)
  - <i class="uil uil-euro"></i> Precio (Si aplica, o "Gratis")
  - <i class="uil uil-calendar-alt"></i> Fecha y Hora (Dinámico).
  - <i class="uil uil-globe"></i> Zona horaria (Dinámico).
- "Qué haremos?": Descripción de la asesoría.

### Panel Derecho (Flujo Interactivo - Dinámico)
Tendrá un sistema de estados internos para manejar los 3 pasos principales del embudo.

**Paso 1: Selección de Fecha y Hora**
- **Vista del Mes (Calendario):** Mostrará el mes actual usando la librería `dayjs`. 
- **Vista de Días Disponibles:** Al hacer clic en un día del calendario, la mitad derecha del panel mostrará las horas fijas disponibles (17:00, 17:30, 18:00, 18:30, 19:00, 19:30). Las horas son estáticas y no conultan a Google Calendar.
- **Confirmación de Hora:** Al elegir una hora, aparecerá el botón "Siguiente" junto a ella.

**Paso 2: Formulario de Adquisición de Datos**
Se mostrará un formulario nativo con validaciones básicas:
- Nombre *
- Apellido *
- Correo electrónico *
- Número de teléfono * (Con prefijo del país, ej. +34)
- Nombre del bebé *
- Edad del bebé *
- Motivo de la consulta / Preocupación (Textarea) *
- Consentimiento de Políticas de Privacidad.
- Botón: "Programar evento"

**Paso 3: Confirmación**
- Pantalla de éxito de que la reunión ha sido reservada, con indicaciones sobre qué esperar.

## Decisiones Técnicas Acordadas

1. **Horas Disponibles Simples:** Slots duros de 17:00 a 19:30 en tramos de 30 min. Un choque de citas se gestionará manualmente.
2. **Iconos Unicons:** Se usarán los iconos nativos del tema (como `uil uil-calendar-alt` que ya se usa en `ViaLacteaHero.tsx`).
3. **Manejo de Envíos (Email):** El formulario enviará los datos directamente usando un endpoint de API Route en Next.js (/api/book). Se utilizará un servicio como Resend o NodeMailer para enviar el correo a `miriruco@gmail.com`. Se añadirá una verificación invisible simple (como un campo honeypot) para evitar Spam.
4. **Zona Horaria:** Se detectará mediante `Intl.DateTimeFormat().resolvedOptions().timeZone` e imprimirá la zona, sin opción a modificarla en una primera versión ("Keep it simple").
5. **No Destrucción:** El componente actual (`CalendlyButton` u otra integración) se comentará o se pondrá detrás de un prop/feature flag, no se borrará.

## Siguientes Pasos (Aprobación requerida):
Si estás conforme con este plan actualizado, iniciaré la ejecución de las tareas definidas en `task.md`.

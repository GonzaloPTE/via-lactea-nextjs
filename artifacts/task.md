# Tareas de Implementación: Componente de Reservas

- [x] **Hito 1: Estructuración y Preparación**
  - [x] Leer plan y preparar entorno (`.cursor/rules/implementation-cycle.mdc`).
  - [x] Crear el esqueleto del componente principal `CustomBookingWidget.tsx` en `src/components/blocks/booking/`.
  - [x] Compilar y verificar que la app levanta en `localhost:3000` sin errores.

- [x] **Hito 2: Desarrollo UI - Panel Izquierdo (Resumen de Servicio)**
  - [x] Desarrollar `ServiceSummary.tsx` recibiendo props estáticas (título, duración, tipo, etc.).
  - [x] Incorporar los iconos de Unicons (`uil uil-clock`, `uil uil-phone`, `uil uil-calendar-alt`).
  - [x] Ajustar estilos usando clases de Bootstrap 5 (`col-md-x`, `d-flex`).
  - [x] Probar en local visualmente.

- [x] **Hito 3: Desarrollo UI - Panel Derecho (Calendario y Horas)**
  - [x] Desarrollar `CalendarSelector.tsx` integrado con `dayjs` o `date-fns` para pintar el mes mes actual.
  - [x] Implementar la selección de días (solo días hábiles).
  - [x] Desarrollar `TimeSlotSelector.tsx` que dada una fecha seleccionable, imprima 6 botones fijos: 17:00, 17:30, 18:00, 18:30, 19:00, y 19:30.
  - [x] Implementar botón "Siguiente" que pase al Paso 2 del estado interno.
  - [x] Añadir detección de zona horaria mediante `Intl.DateTimeFormat`.
  - [x] Probar interactividad en local (clickar en un día y luego en una hora).

- [x] **Hito 4: Desarrollo UI - Panel Derecho (Formulario)**
  - [x] Desarrollar `BookingForm.tsx` con campos: Nombre, Apellido, Email, Teléfono, Nombre del bebé, Edad del bebé, y Motivo de consulta.
  - [x] Validación básica HTML5 (`required`, `type="email"`, etc.).
  - [x] Añadir el campo oculto "honeypot" para evitar spam e interacciones con bots tontos.
  - [x] Estilizar al tono del proyecto (colores grape/morado que sustituyen la estética Calendly).

- [x] **Hito 5: Backend y Envío de Correos**
  - [x] Comprobar método para el envío de correos, o integrar librería tipo `nodemailer` / `resend` en el `package.json` si es necesario o API de la cual ya dispongamos.
  - [x] Crear la API Route `src/app/api/book/route.ts` (si es app router) o `src/pages/api/book.ts` (si es pages router) que reciba el POST con los datos de reserva.
  - [x] Validar datos + honeypot en backend.
  - [x] Logica de envío de email a `miriruco@gmail.com`.
  - [x] Probar envío en local (usando un log o un servicio dev como Mailtrap si las credenciales no están dispuestas).

- [x] **Hito 6: Finalización e Integración en Producción Lógica**
  - [x] Integrar el flujo completo: Paso 1 -> Paso 2 -> POST -> Paso 3 (Pantalla "Éxito").
  - [x] Ocultar mediante comentarios (/* */) o false flag el uso del viejo `CalendlyButton` en `ViaLacteaHero.tsx` y en cualquier otra página de destino.
  - [x] Remplazarlo por `<CustomBookingWidget />`.
  - [x] Compilar, levantar `localhost:3000`, y probar flujo End-To-End completo a nivel visual.
  - [x] Revisión final y confirmación con la usuaria.

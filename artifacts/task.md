# Tareas de Implementación: Componente de Reservas

- [ ] **Hito 1: Estructuración y Preparación**
  - [ ] Leer plan y preparar entorno (`.cursor/rules/implementation-cycle.mdc`).
  - [ ] Crear el esqueleto del componente principal `CustomBookingWidget.tsx` en `src/components/blocks/booking/`.
  - [ ] Compilar y verificar que la app levanta en `localhost:3000` sin errores.

- [ ] **Hito 2: Desarrollo UI - Panel Izquierdo (Resumen de Servicio)**
  - [ ] Desarrollar `ServiceSummary.tsx` recibiendo props estáticas (título, duración, tipo, etc.).
  - [ ] Incorporar los iconos de Unicons (`uil uil-clock`, `uil uil-phone`, `uil uil-calendar-alt`).
  - [ ] Ajustar estilos usando clases de Bootstrap 5 (`col-md-x`, `d-flex`).
  - [ ] Probar en local visualmente.

- [ ] **Hito 3: Desarrollo UI - Panel Derecho (Calendario y Horas)**
  - [ ] Desarrollar `CalendarSelector.tsx` integrado con `dayjs` o `date-fns` para pintar el mes mes actual.
  - [ ] Implementar la selección de días (solo días hábiles).
  - [ ] Desarrollar `TimeSlotSelector.tsx` que dada una fecha seleccionable, imprima 6 botones fijos: 17:00, 17:30, 18:00, 18:30, 19:00, y 19:30.
  - [ ] Implementar botón "Siguiente" que pase al Paso 2 del estado interno.
  - [ ] Añadir detección de zona horaria mediante `Intl.DateTimeFormat`.
  - [ ] Probar interactividad en local (clickar en un día y luego en una hora).

- [ ] **Hito 4: Desarrollo UI - Panel Derecho (Formulario)**
  - [ ] Desarrollar `BookingForm.tsx` con campos: Nombre, Apellido, Email, Teléfono, Nombre del bebé, Edad del bebé, y Motivo de consulta.
  - [ ] Validación básica HTML5 (`required`, `type="email"`, etc.).
  - [ ] Añadir el campo oculto "honeypot" para evitar spam e interacciones con bots tontos.
  - [ ] Estilizar al tono del proyecto (colores grape/morado que sustituyen la estética Calendly).

- [ ] **Hito 5: Backend y Envío de Correos**
  - [ ] Comprobar método para el envío de correos, o integrar librería tipo `nodemailer` / `resend` en el `package.json` si es necesario o API de la cual ya dispongamos.
  - [ ] Crear la API Route `src/app/api/book/route.ts` (si es app router) o `src/pages/api/book.ts` (si es pages router) que reciba el POST con los datos de reserva.
  - [ ] Validar datos + honeypot en backend.
  - [ ] Logica de envío de email a `miriruco@gmail.com`.
  - [ ] Probar envío en local (usando un log o un servicio dev como Mailtrap si las credenciales no están dispuestas).

- [ ] **Hito 6: Finalización e Integración en Producción Lógica**
  - [ ] Integrar el flujo completo: Paso 1 -> Paso 2 -> POST -> Paso 3 (Pantalla "Éxito").
  - [ ] Ocultar mediante comentarios (/* */) o false flag el uso del viejo `CalendlyButton` en `ViaLacteaHero.tsx` y en cualquier otra página de destino.
  - [ ] Remplazarlo por `<CustomBookingWidget />`.
  - [ ] Compilar, levantar `localhost:3000`, y probar flujo End-To-End completo a nivel visual.
  - [ ] Revisión final y confirmación con la usuaria.

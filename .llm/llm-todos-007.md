# Subtareas para TASK-007 - Implementar página de inicio

## Consideración importante
**Priorizar el uso de componentes del tema premium**: En todas las tareas siguientes, debemos utilizar al máximo los componentes existentes del tema premium, minimizando el desarrollo personalizado. Esto acelerará el desarrollo, mantendrá la coherencia visual y aprovechará la inversión realizada en el tema.

## Sección de Servicios y Productos

### TASK-007-01: Estructura de datos para servicios
- Crear un archivo de datos estructurados para los servicios en `src/data/service-data.ts`
- Migrar la información de `.llm/servicios.md` al formato adecuado para la aplicación
- Organizar servicios por categorías (0-6 meses, 6 meses a 4 años)
- Incluir todos los campos necesarios: id, título, descripción, precio, icono, URL, etc.
- Agregar flag para servicios que requieren integración con Calendly
- Adaptar la estructura de datos para que sea compatible con los componentes del tema premium

### TASK-007-02: Estructura de datos para productos
- Crear un archivo de datos estructurados para los productos en `src/data/product-data.ts`
- Migrar la información de `.llm/productos.md` al formato adecuado
- Organizar productos por niveles y tipos según especificaciones
- Incluir todos los campos necesarios: id, título, descripción, precio, formato, nivel, fecha de publicación, etc.
- Agregar metadatos para gestionar la visualización en la home vs páginas internas
- Adaptar la estructura de datos para que sea compatible con los componentes del tema premium

### TASK-007-03: Mejorar componente ViaLacteaServices
- **Identificar componentes del tema premium** que puedan servir para mostrar servicios (cards, pricing tables, feature lists, etc.)
- Adaptar y utilizar estos componentes existentes en lugar de crear nuevos
- Refactorizar el componente `ViaLacteaServices.tsx` para utilizar los datos reales
- Implementar diseño responsivo que muestre servicios destacados en la home
- Añadir links a páginas detalladas para cada servicio
- Hacer ajustes mínimos de estilo para mantener la identidad visual

### TASK-007-04: Crear componente ViaLacteaProducts
- **Identificar componentes del tema premium** que puedan servir para mostrar productos (grids, galleries, tabs, etc.)
- Adaptar y utilizar estos componentes existentes en lugar de crear nuevos
- Desarrollar `ViaLacteaProducts.tsx` como una composición de componentes del tema
- Implementar filtros/tabs para diferentes categorías de productos (si el tema ofrece esta funcionalidad)
- Añadir links a páginas detalladas de cada producto
- Realizar modificaciones mínimas necesarias para adaptarlos a nuestros datos

### TASK-007-05: Integración con Calendly
- **Identificar si el tema incluye algún componente de calendario o modal** que pueda adaptarse
- Implementar la integración del widget de Calendly para la valoración gratuita
- Configurar eventos específicos para cada tipo de servicio
- Personalizar la apariencia del modal de Calendly para que coincida con el tema
- Implementar lógica para capturar datos del usuario antes de la reserva
- Pruebas de integración completas

### TASK-007-06: Integración con HubSpot CRM
- **Verificar si el tema incluye componentes de formularios** que podamos adaptar
- Implementar API de HubSpot para registro de leads
- Configurar flujos de datos para diferenciar leads de valoraciones gratuitas vs clientes de servicio pagado
- Crear campos personalizados en HubSpot para almacenar información relevante
- Implementar captcha en formularios para prevenir spam
- Pruebas de integración completas

### TASK-007-07: Integración con Stripe
- **Revisar si el tema incluye componentes de checkout o pago** que podamos utilizar
- Implementar la pasarela de pago Stripe para servicios como la Llamada SOS
- Crear productos y precios en el dashboard de Stripe
- Implementar checkout de Stripe para procesar pagos
- Configurar webhooks para gestionar estados de pago
- Implementar página de confirmación post-pago
- Pruebas de integración completas

### TASK-007-08: Implementar sección de Suscripción Mensual
- **Identificar componentes de pricing o suscripción** del tema premium
- Diseñar la sección de suscripción mensual utilizando componentes existentes
- Destacar el precio con descuento (10€/mes)
- Listar beneficios de la suscripción (acceso a todos los contenidos)
- Implementar pasarela de pago recurrente con Stripe
- Hasta que no haya contenido, esta sección se mostrará como "próximamente"

### TASK-007-09: Modificar estructura de navegación del sitio
- Adaptar el navbar para incluir las nuevas secciones de servicios y productos (estos los llamaremos "recursos")
- Crear dropdown menus para categorías de servicios (0-6 meses, 6 meses-4 años)
- Revisar la estructura actual y buscar componentes de navegación del tema premium
- Implementar breadcrumbs para mejorar la navegación entre páginas relacionadas
- Asegurar que las rutas de navegación sean coherentes con la arquitectura del sitio. Crear páginas mockeadas para probar la navegación.
- Generar un mapa de navegación para tener claro el orden de las páginas y sus relaciones. En `.llm/navigation-map.md`.

### TASK-007-10: Crear páginas detalladas de servicios
- Desarrollar plantilla base para páginas de servicio utilizando componentes del tema
- Crear páginas individuales para cada servicio con detalles completos
- Incluir descripción detallada, beneficios, proceso, duración y precio
- Incluir componente de proceso de servicio (ya hay en el tema)
- Integrar componentes de testimonio específicos para cada servicio
- Añadir CTA para reserva o consulta adaptado al tipo de servicio
- Implementar sección de FAQ específica para cada servicio

### TASK-007-11: Crear página comparativa de precios
- Identificar componente de tabla de precios del tema premium
- Desarrollar página que compare todos los servicios y sus características
- Diferenciar entre servicios con tabla comparativa de qué incluye cada uno y qué no.
- Destacar el servicio Gigante Roja como el más completo y valorado por los clientes. Incluir 3 meses de suscripción mensual.
- Incluir 1 mes de suscripción mensual para el plan Sol.
- Destacar la suscripción mensual como opción de valor (CTA), aunque sea para la parte de recursos.
- Implementar toggles para mostrar planes mensuales vs pago único
- Añadir CTA para cada opción de servicio

### TASK-007-12: Desarrollar página de recursos y productos
- Crear página centralizada para todos los recursos y productos
- De momento no implementar sistema de filtrado por categoría y tipo de contenido. No hay suficientes recursos.
- Destacar recursos gratuitos vs contenido premium (requiere suscripción)
- Incluir CTA prominente para la suscripción mensual
- Mostrar previsualizaciones de contenido premium para incentivar suscripción
- Integrar sistema de descarga para recursos gratuitos con captura de email
- Mostrar número de descargas en cada recurso. Generar un algoritmo para calcular el número de descargas en función del tiempo desde la publicación.

### TASK-007-13: Implementar estrategia de contenidos
- Seguir el plan detallado en `.llm/estrategia-contenidos.md`

### TASK-007-14: Optimización SEO
- Implementar las recomendaciones de `.llm/optimizacion-seo.md`

### TASK-007-15: Configuración de Analytics
- Implementar el sistema de analytics según `.llm/analytics.md`

### TASK-007-16: Sistema de testimonios dinámicos
- Implementar la estrategia de testimonios detallada en `.llm/testimonials.md`
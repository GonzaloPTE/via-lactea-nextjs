# Lista de Tareas

Última actualización: 2023-10-07 15:30 (Actualizado: 2024-07-19)

## Tareas

### TASK-001 Definir requisitos del sitio web - Alta - Hecho [COMPLETADO]
**Estado:** Información que sigue siendo relevante para el proyecto.

**Requisitos definidos:**
1. **Objetivos de negocio:**
   - Atraer clientes potenciales interesados en asesoría de sueño infantil y lactancia
   - Posicionar a la asesora como experta en su campo
   - Facilitar la reserva de consultas y servicios
   - Proporcionar información valiosa sobre sueño infantil y lactancia

2. **Público objetivo:**
   - Madres/padres con bebés y niños pequeños con problemas de sueño
   - Madres con dificultades en la lactancia materna
   - Familias buscando mejorar hábitos de sueño
   - Profesionales afines interesados en colaboraciones

3. **Páginas necesarias:**
   - Inicio
   - Sobre mí / Biografía profesional
   - Servicios de asesoría de sueño (con detalles y precios)
   - Servicios de asesoría de lactancia (con detalles y precios)
   - Blog con artículos informativos
   - Testimonios de clientes
   - Contacto y reserva de citas
   - FAQ / Preguntas frecuentes
   - Recursos gratuitos

4. **Funcionalidades requeridas:**
   - Sistema de reserva de citas con calendario
   - Formulario de contacto con validación
   - Blog con categorías y búsqueda
   - Descarga de recursos gratuitos (PDF, infografías)
   - Integración con redes sociales
   - Posible sistema de pago online
   - Newsletter para captación de leads

**Dependencias:** Ninguna
**Version:** 1

### TASK-002 Diseñar arquitectura del sitio - Alta - Hecho [COMPLETADO]
**Estado:** Información que sigue siendo relevante para el proyecto.

**Arquitectura del sitio:**

1. **Estructura de navegación principal:**
   ```
   - Inicio
   - Sobre mí
   - Servicios
     |- Asesoría de sueño infantil
     |- Asesoría de lactancia
   - Blog
   - Testimonios
   - Recursos
   - Contacto
   ```

2. **Jerarquía de páginas:**
   ```
   /                           # Página de inicio
   /sobre-mi                   # Biografía profesional
   /servicios                  # Página general de servicios (opcional)
   /servicios/sueno-infantil   # Servicios de asesoría de sueño
   /servicios/lactancia        # Servicios de asesoría de lactancia
   /blog                       # Lista de artículos del blog
   /blog/[slug]                # Página individual de artículo
   /blog/categoria/[categoria] # Filtrado por categoría
   /testimonios                # Experiencias de clientes
   /recursos                   # Recursos gratuitos descargables
   /faq                        # Preguntas frecuentes
   /contacto                   # Formulario de contacto
   /reserva                    # Sistema de reserva de citas
   /politica-privacidad        # Política de privacidad
   /terminos-condiciones       # Términos y condiciones
   ```

**Dependencias:** TASK-001
**Version:** 1

### TASK-003 Configurar entorno de desarrollo - Alta - Hecho [COMPLETADO]
**Estado:** Completado, pero actualizado para reflejar la compra del tema NextJS.

**Configuración del entorno:**
- Se ha adquirido un tema premium de NextJS que incluye componentes predefinidos
- La estructura de carpetas ya está establecida por el tema
- Las dependencias necesarias ya están instaladas
- Se utilizará la estructura y componentes del tema como base para el desarrollo

**Dependencias:** Ninguna
**Version:** 1

### TASK-004 Diseñar identidad visual - Alta - Hecho [COMPLETADO]
**Estado:** Información que sigue siendo relevante para el proyecto.

**Identidad visual:**

1. **Nombre del sitio:** Vía Láctea - Asesoría de Sueño Infantil y Lactancia

2. **Paleta de colores:**
   - **Primarios:**
     - Morado uva (grape): Se utilizará el color "grape" del tema como color principal
   - **Secundarios:**
     - Lavanda suave: Tonos complementarios del tema
   - **Neutros:**
     - Blanco: `#ffffff`
     - Tonos de gris del tema

3. **Tipografía:** La que utilice el tema premium.

**Dependencias:** TASK-001
**Version:** 2

### TASK-005 Análisis de componentes del tema - Alta - Hecho [COMPLETADO]
**Descripción:** Revisar y documentar los componentes disponibles en el tema adquirido para entender su estructura, funcionamiento y posibilidades de personalización.

**Objetivos:**
- Explorar la estructura de carpetas y archivos del tema
- Identificar los componentes principales y su funcionalidad
- Documentar cómo se utilizan los componentes del tema
- Analizar qué componentes pueden reutilizarse para las necesidades del proyecto
- Identificar las posibles limitaciones o necesidades de personalización

**Dependencias:** TASK-003
**Version:** 0

### TASK-006 Adaptación de la identidad visual al tema - Alta - [COMPLETADO]
**Descripción:** Adaptar la identidad visual definida para "Vía Láctea" a los componentes y estilos del tema comprado.

**Objetivos:**
- Utilizar el color "grape" del tema como color principal
- Dejar de momento la tipografía y tamaños de fuente del tema
- Tratar de no modificar estilos de componentes. El tema premium ya ha pensado en todo esto.
- Integrar el logo e iconografía propios
- Asegurar que las modificaciones respeten la estructura del tema

**Dependencias:** TASK-004, TASK-005
**Version:** 1

### TASK-007 Implementar página de inicio - Alta - [INTEGRACIONES]
**Descripción:** Adaptar y personalizar componentes del tema para crear la página de inicio que represente adecuadamente la marca "Vía Láctea" y sus servicios.

**Objetivos:**
- Seleccionar y adaptar el componente Hero adecuado 
- Crear sección de testimonios y prueba social
- Añadir sección de pricing con todos los servicios disponibles
- Implementar llamadas a la acción estratégicas
- Asegurar que el contenido sea relevante para el público objetivo
- Desactivar las secciones que aún pudieran no estar listas (p.ej. vídeos)
- Asegurar un buen copy
- Desplegar en CloudFlare una versión de la home sencilla (SSG)
- Integrar con Calendly (Free Tier) las valoraciones gratuitas de la Home, conectado a HubSpot Free CRM. Ver razonamiento en `.llm/crm-hubspot.md` y detalles de scheduling en `.llm/meeting-scheduling.md`.
- Integrar con Stripe los eventos como la Llamada SOS.
- Integrar con Hubspot API para incluir suscriptores en las listas de newsletter. Añadir captcha de Cloudflare.
- Configurar Hubspot y Calendly para que los leads de las valoraciones se creen como tales, mientras que se marquen como clientes los de la Llamada SOS. Ver `.llm/servicios.md`.
- Implementar sección de servicios y productos `.llm/servicios.md` y `.llm/productos.md`. Ver planificación más detalladaen `.llm/llm-todos-007.md`.

**Dependencias:** TASK-006
**Version:** 0

### TASK-008: Implementar sistema de newsletter - Alta - [CAPTCHA]
**Descripción:** Implementar newsletter en Hubspot y MailGun. Añadir captcha de Cloudflare para evitar spam en el formulario de contacto.
**Dependencias:** TASK-006
**Version:** 1

### TASK-009 Implementar página "Sobre mí" - Media - [PENDIENTE]
**Descripción:** Crear página con biografía detallada, formación, certificaciones y filosofía de trabajo de la asesora.
**Dependencias:** TASK-006
**Version:** 1

### TASK-010 Implementar página de servicios - Alta - [INTEGRACIONES]
**Descripción:** Desarrollar página detallando los servicios específicos de asesoría de sueño, metodología, beneficios y precios, aprovechando componentes del tema.
**Dependencias:** TASK-006
**Version:** 1

### TASK-011 Implementar página de detalle servicios - Alta - [INTEGRACIONES]
**Descripción:** Desarrollar página detallando los servicios específicos de asesoría en lactancia, metodología, beneficios y precios, aprovechando componentes del tema.
**Dependencias:** TASK-006
**Version:** 1

### TASK-012 Implementar blog y sistema de creación de contenido automatizado - Media - [PENDIENTE]
**Descripción:** Adaptar componentes del tema para crear sección de blog con artículos informativos sobre sueño infantil y lactancia. Incluir sistema de creación de contenido automatizado.
**Dependencias:** TASK-006
**Version:** 1

### TASK-013 Implementar sistema de reserva de citas - Alta - [PENDIENTE]
**Descripción:** Crear en calendly todos los eventos asociados a los servicios.
**Dependencias:** TASK-006
**Version:** 1

### TASK-014 Implementar sistema de testimonios o reseñas - Media - [PENDIENTE]
**Descripción:** Crear un sistema de testimonios o reseñas simulado.
**Dependencias:** TASK-006
**Version:** 1

### TASK-015 Implementar formulario de contacto - Alta - [PENDIENTE]
**Descripción:** Personalizar formulario de contacto del tema con validación y sistema de envío de correos electrónicos.
**Dependencias:** TASK-006
**Version:** 1

### TASK-016 Implementar recursos gratuitos descargables - Baja - [COMPLETADO]
**Descripción:** Crear sección para ofrecer guías, checklists o infografías gratuitas como estrategia de generación de leads.
**Dependencias:** TASK-006
**Version:** 1

### TASK-017 Implementar FAQ - Media - [PENDIENTE]
**Descripción:** Adaptar componentes del tema para desarrollar sección de preguntas frecuentes sobre los servicios, metodología y temas comunes.
**Dependencias:** TASK-006
**Version:** 1

### TASK-018 Optimizar SEO - Alta - [PENDIENTE]
**Descripción:** Implementar metadatos, etiquetas semánticas, alt text en imágenes y optimización para motores de búsqueda. Integrar Google Analytics. Implementar las recomendaciones de `.llm/optimizacion-seo.md`
**Dependencias:** TASK-007, TASK-008, TASK-010, TASK-011
**Version:** 1

### TASK-019 Implementar estrategia de contenidos - Alta - [PENDIENTE]
**Descripción:** Seguir el plan detallado en `.llm/estrategia-contenidos.md`
**Dependencias:** TASK-007, TASK-008, TASK-010, TASK-011
**Version:** 1

### TASK-020 Configuración de Analytics - Alta - [PENDIENTE]
**Descripción:** Implementar el sistema de analytics según `.llm/analytics.md`
**Dependencias:** TASK-007, TASK-008, TASK-010, TASK-011
**Version:** 1

### TASK-021 Sistema de testimonios dinámicos - Alta - [PENDIENTE]
**Descripción:** Implementar la estrategia de testimonios detallada en `.llm/testimonials.md`
**Dependencias:** TASK-007, TASK-008, TASK-010, TASK-011
**Version:** 1

### TASK-022 Desplegar sitio web - Alta - [COMPLETADO]
**Descripción:** Configurar hosting y desplegar sitio web en producción. Configurar dominio y certificados SSL.
**Dependencias:** TASK-020
**Version:** 1 
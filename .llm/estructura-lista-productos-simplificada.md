# Estructura simplificada de la página de lista de productos (con componentes de referencia)

1. **Header con Navbar** (ya implementado)

2. **Hero section** - Basado en componente Hero21.tsx
   - Título claro: "Recursos y materiales"
   - Descripción breve del propósito de estos recursos
   - Buscador simple para encontrar recursos específicos
   - CTA de suscripción mensual destacando que todos los recursos están incluidos

3. **Filtros esenciales y Sidebar** - Basado en BlogSidebar de Blog6.tsx
   - Selector simple de categoría: "Sueño" | "Lactancia" | "Desarrollo" | "Todos"
   - Toggle para "Solo gratuitos" / "Todos los recursos"
   - Opción de ordenar por relevancia/fecha/precio
   - Barra lateral con opciones adicionales (categorías, recursos destacados, etc.)

4. **Productos destacados** - Basado en formato de BlogCard2 de Blog6.tsx
   - Presentación destacada de 2-3 recursos principales en formato grande
   - Cada tarjeta muestra: imagen destacada, título, descripción y categoría

5. **Listado principal de productos** - Basado en formato grid de Blog6.tsx
   - Cuadrícula con diseño de BlogCard3 para el resto de productos
   - Cada tarjeta incluye:
     - Imagen representativa
     - Título claro
     - Etiqueta de tipo (Guía, PDF, Curso, etc.)
     - Indicador de precio o "Gratuito"
     - Botón simple de acción: "Ver" o "Obtener"

6. **Sección de suscripción** - Basado en CTA8.tsx
   - Banner con fondo de imagen atractivo
   - Título persuasivo destacando el valor de la suscripción mensual
   - Un solo botón de acción "Suscribirme"
   - Mencionar todos los recursos premium incluidos con diseño destacado

7. **Estado "Próximamente" (cuando no hay productos)**
   - Mostrar cuando no hay productos que listar (lista vacía o filtros sin resultados)
   - Diseño similar a una página 404, pero adaptado:
     - Ilustración amigable de un bebé durmiendo o mamá amamantando
     - Mensaje principal: "Nuevos recursos en camino"
     - Texto secundario: "Estamos preparando contenido valioso para ti"
     - Botón para suscribirse a notificaciones: "Avísame cuando estén disponibles"
     - Opción para volver a la página principal o contactar para sugerir temas

8. **Footer** (ya implementado)

Esta estructura aprovecha los componentes existentes del tema premium con modificaciones mínimas:
- Hero21.tsx: Para crear un hero enfocado en recursos con CTA de suscripción
- Blog6.tsx: Para el sistema de listado de recursos y sidebar con filtros 
- CTA8.tsx: Para el CTA final de suscripción mensual

Esto permite mantener la cohesión visual con el resto del sitio mientras se optimiza la presentación para los recursos específicos de lactancia y sueño. 
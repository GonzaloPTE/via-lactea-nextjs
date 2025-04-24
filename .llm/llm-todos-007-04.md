## Mejoras en la página de recursos

### 1. Filtros con caracteres acentuados
- **Problema**: En el filtro de recursos, las categorías con caracteres especiales como "ñ" (ej: "Sueño") no funcionaban correctamente al ser codificados en la URL.
- **Solución**: Implementación de normalización de strings para manejar correctamente categorías con acentos.
- **Archivos modificados**:
  - `src/app/recursos/page.tsx` - Adición de función `normalizeString` y su aplicación en filtros y URLs
  - `src/components/blocks/resources/ResourcesSidebar.tsx` - Aplicación de normalización en comparaciones de categorías

### 2. Visualización de descargas de recursos
- **Problema**: Los badges "Gratuito" tenían problemas de centrado vertical y se requería mostrar el número de descargas.
- **Solución**: Corrección del centrado mediante clases Bootstrap y adición de contadores de descargas dinámicos.
- **Archivos modificados**:
  - `src/components/blocks/resources/ResourceCardFeatured.tsx` - Mejora visual y adición de contador
  - `src/components/reuseable/product-cards/ResourceCard.tsx` - Mejora visual y adición de contador
  - `src/components/blocks/resources/ResourcesLayout.tsx` - Actualización de la interfaz `IResource` para incluir campo `downloads`

### 3. Cálculo dinámico de descargas
- **Problema**: Necesidad de mostrar descargas que incrementen con el tiempo desde la publicación.
- **Solución**: Implementación de un algoritmo que calcula descargas basadas en la fecha de publicación.
- **Archivos creados/modificados**:
  - `src/utils/downloads.ts` (nuevo) - Función `calculateDownloads` que utiliza la fecha para calcular descargas
  - `src/app/recursos/page.tsx` - Integración del cálculo dinámico de descargas

### 4. Unificación del modelo de datos y enrutamiento por slug
- **Problema**: Los datos de recursos estaban dispersos entre `resourcesData` en `page.tsx` y el modelo `ProductItem` en `product-data.ts`, causando inconsistencias y problemas de navegación con las URLs basadas en slug.
- **Solución**: Migración completa al modelo `ProductItem` y cambio de la estructura de carpetas para usar [slug] en lugar de [id].
- **Archivos modificados/creados**:
  - `src/data/product-data.ts` - Ampliación con los datos de recursos adicionales en formato `ProductItem`
  - `src/app/recursos/page.tsx` - Eliminación de `resourcesData` y uso del modelo unificado `ProductItem`
  - `src/app/recursos/[slug]/page.tsx` - Nuevo archivo para reemplazar la estructura anterior basada en [id]
  - Eliminación de `src/app/recursos/[id]/page.tsx`

## Estructura y archivos clave

### Componentes de recursos
- `src/app/recursos/page.tsx` - Página principal de recursos con filtros y datos
- `src/app/recursos/[slug]/page.tsx` - Página de detalle del recurso basada en slug
- `src/components/blocks/resources/ResourcesLayout.tsx` - Layout general de la página
- `src/components/blocks/resources/ResourcesSidebar.tsx` - Barra lateral con filtros
- `src/components/blocks/resources/ResourceCardFeatured.tsx` - Tarjeta para recursos destacados
- `src/components/reuseable/product-cards/ResourceCard.tsx` - Tarjeta para recursos regulares
- `src/components/reuseable/products/ResourceDetailActions.tsx` - Acciones para el detalle del producto
- `src/components/reuseable/products/ResourceDetailDescription.tsx` - Descripción para el detalle del producto
- `src/components/reuseable/products/ResourceDetailAuthor.tsx` - Información del autor en el detalle del producto

### Utilidades
- `src/utils/downloads.ts` - Cálculo de descargas basado en fechas

### Datos
- `src/data/product-data.ts` - Modelo unificado `ProductItem` para todos los recursos

## Algoritmos implementados
- **Normalización de cadenas**: Función para eliminar acentos y convertir a minúsculas
- **Cálculo de descargas**: Algoritmo basado en la antigüedad de la publicación
- **Mapeo de modelos**: Conversión de `ProductItem` a `IResource` para mantener compatibilidad con componentes existentes

## Pendientes y consideraciones
- Algunas fechas de recursos están establecidas en el futuro (2025), lo que resultará en contadores de descargas mínimos.
- Las fechas podrían ajustarse a fechas pasadas para mostrar números de descargas más realistas.
- El diseño actual muestra las descargas tanto en las tarjetas destacadas como en las regulares, con estilos consistentes.
- La navegación ahora utiliza slugs en lugar de IDs, mejorando el SEO y la experiencia de usuario.

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

## Estructura y archivos clave

### Componentes de recursos
- `src/app/recursos/page.tsx` - Página principal de recursos con filtros y datos
- `src/components/blocks/resources/ResourcesLayout.tsx` - Layout general de la página
- `src/components/blocks/resources/ResourcesSidebar.tsx` - Barra lateral con filtros
- `src/components/blocks/resources/ResourceCardFeatured.tsx` - Tarjeta para recursos destacados
- `src/components/reuseable/product-cards/ResourceCard.tsx` - Tarjeta para recursos regulares

### Utilidades
- `src/utils/downloads.ts` - Cálculo de descargas basado en fechas

### Datos
- La estructura de los recursos incluye:
  ```typescript
  interface IResource {
    id: string;
    image: string;
    title: string;
    type: string;
    description?: string;
    price: number;
    isFree?: boolean;
    url: string;
    category: string;
    date?: string;
    featured?: boolean;
    downloads?: number;
  }
  ```

## Algoritmos implementados
- **Normalización de cadenas**: `str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()`
- **Cálculo de descargas**: 
  ```typescript
  const calculateDownloads = (publishDate: string): number => {
    const pubDate = new Date(publishDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - pubDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Algoritmo: base + (días * factor aleatorio)
    const base = 50;
    const dailyFactor = 2 + Math.random() * 3; // Entre 2 y 5 descargas por día
    
    return Math.floor(base + (diffDays * dailyFactor));
  };
  ```

## Pendientes y consideraciones
- Algunas fechas de recursos están establecidas en el futuro (2025), lo que resultará en contadores de descargas mínimos.
- Las fechas podrían ajustarse a fechas pasadas para mostrar números de descargas más realistas.
- El diseño actual muestra las descargas tanto en las tarjetas destacadas como en las regulares, con estilos consistentes.

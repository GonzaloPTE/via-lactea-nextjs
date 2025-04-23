# Sistema de Urgencia para Recursos Gratuitos

## Objetivo
Crear una sensación de urgencia en el usuario para incentivar la descarga de recursos gratuitos antes de que se conviertan en productos de pago o se alcance un límite de descargas.

## Componentes del Sistema

### 1. Datos para cada recurso gratuito:
- `limitDate`: Fecha límite hasta la que el recurso estará disponible gratuitamente
- `downloadLimit`: Número máximo de descargas antes de que el recurso deje de ser gratuito
- `currentDownloads`: Contador actual de descargas (comienza en el 61% del límite)

### 2. Visualización:
- Barra de progreso que muestra qué porcentaje del límite se ha alcanzado
- Contador de días restantes hasta la fecha límite
- Mensaje motivador que incentiva la descarga inmediata

### 3. Algoritmo de cálculo:
- El progreso base se calcula como `(currentDownloads / downloadLimit) * 100`
- Cuando quedan 7 días o menos, se añade un factor de urgencia que acelera el progreso
- El factor de urgencia se calcula para que, en los últimos 3 días, la barra esté casi llena (98%)

### 4. Comportamiento al alcanzar límites:
- Cuando se alcanza la fecha límite o el número máximo de descargas:
  - El recurso se marca automáticamente como no gratuito (`isFree = false`)
  - Se establece un precio (anteriormente era 0)
  - Se recalcula una nueva fecha límite (1 mes adelante)
  - Se resetea el contador actual al 61% del límite
  
## Ciclo de vida de un recurso gratuito

1. **Estado inicial**:
   - Recurso marcado como gratuito
   - Contador de descargas al 61% del límite
   - Fecha límite establecida a 1-2 meses en el futuro
   
2. **Durante el periodo gratuito**:
   - El contador de descargas aumenta gradualmente
   - La barra de progreso avanza lentamente
   
3. **Última semana**:
   - El ritmo de avance de la barra se acelera
   - Los mensajes de urgencia se hacen más evidentes
   
4. **Finalización**:
   - Al alcanzar el límite, el recurso cambia a estado de pago
   - Si no se alcanza el límite pero se llega a la fecha límite, igualmente cambia a estado de pago
   - El sistema inmediatamente recalcula nuevos límites y fechas

## Implementación técnica

### Archivos y componentes clave

1. **Utilidades para cálculos de urgencia**
   - Archivo: `src/utils/urgency.ts` 
   - Funciones:
     - `calculateUrgencyProgress`: Calcula el porcentaje actual de la barra y los días restantes
     - `resetUrgencyCounters`: Recalcula nueva fecha límite y reinicia contador

2. **Componente de barra de progreso**
   - Archivo: `src/components/reuseable/UrgencyProgressBar.tsx`
   - Características: Muestra barra de progreso visual con colores según nivel de urgencia
   - Mensajes: Genera texto personalizado según días restantes

3. **Integración en tarjetas de recursos**
   - Archivos:
     - `src/components/reuseable/product-cards/ResourceCard.tsx` (tarjetas normales)
     - `src/components/blocks/resources/ResourceCardFeatured.tsx` (tarjetas destacadas)
   - Implementación: Ambos archivos incluyen lógica condicional para mostrar la barra cuando el recurso es gratuito

### Componentes visuales y comportamiento

- **Colores de la barra de progreso**:
  - Verde: Progreso < 40% (baja urgencia)
  - Amarillo: Progreso entre 40% y 70% (urgencia media)
  - Rojo: Progreso > 70% (alta urgencia)

- **Mensajes según días restantes**:
  - 0 días: "¡Último día! La oferta termina hoy"
  - 1 día: "Solo queda 1 día para aprovechar esta oferta"
  - 2-3 días: "¡Solo quedan X días! Aprovecha ahora"
  - 4-7 días: "Oferta disponible por X días más"
  - 8-14 días: "Oferta por tiempo limitado"
  - >14 días: "Disponible por tiempo limitado"

### Modelo de datos necesario

Los recursos gratuitos con sistema de urgencia requieren estos campos adicionales:
- `limitDate`: Fecha de caducidad de la oferta (formato ISO)
- `downloadLimit`: Cantidad máxima de descargas permitidas
- `currentDownloads`: Número actual de descargas acumuladas

Este sistema crea un ciclo constante donde los recursos gratuitos van rotando, incentivando a los usuarios a descargarlos antes de que se vuelvan de pago, y luego reaparecen como gratuitos para una nueva audiencia. 
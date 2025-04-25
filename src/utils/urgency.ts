/**
 * Calcula el progreso de urgencia basado en descargas y fecha límite
 * 
 * @param currentDownloads - Número actual de descargas del recurso
 * @param downloadLimit - Límite máximo de descargas permitidas
 * @param limitDate - Fecha límite en formato ISO string
 * @returns Objeto con progreso calculado y días restantes, y nueva fecha límite si era necesario recalcular
 */
export function calculateUrgencyProgress(
  currentDownloads: number,
  downloadLimit: number,
  limitDate: string
): { progress: number; daysRemaining: number; recalculatedDate?: string } {
  
  // Calcular el progreso basado en descargas (como porcentaje)
  const downloadProgress = Math.min(Math.round((currentDownloads / downloadLimit) * 100), 100);
  
  // Calcular días restantes
  const today = new Date();
  let endDate = new Date(limitDate);
  
  
  // Verificar si la fecha límite ya pasó
  let recalculatedDate: string | undefined;
  if (endDate < today) {
    // La fecha límite ha pasado, recalcular al último día del mes actual
    const newEndDate = getEndOfCurrentMonth();
    recalculatedDate = newEndDate.toISOString().split('T')[0];
    endDate = newEndDate;
  }
  
  const timeDiff = endDate.getTime() - today.getTime();
  const daysRemaining = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 0);
  
  return {
    progress: downloadProgress, // Solo usamos el progreso de descargas
    daysRemaining,
    recalculatedDate
  };
}

/**
 * Devuelve la fecha del último día del mes actual
 * @returns Fecha del último día del mes actual
 */
function getEndOfCurrentMonth(): Date {
  const today = new Date();
  
  // Establecer al último día del mes actual
  // Creamos una fecha con el día 0 del siguiente mes, que es el último día del mes actual
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Configurar a las 23:59:59 de ese día
  lastDay.setHours(23, 59, 59, 999);
  
  return lastDay;
}

/**
 * Recalcula los contadores de urgencia para un recurso
 * 
 * @returns Objeto con nuevos valores de contadores recalculados
 */
export function resetUrgencyCounters(): { 
  newDownloads: number; 
  newLimitDate: string;
} {
  // Generar nueva fecha límite (fin del mes actual)
  const newLimitDate = getEndOfCurrentMonth();
  
  // Formato ISO sin hora para la fecha límite (YYYY-MM-DD)
  const formattedDate = newLimitDate.toISOString().split('T')[0];
  
  // Establecer descargas al 61% del límite estándar (500)
  const standardLimit = 500;
  const newDownloads = Math.round(standardLimit * 0.61);
  
  return {
    newDownloads,
    newLimitDate: formattedDate
  };
} 
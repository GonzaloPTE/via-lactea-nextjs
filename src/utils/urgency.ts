/**
 * Calcula el progreso de urgencia basado en descargas y fecha límite
 * 
 * @param currentDownloads - Número actual de descargas del recurso
 * @param downloadLimit - Límite máximo de descargas permitidas
 * @param limitDate - Fecha límite en formato ISO string
 * @returns Objeto con progreso calculado y días restantes
 */
export function calculateUrgencyProgress(
  currentDownloads: number,
  downloadLimit: number,
  limitDate: string
): { progress: number; daysRemaining: number } {
  console.log('[calculateUrgencyProgress] Input:', { currentDownloads, downloadLimit, limitDate });
  
  // Calcular el progreso basado en descargas (como porcentaje)
  const downloadProgress = Math.min(Math.round((currentDownloads / downloadLimit) * 100), 100);
  console.log('[calculateUrgencyProgress] downloadProgress:', downloadProgress);
  
  // Calcular días restantes
  const today = new Date();
  const endDate = new Date(limitDate);
  console.log('[calculateUrgencyProgress] Dates:', { 
    today: today.toISOString(), 
    endDate: endDate.toISOString() 
  });
  
  const timeDiff = endDate.getTime() - today.getTime();
  const daysRemaining = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 0);
  console.log('[calculateUrgencyProgress] Time calculation:', { timeDiff, daysRemaining });
  
  // El progreso final es el mayor entre el progreso de descargas y el progreso temporal
  const timeProgress = 100 - Math.min(Math.round((daysRemaining / 30) * 100), 100);
  const finalProgress = Math.max(downloadProgress, timeProgress);
  console.log('[calculateUrgencyProgress] Final calculation:', { 
    timeProgress, 
    finalProgress 
  });
  
  return {
    progress: finalProgress,
    daysRemaining
  };
}

/**
 * Recalcula una nueva fecha límite y resetea el contador de descargas
 * @returns Nueva fecha límite (1 mes adelante) y descargas reseteadas
 */
export const resetUrgencyCounters = (): { newLimitDate: string; newCurrentDownloads: number } => {
  // Calcular nueva fecha límite (1 mes adelante)
  const today = new Date();
  const newEndDate = new Date(today);
  newEndDate.setMonth(today.getMonth() + 1);
  
  // Resetear al 61% de un límite estándar (500 por defecto)
  const downloadLimit = 500;
  const newCurrentDownloads = Math.round(downloadLimit * 0.61);
  
  return {
    newLimitDate: newEndDate.toISOString().split('T')[0],
    newCurrentDownloads
  };
}; 
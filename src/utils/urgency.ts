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
  
  // Cálculo mejorado del progreso temporal - asegura alta urgencia en los últimos días
  let timeProgress = 0;
  
  if (daysRemaining === 0) {
    // Último día: la barra debe estar casi llena (95-100%)
    timeProgress = 95 + Math.random() * 5; // Entre 95% y 100%
  } else if (daysRemaining <= 3) {
    // 1-3 días: progreso alto (80-95%)
    timeProgress = 80 + ((3 - daysRemaining) / 3) * 15;
  } else if (daysRemaining <= 7) {
    // 4-7 días: progreso medio-alto (65-80%)
    timeProgress = 65 + ((7 - daysRemaining) / 4) * 15;
  } else if (daysRemaining <= 14) {
    // 8-14 días: progreso medio (40-65%)
    timeProgress = 40 + ((14 - daysRemaining) / 7) * 25;
  } else {
    // Más de 14 días: progreso bajo (basado en 30 días como referencia)
    timeProgress = Math.max(5, 40 - ((daysRemaining - 14) / 16) * 35);
  }
  
  // El progreso final es el mayor entre el progreso de descargas y el progreso temporal
  const finalProgress = Math.max(downloadProgress, Math.round(timeProgress));
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
import { calculateUrgencyProgress } from '../../utils/urgency';
import React from 'react';

export interface UrgencyProgressBarProps {
  currentDownloads?: number;
  downloadLimit?: number;
  limitDate?: string;
  className?: string;
}

/**
 * Componente que muestra una barra de progreso para crear sensación de urgencia
 * Muestra el porcentaje de límite alcanzado y días restantes
 */
export function UrgencyProgressBar({
  currentDownloads = 0,
  downloadLimit = 500,
  limitDate,
  className = '',
}: UrgencyProgressBarProps) {
  // Log values for debugging
  console.log('[UrgencyProgressBar] Props:', { currentDownloads, downloadLimit, limitDate });

  // Calcular progreso y días restantes solo si hay fecha límite
  const progressData = limitDate 
    ? calculateUrgencyProgress(currentDownloads, downloadLimit, limitDate) 
    : { progress: 0, daysRemaining: 0 };

  const { progress, daysRemaining } = progressData;
  
  // Log calculated values
  console.log('[UrgencyProgressBar] Calculated:', { progress, daysRemaining });

  // Determinar la clase de color según el progreso
  let colorClass = '';
  if (progress < 40) {
    colorClass = 'bg-success';
  } else if (progress < 70) {
    colorClass = 'bg-warning';
  } else {
    colorClass = 'bg-danger';
  }

  // Generar mensaje según días restantes
  let urgencyMessage = '';
  if (daysRemaining === 0) {
    urgencyMessage = '¡Último día! La oferta termina hoy';
  } else if (daysRemaining === 1) {
    urgencyMessage = 'Solo queda 1 día para aprovechar esta oferta';
  } else if (daysRemaining <= 3) {
    urgencyMessage = `¡Solo quedan ${daysRemaining} días! Aprovecha ahora`;
  } else if (daysRemaining <= 7) {
    urgencyMessage = `Oferta disponible por ${daysRemaining} días más`;
  } else if (daysRemaining <= 14) {
    urgencyMessage = 'Oferta por tiempo limitado';
  } else {
    urgencyMessage = 'Disponible por tiempo limitado';
  }

  // Si no hay fecha límite, no renderizar nada
  if (!limitDate) {
    console.log('[UrgencyProgressBar] No limitDate, returning null');
    return null;
  }
  
  return (
    <div className={`urgency-container ${className}`}>
      {/* Barra de progreso con estilo mejorado */}
      <div className="progress" style={{ height: '12px', borderRadius: '6px', background: '#e9ecef' }}>
        <div 
          className={`progress-bar ${colorClass}`} 
          role="progressbar" 
          style={{ 
            width: `${progress}%`, 
            transition: 'width 0.5s ease'
          }} 
          aria-valuenow={progress} 
          aria-valuemin={0} 
          aria-valuemax={100}
        ></div>
      </div>
      
      {/* Mensaje de urgencia con mejor visibilidad */}
      <p className="mt-2 mb-0 fs-sm text-danger fw-bold">
        {urgencyMessage}
      </p>
    </div>
  );
} 
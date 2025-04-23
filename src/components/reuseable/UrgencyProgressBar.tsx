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
 * Muestra descargas ocupadas y disponibles con una barra de progreso simple
 */
export function UrgencyProgressBar({
  currentDownloads = 0,
  downloadLimit = 500,
  limitDate,
  className = '',
}: UrgencyProgressBarProps) {
  // Calcular días restantes solo si hay fecha límite
  const progressData = limitDate 
    ? calculateUrgencyProgress(currentDownloads, downloadLimit, limitDate) 
    : { progress: 0, daysRemaining: 0 };

  // Usamos solo los días restantes del cálculo
  const { daysRemaining } = progressData;
  
  // Calcular el progreso basado en las descargas ocupadas
  const downloadPercentage = Math.round((currentDownloads / downloadLimit) * 100);
  
  // Calcular descargas restantes
  const remainingDownloads = downloadLimit - currentDownloads;
  
  // Si no hay fecha límite, no renderizar nada
  if (!limitDate) {
    return null;
  }
  
  // Formatear la fecha para mostrarla en formato simple
  const formatSimpleDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  return (
    <div className={`urgency-container ${className}`}>
      {/* Información de descargas y fecha */}
      <div className="d-flex justify-content-between mb-1">
        <small className="text-muted">
          {currentDownloads} de {downloadLimit} descargas gratis
        </small>
        
        <small className="text-muted">
          Hasta el {formatSimpleDate(limitDate)}
        </small>
      </div>
      
      {/* Barra de progreso simple con color primario */}
      <div className="progress" style={{ height: '12px', borderRadius: '6px', background: '#e9ecef' }}>
        <div 
          role="progressbar" 
          className="bg-primary"
          style={{ 
            width: `${downloadPercentage}%`, 
            height: '100%',
            borderRadius: '6px',
            transition: 'width 0.5s ease',
            minWidth: downloadPercentage > 0 ? '10px' : '0'
          }} 
          aria-valuenow={downloadPercentage} 
          aria-valuemin={0} 
          aria-valuemax={100}
        />
      </div>
      
      {/* Un solo literal sobre descargas restantes */}
      <p className="mt-2 mb-0 text-center">
        <span className="text-primary fw-semibold">
          ¡Solo quedan {remainingDownloads} descargas disponibles!
        </span>
      </p>
    </div>
  );
} 
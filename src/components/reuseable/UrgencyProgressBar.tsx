import React, { useState, useEffect } from 'react';
import { calculateUrgencyProgress } from '../../utils/urgency';

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
  const [progressData, setProgressData] = useState<{
    progress: number;
    daysRemaining: number;
    recalculatedDate?: string;
  }>({
    progress: 0,
    daysRemaining: 0,
    recalculatedDate: undefined
  });
  
  useEffect(() => {
    if (limitDate) {
      // Calcular el progreso basado en descargas y fecha límite
      const result = calculateUrgencyProgress(currentDownloads, downloadLimit, limitDate);
      setProgressData(result);
    }
  }, [currentDownloads, downloadLimit, limitDate]);
  
  // Si no hay fecha límite, no renderizar nada
  if (!limitDate) {
    return null;
  }
  
  // Formatear la fecha para mostrarla en un formato más amigable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Calcular las descargas restantes
  const remainingDownloads = downloadLimit - currentDownloads;
  
  // Usar directamente el progreso de descargas para la barra de progreso
  const displayDate = progressData.recalculatedDate || limitDate;
  
  // Estilos para la animación de reflejo
  const animationStyle = `
    @keyframes shineEffect {
      0% { background-position: 600% 0; }
      100% { background-position: -600% 0; }
    }
  `;
  
  return (
    <div className={`urgency-container ${className}`}>
      {/* Estilos para la animación */}
      <style>{animationStyle}</style>
      
      {/* Información de descargas y fecha */}
      <div className="d-flex justify-content-between mb-1">
        <small className="">
          {currentDownloads} de {downloadLimit} descargas gratis
        </small>
        
        <small className="">
          Gratis hasta el <i className="uil uil-calendar-alt"></i> {formatDate(displayDate)}
        </small>
      </div>
      
      {/* Barra de progreso simple con color según nivel de progreso */}
      <div className="progress" style={{ height: '12px', borderRadius: '6px', background: '#e9ecef' }}>
        <div 
          role="progressbar" 
          className="bg-primary"
          style={{ 
            width: `${progressData.progress}%`, 
            height: '100%',
            borderRadius: '6px',
            transition: 'width 0.5s ease',
            minWidth: progressData.progress > 0 ? '10px' : '0',
            background: 'linear-gradient(60deg, transparent, rgba(255, 255, 255, 0.53), transparent)',
            backgroundSize: '200% 50%',
            animation: 'shineEffect 20s infinite linear',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'var(--bs-primary)'
          }} 
          aria-valuenow={progressData.progress} 
          aria-valuemin={0} 
          aria-valuemax={100}
        />
      </div>
      
      {/* Mensaje sobre descargas restantes */}
      <p className="mt-2 mb-0 text-center">
        <span className="text-primary fw-semibold">
          ¡Solo quedan {remainingDownloads} descargas disponibles!
        </span>
      </p>
    </div>
  );
} 
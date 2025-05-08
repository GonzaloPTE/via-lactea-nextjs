"use client";

import { useEffect } from 'react';

// Add Calendly type declaration for TypeScript
declare global {
  interface Window {
    Calendly?: any;
  }
}

/**
 * Hook personalizado para manejar la integración con Calendly
 * @param uniqueId Un identificador único para evitar duplicación de scripts (ej: 'navbar', 'footer')
 * @param url URL de Calendly para la reserva (opcional, usa valor por defecto si no se especifica)
 * @returns Función handleCalendlyClick para abrir el widget de Calendly
 */
export default function useCalendly(
  uniqueId: string = 'default',
  url: string = 'https://calendly.com/vialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba'
) {
  useEffect(() => {
    // Load Calendly script dynamically if not already loaded
    if (!document.getElementById(`calendly-script-${uniqueId}`)) {
      const script = document.createElement("script");
      script.id = `calendly-script-${uniqueId}`;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);

      // Add Calendly CSS if not already added
      if (!document.getElementById(`calendly-css-${uniqueId}`)) {
        const link = document.createElement("link");
        link.id = `calendly-css-${uniqueId}`;
        link.href = "https://assets.calendly.com/assets/external/widget.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    }
  }, [uniqueId]);

  // Función para abrir el widget de Calendly
  const handleCalendlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: url
      });
    }
    return false;
  };

  return { handleCalendlyClick };
} 
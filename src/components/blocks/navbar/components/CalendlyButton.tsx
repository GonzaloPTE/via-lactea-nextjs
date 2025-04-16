"use client";

import React from "react";
import useCalendly from "hooks/useCalendly";

// Props para personalizar el botón
interface CalendlyButtonProps {
  text?: string;                // Texto del botón
  icon?: string;                // Clase CSS del icono (ej: "uil uil-whatsapp")
  className?: string;           // Clases CSS adicionales
  calendlyUrl?: string;         // URL personalizada de Calendly
}

export default function CalendlyButton({
  text = "Valoración GRATUITA",
  icon = "uil uil-whatsapp",
  className = "btn btn-sm btn-primary rounded mt-1",
  calendlyUrl
}: CalendlyButtonProps) {
  // Usar el hook personalizado
  const { handleCalendlyClick } = useCalendly('navbar', calendlyUrl);

  return (
    <a 
      href="#" 
      onClick={handleCalendlyClick} 
      className={className}
    >
      {icon && <i className={`${icon} fs-25 me-1`}></i>}
      {text}
    </a>
  );
} 
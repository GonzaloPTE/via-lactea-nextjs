"use client";

import { ReactNode, useEffect } from "react";
import Turnstile from "components/turnstile/Turnstile";
import useTurnstile from "hooks/useTurnstile";

interface TurnstileProtectionProps {
  children: ReactNode;
  onTokenChange?: (token: string | null) => void;
  errorElementId?: string;
  theme?: 'light' | 'dark';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

export default function TurnstileProtection({
  children,
  onTokenChange,
  errorElementId,
  theme = 'light',
  appearance = 'execute'
}: TurnstileProtectionProps) {
  // Usar el hook de Turnstile para manejar la verificación
  const { turnstileToken, handleVerify } = useTurnstile({
    onError: (message) => {
      // Mostrar mensaje de error en el elemento especificado si existe
      if (errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
          errorElement.style.display = 'block';
          errorElement.textContent = message;
        }
      }
    }
  });

  // Usar useEffect para notificar cambios en el token al componente padre
  useEffect(() => {
    if (onTokenChange) {
      onTokenChange(turnstileToken);
    }
  }, [turnstileToken, onTokenChange]);

  return (
    <div>
      {children}

      {/* Widget invisible de Turnstile */}
      <div style={{ height: 0, overflow: 'hidden', visibility: 'hidden' }}>
        <Turnstile 
          onVerify={handleVerify} 
          theme={theme}
          appearance={appearance}
        />
      </div>
    </div>
  );
}

// También exportamos una función para validar el token
// que puede ser usada en componentes que utilizan TurnstileProtection
export function validateTurnstileToken(token: string | null): boolean {
  return !!token;
} 
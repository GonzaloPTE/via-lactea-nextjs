import { useState } from 'react';

interface UseTurnstileProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function useTurnstile({ onSuccess, onError }: UseTurnstileProps = {}) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manejar la verificación exitosa
  const handleVerify = (token: string) => {
    setTurnstileToken(token);
    setError(null);
    setIsVerifying(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  // Limpiar el token cuando sea necesario (ej: después de un envío exitoso)
  const resetToken = () => {
    setTurnstileToken(null);
  };

  // Validar que tenemos un token antes de enviar el formulario
  const validateToken = (): boolean => {
    if (!turnstileToken) {
      const errorMsg = 'Error en la verificación de seguridad. Por favor, intenta nuevamente.';
      setError(errorMsg);
      
      if (onError) {
        onError(errorMsg);
      }
      
      return false;
    }
    
    return true;
  };

  // Iniciar el proceso de verificación
  const startVerification = () => {
    setIsVerifying(true);
    setError(null);
  };

  return {
    turnstileToken,
    isVerifying,
    error,
    handleVerify,
    resetToken,
    validateToken,
    startVerification
  };
} 
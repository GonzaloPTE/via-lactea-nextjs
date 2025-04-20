/**
 * Verifica un token de Cloudflare Turnstile
 * @param token Token generado por el widget de Turnstile
 * @param secretKey Clave secreta de Turnstile
 * @param ip IP opcional del cliente para mayor seguridad
 * @returns Un objeto con el resultado de la verificación
 */
export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  ip?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
      return {
        success: false,
        error: Array.isArray(data['error-codes']) 
          ? data['error-codes'].join(', ') 
          : 'Unknown error',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return {
      success: false,
      error: 'Error de servidor al verificar el captcha',
    };
  }
} 
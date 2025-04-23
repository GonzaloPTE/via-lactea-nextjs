import type { NextApiRequest, NextApiResponse } from 'next';
import { subscribeToNewsletter } from '../../lib/hubspot/newsletter';
import { verifyTurnstileToken } from '../../lib/turnstile/verify';

type ResponseData = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, turnstileToken } = req.body;

    // Validar el email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email inválido' 
      });
    }

    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY no está definida en variables de entorno');
      return res.status(500).json({ 
        success: false, 
        message: 'Error de configuración del servidor' 
      });
    }

    // Obtener IP del cliente para mayor seguridad (opcional)
    const clientIp = 
      (req.headers['x-forwarded-for'] as string) || 
      req.socket.remoteAddress || 
      '';
    
    // Verificar el token con Cloudflare
    const verification = await verifyTurnstileToken(
      turnstileToken, 
      secretKey,
      clientIp
    );

    if (!verification.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Falló la verificación del captcha: ' + (verification.error || 'error desconocido')
      });
    }

    // Si la verificación de Turnstile es exitosa, proceder con la suscripción
    const result = await subscribeToNewsletter(email);
    
    // Return the result directly
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error in subscribe handler:', error);
    return res.status(500).json({ success: false, message: 'Por favor, inténtalo de nuevo.' });
  }
} 
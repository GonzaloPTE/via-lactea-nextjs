import type { NextApiRequest, NextApiResponse } from 'next';
import { subscribeToNewsletter } from '../../lib/hubspot/newsletter';

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
    const { email } = req.body;

    // Use the centralized subscription function
    const result = await subscribeToNewsletter(email);
    
    // Return the result directly
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Error in subscribe handler:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
} 
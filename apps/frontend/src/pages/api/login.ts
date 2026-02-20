import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const backendRes = await proxyToBackend(req, '/api/auth/login', { method: 'POST' });
  const data = await backendRes.json();
  res.status(backendRes.status).json(data);
}

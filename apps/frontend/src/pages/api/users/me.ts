import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const backendRes = await proxyToBackend(req, '/api/users/me', {
    method: req.method,
    body: req.method === 'PATCH' ? JSON.stringify(req.body) : undefined,
  });

  res.status(backendRes.status);

  const raw = await backendRes.text();

  if (!raw) {
    return res.json(null);
  }

  try {
    return res.json(JSON.parse(raw));
  } catch {
    return res.send(raw);
  }
}

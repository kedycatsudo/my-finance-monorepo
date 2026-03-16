import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId } = req.query;
  let backendPath = '/api/outcomes/sources';

  if (req.method === 'PATCH' || req.method === 'DELETE') {
    if (!sourceId || Array.isArray(sourceId)) {
      return res.status(400).json({ message: 'sourceId is required' });
    }
    backendPath += `/${sourceId}`;
  }

  const backendRes = await proxyToBackend(req, backendPath, {
    method: req.method,
    body: ['POST', 'PUT', 'PATCH'].includes((req.method || 'GET').toUpperCase())
      ? JSON.stringify(req.body)
      : undefined,
  });

  const raw = await backendRes.text();

  // Don't forward content-encoding/content-length from backend when re-sending body.
  res.status(backendRes.status);

  try {
    return res.send(JSON.parse(raw));
  } catch {
    return res.send(raw);
  }
}

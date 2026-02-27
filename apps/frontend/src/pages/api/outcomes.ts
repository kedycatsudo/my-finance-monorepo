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
  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const data = await backendRes.json();
  return res.send(data);
}

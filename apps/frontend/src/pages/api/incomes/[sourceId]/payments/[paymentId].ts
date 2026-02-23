import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId, paymentId } = req.query;
  const method = req.method;

  if (sourceId === '' || Array.isArray(sourceId)) {
    return res.status(400).json({ message: 'SourceID is required' });
  }
  if (paymentId === '' || Array.isArray(paymentId)) {
    return res.status(400).json({ message: 'Payment id is required' });
  }

  const backendPath = `/api/incomes/sources/${sourceId}/payments/${paymentId}`;

  // Proxy to backend
  const backendRes = await proxyToBackend(req, backendPath, {
    method: req.method,
    body: ['PATCH', 'PUT', 'POST'].includes((req.method || 'GET').toUpperCase())
      ? JSON.stringify(req.body)
      : undefined,
  });

  // Pass through response
  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const data = await backendRes.text();
  return res.send(data);
}

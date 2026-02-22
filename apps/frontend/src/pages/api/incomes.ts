//src/pages/api/incomes.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: fetch list | POST: add new
  const backendPath = '/api/incomes/sources';
  const backendRes = await proxyToBackend(req, backendPath, { method: req.method });

  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const data = await backendRes.text();
  res.send(data);
}

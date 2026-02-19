import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend'; // fix import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendPath = '/api/incomes'; // path your Nest.js service listens on
  const backendRes = await proxyToBackend(req, backendPath, { method: req.method });

  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const data = await backendRes.text();
  res.send(data);
}

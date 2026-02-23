//src/pages/api/incomes.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId } = req.query;
  let backendPath = `/api/incomes/sources`;
  if (req.method === 'PATCH' || req.method === 'DELETE') {
    backendPath += `/${sourceId}`;
  }

  const backendRes = await proxyToBackend(req, backendPath, {
    method: req.method,
    body: JSON.stringify(req.body),
  });
  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const data = await backendRes.json();
  return data;
}

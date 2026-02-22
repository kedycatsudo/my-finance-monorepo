import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId } = req.query;

  let backendPath = `/api/incomes/sources/${sourceId}/payments`;
  if (req.method === 'PATCH' || req.method === 'DELETE') {
    const paymentId = req.query.paymentId;
    backendPath += `/${paymentId}`;
  }

  //mapping the req body for type => payment_type
  const originalBody = req.body;
  const mappedBody =
    req.method === 'POST' || req.method === 'PATCH'
      ? {
          ...originalBody,
          payment_type: originalBody?.payment_type ?? originalBody?.type,
          payment_circle_date: originalBody?.payment_circle_date ?? originalBody.date,
        }
      : undefined;
  const backendRes = await proxyToBackend(req, backendPath, {
    method: req.method,
    body: mappedBody ? JSON.stringify(mappedBody) : undefined,
  });
  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const raw = await backendRes.text();

  //map rtesponse back for frontend shape

  try {
    const parsed = JSON.parse(raw);
    const mapPayment = (p: any) => ({
      ...p,
      date: p.payment_circle_date ?? p.date,
    });
    const transformed = Array.isArray(parsed)
      ? parsed.map(mapPayment)
      : parsed?.payments && Array.isArray(parsed.payments)
        ? { ...parsed, payments: parsed.payments.map(mapPayment) }
        : mapPayment(parsed);
    return res.send(JSON.stringify(transformed));
  } catch (error: any) {
    return res.send(raw);
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId } = req.query;
  if (!sourceId || Array.isArray(sourceId)) {
    return res.status(400).json({ message: 'sourceId is required' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed on this route' });
  }

  const backendPath = `/api/incomes/sources/${sourceId}/payments`;

  const originalBody = req.body;
  const mappedBody =
    req.method === 'POST'
      ? {
          ...originalBody,
          payment_type: originalBody?.payment_type ?? originalBody?.type,
          payment_circle_date: originalBody?.payment_circle_date ?? originalBody?.date,
        }
      : undefined;

  const backendRes = await proxyToBackend(req, backendPath, {
    method: req.method,
    body: mappedBody ? JSON.stringify(mappedBody) : undefined,
  });

  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const raw = await backendRes.text();

  try {
    const parsed = JSON.parse(raw);
    const mapPayment = (payment: any) => ({
      ...payment,
      payment_type: payment?.payment_type,
      date: payment?.payment_circle_date ?? payment?.date ?? '',
    });

    const transformed = Array.isArray(parsed)
      ? parsed.map(mapPayment)
      : parsed && typeof parsed === 'object' && 'finance_payments' in parsed
        ? {
            ...parsed,
            finance_payments: Array.isArray((parsed as any).finance_payments)
              ? (parsed as any).finance_payments.map(mapPayment)
              : (parsed as any).finance_payments,
          }
        : mapPayment(parsed);

    return res.send(JSON.stringify(transformed));
  } catch {
    return res.send(raw);
  }
}

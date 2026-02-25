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
  const mappedBody =
    req.method === 'POST'
      ? {
          ...req.body,
          payment_circle_date: req.body?.payment_circle_date ?? req.body?.date ?? null,
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
      amount:
        payment?.amount !== undefined && payment?.amount !== null
          ? Number(payment.amount)
          : payment?.amount,
      date: payment?.payment_circle_date ?? payment?.date ?? '',
    });
    let transformed;
    if (Array.isArray(parsed)) {
      transformed = parsed.map(mapPayment);
    } else if (
      parsed &&
      typeof parsed === 'object' &&
      'finance_payments' in parsed &&
      Array.isArray((parsed as any).finance_payments)
    ) {
      transformed = {
        ...parsed,
        finance_payments: (parsed as any).finance_payments.map(mapPayment),
      };
    } else {
      transformed = mapPayment(parsed);
    }
    console.log('transformed data from payments.ts:', transformed);
    return res.send(JSON.stringify(transformed));
  } catch (error: any) {
    return res.send(raw);
  }
}

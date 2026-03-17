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

  const backendPath = `/api/outcomes/sources/${sourceId}/payments`;
  const mappedBody =
    req.method === 'POST'
      ? {
          ...req.body,
          date: req.body?.date ?? req.body?.payment_circle_date ?? null,
        }
      : undefined;

  const backendRes = await proxyToBackend(req, backendPath, {
    method: req.method,
    body: mappedBody ? JSON.stringify(mappedBody) : undefined,
  });
  res.status(backendRes.status);
  const raw = await backendRes.text();

  type RawPayment = Record<string, unknown>;

  try {
    const parsed: unknown = JSON.parse(raw);
    const mapPayment = (payment: RawPayment) => ({
      ...payment,
      amount:
        payment?.amount !== undefined && payment?.amount !== null
          ? Number(payment.amount)
          : payment?.amount,
      date: payment?.date ?? payment?.payment_circle_date ?? '',
    });
    let transformed;
    if (Array.isArray(parsed)) {
      transformed = parsed.map(mapPayment);
    } else if (
      parsed &&
      typeof parsed === 'object' &&
      'finance_payments' in parsed &&
      Array.isArray((parsed as Record<string, unknown>).finance_payments)
    ) {
      const typedParsed = parsed as Record<string, unknown>;
      transformed = {
        ...typedParsed,
        finance_payments: (typedParsed.finance_payments as RawPayment[]).map(mapPayment),
      };
    } else {
      transformed = mapPayment(parsed as RawPayment);
    }
    return res.send(JSON.stringify(transformed));
  } catch {
    return res.send(raw);
  }
}

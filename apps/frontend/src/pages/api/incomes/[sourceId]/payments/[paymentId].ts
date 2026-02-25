import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId, paymentId } = req.query;

  if (!sourceId || Array.isArray(sourceId)) {
    return res.status(400).json({ message: 'sourceId is required' });
  }
  if (!paymentId || Array.isArray(paymentId)) {
    return res.status(400).json({ message: 'paymentId is required' });
  }

  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed on this route' });
  }

  const backendPath = `/api/incomes/sources/${sourceId}/payments/${paymentId}`;

  const mappedBody =
    req.method === 'PATCH'
      ? {
          ...req.body,
          payment_circle_date: req.body?.payment_circle_date ?? req.body?.date ?? undefined,
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

    const mapPayment = (p: any) =>
      p
        ? {
            ...p,
            amount: p.amount != null ? Number(p.amount) : p.amount,
            date: p.payment_circle_date ?? p.date ?? '',
          }
        : p;

    // common backend shape today: { message, updated } OR { message, updated_source }
    const updatedPayment = mapPayment(parsed?.updated ?? parsed?.updated_payment ?? null);

    const transformed =
      parsed && typeof parsed === 'object'
        ? {
            ...parsed,
            updated_payment: updatedPayment,
            updated_source:
              parsed.updated_source && Array.isArray(parsed.updated_source.finance_payments)
                ? {
                    ...parsed.updated_source,
                    finance_payments: parsed.updated_source.finance_payments.map(mapPayment),
                  }
                : parsed.updated_source,
          }
        : parsed;

    return res.send(JSON.stringify(transformed));
  } catch {
    return res.send(raw);
  }
}

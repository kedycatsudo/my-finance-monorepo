import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

function dateOnlyToIso(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (value.includes('T')) return value;
  return `${value}T00:00:00.000Z`;
}

function mapItemFromBackend(item: any) {
  if (!item) return item;

  return {
    id: item?.id,
    assetName: item?.asset_name ?? item?.assetName ?? '',
    term: item?.term ?? 'middle',
    investedAmount:
      item?.invested_amount !== undefined && item?.invested_amount !== null
        ? Number(item.invested_amount)
        : Number(item?.investedAmount ?? 0),
    entryDate: item?.entry_date ?? item?.entryDate ?? '',
    exitDate: item?.exit_date ?? item?.exitDate ?? null,
    result: item?.result ?? 'none',
    resultAmount:
      item?.result_amount !== undefined && item?.result_amount !== null
        ? Number(item.result_amount)
        : item?.resultAmount !== undefined && item?.resultAmount !== null
          ? Number(item.resultAmount)
          : null,
    status: item?.status ?? 'open',
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId, itemId } = req.query;

  if (!sourceId || Array.isArray(sourceId)) {
    return res.status(400).json({ message: 'sourceId is required' });
  }
  if (!itemId || Array.isArray(itemId)) {
    return res.status(400).json({ message: 'itemId is required' });
  }

  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed on this route' });
  }

  const backendPath = `/api/investment/${sourceId}/items/${itemId}`;

  const mappedBody =
    req.method === 'PATCH'
      ? {
          ...(req.body?.assetName !== undefined || req.body?.asset_name !== undefined
            ? { asset_name: req.body?.assetName ?? req.body?.asset_name }
            : {}),
          ...(req.body?.term !== undefined ? { term: req.body.term } : {}),
          ...(req.body?.investedAmount !== undefined || req.body?.invested_amount !== undefined
            ? {
                invested_amount:
                  req.body?.investedAmount !== undefined
                    ? Number(req.body.investedAmount)
                    : Number(req.body?.invested_amount),
              }
            : {}),
          ...(req.body?.entryDate !== undefined || req.body?.entry_date !== undefined
            ? { entry_date: dateOnlyToIso(req.body?.entryDate ?? req.body?.entry_date) }
            : {}),
          ...(req.body?.exitDate !== undefined || req.body?.exit_date !== undefined
            ? { exit_date: dateOnlyToIso(req.body?.exitDate ?? req.body?.exit_date) }
            : {}),
          ...(req.body?.result !== undefined ? { result: req.body.result } : {}),
          ...(req.body?.resultAmount !== undefined || req.body?.result_amount !== undefined
            ? {
                result_amount:
                  req.body?.resultAmount !== undefined && req.body?.resultAmount !== null
                    ? Number(req.body.resultAmount)
                    : req.body?.result_amount !== undefined && req.body?.result_amount !== null
                      ? Number(req.body.result_amount)
                      : null,
              }
            : {}),
          ...(req.body?.status !== undefined ? { status: req.body.status } : {}),
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

    if (req.method === 'DELETE') {
      return res.send(JSON.stringify(parsed));
    }

    return res.send(JSON.stringify(mapItemFromBackend(parsed)));
  } catch {
    return res.send(raw);
  }
}

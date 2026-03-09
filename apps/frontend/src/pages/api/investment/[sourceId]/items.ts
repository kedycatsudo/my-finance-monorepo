import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

function mapItemFromBackend(item: any) {
  return {
    id: item?.id,
    assetName: item?.asset_name ?? item.assetName ?? '',
    term: item?.term ?? 'middle',
    investedAmount:
      item?.invested_amount !== undefined && item?.invested_amount !== null
        ? Number(item.invested_amount)
        : Number(item.investedAmount ?? 0),
    entryDate: item?.entry_date ?? item?.entryDate ?? '',
    exitDate: item?.exit_date ?? item?.exitDate ?? null,
    result: item?.result ?? 'none',
    resultAmount:
      item?.result_amount !== undefined && item?.result_amount !== null
        ? Number(item.result_amount)
        : item?.resultAmount !== undefined && item?.result_amount !== null
          ? Number(item.resultAmount)
          : null,
    status: item?.status ?? 'open',
  };
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceId } = req.query;

  if (!sourceId || Array.isArray(sourceId)) {
    return res.status(400).json({ message: 'Method now allowed this route' });
  }

  const backendPath = `/api/investment/${sourceId}/items`;
  const mappedBody =
    req.method === 'POST'
      ? {
          asset_name: req.body?.asset_name ?? req.body?.assetName,
          term: req.body?.term,
          invested_amount:
            req.body?.investedAmount !== undefined
              ? Number(req.body?.investedAmount)
              : Number(req.body?.invested_amount ?? 0),
          entry_date: req.body?.entryDate ?? req.body?.entry_date,
          exit_date: req.body?.exitDate ?? req.body?.exit_date ?? null,
          result: req.body?.result,
          result_amount:
            req.body?.resultAmount !== undefined && req.body?.resultAmount !== null
              ? Number(req.body.resultAmount)
              : req.body?.result_amount !== undefined && req.body?.resut_amount !== null
                ? Number(req.body.result_amount)
                : null,
          status: req.body?.status,
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
    if (Array.isArray(parsed)) {
      return res.send(JSON.stringify(parsed.map(mapItemFromBackend)));
    }
    return res.send(JSON.stringify(mapItemFromBackend(parsed)));
  } catch (error: any) {
    return res.send(raw);
  }
}

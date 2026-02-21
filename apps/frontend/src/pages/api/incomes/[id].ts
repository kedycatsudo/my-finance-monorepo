//src/pages/api/incomes/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const backendPath = `/api/incomes/sources/${id}`;

  // Transform request body: sourceName -> name for PATCH/PUT requests
  let requestBody = req.body;
  console.log('before map', requestBody);
  if ((req.method === 'PATCH' || req.method === 'PUT') && requestBody && requestBody.sourceName) {
    requestBody = {
      ...requestBody,
      name: requestBody.sourceName,
    };
  }
  console.log('after mapping the name to sourceName', requestBody);
  const backendRes = await proxyToBackend(req, backendPath, {
    method: req.method,
    body: JSON.stringify(requestBody),
  });

  res.status(backendRes.status);
  backendRes.headers.forEach((val, key) => res.setHeader(key, val));
  const data = await backendRes.text();

  // Transform response: name -> sourceName
  try {
    const parsedData = JSON.parse(data);
    const transformedData = {
      ...parsedData,
      updated_source: {
        ...parsedData.updated_source,
        sourceName: parsedData.updated_source.name,
      },
    };
    res.send(JSON.stringify(transformedData));
  } catch {
    res.send(data);
  }
}

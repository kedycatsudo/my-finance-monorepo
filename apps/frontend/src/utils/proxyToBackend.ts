import type { NextApiRequest } from 'next';

export async function proxyToBackend(
  req: NextApiRequest,
  backendPath: string,
  opts: { method?: string; body?: string } = {},
) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL + backendPath;
  const headers = new Headers();
  // Forward auth header if present
  if (req.headers.authorization) {
    headers.set('authorization', req.headers.authorization as string);
  }
  headers.set('Content-Type', 'application/json');
  const res = await fetch(backendUrl, {
    method: opts.method || req.method,
    headers,
    // Only set body for these verbs
    body: ['POST', 'PUT', 'PATCH'].includes((opts.method || req.method)!.toUpperCase())
      ? JSON.stringify(req.body)
      : undefined,
  });
  return res;
}

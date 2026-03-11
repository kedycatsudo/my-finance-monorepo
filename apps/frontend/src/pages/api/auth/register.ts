import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyToBackend } from '@/utils/proxyToBackend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password, monthlyCircleDate, monthly_circle_date } = req.body ?? {};

  const mappedBody = JSON.stringify({
    username,
    email,
    password,
    monthly_circle_date: monthlyCircleDate ?? monthly_circle_date,
  });

  const backendRes = await proxyToBackend(req, '/api/auth/register', {
    method: 'POST',
    body: mappedBody,
  });

  const data = await backendRes.json();
  res.status(backendRes.status).json(data);
}

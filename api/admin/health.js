import { requireAdmin } from '../../lib/admin-auth.js';

export default async function handler(req, res) {
  const guardRes = requireAdmin(req, res);
  if (guardRes) return guardRes;

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, ok: true, now: new Date().toISOString() });
  }

  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(405).json({ error: 'Method not allowed' });
}


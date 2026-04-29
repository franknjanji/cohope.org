function getBearerToken(req) {
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function getTokenFromXAdmin(req) {
  const h = req.headers?.['x-admin-token'] || req.headers?.['X-Admin-Token'];
  if (typeof h === 'string') return h.trim();
  return null;
}

export function requireAdmin(req, res) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_API_KEY is missing.' });
  }

  const token = getBearerToken(req) || getTokenFromXAdmin(req);
  if (!token || token !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  return null; // ok
}


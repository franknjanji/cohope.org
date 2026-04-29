import { supabaseAdmin } from '../../lib/supabase-admin.js';
import { requireAdmin } from '../../lib/admin-auth.js';

const ALLOWED_STATUS = ['pending', 'called', 'no-answer', 'resolved'];

function parseIntOr(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export default async function handler(req, res) {
  const guardRes = requireAdmin(req, res);
  if (guardRes) return guardRes;

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const status = req.query?.status ? String(req.query.status) : 'all';
      const limit = parseIntOr(req.query?.limit, 50);
      const offset = parseIntOr(req.query?.offset, 0);

      let q = supabaseAdmin
        .from('callback_requests')
        .select('id,name,phone,email,preferred_time,reason,status,requested_at,team_notes')
        .order('requested_at', { ascending: false });

      if (status !== 'all') {
        if (!ALLOWED_STATUS.includes(status)) {
          return res.status(400).json({ error: 'Invalid status filter.' });
        }
        q = q.eq('status', status);
      }

      const { data: items, error } = await q.range(offset, offset + limit - 1);
      if (error) {
        return res.status(500).json({ error: 'Could not fetch callback requests.' });
      }

      return res.status(200).json({ success: true, items });
    } catch (e) {
      console.error('Admin callback list error:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, status, teamNotes } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id is required.' });

      if (status && !ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
      }

      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (typeof teamNotes !== 'undefined') updatePayload.team_notes = teamNotes?.trim() || null;

      if (Object.keys(updatePayload).length === 0) {
        return res.status(400).json({ error: 'Provide at least one updatable field.' });
      }

      const { data, error } = await supabaseAdmin
        .from('callback_requests')
        .update(updatePayload)
        .eq('id', id)
        .select('id,status,team_notes')
        .maybeSingle();

      if (error) return res.status(500).json({ error: 'Could not update callback request.' });
      if (!data) return res.status(404).json({ error: 'Not found.' });

      return res.status(200).json({ success: true, item: data });
    } catch (e) {
      console.error('Admin callback update error:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}


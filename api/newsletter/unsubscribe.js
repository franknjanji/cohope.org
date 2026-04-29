import { supabaseAdmin } from '../../lib/supabase-admin.js';
import { unsubscribeFromNewsletter } from '../../lib/mailchimp.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const email =
      (req.query?.email && String(req.query.email)) ||
      (req.body?.email && String(req.body.email)) ||
      '';

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Attempt Mailchimp unsubscribe (skip only if misconfigured).
    try {
      await unsubscribeFromNewsletter({ email: cleanEmail });
    } catch (e) {
      if (!String(e?.message || '').includes('not configured')) {
        throw e;
      }
      console.warn('Mailchimp unsubscribe skipped:', e?.message);
    }

    // Update our audit store regardless.
    await supabaseAdmin
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', cleanEmail);

    return res.status(200).json({
      success: true,
      message: 'You have been unsubscribed. Thank you.',
    });
  } catch (err) {
    console.error('Newsletter unsubscribe error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}


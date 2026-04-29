import { supabaseAdmin } from '../lib/supabase-admin.js';
import { sendCallbackNotification } from '../lib/email.js';
import { sendSmsToAdmin } from '../lib/twilio.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, email, preferredTime, reason } = req.body;

    // ── Validation ──
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });
    if (!phone?.trim() || phone.trim().length < 7) {
      return res.status(400).json({ error: 'A valid phone number is required.' });
    }

    // ── Save to DB ──
    const { error: dbError } = await supabaseAdmin.from('callback_requests').insert({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim().toLowerCase() || null,
      preferred_time: preferredTime || 'Any time',
      reason: reason?.trim() || 'General enquiry',
      status: 'pending',
      requested_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('Supabase callback insert error:', dbError);
      // Don't block — still notify the team
    }

    // ── Notify team (email + SMS) ──
    const smsBody = `Call-back request: ${name.trim()} — ${phone.trim()} — ${preferredTime || 'Any time'} — ${reason?.trim() || 'General enquiry'}`;
    await Promise.allSettled([
      sendCallbackNotification({ name, email, phone, preferredTime, reason }),
      sendSmsToAdmin({ body: smsBody }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Call request received. We will call you back at the time you specified.',
    });
  } catch (err) {
    console.error('Callback API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

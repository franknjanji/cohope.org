import { supabase } from '../lib/supabase.js';
import { sendContactNotification, sendContactAutoReply } from '../lib/email.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // ── Validation ──
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message?.trim() || message.trim().length < 10) {
      return res.status(400).json({ error: 'Please write a message of at least 10 characters.' });
    }

    // ── Save to Supabase ──
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || 'General Enquiry',
      message: message.trim(),
      submitted_at: new Date().toISOString(),
      status: 'new',
    });

    if (dbError) {
      console.error('Supabase contact insert error:', dbError);
      // Don't block — still send email
    }

    // ── Send emails (parallel) ──
    await Promise.allSettled([
      sendContactNotification({ name, email, phone, subject, message }),
      sendContactAutoReply({ name, email }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out. We will be in touch soon.',
    });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again or email us directly.' });
  }
}

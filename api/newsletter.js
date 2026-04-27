import { supabase } from '../lib/supabase.js';
import { sendNewsletterWelcome } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, firstName, lastName, ageGroup, heritageBackground } = req.body;

    // ── Validation ──
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // ── Check for duplicate ──
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', cleanEmail)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({ success: true, message: 'You are already subscribed — welcome back!' });
      }
      // Re-activate unsubscribed contact
      await supabase
        .from('newsletter_subscribers')
        .update({ status: 'active', resubscribed_at: new Date().toISOString() })
        .eq('id', existing.id);

      await sendNewsletterWelcome({ email: cleanEmail, firstName });
      return res.status(200).json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
    }

    // ── Insert new subscriber ──
    const { error: dbError } = await supabase.from('newsletter_subscribers').insert({
      email: cleanEmail,
      first_name: firstName?.trim() || null,
      last_name: lastName?.trim() || null,
      age_group: ageGroup || null,
      heritage_background: heritageBackground || null,
      status: 'active',
      subscribed_at: new Date().toISOString(),
      source: 'website',
    });

    if (dbError) {
      console.error('Supabase newsletter insert error:', dbError);
      return res.status(500).json({ error: 'Could not save your subscription. Please try again.' });
    }

    // ── Welcome email ──
    await sendNewsletterWelcome({ email: cleanEmail, firstName });

    return res.status(200).json({
      success: true,
      message: 'You are subscribed! Welcome to the COHOPE community.',
    });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

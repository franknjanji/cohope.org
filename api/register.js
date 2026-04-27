import { supabase } from '../lib/supabase.js';
import { sendRegistrationConfirmation, sendRegistrationNotification } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      name,
      email,
      phone,
      eventName,
      eventId,
      eventDate,
      ageGroup,
      heritageBackground,
      ukBorn,
      notes,
      howHeard,
    } = req.body;

    // ── Validation ──
    if (!name?.trim()) return res.status(400).json({ error: 'Full name is required.' });
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!eventName?.trim()) return res.status(400).json({ error: 'Event name is required.' });
    if (!ageGroup) return res.status(400).json({ error: 'Please select your age group.' });

    const cleanEmail = email.trim().toLowerCase();

    // ── Check for duplicate registration ──
    if (eventId) {
      const { data: dupe } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('email', cleanEmail)
        .eq('event_id', eventId)
        .single();

      if (dupe) {
        return res.status(200).json({
          success: true,
          message: 'You are already registered for this event. We look forward to seeing you!',
        });
      }
    }

    // ── Save registration ──
    const { error: dbError } = await supabase.from('event_registrations').insert({
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || null,
      event_name: eventName.trim(),
      event_id: eventId || null,
      event_date: eventDate || null,
      age_group: ageGroup,
      heritage_background: heritageBackground || null,
      uk_born: ukBorn ?? null,
      notes: notes?.trim() || null,
      how_heard: howHeard || null,
      status: 'confirmed',
      registered_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('Supabase registration insert error:', dbError);
      return res.status(500).json({ error: 'Could not save your registration. Please try again.' });
    }

    // ── Confirmation emails (parallel) ──
    await Promise.allSettled([
      sendRegistrationConfirmation({ name, email: cleanEmail, eventName, eventDate, phone }),
      sendRegistrationNotification({ name, email: cleanEmail, phone, eventName, ageGroup, heritageBackground, notes }),
    ]);

    return res.status(200).json({
      success: true,
      message: `Your place at "${eventName}" is confirmed. Check your email for details.`,
    });
  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

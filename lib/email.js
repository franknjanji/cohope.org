import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'COHOPE Culture School <noreply@cohope.org.uk>';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'hello@cohope.org.uk';

// ── Notify the COHOPE team of a new contact form message ──
export async function sendContactNotification({ name, email, phone, message, subject }) {
  return resend.emails.send({
    from: FROM,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `New Enquiry: ${subject || 'General'} — from ${name}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0E0D0B;color:#F9F4EC;padding:40px;border-top:4px solid #C9A84C;">
        <h2 style="color:#C9A84C;font-size:22px;margin:0 0 8px">New Enquiry Received</h2>
        <p style="color:#7A736A;font-size:12px;margin:0 0 32px;letter-spacing:2px;text-transform:uppercase">COHOPE Culture School</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:100px">Name</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</td><td style="padding:10px 0;border-bottom:1px solid #2a2820"><a href="mailto:${email}" style="color:#C9A84C">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${phone}</td></tr>` : ''}
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Subject</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${subject || 'General Enquiry'}</td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#1A1915;border-left:3px solid #C9A84C;">
          <p style="color:#C9A84C;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px">Message</p>
          <p style="line-height:1.8;color:#d0c8be;margin:0">${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="margin-top:32px;color:#4A4540;font-size:12px">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
  });
}

// ── Auto-reply to the person who contacted ──
export async function sendContactAutoReply({ name, email }) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Thank you for reaching out — COHOPE Culture School',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0E0D0B;color:#F9F4EC;padding:40px;border-top:4px solid #C9A84C;">
        <h2 style="color:#C9A84C;font-size:22px;margin:0 0 8px">Tatenda. Thank you.</h2>
        <p style="color:#7A736A;font-size:12px;margin:0 0 32px;letter-spacing:2px;text-transform:uppercase">COHOPE Culture School · United Kingdom</p>
        <p style="line-height:1.9;color:#d0c8be">Dear ${name},</p>
        <p style="line-height:1.9;color:#d0c8be">Thank you for getting in touch with COHOPE Culture School. We have received your message and a member of our team will be in contact with you shortly.</p>
        <p style="line-height:1.9;color:#d0c8be">In the meantime, we want you to know — there is a place for you here. Whether you are arriving with deep cultural roots or just beginning to find them, COHOPE is built for you.</p>
        <blockquote style="border-left:3px solid #C9A84C;padding-left:20px;margin:32px 0;color:#C9A84C;font-style:italic;font-size:18px">"Revisit. Regrow. Embrace."</blockquote>
        <p style="line-height:1.9;color:#d0c8be">With warmth,<br><strong style="color:#C9A84C">The COHOPE Team</strong></p>
        <hr style="border:none;border-top:1px solid #2a2820;margin:32px 0">
        <p style="color:#4A4540;font-size:11px">COHOPE Culture School · Anglican Church Community · United Kingdom · Ages 15–30</p>
      </div>
    `,
  });
}

// ── Newsletter welcome email ──
export async function sendNewsletterWelcome({ email, firstName, unsubscribeUrl }) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Welcome to the COHOPE community',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0E0D0B;color:#F9F4EC;padding:40px;border-top:4px solid #C9A84C;">
        <h2 style="color:#C9A84C;font-size:22px;margin:0 0 8px">You are now part of something.</h2>
        <p style="color:#7A736A;font-size:12px;margin:0 0 32px;letter-spacing:2px;text-transform:uppercase">COHOPE Culture School</p>
        <p style="line-height:1.9;color:#d0c8be">Dear ${firstName || 'Friend'},</p>
        <p style="line-height:1.9;color:#d0c8be">Welcome to the COHOPE community. You will be the first to hear about new sessions, culture events, and stories from young Zimbabweans building their identity in the UK.</p>
        <p style="line-height:1.9;color:#d0c8be">We are glad you are here.</p>
        <p style="line-height:1.9;color:#d0c8be">With warmth,<br><strong style="color:#C9A84C">The COHOPE Team</strong></p>
        <hr style="border:none;border-top:1px solid #2a2820;margin:32px 0">
        <p style="color:#4A4540;font-size:11px">You are receiving this because you signed up at COHOPE. <a href="${unsubscribeUrl || '#'}" style="color:#C9A84C">Unsubscribe</a></p>
      </div>
    `,
  });
}

// ── Event registration confirmation ──
export async function sendRegistrationConfirmation({ name, email, eventName, eventDate, phone }) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `You are registered: ${eventName} — COHOPE`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0E0D0B;color:#F9F4EC;padding:40px;border-top:4px solid #C9A84C;">
        <h2 style="color:#C9A84C;font-size:22px;margin:0 0 8px">Your place is confirmed.</h2>
        <p style="color:#7A736A;font-size:12px;margin:0 0 32px;letter-spacing:2px;text-transform:uppercase">COHOPE Culture School</p>
        <p style="line-height:1.9;color:#d0c8be">Dear ${name},</p>
        <p style="line-height:1.9;color:#d0c8be">You are registered for <strong style="color:#C9A84C">${eventName}</strong>${eventDate ? ` on <strong style="color:#C9A84C">${eventDate}</strong>` : ''}. We are looking forward to having you with us.</p>
        <div style="margin:28px 0;padding:20px;background:#1A1915;border-left:3px solid #C9A84C;">
          <p style="margin:0 0 8px;color:#C9A84C;font-size:11px;text-transform:uppercase;letter-spacing:2px">What to bring</p>
          <p style="margin:0;line-height:1.8;color:#d0c8be">An open heart, a willingness to learn, and anything you know about your family history. Everything else will be provided.</p>
        </div>
        <p style="line-height:1.9;color:#d0c8be">If you have any questions, simply reply to this email or call us.</p>
        <p style="line-height:1.9;color:#d0c8be">With warmth,<br><strong style="color:#C9A84C">The COHOPE Team</strong></p>
        <hr style="border:none;border-top:1px solid #2a2820;margin:32px 0">
        <p style="color:#4A4540;font-size:11px">COHOPE Culture School · Anglican Church Community · United Kingdom</p>
      </div>
    `,
  });
}

// ── Notify team of new event registration ──
export async function sendRegistrationNotification({ name, email, phone, eventName, ageGroup, heritageBackground, notes }) {
  return resend.emails.send({
    from: FROM,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `New Registration: ${name} → ${eventName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0E0D0B;color:#F9F4EC;padding:40px;border-top:4px solid #C9A84C;">
        <h2 style="color:#C9A84C;font-size:22px;margin:0 0 8px">New Registration</h2>
        <p style="color:#7A736A;font-size:12px;margin:0 0 32px;letter-spacing:2px;text-transform:uppercase">COHOPE Culture School</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:130px">Name</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</td><td style="padding:10px 0;border-bottom:1px solid #2a2820"><a href="mailto:${email}" style="color:#C9A84C">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Event</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${eventName}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Age Group</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${ageGroup || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Heritage</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${heritageBackground || '—'}</td></tr>
        </table>
        ${notes ? `<div style="margin-top:24px;padding:20px;background:#1A1915;border-left:3px solid #C9A84C;"><p style="color:#C9A84C;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px">Notes</p><p style="line-height:1.8;color:#d0c8be;margin:0">${notes}</p></div>` : ''}
      </div>
    `,
  });
}

// ── Notify team of a call-back request ──
export async function sendCallbackNotification({ name, email, phone, preferredTime, reason }) {
  return resend.emails.send({
    from: FROM,
    to: CONTACT_EMAIL,
    subject: `Call Request: ${name} — ${preferredTime || 'Any time'}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0E0D0B;color:#F9F4EC;padding:40px;border-top:4px solid #C9A84C;">
        <h2 style="color:#C9A84C;font-size:22px;margin:0 0 8px">Call-Back Requested</h2>
        <p style="color:#7A736A;font-size:12px;margin:0 0 32px;letter-spacing:2px;text-transform:uppercase">COHOPE Culture School</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:140px">Name</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #2a2820"><strong style="color:#C9A84C">${phone}</strong></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${email || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #2a2820;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Best Time</td><td style="padding:10px 0;border-bottom:1px solid #2a2820">${preferredTime || 'Any time'}</td></tr>
          <tr><td style="padding:10px 0;color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:1px">Reason</td><td style="padding:10px 0">${reason || 'General enquiry'}</td></tr>
        </table>
      </div>
    `,
  });
}

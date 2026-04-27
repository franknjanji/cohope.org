// lib/email-templates.js
// All HTML email templates for COHOPE transactional emails

const baseStyle = `
  font-family: Georgia, 'Times New Roman', serif;
  background: #0E0D0B;
  color: #F9F4EC;
  margin: 0;
  padding: 0;
`;

const gold = '#C9A84C';
const dark = '#0E0D0B';
const cream = '#F9F4EC';
const muted = 'rgba(249,244,236,0.6)';

/**
 * Wrapper that wraps any email body in the COHOPE branded shell
 */
function shell(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>COHOPE Culture School</title>
</head>
<body style="${baseStyle}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0D0B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0E0D0B; border-bottom: 2px solid ${gold}; padding: 32px 40px 24px; text-align:center;">
              <p style="font-family:Georgia,serif; font-size:28px; font-weight:900; color:${gold}; letter-spacing:0.15em; text-transform:uppercase; margin:0 0 4px;">COHOPE</p>
              <p style="font-size:10px; color:rgba(201,168,76,0.5); letter-spacing:0.4em; text-transform:uppercase; margin:0; font-family:Arial,sans-serif;">Culture School</p>
              <p style="font-family:Georgia,serif; font-style:italic; font-size:13px; color:${muted}; margin:16px 0 0; letter-spacing:0.1em;">Revisit. Regrow. Embrace.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1A1915; padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#080807; padding: 24px 40px; text-align:center; border-top:1px solid rgba(201,168,76,0.12);">
              <p style="font-size:11px; color:rgba(249,244,236,0.25); font-family:Arial,sans-serif; margin:0 0 6px; letter-spacing:0.05em;">COHOPE Culture School · Anglican Church Community · United Kingdom</p>
              <p style="font-size:11px; color:rgba(249,244,236,0.15); font-family:Arial,sans-serif; margin:0; letter-spacing:0.05em;">For Young Zimbabweans in the UK · Ages 15–30</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Email sent to the COHOPE admin when a contact form is submitted
 */
export function contactNotificationEmail({ name, email, phone, message, subject }) {
  const body = `
    <p style="font-size:11px; color:${gold}; letter-spacing:0.3em; text-transform:uppercase; font-family:Arial,sans-serif; margin:0 0 24px;">New Contact Form Submission</p>
    <h2 style="font-family:Georgia,serif; font-size:22px; color:${cream}; margin:0 0 24px; font-weight:700;">${subject || 'General Enquiry'}</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="font-size:11px; color:${gold}; text-transform:uppercase; letter-spacing:0.2em; font-family:Arial,sans-serif; display:block; margin-bottom:4px;">Name</span>
        <span style="font-size:15px; color:${cream}; font-family:Georgia,serif;">${name}</span>
      </td></tr>
      <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="font-size:11px; color:${gold}; text-transform:uppercase; letter-spacing:0.2em; font-family:Arial,sans-serif; display:block; margin-bottom:4px;">Email</span>
        <span style="font-size:15px; color:${cream}; font-family:Georgia,serif;"><a href="mailto:${email}" style="color:${gold};">${email}</a></span>
      </td></tr>
      ${phone ? `<tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="font-size:11px; color:${gold}; text-transform:uppercase; letter-spacing:0.2em; font-family:Arial,sans-serif; display:block; margin-bottom:4px;">Phone</span>
        <span style="font-size:15px; color:${cream}; font-family:Georgia,serif;">${phone}</span>
      </td></tr>` : ''}
    </table>

    <p style="font-size:11px; color:${gold}; letter-spacing:0.2em; text-transform:uppercase; font-family:Arial,sans-serif; margin:0 0 12px;">Message</p>
    <div style="background:rgba(201,168,76,0.05); border-left:3px solid ${gold}; padding:20px; border-radius:0;">
      <p style="font-size:15px; color:rgba(249,244,236,0.8); font-family:Georgia,serif; line-height:1.8; margin:0; font-style:italic;">${message.replace(/\n/g, '<br>')}</p>
    </div>

    <p style="margin:28px 0 0; font-size:12px; color:rgba(249,244,236,0.3); font-family:Arial,sans-serif;">Received at ${new Date().toUTCString()}</p>
  `;
  return shell(body);
}

/**
 * Auto-reply sent to the person who submitted the contact form
 */
export function contactAutoReplyEmail({ name }) {
  const body = `
    <p style="font-size:11px; color:${gold}; letter-spacing:0.3em; text-transform:uppercase; font-family:Arial,sans-serif; margin:0 0 24px;">Thank You for Reaching Out</p>
    <h2 style="font-family:Georgia,serif; font-size:24px; color:${cream}; margin:0 0 20px; font-weight:700; line-height:1.3;">We have received your message, ${name}.</h2>
    <p style="font-size:15px; color:rgba(249,244,236,0.7); font-family:Georgia,serif; line-height:1.9; margin:0 0 20px;">Thank you for getting in touch with COHOPE Culture School. We will review your message and respond within 2–3 working days.</p>
    <p style="font-size:15px; color:rgba(249,244,236,0.7); font-family:Georgia,serif; line-height:1.9; margin:0 0 32px;">In the meantime, you are welcome to learn more about our programme and the eight objectives driving our work with young Zimbabweans in the UK.</p>
    <div style="border:1px solid rgba(201,168,76,0.2); padding:24px; margin-bottom:32px;">
      <p style="font-family:Georgia,serif; font-style:italic; font-size:17px; color:${gold}; text-align:center; margin:0; line-height:1.6;">"Revisit. Regrow. Embrace."</p>
    </div>
    <p style="font-size:14px; color:rgba(249,244,236,0.5); font-family:Arial,sans-serif; line-height:1.7; margin:0;">With warmth,<br><strong style="color:${cream}; font-family:Georgia,serif;">The COHOPE Team</strong></p>
  `;
  return shell(body);
}

/**
 * Registration confirmation email
 */
export function registrationConfirmationEmail({ name, eventName, eventDate, eventLocation }) {
  const body = `
    <p style="font-size:11px; color:${gold}; letter-spacing:0.3em; text-transform:uppercase; font-family:Arial,sans-serif; margin:0 0 24px;">Registration Confirmed</p>
    <h2 style="font-family:Georgia,serif; font-size:24px; color:${cream}; margin:0 0 20px; font-weight:700; line-height:1.3;">You're registered, ${name}.</h2>
    <p style="font-size:15px; color:rgba(249,244,236,0.7); font-family:Georgia,serif; line-height:1.9; margin:0 0 28px;">We are delighted to confirm your registration for the following event. We look forward to welcoming you.</p>

    <div style="background:rgba(201,168,76,0.06); border:1px solid rgba(201,168,76,0.2); padding:28px; margin-bottom:32px;">
      <p style="font-size:11px; color:${gold}; letter-spacing:0.25em; text-transform:uppercase; font-family:Arial,sans-serif; margin:0 0 16px;">Event Details</p>
      <p style="font-size:19px; font-family:Georgia,serif; font-weight:700; color:${cream}; margin:0 0 12px;">${eventName}</p>
      ${eventDate ? `<p style="font-size:14px; color:rgba(249,244,236,0.6); font-family:Arial,sans-serif; margin:0 0 6px;">📅 &nbsp;${eventDate}</p>` : ''}
      ${eventLocation ? `<p style="font-size:14px; color:rgba(249,244,236,0.6); font-family:Arial,sans-serif; margin:0;">📍 &nbsp;${eventLocation}</p>` : ''}
    </div>

    <p style="font-size:14px; color:rgba(249,244,236,0.5); font-family:Arial,sans-serif; line-height:1.8; margin:0 0 8px;">If you need to cancel or have any questions, please reply to this email or contact us directly.</p>
    <p style="font-size:14px; color:rgba(249,244,236,0.5); font-family:Arial,sans-serif; line-height:1.8; margin:0 0 28px;">We look forward to seeing you.</p>
    <p style="font-size:14px; color:rgba(249,244,236,0.5); font-family:Arial,sans-serif; line-height:1.7; margin:0;">With warmth,<br><strong style="color:${cream}; font-family:Georgia,serif;">The COHOPE Team</strong></p>
  `;
  return shell(body);
}

/**
 * Registration notification to admin
 */
export function registrationNotificationEmail({ name, email, phone, age, background, eventName }) {
  const body = `
    <p style="font-size:11px; color:${gold}; letter-spacing:0.3em; text-transform:uppercase; font-family:Arial,sans-serif; margin:0 0 24px;">New Event Registration</p>
    <h2 style="font-family:Georgia,serif; font-size:20px; color:${cream}; margin:0 0 24px; font-weight:700;">${eventName}</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ['Name', name],
        ['Email', `<a href="mailto:${email}" style="color:${gold};">${email}</a>`],
        ['Phone', phone || 'Not provided'],
        ['Age Group', age || 'Not specified'],
        ['Background', background || 'Not specified'],
      ].map(([label, val]) => `
      <tr><td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
        <span style="font-size:11px; color:${gold}; text-transform:uppercase; letter-spacing:0.2em; font-family:Arial,sans-serif; display:block; margin-bottom:4px;">${label}</span>
        <span style="font-size:15px; color:${cream}; font-family:Georgia,serif;">${val}</span>
      </td></tr>`).join('')}
    </table>
    <p style="margin:0; font-size:12px; color:rgba(249,244,236,0.3); font-family:Arial,sans-serif;">Registered at ${new Date().toUTCString()}</p>
  `;
  return shell(body);
}

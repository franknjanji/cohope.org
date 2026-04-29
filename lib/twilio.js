import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const adminNumber = process.env.TWILIO_ADMIN_NUMBER;

if (!accountSid || !authToken || !fromNumber || !adminNumber) {
  // Don’t hard-fail every endpoint. Some deployments may not want SMS enabled yet.
  // We’ll throw only when SMS is actually attempted.
  console.warn('[twilio] Missing one or more Twilio env vars; SMS sending may fail.');
}

const client =
  accountSid && authToken
    ? twilio(accountSid, authToken)
    : null;

export async function sendSmsToAdmin({ body }) {
  if (!client || !fromNumber || !adminNumber) {
    // Fail softly so forms still work even if SMS is not configured.
    console.warn('[twilio] SMS skipped (misconfigured).');
    return null;
  }

  const msg = await client.messages.create({
    from: fromNumber,
    to: adminNumber,
    body: String(body).slice(0, 500),
  });

  return msg;
}


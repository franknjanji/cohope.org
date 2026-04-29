import crypto from 'node:crypto';

const apiKey = process.env.MAILCHIMP_API_KEY;
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

function getMailchimpBaseUrl() {
  if (!serverPrefix) throw new Error('Mailchimp is not configured (missing MAILCHIMP_SERVER_PREFIX env var).');
  return `https://${serverPrefix}.api.mailchimp.com/3.0`;
}

function getBasicAuthHeader() {
  // Mailchimp uses HTTP Basic Auth: username is any string, password is the API key.
  // https://mailchimp.com/developer/marketing/api/list-members/#update-list-member
  if (!apiKey) throw new Error('Mailchimp is not configured (missing MAILCHIMP_API_KEY env var).');
  const token = Buffer.from(`anystring:${apiKey}`).toString('base64');
  return `Basic ${token}`;
}

function hashEmail(email) {
  return crypto.createHash('md5').update(String(email).trim().toLowerCase()).digest('hex');
}

async function mailchimpPutListMember({ subscriberHash, payload }) {
  if (!audienceId) throw new Error('Mailchimp is not configured (missing MAILCHIMP_AUDIENCE_ID env var).');

  const baseUrl = getMailchimpBaseUrl();
  const url = `${baseUrl}/lists/${audienceId}/members/${subscriberHash}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: getBasicAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Mailchimp API error (${res.status}): ${text || res.statusText}`);
  }

  return res.json().catch(() => null);
}

export async function subscribeToNewsletter({ email, firstName, lastName }) {
  if (!apiKey || !audienceId || !serverPrefix) {
    throw new Error('Mailchimp is not configured (missing MAILCHIMP_* env vars).');
  }

  const subscriberHash = hashEmail(email);

  const mergeFields = {};
  // Mailchimp default merge tags are often FNAME / LNAME; keep it conservative.
  if (firstName?.trim()) mergeFields.FNAME = firstName.trim();
  if (lastName?.trim()) mergeFields.LNAME = lastName.trim();

  return mailchimpPutListMember({
    subscriberHash,
    payload: {
    email_address: email,
    status: 'subscribed',
    merge_fields: mergeFields,
    },
  });
}

export async function unsubscribeFromNewsletter({ email }) {
  if (!apiKey || !audienceId || !serverPrefix) {
    throw new Error('Mailchimp is not configured (missing MAILCHIMP_* env vars).');
  }

  const subscriberHash = hashEmail(email);

  return mailchimpPutListMember({
    subscriberHash,
    payload: {
      email_address: email,
      status: 'unsubscribed',
      merge_fields: {},
    },
  });
}


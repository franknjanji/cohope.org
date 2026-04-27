// lib/utils.js
// Shared utilities for all API serverless functions

/**
 * Standard JSON response helper
 */
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Handle CORS preflight OPTIONS requests
 */
export function handleCors(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  return null;
}

/**
 * Validate required fields from a parsed body object
 * Returns { valid: true } or { valid: false, missing: [...] }
 */
export function validateFields(body, required) {
  const missing = required.filter(
    (field) => !body[field] || String(body[field]).trim() === ''
  );
  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
}

/**
 * Basic email format validation
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

/**
 * Basic phone number sanitisation — strips spaces and non-digit chars except +
 */
export function sanitisePhone(phone) {
  return String(phone).replace(/[^\d+]/g, '');
}

/**
 * Rate limit map (in-memory, resets on cold start — good enough for serverless)
 * Keyed by IP. Limit: 5 requests per 10 minutes per endpoint.
 */
const rateLimitMap = new Map();

export function checkRateLimit(ip, endpoint, limit = 5, windowMs = 10 * 60 * 1000) {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, start: now };

  if (now - record.start > windowMs) {
    record.count = 1;
    record.start = now;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(key, record);
  return record.count <= limit;
}

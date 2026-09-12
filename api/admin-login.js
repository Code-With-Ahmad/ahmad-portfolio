import crypto from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from './_lib/firebaseAdmin.js';

// Best-effort in-memory throttle. Resets on cold start, and is per-instance
// only — it raises the cost of brute-forcing but is not a hard guarantee.
// See README security notes for the full trade-off.
const attempts = new Map();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function isRateLimited(key) {
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, windowStart: now };
  if (now - record.windowStart > WINDOW_MS) {
    record.count = 0;
    record.windowStart = now;
  }
  record.count += 1;
  attempts.set(key, record);
  return record.count > MAX_ATTEMPTS;
}

function timingSafeStringEqual(a, b) {
  const bufA = crypto.createHash('sha256').update(String(a)).digest();
  const bufB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(key)) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }

  const { password } = req.body || {};
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return res.status(500).json({ error: 'Admin login is not configured.' });
  }

  if (!password || !timingSafeStringEqual(password, expected)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  try {
    getAdminApp();
    const token = await getAuth().createCustomToken('admin-user', { admin: true });
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Failed to mint admin token', err);
    return res.status(500).json({ error: 'Could not create admin session.' });
  }
}

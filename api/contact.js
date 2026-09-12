import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from './_lib/firebaseAdmin.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The contact form's destination address is managed from the admin
// dashboard (Site Info → Email) rather than a fixed env var, so changing it
// doesn't require touching deployment config. CONTACT_TO_EMAIL still works
// as a fallback/override if set.
async function getDestinationEmail() {
  try {
    getAdminApp();
    const snap = await getFirestore().collection('content').doc('site').get();
    const email = snap.data()?.email;
    if (email && EMAIL_RE.test(email)) return email;
  } catch (err) {
    console.error('Could not read destination email from Firestore', err);
  }
  return process.env.CONTACT_TO_EMAIL || null;
}

// Best-effort in-memory throttle. Resets on cold start, and is per-instance
// only — good enough to blunt casual spam, not a hard guarantee.
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(key)) {
    return res.status(429).json({ error: 'Too many messages sent. Try again later.' });
  }

  const { name, email, message, company } = req.body || {};

  // Honeypot field — real visitors never fill this in.
  if (company) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please fill in all fields with a valid email.' });
  }

  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'One of the fields is too long.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = await getDestinationEmail();

  if (!apiKey || !toEmail) {
    return res.status(500).json({ error: 'Contact form is not configured.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.error('Resend error', body);
      return res.status(502).json({ error: 'Could not send message right now.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to send contact email', err);
    return res.status(500).json({ error: 'Could not send message right now.' });
  }
}

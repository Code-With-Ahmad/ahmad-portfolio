import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from './_lib/firebaseAdmin.js';

function urlEntry(loc, priority) {
  return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
}

export default async function handler(req, res) {
  const siteUrl = (process.env.SITE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
  const entries = [urlEntry(siteUrl, '1.0')];

  try {
    getAdminApp();
    const db = getFirestore();
    const snapshot = await db.collection('projects').get();
    snapshot.forEach((doc) => {
      const slug = doc.data().slug;
      if (slug) entries.push(urlEntry(`${siteUrl}/projects/${slug}`, '0.7'));
    });
  } catch (err) {
    // If Firestore/admin isn't configured yet, still serve a valid sitemap
    // with just the homepage rather than failing the request.
    console.error('Sitemap: could not load projects', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}

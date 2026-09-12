import { getDb } from './_firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

// Eyebrow + heading copy for each section, in the site's existing editorial
// voice — short, declarative, no filler. Only fills fields that are still
// empty so it never clobbers anything already set from the dashboard.
const SECTION_HEADINGS = {
  aboutEyebrow: 'About',
  skillsEyebrow: 'Skills',
  skillsTitle: 'Tools I reach for, and why.',
  experienceEyebrow: 'Experience',
  experienceTitle: 'Where the work has happened.',
  projectsEyebrow: 'Selected Work',
  projectsTitle: "A few things I've built.",
  contactEyebrow: 'Contact',
  contactTitle: "Let's build something worth shipping.",
};

async function main() {
  const db = getDb();
  const siteRef = db.collection('content').doc('site');
  const snap = await siteRef.get();
  const current = snap.data() || {};

  const updates = {};
  for (const [key, value] of Object.entries(SECTION_HEADINGS)) {
    if (!current[key]) updates[key] = value;
  }

  if (Object.keys(updates).length === 0) {
    console.log('All section headings are already set — nothing to do.');
    return;
  }

  await siteRef.set({ ...updates, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log('Set section headings:', Object.keys(updates).join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

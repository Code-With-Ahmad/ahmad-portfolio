import { getDb } from './_firebase.js';

const EXPERIENCE = [
  {
    company: 'Nextek Solutions',
    role: 'Web Developer',
    location: 'Model Town, Lahore',
    startDate: '2025-02',
    endDate: '2026-04',
    bullets: [
      'Worked as part of the development team on Medflow Alpha LIS (medflowllc.com), a live Laboratory Information System used by clinical labs to manage patient samples, test orders, and diagnostic results.',
      'Built and consumed REST and GraphQL APIs to connect the front end with backend services, handling data for lab workflows, records, and reporting.',
      'Implemented responsive interfaces with React, Bootstrap, and Pug templates, ensuring the platform worked reliably across devices for lab staff and administrators.',
      'Worked with relational databases and AWS-hosted infrastructure to support secure data storage and deployment for a production healthcare system.',
    ],
  },
];

async function main() {
  const db = getDb();
  const experienceRef = db.collection('experience');

  const existing = await experienceRef.get();
  const startOrder = existing.size;
  if (!existing.empty) {
    console.log(`experience collection already has ${existing.size} document(s) — adding these after them.`);
  }

  const batch = db.batch();
  EXPERIENCE.forEach((entry, i) => {
    const docRef = experienceRef.doc();
    batch.set(docRef, { ...entry, order: startOrder + i });
  });

  await batch.commit();
  console.log(`Seeded ${EXPERIENCE.length} experience entr${EXPERIENCE.length === 1 ? 'y' : 'ies'}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

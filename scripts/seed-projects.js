import { getDb } from './_firebase.js';

const PROJECTS = [
  {
    title: 'Mavero',
    slug: 'mavero',
    summary:
      'A full-stack luxury e-commerce storefront built with React and Firebase, complete with product catalog, cart, and a custom admin dashboard for managing inventory and orders.',
    description: [
      "Mavero is a full-stack e-commerce platform for a luxury boutique brand, covering everything from browsing and checkout to back-office inventory management. It's built on React for the storefront and Firebase for authentication and data, and deployed on Vercel.",
      'The storefront includes category browsing across apparel, bags & accessories, watches & jewelry, footwear, and electronics, plus featured and new-arrival collections, product detail pages with sale pricing, a wishlist, and a shopping cart — wrapped in a considered, editorial visual style with light and dark theme support.',
      'Alongside the customer-facing store, I built a custom admin dashboard that lets the store owner manage products, categories, and orders without touching code — the kind of content-management layer that turns a static storefront into something an actual business can run day to day.',
    ].join('\n\n'),
    tags: ['React', 'Firebase', 'E-Commerce', 'Admin Dashboard', 'Vercel'],
    coverImageUrl: 'https://res.cloudinary.com/dqpitwyx/image/upload/v1789220504/images/projects/jqksjwrbzdtmmuyyzzsh.png',
    images: [],
    liveUrl: 'https://mavero-pied.vercel.app/',
    repoUrl: '',
    featured: true,
  },
];

async function main() {
  const db = getDb();
  const projectsRef = db.collection('projects');

  const existing = await projectsRef.get();
  const startOrder = existing.size;
  if (!existing.empty) {
    console.log(`projects collection already has ${existing.size} document(s) — adding these after them.`);
  }

  const batch = db.batch();
  PROJECTS.forEach((project, i) => {
    const docRef = projectsRef.doc();
    batch.set(docRef, { ...project, order: startOrder + i });
  });

  await batch.commit();
  console.log(`Seeded ${PROJECTS.length} project(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

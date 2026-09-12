import { getDb } from './_firebase.js';

// Each entry: [name, category, icon]. `icon` keys match src/lib/iconMap.js —
// an icon left as '' falls back to a generic glyph (no matching brand icon).
const SKILLS = [
  // Core Languages
  ['HTML5', 'Core Languages', 'SiHtml5'],
  ['CSS3', 'Core Languages', 'SiCss'],
  ['JavaScript (ES6+)', 'Core Languages', 'SiJavascript'],
  ['TypeScript', 'Core Languages', 'SiTypescript'],

  // Frontend Frameworks/Libraries
  ['React.js', 'Frontend Frameworks/Libraries', 'SiReact'],
  ['Next.js', 'Frontend Frameworks/Libraries', 'SiNextdotjs'],

  // Styling
  ['Tailwind CSS', 'Styling', 'SiTailwindcss'],
  ['Bootstrap', 'Styling', 'SiBootstrap'],
  ['SASS/SCSS', 'Styling', 'SiSass'],
  ['CSS Modules / Styled Components', 'Styling', 'SiCssmodules'],

  // Animation
  ['GSAP', 'Animation', 'SiGreensock'],
  ['Framer Motion', 'Animation', 'SiFramer'],
  ['Lottie', 'Animation', 'SiLottiefiles'],

  // State Management
  ['Redux / Redux Toolkit', 'State Management', 'SiRedux'],
  ['Context API', 'State Management', ''],
  ['Zustand', 'State Management', ''],

  // Routing & Forms
  ['React Router / Next.js Routing', 'Routing & Forms', 'SiReactrouter'],
  ['React Hook Form / Formik', 'Routing & Forms', 'SiReacthookform'],

  // Backend Languages/Runtimes
  ['Node.js', 'Backend Languages/Runtimes', 'SiNodedotjs'],
  ['Python', 'Backend Languages/Runtimes', 'SiPython'],

  // Backend Frameworks
  ['Express.js', 'Backend Frameworks', 'SiExpress'],
  ['Next.js (API routes)', 'Backend Frameworks', 'SiNextdotjs'],

  // CMS
  ['Payload CMS', 'CMS', 'SiPayloadcms'],

  // Databases
  ['MongoDB', 'Databases', 'SiMongodb'],
  ['PostgreSQL', 'Databases', 'SiPostgresql'],
  ['MySQL', 'Databases', 'SiMysql'],
  ['Firebase Firestore', 'Databases', 'SiFirebase'],
  ['DynamoDB', 'Databases', ''],
  ['Redis', 'Databases', 'SiRedis'],

  // APIs & Communication
  ['REST APIs', 'APIs & Communication', ''],
  ['GraphQL', 'APIs & Communication', 'SiGraphql'],
  ['Axios / Fetch', 'APIs & Communication', 'SiAxios'],
  ['WebSockets', 'APIs & Communication', 'SiSocketdotio'],

  // Authentication & Security
  ['JWT', 'Authentication & Security', 'SiJsonwebtokens'],
  ['OAuth', 'Authentication & Security', ''],
  ['Firebase Auth', 'Authentication & Security', 'SiFirebase'],

  // Cloud & Hosting
  ['Firebase', 'Cloud & Hosting', 'SiFirebase'],
  ['Vercel', 'Cloud & Hosting', 'SiVercel'],
  ['Netlify', 'Cloud & Hosting', 'SiNetlify'],
  ['AWS', 'Cloud & Hosting', 'FaAws'],

  // DevOps & Tooling
  ['Git & GitHub', 'DevOps & Tooling', 'SiGit'],
  ['Docker', 'DevOps & Tooling', 'SiDocker'],
  ['CI/CD (GitHub Actions)', 'DevOps & Tooling', 'SiGithubactions'],
  ['Vite / Webpack', 'DevOps & Tooling', 'SiVite'],
];

async function main() {
  const db = getDb();
  const skillsRef = db.collection('skills');

  const existing = await skillsRef.get();
  if (!existing.empty) {
    console.log(`skills collection already has ${existing.size} document(s) — leaving them in place and adding these on top.`);
  }

  const orderInCategory = new Map();
  const batch = db.batch();

  for (const [name, category, icon] of SKILLS) {
    const order = orderInCategory.get(category) ?? 0;
    orderInCategory.set(category, order + 1);
    const docRef = skillsRef.doc();
    batch.set(docRef, { name, category, icon, order });
  }

  await batch.commit();
  console.log(`Seeded ${SKILLS.length} skills across ${orderInCategory.size} categories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

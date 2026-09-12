// Default/fallback content — matches the Firestore schema exactly.
// Used before Firestore data loads, and as the seed payload for a fresh project.

export const placeholderSite = {
  name: 'Ahmad Naeem',
  title: 'Full-Stack Developer',
  tagline: 'Full-stack development, from the database schema to the pixel.',
  heroDescription:
    'I design and build web products end to end — backend architecture, API design, and the interface details that decide whether something feels considered.',
  availability: 'Available for select freelance work',
  email: 'hello@example.com',
  location: 'Lahore, Pakistan',
  logoUrl: '',
  faviconUrl: '',
  whatsapp: '',
  socials: {
    github: 'https://github.com/example',
    linkedin: 'https://linkedin.com/in/example',
    x: 'https://x.com/example',
  },
  resumeUrl: '',
  resumeFileName: '',
};

export const placeholderAbout = {
  heading: 'Building things that hold up under real use.',
  bio: [
    "I'm a full-stack developer who spends most of my time in the space between backend systems and the interfaces people actually touch — making sure both are built with the same care.",
    'My background is in shipping production web applications end to end: data modeling, API design, and the interaction details that decide whether something feels considered or merely finished.',
    "Outside of client work, I'm usually rebuilding some small tool to understand it better, or reading about type systems I have no immediate use for yet.",
  ],
  profileImageUrl: '',
};

export const placeholderSkills = [
  { name: 'JavaScript', category: 'Languages', icon: 'SiJavascript', order: 0 },
  { name: 'TypeScript', category: 'Languages', icon: 'SiTypescript', order: 1 },
  { name: 'Python', category: 'Languages', icon: 'SiPython', order: 2 },
  { name: 'React', category: 'Frameworks', icon: 'SiReact', order: 0 },
  { name: 'Node.js', category: 'Frameworks', icon: 'SiNodedotjs', order: 1 },
  { name: 'Next.js', category: 'Frameworks', icon: 'SiNextdotjs', order: 2 },
  { name: 'Tailwind CSS', category: 'Frameworks', icon: 'SiTailwindcss', order: 3 },
  { name: 'PostgreSQL', category: 'Tools & Platforms', icon: 'SiPostgresql', order: 0 },
  { name: 'Firebase', category: 'Tools & Platforms', icon: 'SiFirebase', order: 1 },
  { name: 'Docker', category: 'Tools & Platforms', icon: 'SiDocker', order: 2 },
  { name: 'Git', category: 'Tools & Platforms', icon: 'SiGit', order: 3 },
];

export const placeholderExperience = [
  {
    company: 'Northwind Digital',
    role: 'Senior Full-Stack Developer',
    location: 'Remote',
    startDate: '2023-01',
    endDate: 'Present',
    bullets: [
      'Led the rebuild of a client-facing dashboard, cutting median load time by 40% through data-fetching and rendering changes.',
      'Introduced a shared component and design-token system adopted across three product teams.',
      'Mentored two junior developers on API design and testing practices.',
    ],
    order: 0,
  },
  {
    company: 'Fieldstone Software',
    role: 'Full-Stack Developer',
    location: 'Lahore, Pakistan',
    startDate: '2021-03',
    endDate: '2022-12',
    bullets: [
      'Built and maintained internal tooling used by a 30-person operations team.',
      'Migrated a legacy PHP service to a Node.js/PostgreSQL stack with zero downtime.',
    ],
    order: 1,
  },
  {
    company: 'Freelance',
    role: 'Web Developer',
    location: 'Remote',
    startDate: '2019-06',
    endDate: '2021-02',
    bullets: [
      'Delivered marketing sites and small web apps for a range of independent clients.',
    ],
    order: 2,
  },
];

export const placeholderProjects = [
  {
    title: 'Ledger',
    slug: 'ledger',
    summary: 'A lightweight expense-tracking app for freelancers with real-time sync.',
    description:
      'Ledger started as a personal tool for tracking freelance income and expenses across currencies. It grew into a small product with real-time multi-device sync, CSV export, and a reporting view built around actual tax-season needs rather than generic dashboards.\n\nThe hardest part was reconciling optimistic local updates with server state without introducing sync bugs — solved with a small conflict-resolution layer on top of Firestore listeners.',
    tags: ['React', 'Firebase', 'Tailwind CSS'],
    coverImageUrl: '',
    images: [],
    liveUrl: '',
    repoUrl: '',
    featured: true,
    order: 0,
  },
  {
    title: 'Waypoint',
    slug: 'waypoint',
    summary: 'An internal API gateway and request-logging service for a microservice backend.',
    description:
      'Waypoint sits in front of a set of internal microservices, handling auth token verification, rate limiting, and structured request logging in one place instead of duplicating that logic per service.\n\nBuilt with Node.js and Redis for rate-limit counters, with a small React dashboard for viewing recent traffic and error rates.',
    tags: ['Node.js', 'Redis', 'PostgreSQL'],
    coverImageUrl: '',
    images: [],
    liveUrl: '',
    repoUrl: '',
    featured: true,
    order: 1,
  },
  {
    title: 'Fieldnotes',
    slug: 'fieldnotes',
    summary: 'A minimal, offline-first note-taking app with local-first sync.',
    description:
      'Fieldnotes is an exploration of local-first architecture — notes are written to IndexedDB immediately and synced opportunistically when a connection is available, so the app never blocks on network state.',
    tags: ['TypeScript', 'IndexedDB', 'React'],
    coverImageUrl: '',
    images: [],
    liveUrl: '',
    repoUrl: '',
    featured: false,
    order: 2,
  },
];

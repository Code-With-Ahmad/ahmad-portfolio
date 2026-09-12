import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import ResumeCTA from '@/components/sections/ResumeCTA';
import Contact from '@/components/sections/Contact';
import Seo from '@/components/layout/Seo';
import { scrollToId } from '@/lib/utils';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { subscribeSite, subscribeAbout, skillsApi, experienceApi, projectsApi } from '@/firebase/content';

// Section numbers ("01", "02", ...) are computed once here, in a single
// synchronous pass, rather than having each section increment a shared
// counter independently — sections subscribe to Firestore on their own and
// re-render at different times, so a shared mutable counter would get
// incremented redundantly every time any single section's data changed.
function useSectionNumbers() {
  const { data: about } = useFirestoreDoc(subscribeAbout);
  const { data: skills } = useFirestoreCollection(skillsApi.subscribeAll);
  const { data: experience } = useFirestoreCollection(experienceApi.subscribeAll);
  const { data: projects } = useFirestoreCollection(projectsApi.subscribeAll);

  const visibility = {
    hero: true,
    about: Boolean(about.heading) || (about.bio || []).length > 0,
    skills: skills.length > 0,
    experience: experience.length > 0,
    projects: projects.length > 0,
    contact: true,
  };

  let n = 0;
  const numbers = {};
  for (const key of ['hero', 'about', 'skills', 'experience', 'projects', 'contact']) {
    numbers[key] = visibility[key] ? String(++n).padStart(2, '0') : null;
  }
  return numbers;
}

export default function Home() {
  const location = useLocation();
  const { data: site } = useFirestoreDoc(subscribeSite);
  const numbers = useSectionNumbers();

  useEffect(() => {
    const targetId = location.state?.scrollTo || (location.hash ? location.hash.slice(1) : null);
    if (targetId) {
      requestAnimationFrame(() => scrollToId(targetId));
    }
  }, [location.state, location.hash]);

  const title = [site.name, site.title].filter(Boolean).join(' — ') || 'Portfolio';

  return (
    <>
      <Seo title={title} description={site.heroDescription} image={site.logoUrl} path="/" />
      <Hero number={numbers.hero} />
      <About number={numbers.about} />
      <Skills number={numbers.skills} />
      <Experience number={numbers.experience} />
      <Projects number={numbers.projects} />
      <ResumeCTA />
      <Contact number={numbers.contact} />
    </>
  );
}

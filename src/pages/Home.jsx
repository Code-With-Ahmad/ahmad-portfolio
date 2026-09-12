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
import { subscribeSite } from '@/firebase/content';

export default function Home() {
  const location = useLocation();
  const { data: site } = useFirestoreDoc(subscribeSite);

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
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <ResumeCTA />
      <Contact />
    </>
  );
}

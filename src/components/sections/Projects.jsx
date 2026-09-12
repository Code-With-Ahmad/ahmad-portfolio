import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import SectionHeading from '@/components/ui/SectionHeading';
import Tag from '@/components/ui/Tag';
import Container from '@/components/ui/Container';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { projectsApi, subscribeSite } from '@/firebase/content';
import { cloudinaryUrl } from '@/lib/utils';

function ProjectVisual({ project, className = '' }) {
  if (project.coverImageUrl) {
    return (
      <img
        src={cloudinaryUrl(project.coverImageUrl, 'q_auto,f_auto,w_900')}
        alt={project.title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-bg-elevated ${className}`}>
      <span className="font-display text-[20vw] leading-none text-border md:text-[8vw]">
        {project.title?.[0] || '—'}
      </span>
    </div>
  );
}

export default function Projects() {
  const { data: projects } = useFirestoreCollection(projectsApi.subscribeAll);
  const { data: site } = useFirestoreDoc(subscribeSite);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex] || projects[0];

  if (projects.length === 0) return null;

  return (
    <section id="work" className="border-t border-border py-24 md:py-36">
      <Container>
      {site.projectsTitle && <SectionHeading index="04" eyebrow={site.projectsEyebrow} title={site.projectsTitle} />}

      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          {projects.map((project, i) => (
            <Link
              key={project.id || project.slug}
              to={`/projects/${project.slug}`}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              data-cursor-hover
              className="group block border-t border-border py-7 last:border-b md:py-9"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[13px] text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-1 font-display text-3xl text-ink transition-colors group-hover:text-accent sm:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-muted">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.tags || []).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
                <FiArrowUpRight
                  size={24}
                  className="mt-1 shrink-0 text-ink-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                />
              </div>

              <div className="mt-6 aspect-[16/10] w-full overflow-hidden border border-border md:hidden">
                <ProjectVisual project={project} />
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-32 aspect-[4/5] w-full overflow-hidden border border-border">
            <AnimatePresence mode="wait">
              {activeProject && (
                <motion.div
                  key={activeProject.id || activeProject.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  <ProjectVisual project={activeProject} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </Container>
    </section>
  );
}

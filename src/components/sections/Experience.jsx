import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/ui/Container';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { experienceApi } from '@/firebase/content';
import { placeholderExperience } from '@/lib/placeholderContent';
import { formatDateRange } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export default function Experience() {
  const { data: experience } = useFirestoreCollection(experienceApi.subscribeAll, placeholderExperience);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="experience" className="border-t border-border py-24 md:py-36">
      <Container>
        <SectionHeading index="03" eyebrow="Experience" title="Where the work has happened." />

        <div className="mt-14">
          {experience.map((role, i) => (
            <motion.div
              key={role.id || role.company}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group -mx-6 border-t border-border px-6 py-8 transition-colors hover:bg-bg-elevated last:border-b md:-mx-10 md:grid md:grid-cols-12 md:items-baseline md:gap-6 md:px-10"
            >
              <span className="text-[13px] uppercase tracking-[0.1em] text-ink-muted md:col-span-2">
                {formatDateRange(role.startDate, role.endDate)}
              </span>

              <div className="mt-3 md:col-span-4 md:mt-0">
                <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-accent">
                  {role.role}
                </h3>
                <p className="mt-1 text-[15px] text-ink-muted">
                  {role.company}
                  {role.location ? ` · ${role.location}` : ''}
                </p>
              </div>

              <ul className="mt-4 flex flex-col gap-2 md:col-span-6 md:mt-0">
                {(role.bullets || []).map((bullet, idx) => (
                  <li key={idx} className="text-[15px] leading-relaxed text-ink-muted">
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

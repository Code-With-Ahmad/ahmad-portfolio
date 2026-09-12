import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/ui/Container';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { skillsApi } from '@/firebase/content';
import { getIcon } from '@/lib/iconMap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function groupByCategory(skills) {
  const groups = new Map();
  for (const skill of skills) {
    const key = skill.category || 'Other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(skill);
  }
  return Array.from(groups.entries());
}

export default function Skills() {
  const { data: skills } = useFirestoreCollection(skillsApi.subscribeAll);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (skills.length === 0) return null;

  const groups = groupByCategory(skills);

  return (
    <section id="skills" className="border-t border-border py-24 md:py-36">
      <Container>
        <SectionHeading index="02" eyebrow="Skills" title="Tools I reach for, and why." />

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-5 text-[13px] uppercase tracking-[0.14em] text-ink-muted">{category}</h3>
              <ul className="flex flex-col">
                {items.map((skill, i) => {
                  const Icon = getIcon(skill.icon);
                  return (
                    <motion.li
                      key={skill.id || skill.name}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className="group flex items-center gap-3 border-t border-border py-3 text-ink transition-colors"
                    >
                      <Icon className="text-ink-muted transition-colors group-hover:text-accent" size={16} />
                      <span className="text-[15px]">{skill.name}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

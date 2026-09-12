import SectionHeading from '@/components/ui/SectionHeading';
import TextReveal from '@/components/ui/TextReveal';
import Container from '@/components/ui/Container';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { subscribeAbout, subscribeSite, experienceApi, projectsApi, skillsApi } from '@/firebase/content';

export default function About({ number }) {
  const { data: about } = useFirestoreDoc(subscribeAbout);
  const { data: site } = useFirestoreDoc(subscribeSite);
  const { data: experience } = useFirestoreCollection(experienceApi.subscribeAll);
  const { data: projects } = useFirestoreCollection(projectsApi.subscribeAll);
  const { data: skills } = useFirestoreCollection(skillsApi.subscribeAll);

  const bio = about.bio || [];
  if (!about.heading && bio.length === 0) return null;

  const stats = [
    { value: `${experience.length}`, label: 'Roles held' },
    { value: `${projects.length}`, label: 'Projects shipped' },
    { value: `${skills.length}+`, label: 'Tools & languages' },
  ];

  return (
    <section id="about" className="border-t border-border py-24 md:py-36">
      <Container>
        {about.heading && <SectionHeading index={number} eyebrow={site.aboutEyebrow} title={about.heading} />}

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="flex flex-row gap-8 md:col-span-3 md:flex-col md:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-border pt-3">
                <div className="font-display text-3xl text-ink">{stat.value}</div>
                <div className="mt-1 text-[13px] uppercase tracking-[0.1em] text-ink-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-5">
            {bio.map((paragraph, i) => (
              <TextReveal
                key={i}
                as="p"
                className="max-w-2xl text-lg leading-relaxed text-ink-muted"
                stagger={0.015}
              >
                {paragraph}
              </TextReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

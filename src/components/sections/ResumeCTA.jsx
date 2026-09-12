import { FiArrowDownRight } from 'react-icons/fi';
import TextReveal from '@/components/ui/TextReveal';
import Container from '@/components/ui/Container';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite } from '@/firebase/content';

export default function ResumeCTA() {
  const { data: site } = useFirestoreDoc(subscribeSite);

  return (
    <section className="border-t border-border py-20 md:py-28">
      <Container className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <TextReveal as="h2" className="max-w-xl font-display text-4xl leading-[1.15] text-ink md:text-5xl">
          Want the longer version, on paper?
        </TextReveal>

        {site.resumeUrl ? (
          <a
            href={site.resumeUrl}
            download={site.resumeFileName || 'resume.pdf'}
            data-cursor-hover
            className="group inline-flex shrink-0 items-center gap-3 bg-accent px-7 py-4 text-[15px] font-medium text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            Download Resume
            <FiArrowDownRight className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        ) : (
          <span className="shrink-0 border border-border px-7 py-4 text-[13px] uppercase tracking-[0.12em] text-ink-muted">
            Résumé coming soon
          </span>
        )}
      </Container>
    </section>
  );
}

import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import TextReveal from '@/components/ui/TextReveal';
import Container from '@/components/ui/Container';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite, subscribeAbout } from '@/firebase/content';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { scrollToId } from '@/lib/utils';

export default function Hero() {
  const { data: site } = useFirestoreDoc(subscribeSite);
  const { data: about } = useFirestoreDoc(subscribeAbout);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col">
      <Container
        className="flex flex-1 flex-col justify-between pb-8"
        style={{ paddingTop: 'calc(var(--nav-h, 96px) + 2rem)' }}
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-start justify-between text-[13px] uppercase tracking-[0.14em] text-ink-muted"
        >
          <span>{site.title}</span>
          {site.availability && (
            <span className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {site.availability}
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:items-end md:gap-6 md:py-0">
          {site.tagline && (
            <TextReveal
              as="h1"
              stagger={0.03}
              className="font-display text-[13vw] leading-[0.98] tracking-tight text-ink md:col-span-9 md:text-[6.4vw]"
            >
              {site.tagline}
            </TextReveal>
          )}

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col gap-6 md:col-span-3"
          >
            {about.profileImageUrl && (
              <div className="aspect-[4/5] w-full max-w-[180px] overflow-hidden border border-border">
                <img src={about.profileImageUrl} alt={site.name || ''} className="h-full w-full object-cover" />
              </div>
            )}
            {site.heroDescription && (
              <p className="max-w-xs text-[15px] leading-relaxed text-ink-muted">{site.heroDescription}</p>
            )}
            {site.name && <span className="font-display text-lg italic text-ink-muted">— {site.name}</span>}
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-between text-[13px] uppercase tracking-[0.14em] text-ink-muted"
        >
          <span>{site.location}</span>
          <button
            type="button"
            onClick={() => scrollToId('about')}
            aria-label="Scroll to about section"
            className="flex items-center gap-2 transition-colors hover:text-ink"
          >
            Scroll
            <FiArrowDown className={prefersReducedMotion ? '' : 'animate-bounce'} />
          </button>
        </motion.div>
      </Container>
    </section>
  );
}

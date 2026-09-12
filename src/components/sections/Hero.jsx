import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import TextReveal from '@/components/ui/TextReveal';
import Container from '@/components/ui/Container';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite, subscribeAbout } from '@/firebase/content';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { scrollToId, cloudinaryUrl } from '@/lib/utils';

export default function Hero() {
  const { data: site } = useFirestoreDoc(subscribeSite);
  const { data: about } = useFirestoreDoc(subscribeAbout);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col">
      <Container
        className="flex flex-1 flex-col pb-8"
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

        <div className="my-auto mb-12 grid grid-cols-1 gap-10 py-10 md:mb-8 md:grid-cols-12 md:items-center md:gap-10 md:py-0">
          <div className="md:col-span-8">
            {site.tagline && (
              <TextReveal
                as="h1"
                stagger={0.03}
                className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.15] tracking-tight text-ink"
              >
                {site.tagline}
              </TextReveal>
            )}

            {(site.heroDescription || site.name) && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex flex-col gap-4"
              >
                {site.heroDescription && (
                  <p className="max-w-md text-[15px] leading-relaxed text-ink-muted">{site.heroDescription}</p>
                )}
                {site.name && (
                  <div className="flex items-center gap-3">
                    {about.profileImageUrl && (
                      <img
                        src={cloudinaryUrl(about.profileImageUrl, 'q_auto,f_auto,c_thumb,g_face,w_96,h_96')}
                        alt=""
                        className="h-10 w-10 rounded-full border border-border object-cover md:hidden"
                      />
                    )}
                    <span className="font-display text-lg italic text-ink-muted">— {site.name}</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {about.profileImageUrl && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:col-span-4 md:block"
            >
              <div className="aspect-[3/4] w-full overflow-hidden border border-border">
                <img
                  src={cloudinaryUrl(about.profileImageUrl, 'q_auto,f_auto,c_fill,g_face,w_700,h_934')}
                  alt={site.name || ''}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-between pr-20 text-[13px] uppercase tracking-[0.14em] text-ink-muted sm:pr-0"
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

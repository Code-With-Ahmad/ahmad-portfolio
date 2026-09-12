import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowUp } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite } from '@/firebase/content';
import { getWhatsAppLink, scrollToId } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const MARGIN = 16; // matches bottom-6/right-6 (1.5rem) minus a touch, keeps a gap above the footer
const SCROLL_THRESHOLD = 500; // px scrolled before the back-to-top button appears

export default function FloatingActions() {
  const { data: site } = useFirestoreDoc(subscribeSite);
  const prefersReducedMotion = usePrefersReducedMotion();
  const whatsappLink = getWhatsAppLink(site.whatsapp);
  const [lift, setLift] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');

    let raf = null;
    const measure = () => {
      setShowBackToTop(window.scrollY > SCROLL_THRESHOLD);
      if (footer) {
        const overlap = window.innerHeight - footer.getBoundingClientRect().top;
        setLift(Math.max(0, overlap + MARGIN));
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        measure();
        raf = null;
      });
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!whatsappLink && !showBackToTop) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      style={{ transform: `translateY(-${lift}px)`, transition: 'transform 0.15s linear' }}
    >
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={() => scrollToId('top')}
            aria-label="Back to top"
            data-cursor-hover
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.25 }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-elevated text-ink transition-colors hover:text-accent"
          >
            <FiArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {whatsappLink && (
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          data-cursor-hover
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          whileHover={{ scale: 1.06 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-none"
        >
          <FaWhatsapp size={26} />
        </motion.a>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowDownRight, FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite } from '@/firebase/content';
import { placeholderSite } from '@/lib/placeholderContent';
import { scrollToId, getInitials } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const { data: site } = useFirestoreDoc(subscribeSite, placeholderSite);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tracks the header's real rendered height (which varies with logo size,
  // viewport width, etc.) into a CSS var so page content can pad itself
  // exactly enough to clear the fixed header — instead of guessing a pixel
  // value that breaks every time the logo is resized.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const setNavHeightVar = () => {
      document.documentElement.style.setProperty('--nav-h', `${el.offsetHeight}px`);
    };

    setNavHeightVar();
    const resizeObserver = new ResizeObserver(setNavHeightVar);
    resizeObserver.observe(el);
    window.addEventListener('resize', setNavHeightVar);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', setNavHeightVar);
    };
  }, [site.logoUrl]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      scrollToId(id);
    }
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b bg-bg transition-colors duration-300 ${
        scrolled ? 'border-border' : 'border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 md:px-10">
        <a
          href="/#top"
          onClick={handleNavClick('top')}
          className="flex items-center font-display text-lg tracking-tight text-ink"
          aria-label="Back to top"
        >
          {site.logoUrl ? (
            <img src={site.logoUrl} alt={site.name} className="h-16 w-auto object-contain md:h-20" />
          ) : (
            getInitials(site.name) || 'AN'
          )}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`/#${item.id}`}
                onClick={handleNavClick(item.id)}
                className="text-[13px] uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          {site.resumeUrl && (
            <a
              href={site.resumeUrl}
              download={site.resumeFileName || 'resume.pdf'}
              className="group inline-flex items-center gap-1.5 text-[13px] uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
            >
              Resume
              <FiArrowDownRight className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          )}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center text-ink"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ top: 'var(--nav-h, 88px)' }}
            className="fixed inset-x-0 bottom-0 z-40 flex flex-col justify-between bg-bg px-6 pb-10 pt-6 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className="border-b border-border py-4"
                >
                  <a
                    href={`/#${item.id}`}
                    onClick={handleNavClick(item.id)}
                    className="font-display text-3xl tracking-tight text-ink"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            {site.resumeUrl && (
              <a
                href={site.resumeUrl}
                download={site.resumeFileName || 'resume.pdf'}
                className="inline-flex items-center gap-2 self-start text-sm uppercase tracking-[0.12em] text-accent"
              >
                Download Resume
                <FiArrowDownRight />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

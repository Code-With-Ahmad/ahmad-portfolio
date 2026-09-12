import { useEffect, useRef } from 'react';
import { gsap, splitWords, prefersReducedMotion } from '@/animations/gsapUtils';

/**
 * Renders text that reveals word-by-word on scroll into view.
 * `as` controls the wrapping tag (defaults to div) so it can be used for
 * headings or paragraphs alike.
 */
export default function TextReveal({ as: Tag = 'div', children, className = '', stagger = 0.06, delay = 0, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const inners = splitWords(el);
      gsap.set(inners, { yPercent: 110 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

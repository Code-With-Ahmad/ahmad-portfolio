import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Splits an element's text into masked word spans, in place, for a
 * slide-up-from-behind-a-mask reveal. Word-level (not char-level) to stay
 * performant and avoid layout thrash on resize/reflow.
 *
 * Returns the inner spans — animate their `y`/`yPercent`, the outer mask
 * spans clip the motion.
 */
export function splitWords(el) {
  const text = el.textContent;
  el.textContent = '';
  const words = text.split(' ').filter(Boolean);

  const inners = words.map((word, i) => {
    const mask = document.createElement('span');
    mask.style.display = 'inline-block';
    mask.style.overflow = 'hidden';
    mask.style.verticalAlign = 'top';

    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.textContent = word;

    mask.appendChild(inner);
    el.appendChild(mask);

    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }
    return inner;
  });

  return inners;
}

export { gsap, ScrollTrigger };

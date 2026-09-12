export function scrollToId(id, behavior = 'smooth') {
  const el = document.getElementById(id);
  if (!el) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: prefersReduced ? 'auto' : behavior, block: 'start' });
}

export function formatDateRange(startDate, endDate) {
  const format = (value) => {
    if (!value || value === 'Present') return 'Present';
    const [year, month] = value.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return `${format(startDate)} — ${format(endDate)}`;
}

export function getWhatsAppLink(number = '') {
  const digits = number.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}`;
}

export function slugify(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Requests an auto-format/auto-quality, width-capped version of a Cloudinary
 * image instead of the original upload — the difference is often 4-5x
 * smaller with no visible quality loss at display size, and avoids the
 * "photo streams in progressively over several seconds" problem on
 * unoptimized originals. No-op for any non-Cloudinary URL.
 */
export function cloudinaryUrl(url, transform = 'q_auto,f_auto') {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

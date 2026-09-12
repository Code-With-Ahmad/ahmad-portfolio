import { useEffect } from 'react';

function setMeta(id, content) {
  const el = document.getElementById(id);
  if (el && content) el.setAttribute('content', content);
}

/**
 * Updates document title, meta description, Open Graph/Twitter tags, and the
 * canonical link for the current page. Note: since this is a client-rendered
 * SPA, these updates only reach crawlers/scrapers that execute JavaScript —
 * see the README's SEO section for the SSR/prerendering caveat.
 */
export default function Seo({ title, description, image, path = '' }) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('og-title', title);
    setMeta('twitter-title', title);
    if (description) {
      setMeta('og-description', description);
      setMeta('twitter-description', description);
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute('content', description);
    }
    if (image) {
      setMeta('og-image', image);
      setMeta('twitter-image', image);
    }

    const canonical = document.getElementById('canonical-link');
    if (canonical) canonical.setAttribute('href', window.location.origin + path);
  }, [title, description, image, path]);

  return null;
}

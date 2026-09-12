import { useEffect } from 'react';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite } from '@/firebase/content';
import { placeholderSite } from '@/lib/placeholderContent';

const SCRIPT_ID = 'person-schema';

export default function PersonSchema() {
  const { data: site } = useFirestoreDoc(subscribeSite, placeholderSite);

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.name,
      jobTitle: site.title,
      email: site.email,
      address: site.location,
      url: window.location.origin,
      sameAs: Object.values(site.socials || {}).filter(Boolean),
    };

    let script = document.getElementById(SCRIPT_ID);
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [site]);

  return null;
}

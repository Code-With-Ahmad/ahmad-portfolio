import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite } from '@/firebase/content';

const SOCIAL_ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  x: FiTwitter,
};

export default function Footer() {
  const { data: site } = useFirestoreDoc(subscribeSite);
  const year = new Date().getFullYear();
  const socials = Object.entries(site.socials || {}).filter(([, url]) => url);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="text-sm text-ink-muted">
          © {year}{site.name ? ` ${site.name}` : ''}. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          {socials.map(([key, url]) => {
            const Icon = SOCIAL_ICONS[key];
            if (!Icon) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={key}
                className="text-ink-muted transition-colors hover:text-accent"
              >
                <Icon size={17} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

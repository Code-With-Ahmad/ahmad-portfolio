import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import SectionHeading from '@/components/ui/SectionHeading';
import Container from '@/components/ui/Container';
import ContactForm from './ContactForm';
import { useFirestoreDoc } from '@/hooks/useFirestoreDoc';
import { subscribeSite } from '@/firebase/content';

const SOCIAL_ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  x: FiTwitter,
};

export default function Contact() {
  const { data: site } = useFirestoreDoc(subscribeSite);
  const socials = Object.entries(site.socials || {}).filter(([, url]) => url);

  return (
    <section id="contact" className="border-t border-border py-24 md:py-36">
      <Container>
      {site.contactTitle && <SectionHeading index="06" eyebrow={site.contactEyebrow} title={site.contactTitle} />}

      <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col justify-between gap-12 md:col-span-5">
          {(site.location || socials.length > 0) && (
            <div className="flex flex-col gap-4 text-ink-muted">
              {site.location && <span className="text-[15px]">{site.location}</span>}
              {socials.length > 0 && (
                <div className="flex gap-5">
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
                        data-cursor-hover
                        className="transition-colors hover:text-accent"
                      >
                        <Icon size={19} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </div>
      </Container>
    </section>
  );
}

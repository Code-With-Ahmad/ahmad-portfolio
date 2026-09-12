import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { getProjectBySlug } from '@/firebase/content';
import Tag from '@/components/ui/Tag';
import Loader from '@/components/ui/Loader';
import Seo from '@/components/layout/Seo';
import Container from '@/components/ui/Container';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let active = true;
    setProject(undefined);
    window.scrollTo(0, 0);

    getProjectBySlug(slug).then((result) => {
      if (!active) return;
      setProject(result || null);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (project === undefined) {
    return <Loader className="min-h-screen" />;
  }

  if (project === null) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-ink-muted">That project doesn't exist.</p>
        <Link to="/" className="text-accent underline underline-offset-4">
          Back home
        </Link>
      </div>
    );
  }

  const paragraphs = (project.description || '').split('\n\n').filter(Boolean);

  return (
    <Container as="article" className="pb-24" style={{ paddingTop: 'calc(var(--nav-h, 96px) + 2rem)' }}>
      <Seo
        title={`${project.title} — Project`}
        description={project.summary}
        image={project.coverImageUrl}
        path={`/projects/${project.slug}`}
      />
      <Link
        to="/"
        state={{ scrollTo: 'work' }}
        className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
      >
        <FiArrowLeft /> Back to work
      </Link>

      <header className="mt-10 max-w-4xl">
        <h1 className="font-display text-5xl leading-[1.02] text-ink md:text-7xl">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(project.tags || []).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-6">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent"
            >
              Live site <FiArrowUpRight />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent"
            >
              Source <FiArrowUpRight />
            </a>
          )}
        </div>
      </header>

      {project.coverImageUrl && (
        <div className="mt-14 aspect-[16/9] w-full overflow-hidden border border-border">
          <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-8">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-[17px] leading-relaxed text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {project.images?.length > 0 && (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {project.images.map((src, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden border border-border">
              <img src={src} alt={`${project.title} screenshot ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

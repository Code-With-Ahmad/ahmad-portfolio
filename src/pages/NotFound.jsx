import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Seo from '@/components/layout/Seo';
import TextReveal from '@/components/ui/TextReveal';

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Seo title="Page not found" description="This page doesn't exist." path="/404" />
      <span className="text-[13px] uppercase tracking-[0.14em] text-ink-muted">Error 404</span>
      <TextReveal as="h1" className="font-display text-[18vw] leading-none text-ink sm:text-8xl">
        Lost the thread.
      </TextReveal>
      <p className="max-w-sm text-[15px] leading-relaxed text-ink-muted">
        The page you're looking for doesn't exist, or it moved.
      </p>
      <Link
        to="/"
        data-cursor-hover
        className="group mt-2 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-accent"
      >
        <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
        Back home
      </Link>
    </div>
  );
}

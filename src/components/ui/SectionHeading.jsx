import TextReveal from './TextReveal';

export default function SectionHeading({ index, eyebrow, title, className = '' }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-3 text-ink-muted">
        {index && <span className="font-display text-sm italic">{index}</span>}
        <span className="h-px flex-none w-8 bg-border" />
        <span className="text-[13px] uppercase tracking-[0.16em]">{eyebrow}</span>
      </div>
      <TextReveal
        as="h2"
        className="max-w-3xl font-display text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl"
      >
        {title}
      </TextReveal>
    </div>
  );
}

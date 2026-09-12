export default function Tag({ children }) {
  return (
    <span className="inline-flex items-center border border-border px-2.5 py-1 text-[12px] uppercase tracking-[0.08em] text-ink-muted">
      {children}
    </span>
  );
}

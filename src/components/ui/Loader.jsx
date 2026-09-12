export default function Loader({ className = 'min-h-[40vh]' }) {
  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <span
        role="status"
        aria-label="Loading"
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
      />
    </div>
  );
}

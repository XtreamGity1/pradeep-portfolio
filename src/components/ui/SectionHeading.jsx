// Eyebrow label + large heading. `accent` renders in italic serif after the title.
export default function SectionHeading({ eyebrow, title, accent, className = '' }) {
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      {eyebrow && (
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
      )}
      <h2 className="text-4xl font-semibold tracking-tight text-fg md:text-6xl">
        {title}
        {accent && <span className="font-serif font-normal italic text-muted"> {accent}</span>}
      </h2>
    </div>
  );
}

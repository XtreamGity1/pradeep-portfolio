// Standard page section: anchor id, vertical rhythm and centered container.
export default function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`relative px-4 py-24 sm:px-6 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

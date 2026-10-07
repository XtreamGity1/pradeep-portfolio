import { Card, Section, SectionHeading } from '../components/ui';
import { testimonials } from '../data';

// Grid adapts to how many quotes there are, so 1–4 never leave an awkward gap.
const layouts = {
  1: { grid: 'mx-auto max-w-3xl', item: () => '' },
  3: { grid: 'md:grid-cols-2 lg:grid-cols-3', item: (i) => (i === 0 ? 'md:col-span-2 lg:col-span-1' : '') },
};
const defaultLayout = { grid: 'md:grid-cols-2', item: () => '' };

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

export default function Testimonials() {
  // Launching without quotes is fine — the whole section simply disappears.
  if (testimonials.length === 0) return null;
  const layout = layouts[testimonials.length] ?? defaultLayout;

  return (
    <Section id="testimonials">
      <SectionHeading eyebrow="Testimonials" title="Kind words" accent="from early collaborators." />

      <ul aria-label="Testimonials" className={`grid grid-cols-1 gap-5 sm:gap-6 ${layout.grid}`}>
        {testimonials.map((t, i) => (
          <li key={t.name} className={layout.item(i)}>
            <Card as="figure" className="relative flex h-full flex-col justify-between overflow-hidden md:p-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 right-4 select-none font-serif text-[7rem] leading-none text-accent/25 sm:-top-6 sm:right-6 sm:text-[9rem]"
              >
                &ldquo;
              </span>
              <blockquote className="relative">
                <p className="font-serif text-xl italic leading-snug text-fg sm:text-2xl">{t.quote}</p>
              </blockquote>
              <figcaption className="relative mt-8 flex items-center gap-4 border-t border-line pt-6">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent ring-1 ring-accent/30"
                >
                  {initialsOf(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-fg">{t.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">{t.role}</span>
                </span>
              </figcaption>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

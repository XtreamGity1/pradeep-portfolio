import { Card, Section, SectionHeading } from '../components/ui';
import { testimonials } from '../data';

export default function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading eyebrow="Kind words" title="Trusted by" accent="creators & brands." />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <Card
            as="figure"
            key={t.name}
            className="relative flex flex-col justify-between overflow-hidden md:p-8 lg:p-10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 right-4 select-none font-serif text-[7rem] leading-none text-accent/25 sm:-top-6 sm:right-6 sm:text-[10rem]"
            >
              &ldquo;
            </span>
            <blockquote className="relative">
              <p className="font-serif text-xl italic leading-snug text-fg sm:text-2xl lg:text-3xl">{t.quote}</p>
            </blockquote>
            <figcaption className="relative mt-8 border-t border-line pt-6 sm:mt-10">
              <span className="block font-semibold text-fg">{t.name}</span>
              <span className="mt-1 block text-sm text-muted">{t.role}</span>
            </figcaption>
          </Card>
        ))}
      </div>
    </Section>
  );
}

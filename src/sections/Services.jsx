import SpotlightCard from '../components/SpotlightCard/SpotlightCard';
import { Eyebrow, Pill, Section, SectionHeading } from '../components/ui';
import { services, tools } from '../data';

export default function Services() {
  return (
    <Section id="services">
      <SectionHeading eyebrow="Services" title="What I" accent="do best." />

      <ul aria-label="Services" className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        {services.map((service) => (
          <li key={service.tag} className="h-full">
            {/* SpotlightCard ships unlayered CSS, so token overrides need `!`. */}
            <SpotlightCard
              className="h-full rounded-2xl! border-line! bg-surface! p-6! sm:p-8! lg:p-10!"
              spotlightColor="rgba(255, 77, 109, 0.2)"
            >
              <span className="font-mono text-sm tracking-[0.2em] text-accent">{service.tag}</span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-fg sm:mt-6 sm:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{service.body}</p>
            </SpotlightCard>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col gap-5 border-t border-line pt-10 md:mt-16 md:flex-row md:items-center md:gap-10">
        <Eyebrow as="h3" id="toolkit-label" tone="muted" className="shrink-0">
          Toolkit
        </Eyebrow>
        <ul aria-labelledby="toolkit-label" className="flex flex-wrap gap-2 sm:gap-3">
          {tools.map((tool) => (
            <Pill as="li" key={tool}>
              {tool}
            </Pill>
          ))}
        </ul>
      </div>
    </Section>
  );
}

import SpotlightCard from '../components/SpotlightCard/SpotlightCard';
import { Eyebrow, Pill, Section, SectionHeading } from '../components/ui';
import { services, tools } from '../data';

function ServiceCard({ service }) {
  const id = `service-${service.tag}`;
  return (
    // Spotlight is mouse-only; the hairline + corner glow give touch devices a finished static card.
    <SpotlightCard
      as="article"
      aria-labelledby={`${id}-title`}
      className="h-full rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:p-10"
      spotlightColor="rgba(255, 77, 109, 0.2)"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-sm tracking-[0.2em] text-accent">{service.tag}</span>
          <ul aria-label="Platforms" className="flex flex-wrap gap-1.5">
            {service.platforms.map((platform) => (
              <Pill as="li" key={platform} tone="glass">
                {platform}
              </Pill>
            ))}
          </ul>
        </div>

        <h3 id={`${id}-title`} className="mt-5 text-xl font-semibold tracking-tight text-fg sm:mt-6 sm:text-2xl">
          {service.title}
        </h3>
        <p className="mt-3 mb-8 leading-relaxed text-muted">{service.body}</p>

        <dl className="mt-auto grid gap-5 border-t border-line pt-6 sm:grid-cols-[1fr_auto] sm:gap-8 md:grid-cols-1 md:gap-5 lg:grid-cols-[1fr_auto] lg:gap-8">
          <div>
            <Eyebrow as="dt" id={`${id}-deliverables`} tone="muted">
              Deliverables
            </Eyebrow>
            <dd className="mt-3">
              <ul aria-labelledby={`${id}-deliverables`} className="space-y-2">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-fg">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <Eyebrow as="dt" tone="muted">
              Typical turnaround
            </Eyebrow>
            <dd className="mt-3 font-serif text-2xl italic leading-none text-fg">{service.turnaround}</dd>
          </div>
        </dl>
      </div>
    </SpotlightCard>
  );
}

export default function Services() {
  return (
    <Section id="services">
      <SectionHeading eyebrow="Services" title="What I" accent="do best." />

      <ul aria-label="Services" className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        {services.map((service) => (
          <li key={service.tag} className="h-full">
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col gap-5 border-t border-line pt-10 md:mt-16 md:flex-row md:items-center md:gap-10">
        <Eyebrow as="h3" id="toolkit-label" tone="muted" className="shrink-0">
          Toolkit
        </Eyebrow>
        {/* Even two-up grid on phones so the pills don't wrap raggedly; free-flowing row from sm. */}
        <ul aria-labelledby="toolkit-label" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {tools.map((tool) => (
            <Pill as="li" key={tool} className="text-center">
              {tool}
            </Pill>
          ))}
        </ul>
      </div>
    </Section>
  );
}

import { Button, Eyebrow, Pill, Section, SectionHeading } from '../components/ui';
import { packages, testEdit } from '../data';

const formatPrice = (amount) => `$${amount.toLocaleString('en-US')}`;

// "per month" -> "/ month" for the compact visual price.
const shortUnit = (unit) => unit.replace(/^per\s+/, '/ ');

const skins = {
  default: 'border-line bg-surface/50 hover:border-fg/25',
  featured:
    'border-accent/50 bg-linear-to-b from-accent/10 to-surface/60 shadow-[0_0_60px_-24px] shadow-accent/60',
};

function Price({ pkg }) {
  return (
    <p className="mt-6">
      {/* Screen readers get one clear phrase; the styled version is visual only. */}
      <span className="sr-only">{`From ${formatPrice(pkg.price)} ${pkg.unit}`}</span>
      <span aria-hidden="true" className="flex items-baseline gap-2">
        <span className="text-sm text-muted">From</span>
        <span className="text-5xl font-semibold tracking-tight tabular-nums text-fg">{formatPrice(pkg.price)}</span>
        <span className="text-sm text-muted">{shortUnit(pkg.unit)}</span>
      </span>
    </p>
  );
}

function PackageCard({ pkg, index }) {
  const id = `package-${index}`;
  const featured = Boolean(pkg.badge);
  return (
    // Phone + laptop: stacked card. Tablet (md, single column): summary left, details right.
    <article
      aria-labelledby={`${id}-name`}
      className={`flex h-full flex-col gap-8 rounded-2xl border p-6 transition-colors duration-300 motion-reduce:transition-none sm:p-8 md:grid md:grid-cols-2 md:gap-10 lg:flex lg:gap-8 ${skins[featured ? 'featured' : 'default']}`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id={`${id}-name`} className="text-2xl font-semibold tracking-tight text-fg">
            {pkg.name}
          </h3>
          {featured && (
            <Pill tone="accent">
              <span aria-hidden="true">★ </span>
              {pkg.badge}
            </Pill>
          )}
        </div>
        <p className="mt-3 leading-relaxed text-muted lg:min-h-[5.25rem]">{pkg.audience}</p>
        <Price pkg={pkg} />
        <Button
          href="#contact"
          variant={featured ? 'primary' : 'ghost'}
          className="mt-6 w-full justify-center"
        >
          {pkg.cta}
          <span aria-hidden="true">&rarr;</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col">
        <Eyebrow id={`${id}-included`} tone="muted">
          What’s included
        </Eyebrow>
        <ul aria-labelledby={`${id}-included`} className="mt-4 mb-8 space-y-3">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm leading-relaxed text-fg">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="mt-1 size-4 shrink-0 fill-none stroke-accent stroke-2"
              >
                <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-6">
          <div>
            <Eyebrow as="dt" tone="muted">
              Turnaround
            </Eyebrow>
            <dd className="mt-2 text-sm text-fg">{pkg.turnaround}</dd>
          </div>
          <div>
            <Eyebrow as="dt" tone="muted">
              Revisions
            </Eyebrow>
            <dd className="mt-2 text-sm text-fg">{pkg.revisions}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading eyebrow="Pricing" title="Simple rates," accent="no surprises." />

      <ul aria-label="Packages" className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
        {packages.map((pkg, i) => (
          <li key={pkg.name}>
            <PackageCard pkg={pkg} index={i} />
          </li>
        ))}
      </ul>

      <section
        aria-labelledby="test-edit-title"
        className="mt-8 flex flex-col gap-6 rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-6 sm:p-8 md:mt-10 md:flex-row md:items-center md:justify-between md:gap-10"
      >
        <div className="max-w-2xl">
          <h3 id="test-edit-title" className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
            {testEdit.title}
          </h3>
          <p className="mt-2 leading-relaxed text-muted">{testEdit.body}</p>
        </div>
        <Button href="#contact" className="w-full shrink-0 justify-center sm:w-auto">
          {testEdit.cta}
          <span aria-hidden="true">&rarr;</span>
        </Button>
      </section>
    </Section>
  );
}

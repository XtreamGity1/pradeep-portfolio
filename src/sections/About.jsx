import ScrollReveal from '../components/ScrollReveal/ScrollReveal';
import CountUp from '../components/CountUp/CountUp';
import { Card, Eyebrow, Pill, Section, SectionHeading } from '../components/ui';
import { aboutDetails, platforms, principles, profile, stats } from '../data';

const principleIndex = i => String(i + 1).padStart(2, '0');

function formatStat({ value, suffix, separator }) {
  const number = value.toLocaleString('en-US', { useGrouping: Boolean(separator) });
  return `${separator ? number.replace(/,/g, separator) : number}${suffix}`;
}

function Portrait({ className = '' }) {
  const { src, alt, width, height } = aboutDetails.portrait;
  return (
    <figure className={`relative overflow-hidden rounded-2xl border border-line bg-surface ${className}`}>
      {/* Width/height + aspect ratio reserve the box before the lazy image arrives (no layout shift).
          Landscape crop while stacked on phones/tablets, true portrait beside the copy on large screens. */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block aspect-[4/5] h-auto w-full object-cover sm:aspect-[16/10] lg:aspect-[4/5]"
      />
      <figcaption className="absolute bottom-4 left-4">
        <Pill tone="glass">{profile.name}</Pill>
      </figcaption>
    </figure>
  );
}

function StatCard({ stat }) {
  return (
    <Card className="flex flex-col-reverse justify-end gap-2">
      <dt className="text-sm text-muted">{stat.label}</dt>
      <dd className="text-3xl font-semibold tracking-tight tabular-nums text-fg sm:text-4xl lg:text-5xl">
        <span className="sr-only">{formatStat(stat)}</span>
        <span aria-hidden="true">
          <CountUp to={stat.value} separator={stat.separator ?? ''} duration={2} />
          <span className="text-accent">{stat.suffix}</span>
        </span>
      </dd>
    </Card>
  );
}

export default function About() {
  return (
    <Section id="about">
      <SectionHeading eyebrow="About" title="Editing is invisible" accent="until it isn't." />

      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Portrait className="lg:col-span-5" />

        <div className="lg:col-span-7">
          {/* The animated copy is split into words; expose it once as a plain paragraph instead. */}
          <p className="sr-only">{profile.about}</p>
          <div aria-hidden="true">
            <ScrollReveal
              containerClassName="my-0!"
              textClassName="text-fg lg:text-[clamp(1.75rem,2.4vw,2.25rem)]"
              baseOpacity={0.12}
              blurStrength={4}
              baseRotation={2}
            >
              {profile.about}
            </ScrollReveal>
          </div>

          <Eyebrow tone="muted" className="mt-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-line" />
            {profile.location}
          </Eyebrow>

          <div className="mt-10 border-t border-line pt-8">
            <Eyebrow as="h3" id="platforms-label" tone="muted">
              {aboutDetails.platformsTitle}
            </Eyebrow>
            <ul aria-labelledby="platforms-label" className="mt-4 flex flex-wrap gap-2 sm:gap-3">
              {platforms.map(platform => (
                <Pill as="li" key={platform}>
                  {platform}
                </Pill>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <h3 id="principles-label" className="text-2xl font-semibold tracking-tight text-fg md:text-3xl">
          {aboutDetails.principlesTitle}
        </h3>
        <ol aria-labelledby="principles-label" className="mt-8 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((principle, i) => (
            <Card as="li" key={principle.title} className="flex flex-col">
              <span aria-hidden="true" className="font-serif text-4xl italic leading-none text-accent">
                {principleIndex(i)}
              </span>
              <h4 className="mt-5 text-lg font-semibold tracking-tight text-fg">{principle.title}</h4>
              <p className="mt-2 leading-relaxed text-muted">{principle.body}</p>
            </Card>
          ))}
        </ol>
      </div>

      <dl className="mt-12 grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:mt-16 md:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </dl>
    </Section>
  );
}

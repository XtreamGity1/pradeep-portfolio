import ScrollReveal from '../components/ScrollReveal/ScrollReveal';
import CountUp from '../components/CountUp/CountUp';
import { Card, Eyebrow, Section, SectionHeading } from '../components/ui';
import { profile, stats } from '../data';

function formatStat({ value, suffix, separator }) {
  const number = value.toLocaleString('en-US', { useGrouping: Boolean(separator) });
  return `${separator ? number.replace(/,/g, separator) : number}${suffix}`;
}

function StatCard({ stat }) {
  return (
    <Card className="flex flex-col-reverse gap-2">
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

      {/* ScrollReveal renders its own <h2>; expose the copy once as a plain paragraph instead. */}
      <p className="sr-only">{profile.about}</p>
      <div aria-hidden="true" className="max-w-4xl">
        <ScrollReveal textClassName="text-fg" baseOpacity={0.12} blurStrength={4} baseRotation={2}>
          {profile.about}
        </ScrollReveal>
      </div>

      <Eyebrow tone="muted" className="mt-10 flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-line" />
        {profile.location}
      </Eyebrow>

      <dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-16 md:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </dl>
    </Section>
  );
}

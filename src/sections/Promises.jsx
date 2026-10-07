import { Card, Section, SectionHeading } from '../components/ui';
import { promises } from '../data';

// What a client can count on: concrete commitments, standing in for testimonials until there are
// real quotes. One column on phones, two on tablets, four across on laptops.
export default function Promises() {
  return (
    <Section id="promises">
      <SectionHeading eyebrow="My promise" title="What you can" accent="count on." />

      <ul aria-label="Promises" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {promises.map(p => (
          <li key={p.title}>
            <Card className="flex h-full flex-col gap-4">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-fg">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

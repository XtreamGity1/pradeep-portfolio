import { Section, SectionHeading } from '../components/ui';
import { process as steps } from '../data';

const stepIndex = (i) => String(i + 1).padStart(2, '0');

export default function Process() {
  return (
    <Section id="process" className="border-y border-line bg-surface/30">
      <SectionHeading eyebrow="Process" title="From raw footage" accent="to final cut." />

      <ol className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
        {steps.map((item, i) => (
          <li key={item.step} className="relative border-t border-line pt-8">
            {/* Accent node sitting on the connecting line */}
            <span
              aria-hidden="true"
              className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px] shadow-accent/60"
            />
            <span aria-hidden="true" className="block font-serif text-5xl italic leading-none text-accent md:text-6xl">
              {stepIndex(i)}
            </span>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg">
              <span className="sr-only">Step {i + 1}: </span>
              {item.step}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

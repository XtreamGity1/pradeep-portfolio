import { Eyebrow, Pill, Section, SectionHeading } from '../components/ui';
import { process as steps } from '../data';

const stepIndex = (i) => String(i + 1).padStart(2, '0');

// Timeline: a vertical rail on phones/tablets, a horizontal track from `lg` up.
export default function Process() {
  return (
    <Section id="process" className="border-y border-line bg-surface/30">
      <SectionHeading eyebrow="Process" title="From raw footage" accent="to final cut." />

      <ol aria-label="Process" className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-8">
        {steps.map((item, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={item.step} className="flex gap-5 sm:gap-8 lg:flex-col lg:gap-8">
              {/* Step node + connector to the next step (down on mobile, across on laptop) */}
              <div aria-hidden="true" className="flex shrink-0 flex-col items-center lg:flex-row">
                <span className="grid size-14 shrink-0 place-items-center rounded-full border border-accent/40 bg-ink font-serif text-2xl italic leading-none text-accent shadow-[0_0_24px] shadow-accent/20 sm:size-16 sm:text-3xl">
                  {stepIndex(i)}
                </span>
                <span
                  className={`w-px flex-1 bg-linear-to-b from-accent/60 to-line lg:ml-4 lg:h-px lg:w-auto lg:bg-linear-to-r ${
                    isLast ? 'lg:to-transparent max-lg:hidden' : ''
                  }`}
                />
              </div>

              <div className={`min-w-0 flex-1 pt-3 ${isLast ? '' : 'pb-12 sm:pb-14'} lg:pt-0 lg:pb-0`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                    <span className="sr-only">Step {i + 1}: </span>
                    {item.step}
                  </h3>
                  <Pill tone="accent">
                    <span className="sr-only">Timing: </span>
                    {item.duration}
                  </Pill>
                </div>

                <div className="mt-3 md:grid md:grid-cols-[minmax(0,1fr)_16rem] md:gap-8 lg:block">
                  <p className="leading-relaxed text-muted">{item.body}</p>
                  <dl className="mt-5 rounded-xl border border-line bg-ink/40 p-4 md:mt-0 lg:mt-6">
                    <Eyebrow as="dt" tone="muted">
                      You provide
                    </Eyebrow>
                    <dd className="mt-2 text-sm leading-relaxed text-fg/90">{item.provide}</dd>
                  </dl>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

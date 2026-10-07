import Accordion from '../components/Accordion/Accordion';
import { Button, Section, SectionHeading } from '../components/ui';
import { faqs } from '../data';

const items = faqs.map(({ question, answer }) => ({ title: question, content: answer }));

export default function FAQ() {
  return (
    <Section id="faq">
      <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Heading + contact nudge stay in view beside the answers on laptops */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="FAQ" title="Questions," accent="answered." className="mb-6 md:mb-8" />
          <p className="max-w-md leading-relaxed text-muted">
            The things creators usually ask before sending footage. Anything else? I reply within a day.
          </p>
          <Button href="#contact" variant="ghost" className="mt-6 min-h-11">
            Ask me directly
            <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>

        <Accordion items={items} className="mt-12 lg:mt-0" />
      </div>
    </Section>
  );
}

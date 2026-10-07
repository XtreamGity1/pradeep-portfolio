import ScrollVelocity from '../components/ScrollVelocity/ScrollVelocity';
import { marquee } from '../data';

// Alternating row styles; row direction alternates via the sign of the velocity.
const ROW_STYLES = [
  'font-serif font-normal italic text-fg/80',
  'font-sans font-semibold tracking-tight text-muted/70',
];
const VELOCITY = 60;

export default function Marquee() {
  return (
    <section aria-label="Formats and skills" className="overflow-hidden border-y border-line py-10">
      <ul className="sr-only">
        {marquee.map(text => (
          <li key={text}>{text}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="flex flex-col gap-2 md:gap-4">
        {marquee.map((text, i) => (
          <ScrollVelocity
            key={text}
            texts={[text]}
            velocity={i % 2 === 0 ? VELOCITY : -VELOCITY}
            numCopies={4}
            className={`px-3 text-4xl leading-tight sm:text-5xl md:text-7xl md:leading-tight ${ROW_STYLES[i % ROW_STYLES.length]}`}
          />
        ))}
      </div>
    </section>
  );
}

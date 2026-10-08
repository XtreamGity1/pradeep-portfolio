import { Fragment } from 'react';
import ScrollVelocity from '../components/ScrollVelocity/ScrollVelocity';
import useMediaQuery from '../hooks/useMediaQuery';
import { marquee } from '../data';

// Alternating row styles; row direction alternates via the sign of the velocity.
const ROW_STYLES = [
  'font-serif font-normal italic text-fg/80',
  'font-sans font-semibold tracking-tight text-muted/70',
];
const VELOCITY = 50;
// Fade the rows out at both edges so text never hard-clips against the viewport.
const EDGE_FADE = 'mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]';

// One row's items, separated by small accent stars.
function RowText({ items }) {
  return items.map(item => (
    <Fragment key={item}>
      <span>{item}</span>
      <span className="mx-[0.45em] inline-block align-middle text-[0.45em] text-accent/80 not-italic">✦</span>
    </Fragment>
  ));
}

export default function Marquee() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Reduced motion: velocity 0 also cancels the scroll-speed boost, so the rows stay still.
  const velocity = reducedMotion ? 0 : VELOCITY;

  return (
    <section aria-label="Formats and skills" className="overflow-hidden border-y border-line py-8 md:py-10">
      {marquee.map(row => (
        <ul key={row.label} aria-label={row.label} className="sr-only">
          {row.items.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ))}

      <div aria-hidden="true" className={`flex flex-col gap-1 md:gap-3 ${EDGE_FADE}`}>
        {marquee.map((row, i) => (
          <ScrollVelocity
            key={row.label}
            texts={[<RowText key={row.label} items={row.items} />]}
            velocity={i % 2 === 0 ? velocity : -velocity}
            numCopies={4}
            className={`text-3xl leading-tight sm:text-4xl md:text-6xl md:leading-tight ${ROW_STYLES[i % ROW_STYLES.length]}`}
          />
        ))}
      </div>
    </section>
  );
}

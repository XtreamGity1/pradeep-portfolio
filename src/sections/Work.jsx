import { useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Button, Card, Eyebrow, Section, SectionHeading, focusRing } from '../components/ui';
import useMediaQuery from '../hooks/useMediaQuery';
import EditCard from './work/EditCard';
import EditDialog from './work/EditDialog';
import { edits, workCta } from '../data';

const ALL = 'All';
// Filter buttons come straight from the data, in order of first appearance.
const groups = [...new Set(edits.map(e => e.group))];
const filters = [ALL, ...groups].map(label => ({
  label,
  count: label === ALL ? edits.length : edits.filter(e => e.group === label).length,
}));

// The CTA card spans whatever is left of the last row, so the grid never has a gap
// (2 columns from sm, 3 from lg). Literal class names so Tailwind can see them.
const SM_SPAN = ['sm:col-span-2', 'sm:col-span-1'];
const LG_SPAN = ['lg:col-span-3', 'lg:col-span-2', 'lg:col-span-1'];
const ctaSpan = count => `${SM_SPAN[count % 2]} ${LG_SPAN[count % 3]}`;

// Tilt only where there is a real hover pointer and the visitor hasn't asked for less motion.
const TILT_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

function statusText(filter, count) {
  if (filter === ALL) return `Showing all ${count} edits`;
  return `Showing ${count} ${filter} ${count === 1 ? 'edit' : 'edits'}`;
}

// Toggle buttons (aria-pressed) for the technique filter. Exactly one is pressed at a time.
function FilterBar({ active, onChange, count }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Filter edits by technique" className="flex flex-wrap gap-2">
        {filters.map(({ label, count: total }) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === label}
            onClick={() => onChange(label)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-muted transition-colors duration-300 hover:border-fg/40 hover:text-fg aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-ink ${focusRing}`}
          >
            {label}
            <span aria-hidden="true" className="font-mono text-xs opacity-60">
              {total}
            </span>
          </button>
        ))}
      </div>
      <p role="status" className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
        {statusText(active, count)}
      </p>
    </div>
  );
}

// Last grid cell: a nudge towards the contact form (also keeps the grid free of gaps).
function NextProjectCard() {
  return (
    <Card className="flex h-full flex-col justify-between gap-4 border-dashed bg-transparent">
      <div>
        <Eyebrow className="mb-3">Open for projects</Eyebrow>
        <p className="text-2xl font-semibold tracking-tight text-fg">{workCta.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{workCta.body}</p>
      </div>
      <Button href={workCta.href} className="self-start">
        {workCta.label}
        <span aria-hidden="true">→</span>
      </Button>
    </Card>
  );
}

export default function Work() {
  const [filter, setFilter] = useState(ALL);
  const [openId, setOpenId] = useState(null);
  const tilt = useMediaQuery(TILT_QUERY);
  const cardButtons = useRef(new Map());

  const visible = filter === ALL ? edits : edits.filter(e => e.group === filter);
  const openIndex = visible.findIndex(e => e.id === openId);
  const open = visible[openIndex];
  const neighbour = step => (visible.length > 1 ? visible[(openIndex + step + visible.length) % visible.length] : null);

  // Return focus to the card of whichever edit was on screen when the dialog closed.
  const close = () => {
    cardButtons.current.get(openId)?.focus();
    setOpenId(null);
  };

  return (
    <Section id="work">
      <SectionHeading eyebrow="Selected work" title="Edits that" accent="move the needle." />
      <FilterBar active={filter} onChange={setFilter} count={visible.length} />

      {/* Every edit is landscape, so all rows share one height. */}
      <ul aria-label="Edits" className="grid auto-rows-[280px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {visible.map(edit => (
          <li key={edit.id}>
            <EditCard
              edit={edit}
              tilt={tilt}
              onOpen={() => setOpenId(edit.id)}
              buttonRef={el => {
                if (el) cardButtons.current.set(edit.id, el);
                else cardButtons.current.delete(edit.id);
              }}
            />
          </li>
        ))}
        <li className={ctaSpan(visible.length)}>
          <NextProjectCard />
        </li>
      </ul>

      <MotionConfig reducedMotion="user">
        {open && (
          <EditDialog
            edit={open}
            prev={neighbour(-1)}
            next={neighbour(1)}
            onSelect={e => setOpenId(e.id)}
            onClose={close}
          />
        )}
      </MotionConfig>
    </Section>
  );
}

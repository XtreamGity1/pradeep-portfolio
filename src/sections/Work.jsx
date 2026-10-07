import { useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Button, Card, Eyebrow, Section, SectionHeading, focusRing } from '../components/ui';
import useMediaQuery from '../hooks/useMediaQuery';
import ProjectCard from './work/ProjectCard';
import ProjectDialog from './work/ProjectDialog';
import { projects, workCta } from '../data';

const ALL = 'All';
// Filter buttons come straight from the data, in order of first appearance.
const categories = [...new Set(projects.map(p => p.category))];
const filters = [ALL, ...categories].map(label => ({
  label,
  count: label === ALL ? projects.length : projects.filter(p => p.category === label).length,
}));

// Tilt only where there is a real hover pointer and the visitor hasn't asked for less motion.
const TILT_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

function statusText(filter, count) {
  if (filter === ALL) return `Showing all ${count} projects`;
  return `Showing ${count} ${filter} ${count === 1 ? 'project' : 'projects'}`;
}

// Toggle buttons (aria-pressed) for the format filter. Exactly one is pressed at a time.
function FilterBar({ active, onChange, count }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Filter projects by format" className="flex flex-wrap gap-2">
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
  const [openTitle, setOpenTitle] = useState(null);
  const tilt = useMediaQuery(TILT_QUERY);
  const cardButtons = useRef(new Map());

  const visible = filter === ALL ? projects : projects.filter(p => p.category === filter);
  const openIndex = visible.findIndex(p => p.title === openTitle);
  const open = visible[openIndex];
  const neighbour = step => (visible.length > 1 ? visible[(openIndex + step + visible.length) % visible.length] : null);

  // Return focus to the card of whichever project was on screen when the dialog closed.
  const close = () => {
    cardButtons.current.get(openTitle)?.focus();
    setOpenTitle(null);
  };

  return (
    <Section id="work">
      <SectionHeading eyebrow="Selected work" title="Edits that" accent="move the needle." />
      <FilterBar active={filter} onChange={setFilter} count={visible.length} />

      {/* Fixed row height; vertical (9:16) projects span two rows. Dense flow keeps the grid gap-free. */}
      <ul
        aria-label="Projects"
        className="grid grid-flow-dense auto-rows-[280px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {visible.map(project => (
          <li key={project.title} className={project.orientation === 'vertical' ? 'row-span-2' : ''}>
            <ProjectCard
              project={project}
              tilt={tilt}
              onOpen={() => setOpenTitle(project.title)}
              buttonRef={el => {
                if (el) cardButtons.current.set(project.title, el);
                else cardButtons.current.delete(project.title);
              }}
            />
          </li>
        ))}
        <li>
          <NextProjectCard />
        </li>
      </ul>

      <MotionConfig reducedMotion="user">
        {open && (
          <ProjectDialog
            project={open}
            prev={neighbour(-1)}
            next={neighbour(1)}
            onSelect={p => setOpenTitle(p.title)}
            onClose={close}
          />
        )}
      </MotionConfig>
    </Section>
  );
}

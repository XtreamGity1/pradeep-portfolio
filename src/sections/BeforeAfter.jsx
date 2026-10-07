import { useRef, useState } from 'react';
import CompareSlider from '../components/CompareSlider/CompareSlider';
import { Eyebrow, Section, SectionHeading, focusRing } from '../components/ui';
import { beforeAfter } from '../data';

const { comparisons, breakdown } = beforeAfter;

const tabId = (c) => `craft-tab-${c.id}`;
const PANEL_ID = 'craft-panel';

// Timeline "clip" colors for the breakdown, cycling like tracks in an NLE.
const TRACK_COLORS = ['border-accent', 'border-accent-2', 'border-accent-3', 'border-fg/60'];

// Shared <img> props: 16:9 frames that never hijack a drag.
const frameImg = { width: 1200, height: 675, loading: 'lazy', decoding: 'async', draggable: false };
const coverImg = 'pointer-events-none absolute inset-0 size-full object-cover';

// Overlays sit in the right half — the finished side that's visible at the default split.
const FINISHED_HALF = 'absolute right-[4%] left-[54%]';

// Burned-in caption with one highlighted word, sized to the frame via a container query.
function Captions({ text, highlight }) {
  return (
    <p
      aria-hidden="true"
      className={`${FINISHED_HALF} bottom-[12%] text-center text-sm leading-snug font-extrabold uppercase text-fg text-shadow-lg/60 @md:text-xl @2xl:text-3xl`}
    >
      {text.split(' ').map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          {word === highlight ? <span className="rounded bg-accent-3 px-1.5 text-ink text-shadow-none">{word}</span> : word}
        </span>
      ))}
    </p>
  );
}

// Animated-style lower third plus a trip-progress tracker.
function LowerThird({ title, subtitle }) {
  return (
    <div aria-hidden="true" className={`${FINISHED_HALF} bottom-[7%]`}>
      <div className="inline-block border-l-4 border-accent bg-ink/70 px-3 py-1.5 backdrop-blur-sm @md:px-4 @md:py-2">
        <p className="text-xs font-semibold text-fg @md:text-lg">{title}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-3 @md:text-xs">{subtitle}</p>
      </div>
      <div className="mt-2 h-1 rounded-full bg-fg/25 @md:mt-3">
        <div className="h-full w-3/5 rounded-full bg-accent" />
      </div>
    </div>
  );
}

// The finished side of a comparison: the clean frame plus the comparison's optional overlay.
function FinishedFrame({ frame, overlay }) {
  if (overlay?.kind === 'reframe') {
    return (
      <>
        <img {...frameImg} src={frame.src} alt="" className={`${coverImg} scale-110 blur-md brightness-50`} />
        {/* 9:16 crop with its safe zone, centered in the finished half. */}
        <div className="absolute inset-y-0 left-[75%] aspect-[9/16] -translate-x-1/2 overflow-hidden ring-2 ring-fg/80">
          <img {...frameImg} src={frame.src} alt={frame.alt} className={coverImg} />
          <span
            aria-hidden="true"
            className="absolute inset-x-[8%] top-[10%] bottom-[20%] rounded border-2 border-dashed border-accent-3 shadow-[0_0_0_1px] shadow-ink/40"
          />
        </div>
      </>
    );
  }
  return (
    <>
      <img {...frameImg} src={frame.src} alt={frame.alt} className={coverImg} />
      {overlay?.kind === 'captions' && <Captions {...overlay} />}
      {overlay?.kind === 'lowerThird' && <LowerThird {...overlay} />}
    </>
  );
}

function ComparisonTabs({ active, onSelect }) {
  const tabs = useRef([]);

  // Arrow keys/Home/End move focus and selection together (automatic-activation tabs).
  const onKeyDown = (e) => {
    const last = comparisons.length - 1;
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const index = next > last ? 0 : next < 0 ? last : next;
    onSelect(index);
    tabs.current[index].focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Edit comparisons"
      onKeyDown={onKeyDown}
      className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3"
    >
      {comparisons.map((c, i) => {
        const selected = i === active;
        return (
          <button
            key={c.id}
            ref={(el) => (tabs.current[i] = el)}
            type="button"
            role="tab"
            id={tabId(c)}
            aria-selected={selected}
            aria-controls={PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(i)}
            className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors duration-300 sm:px-5 ${focusRing} ${
              selected ? 'border-fg bg-fg text-ink' : 'border-line text-muted hover:border-fg/40 hover:text-fg'
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function Breakdown() {
  return (
    <div className="mt-20 border-t border-line pt-10 md:mt-24">
      <Eyebrow as="h3" id="craft-breakdown" tone="muted">
        What goes into an edit
      </Eyebrow>
      <ol aria-labelledby="craft-breakdown" className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-5">
        {breakdown.map((item, i) => (
          <li
            key={item.step}
            className={`border-l-2 pl-5 lg:border-t-4 lg:border-l-0 lg:pt-5 lg:pl-0 ${TRACK_COLORS[i % TRACK_COLORS.length]}`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-muted">
              <span className="sr-only">Timecode </span>
              {item.time}
            </p>
            <h4 className="mt-2 text-lg font-semibold tracking-tight text-fg">{item.step}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function BeforeAfter() {
  const [active, setActive] = useState(0);
  const current = comparisons[active];

  return (
    <Section id="craft">
      <SectionHeading eyebrow="The craft" title="Same footage." accent="Different story." />

      <ComparisonTabs active={active} onSelect={setActive} />

      <div
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={tabId(current)}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-12"
      >
        <div>
          {/* Keyed so each comparison starts centered with fresh images. */}
          <CompareSlider
            key={current.id}
            beforeLabel={current.before.label}
            afterLabel={current.after.label}
            before={<img {...frameImg} src={current.before.src} alt={current.before.alt} className={coverImg} />}
            after={<FinishedFrame frame={current.after} overlay={current.overlay} />}
          />
          <p className="mt-4 text-center text-xs text-muted sm:text-sm">Drag the handle, tap the frame or use the arrow keys.</p>
        </div>

        <div>
          <p className="text-sm text-muted">{current.project}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-fg md:text-3xl">{current.title}</h3>
          <dl className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
            <div>
              <Eyebrow as="dt">What changed</Eyebrow>
              <dd className="mt-2 leading-relaxed text-fg/90">{current.changed}</dd>
            </div>
            <div>
              <Eyebrow as="dt">Why it works</Eyebrow>
              <dd className="mt-2 leading-relaxed text-muted">{current.why}</dd>
            </div>
          </dl>
        </div>
      </div>

      <Breakdown />
    </Section>
  );
}

import { useEffect, useEffectEvent, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Eyebrow, Pill } from '../../components/ui';

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
const EASE = [0.22, 1, 0.36, 1];
// Focus outline drawn inside the element, so it is not clipped by the panel's rounded overflow.
const insetFocus = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent';

// Poster frame, or the real video when the project has an `embed` URL.
function Media({ project }) {
  const frame = `rounded-2xl border border-line bg-ink ${
    project.orientation === 'vertical' ? 'mx-auto aspect-[9/16] w-full max-w-64 md:max-w-none' : 'aspect-video w-full'
  }`;
  if (project.embed) {
    return (
      <iframe
        src={project.embed}
        title={`${project.title} video`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className={frame}
      />
    );
  }
  return <img src={project.image} alt={`${project.title} — poster frame`} className={`${frame} object-cover`} />;
}

function Block({ title, className = '', children }) {
  return (
    <div className={className}>
      <Eyebrow as="h3" tone="muted" className="mb-3">
        {title}
      </Eyebrow>
      {children}
    </div>
  );
}

const facts = project => [
  { label: 'Project', value: project.type },
  { label: 'Runtime', value: project.runtime },
  { label: 'Focus', value: project.focus, wide: true },
];

// Previous / next case study, so visitors can browse without closing the dialog.
function BrowseButton({ direction, project, onSelect }) {
  const isNext = direction === 'next';
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className={`min-h-16 min-w-0 px-5 py-3 transition-colors hover:bg-ink/40 sm:px-8 ${isNext ? 'text-right' : 'text-left'} ${insetFocus}`}
    >
      <span className="block text-xs text-muted">
        {isNext ? 'Next' : 'Previous'}
        <span aria-hidden="true">{isNext ? ' →' : ' ←'}</span>
      </span>
      <span className="block truncate text-sm font-medium text-fg"> {project.title}</span>
    </button>
  );
}

// Accessible case-study modal: focus moves in and is trapped, Escape / close button / backdrop close it,
// and page scroll is locked while open. The caller returns focus to the card on close.
export default function ProjectDialog({ project, prev, next, onSelect, onClose }) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  const requestClose = useEffectEvent(onClose);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const outside = !panelRef.current.contains(document.activeElement);
      if (e.shiftKey && (outside || document.activeElement === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (outside || document.activeElement === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Browsing to another project starts it from the top.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [project]);

  const vertical = project.orientation === 'vertical';

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-end justify-center md:items-center md:p-6">
      <motion.div
        data-testid="project-dialog-backdrop"
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-ink/80 backdrop-blur-md"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl shadow-ink md:max-h-[88svh] md:max-w-5xl md:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line py-2 pr-2 pl-5 sm:pl-8">
          <Eyebrow tone="muted" className="truncate">
            {project.type} · {project.category}
          </Eyebrow>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close case study"
            onClick={onClose}
            className={`grid size-11 shrink-0 place-items-center rounded-full text-2xl leading-none text-muted transition-colors hover:bg-ink/60 hover:text-fg ${insetFocus}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div ref={scrollRef} className="overflow-y-auto overscroll-contain">
          <div
            className={`grid gap-8 p-5 sm:p-8 ${vertical ? 'md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:items-start lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]' : ''}`}
          >
            <Media project={project} />

            <div className="@container min-w-0">
              <h2 id={titleId} className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
                {project.title}
              </h2>
              <p className="mt-2 text-muted">{project.format}</p>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line @lg:grid-cols-3">
                {facts(project).map(fact => (
                  <div key={fact.label} className={`bg-surface p-4 ${fact.wide ? 'col-span-2 @lg:col-span-1' : ''}`}>
                    <dt className="text-xs text-muted">{fact.label}</dt>
                    <dd className="mt-1 font-medium text-fg">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 grid gap-8 leading-relaxed @2xl:grid-cols-2">
                <Block title="The goal">
                  <p className="text-fg/90">{project.goal}</p>
                </Block>
                <Block title="Raw material">
                  <p className="text-fg/90">{project.footage}</p>
                </Block>
                <Block title="What I did" className="@2xl:col-span-2">
                  <dl className="grid gap-4 @xl:grid-cols-2">
                    {project.approach.map(step => (
                      <div key={step.label} className="rounded-2xl border border-line bg-ink/40 p-4">
                        <dt className="font-semibold text-accent">{step.label}</dt>
                        <dd className="mt-1 text-sm text-fg/85">{step.body}</dd>
                      </div>
                    ))}
                  </dl>
                </Block>
                <Block title="What I learned">
                  <p className="text-fg/90">{project.learned}</p>
                </Block>
                <Block title="Next time">
                  <p className="text-fg/90">{project.next}</p>
                </Block>
                <Block title="Tools" className="@2xl:col-span-2">
                  <ul className="flex flex-wrap gap-2">
                    {project.tools.map(tool => (
                      <Pill as="li" key={tool}>
                        {tool}
                      </Pill>
                    ))}
                  </ul>
                </Block>
              </div>
            </div>
          </div>
        </div>

        {prev && next && (
          <nav aria-label="More projects" className="grid shrink-0 grid-cols-2 divide-x divide-line border-t border-line">
            <BrowseButton direction="prev" project={prev} onSelect={onSelect} />
            <BrowseButton direction="next" project={next} onSelect={onSelect} />
          </nav>
        )}
        {/* Announces the new title when browsing with prev/next (focus stays on the button). */}
        <p aria-live="polite" className="sr-only">
          {project.title}
        </p>
      </motion.div>
    </div>,
    document.body,
  );
}

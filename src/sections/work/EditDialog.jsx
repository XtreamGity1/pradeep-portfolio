import { useEffect, useEffectEvent, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Eyebrow } from '../../components/ui';
import useScrollLock from '../../hooks/useScrollLock';
import { reelChapters, showreel } from '../../data';

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';
const EASE = [0.22, 1, 0.36, 1];
// Focus outline drawn inside the element, so it is not clipped by the panel's rounded overflow.
const insetFocus = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent';

// That segment of the reel, with sound. The reel is 16:9 with its letterbox baked in.
function Clip({ edit, chapter }) {
  return (
    <video
      key={edit.id}
      src={`${showreel.src}#t=${chapter.start},${chapter.end}`}
      poster={edit.image}
      aria-label={`${edit.title} clip from the showreel`}
      controls
      playsInline
      preload="metadata"
      className="aspect-video w-full rounded-2xl border border-line bg-ink"
    />
  );
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

const facts = (edit, chapter) => [
  { label: 'Technique', value: edit.group },
  { label: 'Clip length', value: `${(chapter.end - chapter.start).toFixed(1)} s` },
  { label: 'From', value: showreel.title, wide: true },
];

// Previous / next edit, so visitors can browse without closing the dialog.
function BrowseButton({ direction, edit, onSelect }) {
  const isNext = direction === 'next';
  return (
    <button
      type="button"
      onClick={() => onSelect(edit)}
      className={`min-h-16 min-w-0 px-5 py-3 transition-colors hover:bg-ink/40 sm:px-8 ${isNext ? 'text-right' : 'text-left'} ${insetFocus}`}
    >
      <span className="block text-xs text-muted">
        {isNext ? 'Next' : 'Previous'}
        <span aria-hidden="true">{isNext ? ' →' : ' ←'}</span>
      </span>
      <span className="block truncate text-sm font-medium text-fg"> {edit.title}</span>
    </button>
  );
}

// Accessible modal for one technique: focus moves in and is trapped, Escape / close button / backdrop close it,
// and page scroll is locked while open. The caller returns focus to the card on close.
export default function EditDialog({ edit, prev, next, onSelect, onClose }) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  const requestClose = useEffectEvent(onClose);

  // Mounted only while open, so the lock lasts exactly as long as the dialog.
  useScrollLock(true);

  useEffect(() => {
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
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Browsing to another edit starts it from the top.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [edit]);

  const chapter = reelChapters.find(c => c.id === edit.id);

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-end justify-center md:items-center md:p-6">
      <motion.div
        data-testid="edit-dialog-backdrop"
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
            {edit.group} · {showreel.title}
          </Eyebrow>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={`grid size-11 shrink-0 place-items-center rounded-full text-2xl leading-none text-muted transition-colors hover:bg-ink/60 hover:text-fg ${insetFocus}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div ref={scrollRef} className="overflow-y-auto overscroll-contain">
          <div className="grid gap-8 p-5 sm:p-8">
            <Clip edit={edit} chapter={chapter} />

            <div className="@container min-w-0">
              <h2 id={titleId} className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
                {edit.title}
              </h2>
              <p className="mt-2 text-muted">{edit.summary}</p>

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line @lg:grid-cols-3">
                {facts(edit, chapter).map(fact => (
                  <div key={fact.label} className={`bg-surface p-4 ${fact.wide ? 'col-span-2 @lg:col-span-1' : ''}`}>
                    <dt className="text-xs text-muted">{fact.label}</dt>
                    <dd className="mt-1 font-medium text-fg">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 grid gap-8 leading-relaxed @2xl:grid-cols-2">
                <Block title="In this clip" className="@2xl:col-span-2">
                  <p className="text-fg/90">{edit.shows}</p>
                </Block>
                <Block title="How it’s done" className="@2xl:col-span-2">
                  <dl className="grid gap-4 @xl:grid-cols-3">
                    {edit.how.map(step => (
                      <div key={step.label} className="rounded-2xl border border-line bg-ink/40 p-4">
                        <dt className="font-semibold text-accent">{step.label}</dt>
                        <dd className="mt-1 text-sm text-fg/85">{step.body}</dd>
                      </div>
                    ))}
                  </dl>
                </Block>
                <Block title="Why it matters" className="@2xl:col-span-2">
                  <p className="text-fg/90">{edit.why}</p>
                </Block>
              </div>
            </div>
          </div>
        </div>

        {prev && next && (
          <nav aria-label="More edits" className="grid shrink-0 grid-cols-2 divide-x divide-line border-t border-line">
            <BrowseButton direction="prev" edit={prev} onSelect={onSelect} />
            <BrowseButton direction="next" edit={next} onSelect={onSelect} />
          </nav>
        )}
        {/* Announces the new title when browsing with prev/next (focus stays on the button). */}
        <p aria-live="polite" className="sr-only">
          {edit.title}
        </p>
      </motion.div>
    </div>,
    document.body,
  );
}

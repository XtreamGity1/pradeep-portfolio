import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Eyebrow, focusRing } from '../ui';
import useMediaQuery from '../../hooks/useMediaQuery';
import useScrollLock from '../../hooks/useScrollLock';

const EASE = [0.22, 1, 0.36, 1];
const FOCUSABLE = 'button, [href], iframe, video[controls], [tabindex]:not([tabindex="-1"])';
const EMBED_ALLOW = 'autoplay; fullscreen; picture-in-picture; encrypted-media';

// Fullscreen modal video player for a showreel.
// `reel` comes from data.js: plays `embedUrl` (YouTube/Vimeo) in an iframe when set,
// otherwise a native <video> from `src` + `poster`.
// While open: locks body scroll, focuses the close button, traps Tab, closes on Escape or
// backdrop click, and on close pauses playback and returns focus to `returnFocusRef`
// (falling back to whatever was focused when it opened).
export default function ShowreelModal({ open, reel, onClose, returnFocusRef }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const videoRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  // Read inside the effect so a new onClose identity never re-runs it.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const previousFocus = returnFocusRef?.current ?? document.activeElement;
    const video = videoRef.current;
    closeRef.current?.focus();

    const focusables = () => [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])];
    const onKeyDown = e => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Catches focus that slips out another way, e.g. tabbing out of a cross-origin iframe.
    const onFocusIn = e => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) closeRef.current?.focus();
    };
    // Capture phase: a focused <video>'s native controls swallow Escape before it would bubble up.
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn);
      // The player stays mounted for the exit animation, so silence it right away.
      video?.pause();
      previousFocus?.focus?.();
    };
  }, [open, returnFocusRef]);

  const fade = reducedMotion ? { duration: 0 } : { duration: 0.3, ease: EASE };
  const pop = reducedMotion ? {} : { opacity: 0, y: 24, scale: 0.97 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="showreel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
          className="fixed inset-0 z-60 flex overflow-y-auto overscroll-contain p-4 sm:p-6"
        >
          <div
            data-testid="showreel-backdrop"
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 bg-ink/85 backdrop-blur-md"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={pop}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={pop}
            transition={fade}
            // Width is capped by the viewport height too, so the 16:9 player never overflows a landscape screen.
            className="relative m-auto w-full max-w-[min(72rem,calc((100svh_-_10rem)*16/9))] min-w-0"
          >
            <div className="mb-4 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <Eyebrow>
                  Showreel <span aria-hidden="true">·</span> {reel.duration}
                </Eyebrow>
                <h2 id={titleId} className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                  {reel.title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close showreel"
                onClick={onClose}
                className={`grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-fg transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-ink ${focusRing}`}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-accent-2/10">
              {reel.embedUrl ? (
                <iframe
                  src={reel.embedUrl}
                  title={reel.title}
                  allow={EMBED_ALLOW}
                  allowFullScreen
                  className="size-full"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={reel.src}
                  poster={reel.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="size-full bg-ink object-contain"
                />
              )}
            </div>

            <p id={descriptionId} className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {reel.description}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

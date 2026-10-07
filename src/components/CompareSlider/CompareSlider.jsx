import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Pill, focusRing } from '../ui';

const clamp = (n) => Math.min(100, Math.max(0, Math.round(n)));
// Pixels a finger must travel before a touch gesture is judged horizontal (drag) or vertical (scroll).
const TOUCH_SLOP = 6;

// Keyboard map for the slider: arrows nudge, Page keys jump, Home/End go to the edges.
const keySteps = {
  ArrowRight: (v, step) => v + step,
  ArrowUp: (v, step) => v + step,
  ArrowLeft: (v, step) => v - step,
  ArrowDown: (v, step) => v - step,
  PageUp: (v, step) => v + step * 5,
  PageDown: (v, step) => v - step * 5,
  Home: () => 0,
  End: () => 100,
};

// Before/after frame comparison with a draggable divider. `before` shows on the left, `after` on the
// right. Works with mouse, touch (vertical swipes still scroll the page) and keyboard.
export default function CompareSlider({ before, after, beforeLabel, afterLabel, initial = 50, step = 5, hint = true }) {
  const [value, setValue] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const frameRef = useRef(null);
  const pointer = useRef(null);
  const touched = useRef(false);
  const hintTimers = useRef([]);

  // Once in view, nudge the divider so it reads as draggable — unless the viewer moved it first.
  useEffect(() => {
    if (!hint || reducedMotion) return;
    const timers = hintTimers.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return;
        observer.disconnect();
        timers.push(
          setTimeout(() => setValue(initial - 15), 300),
          setTimeout(() => setValue(initial), 1100),
        );
      },
      { threshold: 0.6 },
    );
    observer.observe(frameRef.current);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [hint, reducedMotion, initial]);

  const interrupt = () => {
    touched.current = true;
    hintTimers.current.forEach(clearTimeout);
  };

  const valueAt = (clientX) => {
    const { left, width } = frameRef.current.getBoundingClientRect();
    return width ? clamp(((clientX - left) / width) * 100) : value;
  };

  // Mouse/pen jump to the press point; touch waits to see if it's a drag, a tap, or a page scroll.
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    interrupt();
    const touch = e.pointerType === 'touch';
    // Touch drags start unlocked: the first few pixels decide between dragging and scrolling.
    pointer.current = { id: e.pointerId, moved: false, touch, locked: !touch, x: e.clientX, y: e.clientY };
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Pointer already released — dragging still works without capture.
    }
    if (!pointer.current.touch) setValue(valueAt(e.clientX));
    setDragging(true);
  };

  // The browser took the gesture (vertical scroll) — leave the divider where it was.
  const onPointerCancel = () => {
    pointer.current = null;
    setDragging(false);
  };

  const onPointerMove = (e) => {
    const active = pointer.current;
    if (active?.id !== e.pointerId) return;
    if (!active.locked) {
      const dx = Math.abs(e.clientX - active.x);
      const dy = Math.abs(e.clientY - active.y);
      if (dx < TOUCH_SLOP && dy < TOUCH_SLOP) return;
      // Mostly vertical: it's a page scroll, so let the browser have it and ignore the rest.
      if (dy > dx) return onPointerCancel();
      active.locked = true;
    }
    active.moved = true;
    setValue(valueAt(e.clientX));
  };

  const onPointerUp = (e) => {
    const active = pointer.current;
    if (active?.id !== e.pointerId) return;
    if (active.touch && !active.moved) setValue(valueAt(e.clientX));
    pointer.current = null;
    setDragging(false);
  };

  const onKeyDown = (e) => {
    const move = keySteps[e.key];
    if (!move) return;
    e.preventDefault();
    interrupt();
    setValue((v) => clamp(move(v, step)));
  };

  // Ease programmatic moves (keys, taps, hint); follow the pointer 1:1 while dragging.
  const ease = dragging || reducedMotion ? '' : 'transition-[clip-path,left] duration-300 ease-out';

  return (
    <div
      ref={frameRef}
      data-compare-frame
      className="relative aspect-video cursor-ew-resize touch-pan-y select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div className="@container absolute inset-0 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="absolute inset-0">
          {after}
          <Pill tone="glass" className="absolute top-3 right-3">
            {afterLabel}
          </Pill>
        </div>
        <div className={`absolute inset-0 ${ease}`} style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          {before}
          <Pill tone="glass" className="absolute top-3 left-3">
            {beforeLabel}
          </Pill>
        </div>
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 w-0.5 -translate-x-1/2 bg-fg shadow-[0_0_12px] shadow-ink/60 ${ease}`}
          style={{ left: `${value}%` }}
        />
      </div>

      {/* The handle stays fully inside the frame at the edges so it never overflows the page. */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value}% ${beforeLabel}, ${100 - value}% ${afterLabel}`}
        onKeyDown={onKeyDown}
        className={`absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-fg text-ink shadow-lg shadow-ink/50 ring-4 ring-ink/30 ${focusRing} ${ease}`}
        style={{ left: `clamp(1.375rem, ${value}%, calc(100% - 1.375rem))` }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 6-6 6 6 6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

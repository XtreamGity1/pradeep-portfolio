import { useCallback, useEffect, useRef, useState } from 'react';

// A thin band a little above the middle of the viewport: the section crossing it is "current".
const SPY_MARGIN = '-40% 0px -55% 0px';
// While pinned, give up waiting for the scroll to start after this long, or to settle after this long.
const PIN_START_MS = 1000;
const PIN_IDLE_MS = 200;

// Scrollspy: returns [activeId, pin] for the given section ids (in page order).
// `activeId` is the id of the section crossing the spy band, or null (e.g. over the hero).
// `pin(id)` marks a clicked target active straight away and ignores the sections passed on the
// way there, resuming once the scroll settles — so the nav doesn't flicker through each one.
export default function useScrollSpy(ids) {
  const key = ids.join(' ');
  const [activeId, setActiveId] = useState(null);
  const visible = useRef(new Map());
  const pinned = useRef(null);
  const unpin = useRef(null);

  const current = useCallback(() => key.split(' ').find(id => visible.current.get(id)) ?? null, [key]);

  useEffect(() => {
    const seen = visible.current;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
        if (!pinned.current) setActiveId(current());
      },
      { rootMargin: SPY_MARGIN },
    );
    for (const id of key.split(' ')) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => {
      observer.disconnect();
      seen.clear();
      unpin.current?.();
    };
  }, [key, current]);

  const pin = useCallback(
    id => {
      unpin.current?.();
      pinned.current = id;
      setActiveId(id);

      let timer = setTimeout(release, PIN_START_MS);
      const onScroll = () => {
        clearTimeout(timer);
        timer = setTimeout(release, PIN_IDLE_MS);
      };
      function cleanup() {
        clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('scrollend', release);
        pinned.current = null;
        unpin.current = null;
      }
      function release() {
        cleanup();
        setActiveId(current());
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('scrollend', release);
      unpin.current = cleanup;
    },
    [current],
  );

  return [activeId, pin];
}

import { useEffect, useState } from 'react';

// True while the element referenced by `ref` is no taller than the window. Re-checks when the
// element resizes (text wrapping, fonts loading) or the window does.
export default function useFitsViewport(ref) {
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // +1 absorbs sub-pixel rounding between offsetHeight and innerHeight.
    const check = () => setFits(el.offsetHeight <= window.innerHeight + 1);
    check();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(check);
    observer?.observe(el);
    window.addEventListener('resize', check);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', check);
    };
  }, [ref]);

  return fits;
}

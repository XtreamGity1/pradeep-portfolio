import { useEffect } from 'react';

// Stops the page scrolling while `active` (open dialogs and menus). Locks <html> as well as
// <body>: mobile browsers keep scrolling the root when only the body is hidden.
export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const targets = [document.documentElement, document.body];
    const previous = targets.map(el => el.style.overflow);
    targets.forEach(el => {
      el.style.overflow = 'hidden';
    });
    return () => {
      targets.forEach((el, i) => {
        el.style.overflow = previous[i];
      });
    };
  }, [active]);
}

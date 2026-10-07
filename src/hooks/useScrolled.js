import { useCallback, useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}

// True once the window has scrolled past `threshold` px. The snapshot is a boolean, so
// components re-render only when the threshold is crossed, not on every scroll event.
export default function useScrolled(threshold = 80) {
  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

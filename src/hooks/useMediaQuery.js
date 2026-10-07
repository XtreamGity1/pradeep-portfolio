import { useCallback, useSyncExternalStore } from 'react';

// Live boolean for a CSS media query, e.g. useMediaQuery('(min-width: 768px)').
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    callback => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

import { act, renderHook } from '@testing-library/react';
import useMediaQuery from '../useMediaQuery';

function mockMatchMedia(initial) {
  const listeners = new Set();
  const state = { matches: initial };
  const original = window.matchMedia;
  window.matchMedia = query => ({
    get matches() {
      return state.matches;
    },
    media: query,
    addEventListener: (_, cb) => listeners.add(cb),
    removeEventListener: (_, cb) => listeners.delete(cb),
  });
  return {
    set(value) {
      state.matches = value;
      listeners.forEach(cb => cb());
    },
    restore() {
      window.matchMedia = original;
    },
  };
}

describe('useMediaQuery', () => {
  test('returns the current match and updates on change', () => {
    const mq = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
    act(() => mq.set(true));
    expect(result.current).toBe(true);
    mq.restore();
  });
});

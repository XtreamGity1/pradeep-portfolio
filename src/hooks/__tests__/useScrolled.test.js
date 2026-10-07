import { act, renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import useScrolled from '../useScrolled';

function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });
}

describe('useScrolled', () => {
  afterEach(() => setScrollY(0));

  test('is false at the top of the page', () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrolled());
    expect(result.current).toBe(false);
  });

  test('flips to true past the default threshold and back at the top', () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrolled());
    act(() => {
      setScrollY(200);
      fireEvent.scroll(window);
    });
    expect(result.current).toBe(true);
    act(() => {
      setScrollY(0);
      fireEvent.scroll(window);
    });
    expect(result.current).toBe(false);
  });

  test('respects a custom threshold', () => {
    setScrollY(150);
    const { result } = renderHook(() => useScrolled(300));
    expect(result.current).toBe(false);
    act(() => {
      setScrollY(301);
      fireEvent.scroll(window);
    });
    expect(result.current).toBe(true);
  });

  test('reads the initial scroll position on mount', () => {
    setScrollY(500);
    const { result } = renderHook(() => useScrolled());
    expect(result.current).toBe(true);
  });
});

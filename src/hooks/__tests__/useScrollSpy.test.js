import { act, fireEvent, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import useScrollSpy from '../useScrollSpy';
import mockIntersectionObserver from './intersectionObserverMock';

const IDS = ['work', 'craft', 'contact'];

describe('useScrollSpy', () => {
  let io;
  beforeEach(() => {
    io = mockIntersectionObserver();
    document.body.innerHTML = ['top', ...IDS].map(id => `<section id="${id}"></section>`).join('');
  });
  afterEach(() => {
    io.restore();
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  test('is null until a section crosses the spy line', () => {
    const { result } = renderHook(() => useScrollSpy(IDS));
    expect(result.current[0]).toBeNull();
  });

  test('observes every existing section with a thin band near the top of the viewport', () => {
    renderHook(() => useScrollSpy([...IDS, 'missing']));
    const [observer] = io.instances;
    expect([...observer.targets].map(el => el.id)).toEqual(IDS);
    expect(observer.options.rootMargin).toMatch(/^-\d+% 0px -\d+% 0px$/);
  });

  test('tracks the section in view and clears when none is', () => {
    const { result } = renderHook(() => useScrollSpy(IDS));
    io.show('work');
    expect(result.current[0]).toBe('work');
    io.show('craft');
    expect(result.current[0]).toBe('craft');
    io.show();
    expect(result.current[0]).toBeNull();
  });

  test('prefers the earliest section when two straddle the line', () => {
    const { result } = renderHook(() => useScrollSpy(IDS));
    io.show('contact', 'craft');
    expect(result.current[0]).toBe('craft');
  });

  test('pin() holds a clicked target while the page scrolls there, then resumes spying', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useScrollSpy(IDS));
    io.show('work');
    act(() => result.current[1]('contact'));
    expect(result.current[0]).toBe('contact');

    // Sections passed on the way are ignored while pinned.
    io.show('craft');
    expect(result.current[0]).toBe('contact');

    io.show('contact');
    act(() => {
      fireEvent(window, new Event('scrollend'));
    });
    expect(result.current[0]).toBe('contact');
    io.show('craft');
    expect(result.current[0]).toBe('craft');
  });

  test('pin() releases after a short idle period when scrollend never fires', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useScrollSpy(IDS));
    io.show('work');
    act(() => result.current[1]('contact'));
    io.show('craft');
    act(() => {
      fireEvent.scroll(window);
      vi.advanceTimersByTime(100);
      fireEvent.scroll(window);
    });
    expect(result.current[0]).toBe('contact');
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current[0]).toBe('craft');
  });

  test('disconnects on unmount', () => {
    const { unmount } = renderHook(() => useScrollSpy(IDS));
    unmount();
    expect(io.instances[0].disconnected).toBe(true);
  });
});

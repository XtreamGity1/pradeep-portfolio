import { renderHook } from '@testing-library/react';
import useScrollLock from '../useScrollLock';

describe('useScrollLock', () => {
  afterEach(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  });

  test('locks both html and body while active (mobile browsers scroll the root otherwise)', () => {
    renderHook(() => useScrollLock(true));
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('does nothing while inactive', () => {
    renderHook(() => useScrollLock(false));
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');
  });

  test('restores the previous values when released', () => {
    document.body.style.overflow = 'auto';
    const { rerender, unmount } = renderHook(({ active }) => useScrollLock(active), {
      initialProps: { active: true },
    });
    rerender({ active: false });
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('auto');

    rerender({ active: true });
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});

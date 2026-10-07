import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import GooeyNav from '../GooeyNav';

const ITEMS = [
  { label: 'Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

function preferReducedMotion(reduce) {
  const original = window.matchMedia;
  window.matchMedia = query => ({
    matches: reduce && query.includes('prefers-reduced-motion: reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  return () => {
    window.matchMedia = original;
  };
}

describe('GooeyNav', () => {
  afterEach(() => vi.useRealTimers());

  test('renders a labelled navigation landmark with every link', () => {
    render(<GooeyNav items={ITEMS} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const item of ITEMS) {
      expect(within(nav).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
  });

  test('marks only the controlled active item as the current location', () => {
    const { rerender } = render(<GooeyNav items={ITEMS} activeIndex={1} />);
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current');

    rerender(<GooeyNav items={ITEMS} activeIndex={-1} />);
    for (const link of screen.getAllByRole('link')) expect(link).not.toHaveAttribute('aria-current');
  });

  test('clicking reports the item and lets the anchor navigate', () => {
    const onItemClick = vi.fn();
    render(<GooeyNav items={ITEMS} activeIndex={0} onItemClick={onItemClick} />);
    const link = screen.getByRole('link', { name: 'FAQ' });
    expect(fireEvent.keyDown(link, { key: 'Enter' })).toBe(true);
    expect(fireEvent.click(link)).toBe(true);
    expect(onItemClick).toHaveBeenCalledWith(ITEMS[2], 2);
  });

  test('bursts particles on click, but not when reduced motion is preferred', () => {
    vi.useFakeTimers();
    const restore = preferReducedMotion(false);
    const { container, unmount } = render(<GooeyNav items={ITEMS} />);
    fireEvent.click(screen.getByRole('link', { name: 'Pricing' }));
    act(() => vi.advanceTimersByTime(50));
    expect(container.querySelectorAll('.particle').length).toBeGreaterThan(0);
    unmount();
    restore();

    const restoreReduced = preferReducedMotion(true);
    const reduced = render(<GooeyNav items={ITEMS} />);
    fireEvent.click(screen.getByRole('link', { name: 'Pricing' }));
    act(() => vi.advanceTimersByTime(50));
    expect(reduced.container.querySelectorAll('.particle')).toHaveLength(0);
    // The selection itself still moves.
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'location');
    restoreReduced();
  });
});

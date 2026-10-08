import { act, fireEvent, render, screen, within } from '@testing-library/react';
import BeforeAfter from '../BeforeAfter';
import { beforeAfter } from '../../data';

const { comparisons, breakdown } = beforeAfter;

// Give the comparison frame a known 400px-wide box so pointer positions map to percentages.
function mockFrameRect(slider) {
  const frame = slider.closest('[data-compare-frame]');
  frame.getBoundingClientRect = () => ({ left: 100, width: 400, top: 0, height: 225, right: 500, bottom: 225 });
  return frame;
}

// Fires the next IntersectionObserver callback as "in view".
function stubIntersectionObserver() {
  const original = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(el) {
      this.callback([{ isIntersecting: true, target: el }]);
    }
    unobserve() {}
    disconnect() {}
  };
  return () => (globalThis.IntersectionObserver = original);
}

function mockReducedMotion(reduced) {
  const original = window.matchMedia;
  window.matchMedia = query => ({
    matches: reduced && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  return () => (window.matchMedia = original);
}

describe('BeforeAfter', () => {
  test('renders the #craft anchor and an h2', () => {
    const { container } = render(<BeforeAfter />);
    expect(container.querySelector('section#craft')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  });

  test('renders one tab per comparison with the first selected', () => {
    render(<BeforeAfter />);
    const tabs = within(screen.getByRole('tablist')).getAllByRole('tab');
    expect(tabs.map(t => t.textContent)).toEqual(comparisons.map(c => c.label));
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    tabs.slice(1).forEach(tab => expect(tab).toHaveAttribute('aria-selected', 'false'));
  });

  test('the active panel shows both frames, their labels and the caption', () => {
    render(<BeforeAfter />);
    const [first] = comparisons;
    const panel = screen.getByRole('tabpanel', { name: first.label });
    const view = within(panel);
    expect(view.getByRole('img', { name: first.before.alt })).toHaveAttribute('src', first.before.src);
    expect(view.getByRole('img', { name: first.after.alt })).toHaveAttribute('src', first.after.src);
    expect(view.getByText(first.before.label)).toBeInTheDocument();
    expect(view.getByText(first.after.label)).toBeInTheDocument();
    expect(view.getByRole('heading', { level: 3, name: first.title })).toBeInTheDocument();
    expect(view.getByText(first.changed)).toBeInTheDocument();
    expect(view.getByText(first.why)).toBeInTheDocument();
  });

  test('shows the real reel stills unretouched in a 20:9 frame', () => {
    const { container } = render(<BeforeAfter />);
    const panel = screen.getByRole('tabpanel', { name: comparisons[0].label });
    expect(container.querySelector('[data-compare-frame]')).toHaveClass('aspect-20/9');
    // Just the two stills: no simulated captions, lower thirds or reframe crops on top.
    const images = within(panel).getAllByRole('img');
    expect(images).toHaveLength(2);
    for (const img of images) {
      expect(img).toHaveAttribute('width', '1600');
      expect(img).toHaveAttribute('height', '720');
    }
  });

  test('clicking a tab swaps the comparison', () => {
    render(<BeforeAfter />);
    const target = comparisons[2];
    fireEvent.click(screen.getByRole('tab', { name: target.label }));
    expect(screen.getByRole('tab', { name: target.label })).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: target.label });
    expect(within(panel).getByRole('img', { name: target.after.alt })).toBeInTheDocument();
    expect(within(panel).getByText(target.changed)).toBeInTheDocument();
    expect(screen.queryByText(comparisons[0].changed)).not.toBeInTheDocument();
  });

  test('arrow keys, Home and End move between tabs with a roving tabindex', () => {
    render(<BeforeAfter />);
    const tabs = screen.getAllByRole('tab');
    const last = tabs.length - 1;
    expect(tabs.map(t => t.tabIndex)).toEqual(tabs.map((_, i) => (i === 0 ? 0 : -1)));

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tabs[1], { key: 'End' });
    expect(tabs[last]).toHaveFocus();
    fireEvent.keyDown(tabs[last], { key: 'ArrowRight' });
    expect(tabs[0]).toHaveFocus();
    fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' });
    expect(tabs[last]).toHaveFocus();
    fireEvent.keyDown(tabs[last], { key: 'Home' });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  test('renders an accessible slider centered by default', () => {
    render(<BeforeAfter />);
    const slider = screen.getByRole('slider');
    const { before, after } = comparisons[0];
    expect(slider).toHaveAccessibleName(new RegExp(`${before.label}.*${after.label}`, 'i'));
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(slider.getAttribute('aria-valuetext')).toMatch(new RegExp(before.label, 'i'));
    expect(slider).toHaveAttribute('tabindex', '0');
  });

  test('slider responds to arrow keys, Page keys, Home and End and stays in range', () => {
    render(<BeforeAfter />);
    const slider = screen.getByRole('slider');
    const press = key => fireEvent.keyDown(slider, { key });
    const value = () => Number(slider.getAttribute('aria-valuenow'));

    press('ArrowRight');
    expect(value()).toBe(55);
    press('ArrowUp');
    expect(value()).toBe(60);
    press('ArrowLeft');
    press('ArrowDown');
    expect(value()).toBe(50);
    press('PageUp');
    expect(value()).toBe(75);
    press('PageDown');
    expect(value()).toBe(50);
    press('End');
    expect(value()).toBe(100);
    press('ArrowRight');
    expect(value()).toBe(100);
    press('Home');
    expect(value()).toBe(0);
    press('ArrowLeft');
    expect(value()).toBe(0);
  });

  test('dragging with a pointer moves the divider; releasing stops it', () => {
    render(<BeforeAfter />);
    const slider = screen.getByRole('slider');
    const frame = mockFrameRect(slider);

    fireEvent.pointerDown(frame, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 200 });
    expect(slider).toHaveAttribute('aria-valuenow', '25');
    fireEvent.pointerMove(frame, { pointerId: 1, pointerType: 'mouse', clientX: 420 });
    expect(slider).toHaveAttribute('aria-valuenow', '80');
    // Past the edge clamps to the range.
    fireEvent.pointerMove(frame, { pointerId: 1, pointerType: 'mouse', clientX: 900 });
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    fireEvent.pointerUp(frame, { pointerId: 1, pointerType: 'mouse', clientX: 900 });
    fireEvent.pointerMove(frame, { pointerId: 1, pointerType: 'mouse', clientX: 200 });
    expect(slider).toHaveAttribute('aria-valuenow', '100');
  });

  test('touch: a drag moves the divider, a tap jumps to it, a cancelled gesture (page scroll) does not', () => {
    render(<BeforeAfter />);
    const slider = screen.getByRole('slider');
    const frame = mockFrameRect(slider);
    const touch = { pointerId: 7, pointerType: 'touch' };

    // Vertical scroll: the browser takes over and cancels the pointer — the divider stays put.
    fireEvent.pointerDown(frame, { ...touch, clientX: 140 });
    fireEvent.pointerCancel(frame, touch);
    fireEvent.pointerUp(frame, { ...touch, clientX: 140 });
    expect(slider).toHaveAttribute('aria-valuenow', '50');

    fireEvent.pointerDown(frame, { ...touch, clientX: 300 });
    fireEvent.pointerMove(frame, { ...touch, clientX: 340 });
    expect(slider).toHaveAttribute('aria-valuenow', '60');
    fireEvent.pointerUp(frame, { ...touch, clientX: 340 });

    fireEvent.pointerDown(frame, { ...touch, clientX: 180 });
    fireEvent.pointerUp(frame, { ...touch, clientX: 180 });
    expect(slider).toHaveAttribute('aria-valuenow', '20');
  });

  test('touch: a mostly-vertical swipe is left to page scroll and never moves the divider', () => {
    render(<BeforeAfter />);
    const slider = screen.getByRole('slider');
    const frame = mockFrameRect(slider);
    const touch = { pointerId: 3, pointerType: 'touch' };

    fireEvent.pointerDown(frame, { ...touch, clientX: 300, clientY: 200 });
    fireEvent.pointerMove(frame, { ...touch, clientX: 296, clientY: 170 });
    fireEvent.pointerMove(frame, { ...touch, clientX: 260, clientY: 120 });
    fireEvent.pointerUp(frame, { ...touch, clientX: 260, clientY: 120 });
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  test('lets the page scroll vertically over the slider', () => {
    render(<BeforeAfter />);
    expect(mockFrameRect(screen.getByRole('slider'))).toHaveClass('touch-pan-y');
  });

  test('switching comparisons resets the divider', () => {
    render(<BeforeAfter />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' });
    fireEvent.click(screen.getByRole('tab', { name: comparisons[1].label }));
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
  });

  test('nudges the divider once when it scrolls into view to hint it can be dragged', () => {
    vi.useFakeTimers();
    const restoreIO = stubIntersectionObserver();
    try {
      render(<BeforeAfter />);
      const slider = screen.getByRole('slider');
      act(() => vi.advanceTimersByTime(400));
      expect(Number(slider.getAttribute('aria-valuenow'))).toBeLessThan(50);
      act(() => vi.advanceTimersByTime(2000));
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    } finally {
      restoreIO();
      vi.useRealTimers();
    }
  });

  test('skips the hint when the user prefers reduced motion', () => {
    vi.useFakeTimers();
    const restoreIO = stubIntersectionObserver();
    const restoreMQ = mockReducedMotion(true);
    try {
      render(<BeforeAfter />);
      const slider = screen.getByRole('slider');
      for (let i = 0; i < 10; i++) {
        act(() => vi.advanceTimersByTime(200));
        expect(slider).toHaveAttribute('aria-valuenow', '50');
      }
    } finally {
      restoreMQ();
      restoreIO();
      vi.useRealTimers();
    }
  });

  test('renders the "what goes into an edit" timeline in order', () => {
    render(<BeforeAfter />);
    const list = screen.getByRole('list', { name: /what goes into an edit/i });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(breakdown.length);
    breakdown.forEach((item, i) => {
      const step = within(items[i]);
      expect(step.getByRole('heading', { name: new RegExp(item.step) })).toBeInTheDocument();
      expect(step.getByText(item.body)).toBeInTheDocument();
      expect(step.getByText(item.time)).toBeInTheDocument();
    });
  });
});

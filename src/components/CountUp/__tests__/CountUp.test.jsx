import { render } from '@testing-library/react';
import CountUp from '../CountUp';

function mockReducedMotion(reduce) {
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

describe('CountUp', () => {
  test('starts from `from` and waits to be scrolled into view', () => {
    const restore = mockReducedMotion(false);
    const { container } = render(<CountUp from={0} to={1200} separator="," />);
    expect(container.textContent).toBe('0');
    restore();
  });

  test('jumps straight to the final value with reduced motion', () => {
    const restore = mockReducedMotion(true);
    const onEnd = vi.fn();
    const { container } = render(<CountUp from={0} to={1200} separator="," onEnd={onEnd} />);
    expect(container.textContent).toBe('1,200');
    restore();
  });

  test('counting down lands on `from` with reduced motion', () => {
    const restore = mockReducedMotion(true);
    const { container } = render(<CountUp from={5} to={100} direction="down" />);
    expect(container.textContent).toBe('5');
    restore();
  });
});

import { render, screen } from '@testing-library/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../ScrollReveal';

const copy = 'Hooks in the first three seconds.';

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

const words = () => [...document.querySelectorAll('.word')];

describe('ScrollReveal', () => {
  test('renders the copy word by word without adding a heading', () => {
    render(<ScrollReveal>{copy}</ScrollReveal>);
    expect(words().map(w => w.textContent).join(' ')).toBe(copy);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('ties the reveal to scroll position when motion is allowed', () => {
    const restore = mockReducedMotion(false);
    const { unmount } = render(<ScrollReveal>{copy}</ScrollReveal>);
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    restore();
  });

  test('shows the copy fully with reduced motion', () => {
    const restore = mockReducedMotion(true);
    render(<ScrollReveal baseOpacity={0.1}>{copy}</ScrollReveal>);
    words().forEach(word => expect(word.style.opacity).toBe(''));
    expect(ScrollTrigger.getAll()).toHaveLength(0);
    restore();
  });

  test('only kills its own scroll triggers on unmount', () => {
    const restore = mockReducedMotion(false);
    const other = ScrollTrigger.create({ trigger: document.body });
    const { unmount } = render(<ScrollReveal>{copy}</ScrollReveal>);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([other]);
    other.kill();
    restore();
  });
});

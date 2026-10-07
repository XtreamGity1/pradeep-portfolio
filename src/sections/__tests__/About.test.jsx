import { render, screen, within } from '@testing-library/react';
import About from '../About';
import { aboutDetails, platforms, principles, profile, stats } from '../../data';

// jsdom has no prefers-reduced-motion; let a test opt in.
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

const formatValue = stat => stat.value.toLocaleString('en-US', { useGrouping: !!stat.separator });

describe('About', () => {
  test('is the #about anchor target with its heading', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section#about')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Editing is invisible\s*until it isn't\./ })).toBeInTheDocument();
    // The ScrollReveal paragraph must not show up as an extra heading.
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(screen.queryByRole('heading', { name: profile.about })).not.toBeInTheDocument();
  });

  test('renders the about copy once for screen readers and the location', () => {
    render(<About />);
    expect(screen.getByText(profile.about)).toBeInTheDocument();
    expect(screen.getByText(profile.location)).toBeInTheDocument();
  });

  test('shows a lazy-loaded still from the reel with alt text, intrinsic size and caption', () => {
    render(<About />);
    const { image } = aboutDetails;
    const img = screen.getByRole('img', { name: image.alt });
    // Pradeep's own footage, not a stock placeholder.
    expect(image.src).toMatch(/^\/media\/reel\//);
    expect(img).toHaveAttribute('src', image.src);
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('width', String(image.width));
    expect(img).toHaveAttribute('height', String(image.height));
    expect(img.closest('figure')).toHaveTextContent(image.caption);
  });

  test('lists every editing principle under a "How I cut" heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 3, name: aboutDetails.principlesTitle })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: aboutDetails.principlesTitle });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(principles.length);
    principles.forEach((principle, i) => {
      const item = within(items[i]);
      expect(item.getByRole('heading', { level: 4, name: principle.title })).toBeInTheDocument();
      expect(item.getByText(principle.body)).toBeInTheDocument();
    });
  });

  test('lists the platforms edited for', () => {
    render(<About />);
    const list = screen.getByRole('list', { name: aboutDetails.platformsTitle });
    const items = within(list).getAllByRole('listitem');
    expect(items.map(item => item.textContent)).toEqual(platforms);
  });

  test('renders every stat with an accessible value and label', () => {
    render(<About />);
    for (const stat of stats) {
      expect(screen.getByText(stat.label)).toBeInTheDocument();
      expect(screen.getByText(`${formatValue(stat)}${stat.suffix}`)).toBeInTheDocument();
    }
  });

  test('stat counters start from zero when motion is allowed', () => {
    const restore = mockReducedMotion(false);
    const { container } = render(<About />);
    const counters = container.querySelectorAll('dd [aria-hidden="true"]');
    expect(counters).toHaveLength(stats.length);
    counters.forEach(counter => expect(counter.textContent).toMatch(/^0/));
    restore();
  });

  test('stat counters show their final values immediately with reduced motion', () => {
    const restore = mockReducedMotion(true);
    const { container } = render(<About />);
    const counters = container.querySelectorAll('dd [aria-hidden="true"]');
    stats.forEach((stat, i) => {
      expect(counters[i].textContent).toBe(`${formatValue(stat)}${stat.suffix}`);
    });
    restore();
  });
});

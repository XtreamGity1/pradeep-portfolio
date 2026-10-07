import { render, screen, within } from '@testing-library/react';
import Testimonials from '../Testimonials';
import { testimonials } from '../../data';

describe('Testimonials', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Testimonials />);
    expect(container.querySelector('section#testimonials')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /kind words/i })).toBeInTheDocument();
  });

  test('ships a handful of placeholder quotes without invented metrics', () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(2);
    expect(testimonials.length).toBeLessThanOrEqual(4);
    for (const t of testimonials) {
      expect(Object.keys(t).sort()).toEqual(['name', 'quote', 'role']);
    }
  });

  test('renders each testimonial as a list item with figure, blockquote and caption', () => {
    render(<Testimonials />);
    const items = within(screen.getByRole('list', { name: /testimonials/i })).getAllByRole('listitem');
    expect(items).toHaveLength(testimonials.length);
    testimonials.forEach((t, i) => {
      const figure = items[i].querySelector('figure');
      expect(figure).toBeInTheDocument();
      expect(figure.querySelector('blockquote')).toHaveTextContent(t.quote);
      const caption = figure.querySelector('figcaption');
      expect(caption).toHaveTextContent(t.name);
      expect(caption).toHaveTextContent(t.role);
    });
  });
});

describe('Testimonials with no quotes yet', () => {
  afterEach(() => {
    vi.doUnmock('../../data');
    vi.resetModules();
  });

  test('renders nothing so the page can launch without testimonials', async () => {
    vi.resetModules();
    vi.doMock('../../data', async importOriginal => ({ ...(await importOriginal()), testimonials: [] }));
    const { default: Empty } = await import('../Testimonials');
    const { container } = render(<Empty />);
    expect(container).toBeEmptyDOMElement();
  });
});

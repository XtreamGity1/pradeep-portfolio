import { render, screen } from '@testing-library/react';
import Testimonials from '../Testimonials';
import { testimonials } from '../../data';

describe('Testimonials', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Testimonials />);
    expect(container.querySelector('section#testimonials')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /trusted by\s*creators & brands\./i }),
    ).toBeInTheDocument();
  });

  test('renders each testimonial as a figure with blockquote and caption', () => {
    const { container } = render(<Testimonials />);
    const figures = container.querySelectorAll('figure');
    expect(figures).toHaveLength(testimonials.length);
    testimonials.forEach((t, i) => {
      const figure = figures[i];
      expect(figure.querySelector('blockquote')).toHaveTextContent(t.quote);
      const caption = figure.querySelector('figcaption');
      expect(caption).toHaveTextContent(t.name);
      expect(caption).toHaveTextContent(t.role);
    });
  });
});

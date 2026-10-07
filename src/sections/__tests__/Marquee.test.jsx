import { render, screen, within } from '@testing-library/react';
import Marquee from '../Marquee';
import { marquee } from '../../data';

describe('Marquee', () => {
  test('renders a labelled region', () => {
    render(<Marquee />);
    expect(screen.getByRole('region', { name: /formats and skills/i })).toBeInTheDocument();
  });

  test('exposes each marquee line once to assistive tech', () => {
    render(<Marquee />);
    const list = screen.getByRole('list');
    marquee.forEach(text => expect(within(list).getByText(text)).toBeInTheDocument());
  });

  test('renders the scrolling rows visually (aria-hidden)', () => {
    const { container } = render(<Marquee />);
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual).not.toBeNull();
    marquee.forEach(text => expect(within(visual).getAllByText(text).length).toBeGreaterThan(0));
  });
});

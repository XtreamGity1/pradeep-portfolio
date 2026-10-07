import { render, screen, within } from '@testing-library/react';
import Marquee from '../Marquee';
import { marquee } from '../../data';

describe('Marquee', () => {
  test('renders a labelled region', () => {
    render(<Marquee />);
    expect(screen.getByRole('region', { name: /formats and skills/i })).toBeInTheDocument();
  });

  test('exposes each row as a labelled list with every item once', () => {
    render(<Marquee />);
    for (const row of marquee) {
      const list = screen.getByRole('list', { name: row.label });
      const items = within(list).getAllByRole('listitem');
      expect(items.map(item => item.textContent)).toEqual(row.items);
    }
  });

  test('renders the scrolling rows visually (aria-hidden)', () => {
    const { container } = render(<Marquee />);
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual).not.toBeNull();
    marquee.forEach(row =>
      row.items.forEach(item => expect(within(visual).getAllByText(item).length).toBeGreaterThan(0)),
    );
  });

  test('does not nest an unlabelled section inside the region', () => {
    const { container } = render(<Marquee />);
    expect(container.querySelectorAll('section')).toHaveLength(1);
  });
});

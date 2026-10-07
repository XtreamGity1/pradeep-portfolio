import { render, screen, within } from '@testing-library/react';
import Promises from '../Promises';
import { promises } from '../../data';

describe('Promises', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Promises />);
    expect(container.querySelector('section#promises')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /what you can\s*count on\./i })).toBeInTheDocument();
  });

  test('lists every promise with its title and detail', () => {
    render(<Promises />);
    const items = within(screen.getByRole('list', { name: 'Promises' })).getAllByRole('listitem');
    expect(items).toHaveLength(promises.length);
    promises.forEach((p, i) => {
      expect(within(items[i]).getByRole('heading', { level: 3, name: p.title })).toBeInTheDocument();
      expect(items[i]).toHaveTextContent(p.body);
    });
  });

  test('makes concrete commitments, not invented quotes', () => {
    expect(promises.length).toBeGreaterThanOrEqual(3);
    for (const p of promises) expect(Object.keys(p).sort()).toEqual(['body', 'title']);
  });
});

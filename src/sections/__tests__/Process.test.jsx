import { render, screen, within } from '@testing-library/react';
import Process from '../Process';
import { process as steps } from '../../data';

describe('Process', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Process />);
    expect(container.querySelector('section#process')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /from raw footage\s*to final cut\./i }),
    ).toBeInTheDocument();
  });

  test('renders every step in order with a zero-padded index', () => {
    render(<Process />);
    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(steps.length);
    steps.forEach((item, i) => {
      const step = within(items[i]);
      expect(step.getByText(String(i + 1).padStart(2, '0'))).toBeInTheDocument();
      expect(step.getByRole('heading', { level: 3, name: new RegExp(item.step) })).toBeInTheDocument();
      expect(step.getByText(item.body)).toBeInTheDocument();
    });
  });
});

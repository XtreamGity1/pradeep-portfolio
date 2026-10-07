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

  test('renders every step in order as an ordered timeline with a zero-padded index', () => {
    const { container } = render(<Process />);
    const list = screen.getByRole('list', { name: /process/i });
    expect(container.querySelector('ol')).toBe(list);
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(steps.length);
    steps.forEach((item, i) => {
      const step = within(items[i]);
      expect(step.getByText(String(i + 1).padStart(2, '0'))).toBeInTheDocument();
      expect(
        step.getByRole('heading', { level: 3, name: new RegExp(`step ${i + 1}:\\s*${item.step}`, 'i') }),
      ).toBeInTheDocument();
      expect(step.getByText(item.body)).toBeInTheDocument();
    });
  });

  test('each step shows its timing and what the client provides', () => {
    render(<Process />);
    const items = within(screen.getByRole('list', { name: /process/i })).getAllByRole('listitem');
    steps.forEach((item, i) => {
      expect(item.duration).toBeTruthy();
      expect(item.provide).toBeTruthy();
      const step = within(items[i]);
      expect(step.getByText(item.duration)).toBeInTheDocument();
      // Labelled pair: "You provide" → the client's input for this step.
      const term = step.getByText(/you provide/i);
      expect(term.tagName).toBe('DT');
      expect(term.nextElementSibling).toHaveTextContent(item.provide);
    });
  });
});

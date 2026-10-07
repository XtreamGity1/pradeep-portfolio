import { fireEvent, render, screen } from '@testing-library/react';
import FAQ from '../FAQ';
import { faqs } from '../../data';

describe('FAQ', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<FAQ />);
    expect(container.querySelector('section#faq')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /questions,?\s*answered/i })).toBeInTheDocument();
  });

  test('covers 6–8 questions, each as a collapsed disclosure button inside an h3', () => {
    expect(faqs.length).toBeGreaterThanOrEqual(6);
    expect(faqs.length).toBeLessThanOrEqual(8);
    render(<FAQ />);
    for (const { question, answer } of faqs) {
      const button = screen.getByRole('button', { name: question });
      expect(button.closest('h3')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      expect(panel).toHaveTextContent(answer);
      expect(panel).not.toBeVisible();
    }
  });

  test('toggles an answer open and closed', () => {
    render(<FAQ />);
    const [first] = faqs;
    const button = screen.getByRole('button', { name: first.question });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const panel = screen.getByRole('region', { name: first.question });
    expect(panel).toBeVisible();
    expect(panel).toHaveTextContent(first.answer);
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();
  });

  test('allows several answers to be open at once', () => {
    render(<FAQ />);
    const [a, b] = faqs.map(f => screen.getByRole('button', { name: f.question }));
    fireEvent.click(a);
    fireEvent.click(b);
    expect(a).toHaveAttribute('aria-expanded', 'true');
    expect(b).toHaveAttribute('aria-expanded', 'true');
  });

  test('includes the questions a client would ask a newer editor', () => {
    const questions = faqs.map(f => f.question).join('\n');
    for (const topic of [/test edit/i, /newer editor/i, /footage/i, /revisions/i, /turnaround|how fast/i]) {
      expect(questions).toMatch(topic);
    }
  });

  test('points people with other questions to the contact section', () => {
    render(<FAQ />);
    expect(screen.getByRole('link', { name: /ask me directly/i })).toHaveAttribute('href', '#contact');
  });
});

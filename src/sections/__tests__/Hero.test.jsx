import { render, screen } from '@testing-library/react';
import Hero from '../Hero';
import { profile } from '../../data';

describe('Hero', () => {
  test('is the #top anchor target', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('section#top')).toBeInTheDocument();
  });

  test('renders the name as the page h1', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument();
  });

  test('shows availability badge, rotating role and tagline', () => {
    const { container } = render(<Hero />);
    expect(screen.getByText('Available for new projects')).toBeInTheDocument();
    expect(screen.getByText(/I edit/)).toBeInTheDocument();
    expect(screen.getByText(profile.roles[0])).toBeInTheDocument();
    const text = container.textContent.replace(/ /g, ' ');
    expect(text).toContain(profile.tagline);
  });

  test('renders call-to-action links', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'View my work' })).toHaveAttribute('href', '#work');
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: /scroll/i })).toHaveAttribute('href', '#about');
  });

  test('renders the Aurora background as decorative', () => {
    render(<Hero />);
    expect(screen.getByTestId('aurora').closest('[aria-hidden="true"]')).not.toBeNull();
  });
});

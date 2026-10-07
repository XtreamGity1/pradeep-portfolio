import { render, screen, within } from '@testing-library/react';
import Contact from '../Contact';
import { inquiry, profile } from '../../data';

const BLURB = 'Have footage sitting on a drive? Tell me about your project — I reply within 24 hours.';

// Reports `matches: true` only for the reduced-motion query.
function preferReducedMotion() {
  const original = window.matchMedia;
  window.matchMedia = query => ({
    matches: query.includes('prefers-reduced-motion: reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  return () => {
    window.matchMedia = original;
  };
}

describe('Contact', () => {
  test('renders the section anchor, eyebrow and headline', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('section#contact')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /make something people finish watching/i }),
    ).toBeInTheDocument();
  });

  test('renders the supporting line', () => {
    const { container } = render(<Contact />);
    expect(container).toHaveTextContent(/have footage sitting on a drive\?/i);
    expect(container).toHaveTextContent(/i reply within 24 hours\./i);
  });

  test('links the email button to a mailto address', () => {
    render(<Contact />);
    const link = screen.getByRole('link', { name: new RegExp(profile.email) });
    expect(link).toHaveAttribute('href', `mailto:${profile.email}`);
  });

  test('renders every social link opening safely in a new tab', () => {
    render(<Contact />);
    profile.socials.forEach((social) => {
      const link = screen.getByRole('link', { name: new RegExp(social.label) });
      expect(link).toHaveAttribute('href', social.href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toMatch(/noopener/);
      expect(link.getAttribute('rel')).toMatch(/noreferrer/);
    });
  });

  test('renders the project inquiry form beside the email CTA', () => {
    render(<Contact />);
    const form = screen.getByRole('form', { name: inquiry.title });
    expect(within(form).getByRole('button', { name: inquiry.submitLabel })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: inquiry.title })).toBeInTheDocument();
  });

  test('renders the headline and blurb as plain, unsplit text when motion is reduced', () => {
    const restore = preferReducedMotion();
    render(<Contact />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Let’s make something people finish watching.');
    expect(screen.getByText(BLURB)).toBeInTheDocument();
    restore();
  });
});

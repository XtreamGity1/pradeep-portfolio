import { render, screen } from '@testing-library/react';
import Contact from '../Contact';
import { profile } from '../../data';

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
});

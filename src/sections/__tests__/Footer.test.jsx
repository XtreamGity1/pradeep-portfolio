import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { profile } from '../../data';

describe('Footer', () => {
  test('renders a contentinfo landmark with copyright, name and location', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent(`© ${new Date().getFullYear()} ${profile.name}`);
    expect(footer).toHaveTextContent(profile.location);
  });

  test('links back to the top of the page', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top');
  });
});

import { render, screen, within } from '@testing-library/react';
import Footer from '../Footer';
import { footer, profile } from '../../data';

describe('Footer', () => {
  test('renders a contentinfo landmark with copyright, name and location', () => {
    render(<Footer />);
    const contentinfo = screen.getByRole('contentinfo');
    expect(contentinfo).toHaveTextContent(`© ${new Date().getFullYear()} ${profile.name}`);
    expect(contentinfo).toHaveTextContent(profile.location);
  });

  test('shows the availability line', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent(footer.availability);
  });

  test('keeps name, availability and copyright together in one block', () => {
    render(<Footer />);
    const block = screen.getByText(profile.name).parentElement;
    expect(block).toHaveTextContent(footer.availability);
    expect(block).toHaveTextContent(`© ${new Date().getFullYear()}`);
    expect(block).not.toContainElement(screen.getByRole('navigation', { name: /footer/i }));
  });

  test('leaves back-to-top to the floating pill', () => {
    render(<Footer />);
    expect(screen.queryByRole('link', { name: /back to top/i })).not.toBeInTheDocument();
  });

  test('has a footer nav linking to each section in order', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: /footer/i });
    const links = within(nav).getAllByRole('link');
    expect(links.map(link => [link.textContent, link.getAttribute('href')])).toEqual(
      footer.links.map(({ label, href }) => [label, href]),
    );
  });

  test('lists every social profile, opening safely in a new tab', () => {
    render(<Footer />);
    const list = screen.getByRole('list', { name: /social/i });
    const links = within(list).getAllByRole('link');
    expect(links).toHaveLength(profile.socials.length);
    profile.socials.forEach((social, i) => {
      expect(links[i]).toHaveAccessibleName(new RegExp(social.label));
      expect(links[i]).toHaveAttribute('href', social.href);
      expect(links[i]).toHaveAttribute('target', '_blank');
    });
  });
});

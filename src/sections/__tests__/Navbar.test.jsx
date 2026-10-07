import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Navbar from '../Navbar';
import { navItems, profile } from '../../data';

function scrollTo(y) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true });
    fireEvent.scroll(window);
  });
}

// jsdom's matchMedia stub reports `matches: false`, so these tests exercise the mobile layout.
describe('Navbar', () => {
  afterEach(() => {
    scrollTo(0);
    document.body.style.overflow = '';
  });

  test('renders a translucent banner with a home link', () => {
    render(<Navbar />);
    const banner = screen.getByRole('banner');
    expect(banner.className).toMatch(/bg-ink\/\d+/);
    expect(banner.className).toMatch(/backdrop-blur/);
    const home = within(banner).getByRole('link', { name: new RegExp(profile.name) });
    expect(home).toHaveAttribute('href', '#top');
    expect(within(home).getByText(profile.initials)).toBeInTheDocument();
  });

  test('shows every nav item as an inline link at the top of the page', () => {
    render(<Navbar />);
    const banner = screen.getByRole('banner');
    for (const item of navItems) {
      expect(within(banner).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
    expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
  });

  test('collapses into a hamburger after scrolling and restores at the top', async () => {
    render(<Navbar />);
    scrollTo(200);
    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(within(screen.getByRole('banner')).queryByRole('link', { name: 'Work' })).not.toBeInTheDocument(),
    );

    scrollTo(0);
    await waitFor(() => expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument());
    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Work' })).toBeInTheDocument();
  });

  test('opens a modal menu with every nav link and locks scroll', () => {
    render(<Navbar />);
    scrollTo(200);
    const button = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAccessibleName('Close menu');
    const dialog = screen.getByRole('dialog', { name: 'Site menu' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(button).toHaveAttribute('aria-controls', dialog.id);
    for (const item of navItems) {
      expect(within(dialog).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('clicking a menu link closes the menu', async () => {
    render(<Navbar />);
    scrollTo(200);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Contact' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
  });

  test('Escape closes the menu and returns focus to the toggle', async () => {
    render(<Navbar />);
    scrollTo(200);
    const button = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Navbar from '../Navbar';
import { navCta, navItems, profile } from '../../data';
import mockIntersectionObserver from '../../hooks/__tests__/intersectionObserverMock';

const compactItems = navItems.filter(item => item.compact);
const fullOnlyItems = navItems.filter(item => !item.compact);

function scrollTo(y) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true });
    fireEvent.scroll(window);
  });
}

// The navbar plus the sections it links to, so the scrollspy has something to observe.
function renderPage() {
  return render(
    <>
      <Navbar />
      <main id="main">
        {navItems.map(item => (
          <section key={item.href} id={item.href.slice(1)} />
        ))}
      </main>
    </>,
  );
}

function mockViewport({ desktop }) {
  const original = window.matchMedia;
  window.matchMedia = query => ({
    matches: desktop && query.includes('min-width'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  return () => {
    window.matchMedia = original;
  };
}

function openMenu() {
  scrollTo(200);
  const button = screen.getByRole('button', { name: 'Open menu' });
  fireEvent.click(button);
  return { button, dialog: screen.getByRole('dialog', { name: 'Site menu' }) };
}

// jsdom's matchMedia stub reports `matches: false`, so these tests exercise the mobile layout
// unless they opt into the desktop one.
describe('Navbar', () => {
  let io;
  beforeEach(() => {
    io = mockIntersectionObserver();
  });
  afterEach(() => {
    scrollTo(0);
    document.body.style.overflow = '';
    io.restore();
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

  test('starts with a skip link to the main content', () => {
    render(<Navbar />);
    const [first] = screen.getAllByRole('link');
    expect(first).toHaveAccessibleName('Skip to content');
    expect(first).toHaveAttribute('href', '#main');
  });

  test('shows the compact nav items as inline links at the top of the page', () => {
    render(<Navbar />);
    const nav = within(screen.getByRole('banner')).getByRole('navigation', { name: 'Primary' });
    for (const item of compactItems) {
      expect(within(nav).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
    for (const item of fullOnlyItems) {
      expect(within(nav).queryByRole('link', { name: item.label })).not.toBeInTheDocument();
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

  test('opens a modal menu with every nav link, focuses the first and locks scroll', () => {
    render(<Navbar />);
    const { button, dialog } = openMenu();

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAccessibleName('Close menu');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(button).toHaveAttribute('aria-controls', dialog.id);
    for (const item of navItems) {
      expect(within(dialog).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
    expect(within(dialog).getByRole('link', { name: navItems[0].label })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('Tab and Shift+Tab stay inside the open menu', () => {
    render(<Navbar />);
    const { button, dialog } = openMenu();
    const links = within(dialog).getAllByRole('link');
    const last = links[links.length - 1];

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(button).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });

  test('clicking a menu link closes the menu', async () => {
    render(<Navbar />);
    const { dialog } = openMenu();
    fireEvent.click(within(dialog).getByRole('link', { name: 'Contact' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('');
  });

  test('Escape closes the menu and returns focus to the toggle', async () => {
    render(<Navbar />);
    const { button } = openMenu();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  describe('scrollspy', () => {
    test('marks the inline link for the section in view as the current location', () => {
      renderPage();
      const banner = screen.getByRole('banner');
      io.show('pricing');
      expect(within(banner).getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'location');
      expect(within(banner).getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current');

      io.show();
      expect(within(banner).queryByRole('link', { current: 'location' })).not.toBeInTheDocument();
    });

    test('marks the current section in the mobile menu', () => {
      renderPage();
      io.show('faq');
      const { dialog } = openMenu();
      expect(within(dialog).getByRole('link', { name: 'FAQ' })).toHaveAttribute('aria-current', 'location');
      expect(within(dialog).getAllByRole('link', { current: 'location' })).toHaveLength(1);
    });

    test('a clicked link becomes current straight away', () => {
      renderPage();
      io.show('work');
      const banner = screen.getByRole('banner');
      fireEvent.click(within(banner).getByRole('link', { name: 'Contact' }));
      expect(within(banner).getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'location');
    });
  });

  describe('desktop', () => {
    let restoreViewport;
    beforeEach(() => {
      restoreViewport = mockViewport({ desktop: true });
    });
    afterEach(() => restoreViewport());

    test('shows every nav item plus a call-to-action and no hamburger', () => {
      renderPage();
      const banner = screen.getByRole('banner');
      const nav = within(banner).getByRole('navigation', { name: 'Primary' });
      for (const item of navItems.filter(item => item.href !== navCta.href)) {
        expect(within(nav).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
      }
      expect(within(banner).getByRole('link', { name: navCta.label })).toHaveAttribute('href', navCta.href);
      expect(within(banner).queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    });

    test('highlights the section in view, including the call-to-action', () => {
      renderPage();
      const banner = screen.getByRole('banner');
      expect(within(banner).queryByRole('link', { current: 'location' })).not.toBeInTheDocument();

      io.show('craft');
      expect(within(banner).getByRole('link', { name: 'Before & After' })).toHaveAttribute('aria-current', 'location');

      io.show('contact');
      expect(within(banner).getByRole('link', { name: navCta.label })).toHaveAttribute('aria-current', 'location');
      expect(within(banner).getAllByRole('link', { current: 'location' })).toHaveLength(1);
    });
  });
});

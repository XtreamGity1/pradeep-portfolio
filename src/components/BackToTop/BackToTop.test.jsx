import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import BackToTop from './BackToTop';

function scrollTo(y) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true });
    fireEvent.scroll(window);
  });
}

const pill = () => screen.queryByRole('link', { name: /back to top/i });

describe('BackToTop', () => {
  afterEach(() => scrollTo(0));

  test('is hidden on landing', () => {
    render(<BackToTop />);
    expect(pill()).not.toBeInTheDocument();
  });

  test('stays hidden for a small scroll', () => {
    render(<BackToTop />);
    scrollTo(200);
    expect(pill()).not.toBeInTheDocument();
  });

  test('appears after scrolling down and links to the top', () => {
    render(<BackToTop />);
    scrollTo(1200);
    expect(pill()).toHaveAttribute('href', '#top');
  });

  test('disappears again when scrolled back to the top', async () => {
    render(<BackToTop />);
    scrollTo(1200);
    expect(pill()).toBeInTheDocument();
    scrollTo(0);
    await waitFor(() => expect(pill()).not.toBeInTheDocument());
  });
});

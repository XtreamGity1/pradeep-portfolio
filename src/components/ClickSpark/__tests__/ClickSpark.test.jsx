import { fireEvent, render, screen } from '@testing-library/react';
import ClickSpark from '../ClickSpark';

function mockReducedMotion(reduce) {
  const original = window.matchMedia;
  window.matchMedia = query => ({
    matches: reduce && query.includes('prefers-reduced-motion: reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  return () => {
    window.matchMedia = original;
  };
}

describe('ClickSpark', () => {
  let raf;
  beforeEach(() => {
    raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
  });
  afterEach(() => raf.mockRestore());

  test('renders its children and stays idle until clicked', () => {
    render(
      <ClickSpark>
        <button type="button">Tap</button>
      </ClickSpark>,
    );
    expect(raf).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }));
    expect(raf).toHaveBeenCalledTimes(1);
  });

  test('skips the sparks when the visitor prefers reduced motion', () => {
    const restore = mockReducedMotion(true);
    render(
      <ClickSpark>
        <button type="button">Tap</button>
      </ClickSpark>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }));
    expect(raf).not.toHaveBeenCalled();
    restore();
  });
});

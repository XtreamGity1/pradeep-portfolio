import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Hero from '../Hero';
import { heroVideo, profile, reelChapters, showreel } from '../../data';

function mockReducedMotion() {
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

const openShowreel = () => {
  const trigger = screen.getByRole('button', { name: new RegExp(showreel.cta, 'i') });
  fireEvent.click(trigger);
  return { trigger, dialog: screen.getByRole('dialog', { name: showreel.title }) };
};

describe('Hero', () => {
  test('is the #top anchor target', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('section#top')).toBeInTheDocument();
  });

  test('renders the name as the page h1', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument();
  });

  test('shows the now-showing badge, rotating role and tagline', () => {
    const { container } = render(<Hero />);
    expect(screen.queryByText('Available for new projects')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-now-showing')).toBeInTheDocument();
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

  test('stacks the CTAs as equal full-width buttons on mobile and lays them out in a row from sm', () => {
    render(<Hero />);
    const ctas = ['View my work', 'Get in touch'].map(name => screen.getByRole('link', { name }));
    for (const cta of ctas) expect(cta).toHaveClass('w-full', 'justify-center', 'sm:w-auto');
    // Both CTAs sit inside the same capped-width container that switches to a row from sm.
    const group = ctas[0].closest('.flex-col');
    expect(group).toContainElement(ctas[1]);
    expect(group).toHaveClass('w-full', 'max-w-xs', 'sm:w-auto', 'sm:flex-row');
  });

  test('hides the scroll cue on short viewports so it never crowds the CTAs', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /scroll/i })).toHaveClass('[@media(max-height:44rem)]:hidden');
  });

  test('plays the hero video as a muted, looping, decorative background', () => {
    const { container } = render(<Hero />);
    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(video).toHaveAttribute('src', heroVideo.src);
    expect(video).toHaveAttribute('poster', heroVideo.poster);
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.autoplay).toBe(true);
    expect(video).toHaveAttribute('playsinline');
  });

  test('shows the still poster instead of the video when motion is reduced', () => {
    const restore = mockReducedMotion();
    const { container } = render(<Hero />);
    restore();
    expect(container.querySelector('video')).toBeNull();
    const still = container.querySelector(`img[src="${heroVideo.poster}"]`);
    expect(still).not.toBeNull();
    expect(still).toHaveAttribute('alt', '');
  });

  describe('now-showing badge', () => {
    const label = container => container.querySelector('[data-testid="hero-now-showing"]');
    // Move the background loop's playhead to `time` seconds (loop time, not reel time).
    const seek = (video, time) => {
      Object.defineProperty(video, 'currentTime', { configurable: true, value: time });
      fireEvent.timeUpdate(video);
    };

    test('names the technique the background video is showing, in sync with its time', () => {
      const { container } = render(<Hero />);
      const video = container.querySelector('video');
      // Decorative: it mirrors the muted background video.
      expect(label(container).closest('[aria-hidden="true"]')).not.toBeNull();
      // Sits above the headline, where the eye lands first.
      expect(label(container).compareDocumentPosition(screen.getByRole('heading', { level: 1 }))).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );

      for (const chapter of reelChapters.filter(c => c.start >= heroVideo.offset)) {
        seek(video, (chapter.start + chapter.end) / 2 - heroVideo.offset);
        expect(label(container)).toHaveTextContent(`Now showing · ${chapter.label}`);
      }
    });

    test('keeps the last technique between chapters instead of flickering', () => {
      const { container } = render(<Hero />);
      const video = container.querySelector('video');
      const gap = reelChapters.findIndex((c, i) => i > 0 && c.start > reelChapters[i - 1].end);
      const before = reelChapters[gap - 1];
      seek(video, (before.start + before.end) / 2 - heroVideo.offset);
      seek(video, (before.end + reelChapters[gap].start) / 2 - heroVideo.offset);
      expect(label(container)).toHaveTextContent(`Now showing · ${before.label}`);
    });

    test('names the poster’s technique when motion is reduced', () => {
      const restore = mockReducedMotion();
      const { container } = render(<Hero />);
      restore();
      expect(label(container)).toHaveTextContent('Now showing · Text in background');
    });
  });

  describe('showreel', () => {
    beforeEach(() => {
      // jsdom doesn't implement media playback.
      vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    });
    afterEach(() => {
      vi.restoreAllMocks();
      document.body.style.overflow = '';
    });

    test('offers a "Watch showreel" button that announces a dialog', () => {
      render(<Hero />);
      const trigger = screen.getByRole('button', { name: new RegExp(showreel.cta, 'i') });
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveTextContent(showreel.duration);
      // Sits with the other CTAs so the stacked/row layout applies to all three.
      expect(trigger).toHaveClass('w-full', 'justify-center', 'sm:w-auto');
      expect(screen.getByRole('link', { name: 'View my work' }).closest('.flex-col')).toContainElement(trigger);
    });

    test('opens a labelled modal player with the reel', () => {
      render(<Hero />);
      const { trigger, dialog } = openShowreel();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAccessibleDescription(showreel.description);
      const video = dialog.querySelector('video');
      expect(video).toHaveAttribute('src', showreel.src);
      expect(video).toHaveAttribute('poster', showreel.poster);
      expect(video).toHaveAttribute('controls');
    });

    test('moves focus into the dialog and locks page scroll', () => {
      render(<Hero />);
      const { dialog } = openShowreel();
      expect(within(dialog).getByRole('button', { name: /close/i })).toHaveFocus();
      expect(document.body.style.overflow).toBe('hidden');
    });

    test('keeps Tab and Shift+Tab inside the dialog', () => {
      render(<Hero />);
      const { dialog } = openShowreel();
      const close = within(dialog).getByRole('button', { name: /close/i });
      // jsdom can't focus <video>, so check the wrap request; e2e covers the real round trip.
      const video = dialog.querySelector('video');
      const focusVideo = vi.spyOn(video, 'focus');

      expect(close).toHaveFocus();
      const notPrevented = fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(notPrevented).toBe(false);
      expect(focusVideo).toHaveBeenCalled();

      // Tab from the first item just moves on naturally.
      expect(fireEvent.keyDown(document, { key: 'Tab' })).toBe(true);
    });

    test('pulls focus back in if it lands outside the dialog', () => {
      render(<Hero />);
      const { dialog } = openShowreel();
      const outside = screen.getByRole('link', { name: 'Get in touch' });
      outside.focus();
      expect(within(dialog).getByRole('button', { name: /close/i })).toHaveFocus();
    });

    test('Escape closes it, pauses the video and returns focus to the trigger', async () => {
      render(<Hero />);
      const { trigger } = openShowreel();
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveFocus();
      expect(document.body.style.overflow).toBe('');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      // The reel's player is gone; only the muted background loop remains.
      expect(document.querySelector(`video[src="${showreel.src}"]`)).toBeNull();
    });

    test('Escape still closes it while the reel player has focus', async () => {
      render(<Hero />);
      const { trigger, dialog } = openShowreel();
      const video = dialog.querySelector('video');
      // Native media controls handle Escape themselves and stop it bubbling to the document.
      video.addEventListener('keydown', e => e.stopPropagation());
      fireEvent.keyDown(video, { key: 'Escape' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    test('the close button closes it', async () => {
      render(<Hero />);
      const { dialog, trigger } = openShowreel();
      fireEvent.click(within(dialog).getByRole('button', { name: /close/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(trigger).toHaveFocus();
    });

    test('clicking the backdrop closes it, clicking the player does not', async () => {
      render(<Hero />);
      const { dialog } = openShowreel();
      fireEvent.click(dialog.querySelector('video'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('showreel-backdrop'));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });
  });
});

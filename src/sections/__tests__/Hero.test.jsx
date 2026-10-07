import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Hero from '../Hero';
import { profile, showreel } from '../../data';

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

  test('renders the Aurora background as decorative', () => {
    render(<Hero />);
    expect(screen.getByTestId('aurora').closest('[aria-hidden="true"]')).not.toBeNull();
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
      expect(document.querySelector('video')).toBeNull();
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

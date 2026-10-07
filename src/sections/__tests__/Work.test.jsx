import { fireEvent, render, screen, within } from '@testing-library/react';
import Work from '../Work';
import { edits, reelChapters, showreel, workCta } from '../../data';

const groups = [...new Set(edits.map(e => e.group))];
const chapterOf = edit => reelChapters.find(c => c.id === edit.id);

const cardButton = edit => screen.getByRole('button', { name: edit.title });
const editHeadings = () => screen.queryAllByRole('heading', { level: 3 });
const filterGroup = () => screen.getByRole('group', { name: 'Filter edits by technique' });

function openEdit(edit) {
  const button = cardButton(edit);
  button.focus();
  fireEvent.click(button);
  return screen.getByRole('dialog', { name: edit.title });
}

describe('Work', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  test('renders the section anchor and heading', () => {
    const { container } = render(<Work />);
    expect(container.querySelector('section#work')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /edits that\s*move the needle\./i })).toBeInTheDocument();
  });

  test('every edit is a segment of the reel', () => {
    for (const edit of edits) expect(chapterOf(edit), edit.id).toBeDefined();
  });

  test('renders one card per edit with its title, group, summary and still', () => {
    render(<Work />);
    const list = screen.getByRole('list', { name: 'Edits' });
    expect(editHeadings()).toHaveLength(edits.length);

    for (const edit of edits) {
      const item = cardButton(edit).closest('li');
      expect(list).toContainElement(item);
      const card = within(item);
      expect(card.getByRole('heading', { level: 3, name: edit.title })).toBeInTheDocument();
      expect(card.getByText(edit.group)).toBeInTheDocument();
      expect(card.getByText(edit.summary)).toBeInTheDocument();
      expect(item.querySelector('img')).toHaveAttribute('src', edit.image);
      // Below the fold: stills load only as the grid nears the viewport.
      expect(item.querySelector('img')).toHaveAttribute('loading', 'lazy');
    }
  });

  test('cards are real buttons that open a dialog', () => {
    render(<Work />);
    for (const edit of edits) expect(cardButton(edit)).toHaveAttribute('aria-haspopup', 'dialog');
  });

  test('ends the grid with a call to action for the next project', () => {
    render(<Work />);
    expect(screen.getByRole('link', { name: workCta.label })).toHaveAttribute('href', workCta.href);
  });

  test('does not render the TiltedCard mobile warning', () => {
    render(<Work />);
    expect(screen.queryByText(/not optimized for mobile/i)).not.toBeInTheDocument();
  });

  describe('technique filter', () => {
    test('offers All plus one toggle per group derived from the edits', () => {
      render(<Work />);
      const buttons = within(filterGroup()).getAllByRole('button');
      expect(buttons.map(b => b.textContent.replace(/\d+$/, ''))).toEqual(['All', ...groups]);
      expect(within(filterGroup()).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
      for (const group of groups) {
        expect(within(filterGroup()).getByRole('button', { name: group })).toHaveAttribute('aria-pressed', 'false');
      }
    });

    test('announces the result count in a live region', () => {
      render(<Work />);
      expect(screen.getByRole('status')).toHaveTextContent(`Showing all ${edits.length} edits`);
    });

    test.each(groups)('filtering by %s shows only matching edits', group => {
      render(<Work />);
      fireEvent.click(within(filterGroup()).getByRole('button', { name: group }));

      const matching = edits.filter(e => e.group === group);
      expect(within(filterGroup()).getByRole('button', { name: group })).toHaveAttribute('aria-pressed', 'true');
      expect(within(filterGroup()).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
      expect(editHeadings().map(h => h.textContent)).toEqual(matching.map(e => e.title));
      const noun = matching.length === 1 ? 'edit' : 'edits';
      expect(screen.getByRole('status')).toHaveTextContent(`Showing ${matching.length} ${group} ${noun}`);

      fireEvent.click(within(filterGroup()).getByRole('button', { name: 'All' }));
      expect(editHeadings()).toHaveLength(edits.length);
    });
  });

  describe('edit dialog', () => {
    const edit = edits[0];

    test('opens a labelled modal dialog that explains the technique', () => {
      render(<Work />);
      const dialog = openEdit(edit);
      const d = within(dialog);

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(d.getByRole('heading', { level: 2, name: edit.title })).toBeInTheDocument();
      for (const name of ['In this clip', 'How it’s done', 'Why it matters']) {
        expect(d.getByRole('heading', { level: 3, name })).toBeInTheDocument();
      }
      expect(d.getByText(edit.shows)).toBeInTheDocument();
      expect(d.getByText(edit.why)).toBeInTheDocument();
      for (const step of edit.how) {
        expect(d.getByText(step.label)).toBeInTheDocument();
        expect(d.getByText(step.body)).toBeInTheDocument();
      }
      expect(d.getByText(edit.group, { selector: 'dd' })).toBeInTheDocument();
      expect(d.getByText(showreel.title)).toBeInTheDocument();
    });

    test('plays that segment of the reel with sound and controls', () => {
      render(<Work />);
      const dialog = openEdit(edit);
      const { start, end } = chapterOf(edit);
      const video = dialog.querySelector('video');

      expect(video).toHaveAttribute('src', `${showreel.src}#t=${start},${end}`);
      expect(video).toHaveAttribute('poster', edit.image);
      expect(video).toHaveAttribute('controls');
      expect(video).toHaveAttribute('playsinline');
      expect(video.muted).toBe(false);
      expect(video).toHaveAccessibleName(`${edit.title} clip from the showreel`);
      // Clip length, rounded to a tenth of a second.
      expect(within(dialog).getByText(`${(end - start).toFixed(1)} s`)).toBeInTheDocument();
    });

    test('locks page scroll and moves focus into the dialog', () => {
      render(<Work />);
      const dialog = openEdit(edit);
      expect(document.body.style.overflow).toBe('hidden');
      expect(within(dialog).getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    test('Escape closes it, unlocks scroll and returns focus to the card', () => {
      render(<Work />);
      openEdit(edit);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('');
      expect(cardButton(edit)).toHaveFocus();
    });

    test('Tab treats the video as one stop, and Escape closes it from there', () => {
      render(<Work />);
      const dialog = openEdit(edit);
      const video = dialog.querySelector('video');
      video.tabIndex = 0; // jsdom only lets a <video> take focus with a tabindex
      // Focus never enters the player's native controls, where Chrome stops passing keys to the page.
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(video).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(within(dialog).getByRole('button', { name: /^previous/i })).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(video).toHaveFocus();

      fireEvent.keyDown(video, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(cardButton(edit)).toHaveFocus();
    });

    test('the close button closes it', () => {
      render(<Work />);
      const dialog = openEdit(edit);
      fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(cardButton(edit)).toHaveFocus();
    });

    test('clicking the backdrop closes it, clicking inside does not', () => {
      render(<Work />);
      const dialog = openEdit(edit);
      fireEvent.click(within(dialog).getByText(edit.why));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('edit-dialog-backdrop'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('keeps Tab focus inside the dialog', () => {
      render(<Work />);
      const dialog = openEdit(edit);
      const close = within(dialog).getByRole('button', { name: 'Close' });
      const focusables = dialog.querySelectorAll('button, a[href], video');
      const last = focusables[focusables.length - 1];

      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(last).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(close).toHaveFocus();
    });

    test('browses to the next and previous edit within the current filter', () => {
      render(<Work />);
      const inGroup = g => edits.filter(e => e.group === g);
      const group = groups.find(g => inGroup(g).length >= 2);
      const matching = inGroup(group);
      fireEvent.click(within(filterGroup()).getByRole('button', { name: group }));
      openEdit(matching[0]);

      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^next.*${matching[1].title}`, 'i') }));
      const dialog = screen.getByRole('dialog', { name: matching[1].title });
      const { start, end } = chapterOf(matching[1]);
      expect(dialog.querySelector('video')).toHaveAttribute('src', `${showreel.src}#t=${start},${end}`);
      fireEvent.click(screen.getByRole('button', { name: /^previous/i }));
      expect(screen.getByRole('dialog', { name: matching[0].title })).toBeInTheDocument();

      // Closing returns focus to the card of the edit being viewed.
      fireEvent.click(screen.getByRole('button', { name: /^next/i }));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(cardButton(matching[1])).toHaveFocus();
    });
  });
});

import { fireEvent, render, screen, within } from '@testing-library/react';
import Work from '../Work';
import { projects, workCta } from '../../data';

const categories = [...new Set(projects.map(p => p.category))];

const cardButton = project => screen.getByRole('button', { name: project.title });
const projectHeadings = () => screen.queryAllByRole('heading', { level: 3 });

function openProject(project) {
  const button = cardButton(project);
  button.focus();
  fireEvent.click(button);
  return screen.getByRole('dialog', { name: project.title });
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

  test('renders one card per project with its info visible without hover', () => {
    render(<Work />);
    const list = screen.getByRole('list', { name: 'Projects' });
    expect(projectHeadings()).toHaveLength(projects.length);

    for (const project of projects) {
      const item = cardButton(project).closest('li');
      expect(list).toContainElement(item);
      const card = within(item);
      expect(card.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument();
      expect(card.getByText(project.type)).toBeInTheDocument();
      expect(card.getByText(project.focus)).toBeInTheDocument();
      expect(card.getAllByText(new RegExp(project.format)).length).toBeGreaterThan(0);
      expect(item.querySelector('img')).toHaveAttribute('src', project.image);
    }
  });

  test('cards are real buttons that open a case-study dialog', () => {
    render(<Work />);
    for (const project of projects) {
      expect(cardButton(project)).toHaveAttribute('aria-haspopup', 'dialog');
    }
  });

  test('every project is honestly labelled with a project type', () => {
    for (const project of projects) {
      expect(['Personal', 'Spec', 'Collab', 'Practice']).toContain(project.type);
    }
  });

  test('ends the grid with a call to action for the next project', () => {
    render(<Work />);
    expect(screen.getByRole('link', { name: workCta.label })).toHaveAttribute('href', workCta.href);
  });

  test('does not render the TiltedCard mobile warning', () => {
    render(<Work />);
    expect(screen.queryByText(/not optimized for mobile/i)).not.toBeInTheDocument();
  });

  describe('format filter', () => {
    test('offers All plus one toggle per format derived from the projects', () => {
      render(<Work />);
      const group = screen.getByRole('group', { name: /filter projects by format/i });
      const buttons = within(group).getAllByRole('button');
      expect(buttons.map(b => b.textContent.replace(/\d+$/, ''))).toEqual(['All', ...categories]);
      expect(within(group).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
      for (const category of categories) {
        expect(within(group).getByRole('button', { name: category })).toHaveAttribute('aria-pressed', 'false');
      }
    });

    test('announces the result count in a live region', () => {
      render(<Work />);
      expect(screen.getByRole('status')).toHaveTextContent(`Showing all ${projects.length} projects`);
    });

    test.each(categories)('filtering by %s shows only matching projects', category => {
      render(<Work />);
      const group = screen.getByRole('group', { name: /filter projects by format/i });
      fireEvent.click(within(group).getByRole('button', { name: category }));

      const matching = projects.filter(p => p.category === category);
      expect(within(group).getByRole('button', { name: category })).toHaveAttribute('aria-pressed', 'true');
      expect(within(group).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
      expect(projectHeadings().map(h => h.textContent)).toEqual(matching.map(p => p.title));
      const noun = matching.length === 1 ? 'project' : 'projects';
      expect(screen.getByRole('status')).toHaveTextContent(`Showing ${matching.length} ${category} ${noun}`);

      fireEvent.click(within(group).getByRole('button', { name: 'All' }));
      expect(projectHeadings()).toHaveLength(projects.length);
    });
  });

  describe('case-study dialog', () => {
    const project = projects[0];

    test('opens a labelled modal dialog with the full story', () => {
      render(<Work />);
      const dialog = openProject(project);
      const d = within(dialog);

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(d.getByRole('heading', { level: 2, name: project.title })).toBeInTheDocument();
      for (const name of ['The goal', 'Raw material', 'What I did', 'What I learned', 'Next time', 'Tools']) {
        expect(d.getByRole('heading', { level: 3, name })).toBeInTheDocument();
      }
      expect(d.getByText(project.goal)).toBeInTheDocument();
      expect(d.getByText(project.footage)).toBeInTheDocument();
      expect(d.getByText(project.learned)).toBeInTheDocument();
      expect(d.getByText(project.next)).toBeInTheDocument();
      expect(d.getByText(project.runtime)).toBeInTheDocument();
      for (const step of project.approach) {
        expect(d.getByText(step.label)).toBeInTheDocument();
        expect(d.getByText(step.body)).toBeInTheDocument();
      }
      for (const tool of project.tools) expect(d.getByText(tool)).toBeInTheDocument();
      expect(d.getByRole('img', { name: new RegExp(project.title) })).toHaveAttribute('src', project.image);
    });

    test('locks page scroll and moves focus into the dialog', () => {
      render(<Work />);
      const dialog = openProject(project);
      expect(document.body.style.overflow).toBe('hidden');
      expect(within(dialog).getByRole('button', { name: 'Close case study' })).toHaveFocus();
    });

    test('Escape closes it, unlocks scroll and returns focus to the card', () => {
      render(<Work />);
      openProject(project);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('');
      expect(cardButton(project)).toHaveFocus();
    });

    test('the close button closes it', () => {
      render(<Work />);
      const dialog = openProject(project);
      fireEvent.click(within(dialog).getByRole('button', { name: 'Close case study' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(cardButton(project)).toHaveFocus();
    });

    test('clicking the backdrop closes it, clicking inside does not', () => {
      render(<Work />);
      const dialog = openProject(project);
      fireEvent.click(within(dialog).getByText(project.goal));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('project-dialog-backdrop'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('keeps Tab focus inside the dialog', () => {
      render(<Work />);
      const dialog = openProject(project);
      const close = within(dialog).getByRole('button', { name: 'Close case study' });
      const focusables = dialog.querySelectorAll('button, a[href], iframe');
      const last = focusables[focusables.length - 1];

      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(last).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(close).toHaveFocus();
    });

    test('browses to the next and previous case study within the current filter', () => {
      render(<Work />);
      const inCategory = c => projects.filter(p => p.category === c);
      const category = categories.find(c => inCategory(c).length >= 2);
      const matching = inCategory(category);
      fireEvent.click(screen.getByRole('button', { name: category }));
      openProject(matching[0]);

      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^next.*${matching[1].title}`, 'i') }));
      expect(screen.getByRole('dialog', { name: matching[1].title })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /^previous/i }));
      expect(screen.getByRole('dialog', { name: matching[0].title })).toBeInTheDocument();

      // Closing returns focus to the card of the project being viewed.
      fireEvent.click(screen.getByRole('button', { name: /^next/i }));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(cardButton(matching[1])).toHaveFocus();
    });

    test('plays an embed instead of the poster when the project has one', () => {
      const original = project.embed;
      project.embed = 'https://player.vimeo.com/video/76979871';
      try {
        render(<Work />);
        const dialog = openProject(project);
        expect(within(dialog).getByTitle(`${project.title} video`)).toHaveAttribute('src', project.embed);
      } finally {
        project.embed = original;
      }
    });
  });
});

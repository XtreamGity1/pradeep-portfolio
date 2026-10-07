import { render, screen, within } from '@testing-library/react';
import Work from '../Work';
import { projects } from '../../data';

describe('Work', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Work />);
    expect(container.querySelector('section#work')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /edits that\s*move the needle\./i })).toBeInTheDocument();
  });

  test('renders one card per project with image alt text and overlay info', () => {
    render(<Work />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(projects.length);

    projects.forEach((project, i) => {
      const card = within(items[i]);
      const img = card.getByRole('img', { name: project.title });
      expect(img).toHaveAttribute('src', project.image);
      expect(card.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument();
      expect(card.getByText(project.client)).toBeInTheDocument();
      expect(card.getByText(project.result)).toBeInTheDocument();
      // Format is visible in the overlay (tooltip is hover-only, hidden on touch).
      expect(card.getAllByText(project.format).length).toBeGreaterThan(0);
    });
  });

  test('does not render the TiltedCard mobile warning', () => {
    render(<Work />);
    expect(screen.queryByText(/not optimized for mobile/i)).not.toBeInTheDocument();
  });
});

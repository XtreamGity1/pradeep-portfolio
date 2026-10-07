import { render, screen, within } from '@testing-library/react';
import Services from '../Services';
import { services, tools } from '../../data';

describe('Services', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('section#services')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /what i\s*do best\./i })).toBeInTheDocument();
  });

  test('renders every service as a card named by its title', () => {
    render(<Services />);
    const list = screen.getByRole('list', { name: /^services$/i });
    const cards = within(list).getAllByRole('article');
    expect(cards).toHaveLength(services.length);
    services.forEach((service, i) => {
      expect(cards[i]).toHaveAccessibleName(service.title);
      const card = within(cards[i]);
      expect(card.getByText(service.tag)).toBeInTheDocument();
      expect(card.getByRole('heading', { level: 3, name: service.title })).toBeInTheDocument();
      expect(card.getByText(service.body)).toBeInTheDocument();
    });
  });

  test('each service lists its deliverables, turnaround and platforms', () => {
    render(<Services />);
    services.forEach((service) => {
      const card = within(screen.getByRole('article', { name: service.title }));

      const deliverables = card.getByRole('list', { name: /deliverables/i });
      expect(within(deliverables).getAllByRole('listitem').map((li) => li.textContent)).toEqual(
        service.deliverables,
      );

      expect(card.getByText(/turnaround/i)).toBeInTheDocument();
      expect(card.getByText(service.turnaround)).toBeInTheDocument();

      const platforms = card.getByRole('list', { name: /platforms/i });
      expect(within(platforms).getAllByRole('listitem').map((li) => li.textContent)).toEqual(
        service.platforms,
      );
    });
  });

  test('renders the toolkit with every tool', () => {
    render(<Services />);
    const list = screen.getByRole('list', { name: /toolkit/i });
    const items = within(list).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual(tools);
  });
});

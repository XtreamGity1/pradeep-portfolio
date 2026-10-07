import { render, screen, within } from '@testing-library/react';
import Services from '../Services';
import { services, tools } from '../../data';

describe('Services', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('section#services')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /what i\s*do best\./i })).toBeInTheDocument();
  });

  test('renders every service with tag, title and body', () => {
    render(<Services />);
    const list = screen.getByRole('list', { name: /services/i });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(services.length);
    services.forEach((service, i) => {
      const card = within(items[i]);
      expect(card.getByText(service.tag)).toBeInTheDocument();
      expect(card.getByRole('heading', { level: 3, name: service.title })).toBeInTheDocument();
      expect(card.getByText(service.body)).toBeInTheDocument();
    });
  });

  test('renders the toolkit with every tool', () => {
    render(<Services />);
    const list = screen.getByRole('list', { name: /toolkit/i });
    const items = within(list).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual(tools);
  });
});

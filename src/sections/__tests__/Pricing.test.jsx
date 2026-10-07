import { render, screen, within } from '@testing-library/react';
import Pricing from '../Pricing';
import { packages, testEdit } from '../../data';

const formatPrice = (amount) => `$${amount.toLocaleString('en-US')}`;

describe('Pricing', () => {
  test('renders the section anchor and heading', () => {
    const { container } = render(<Pricing />);
    expect(container.querySelector('section#pricing')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/pricing|rates|packages/i);
  });

  test('renders one card per package, named by its h3', () => {
    render(<Pricing />);
    const list = screen.getByRole('list', { name: /packages/i });
    const cards = within(list).getAllByRole('article');
    expect(cards).toHaveLength(packages.length);
    expect(packages.length).toBe(3);
    packages.forEach((pkg, i) => {
      expect(cards[i]).toHaveAccessibleName(pkg.name);
      expect(within(cards[i]).getByRole('heading', { level: 3, name: pkg.name })).toBeInTheDocument();
    });
  });

  test('each card shows audience, features, turnaround, revisions and a contact CTA', () => {
    render(<Pricing />);
    packages.forEach((pkg) => {
      const card = within(screen.getByRole('article', { name: pkg.name }));
      expect(card.getByText(pkg.audience)).toBeInTheDocument();

      const features = card.getByRole('list', { name: /included/i });
      expect(within(features).getAllByRole('listitem').map((li) => li.textContent)).toEqual(pkg.features);

      expect(card.getByText(pkg.turnaround)).toBeInTheDocument();
      expect(card.getByText(pkg.revisions)).toBeInTheDocument();

      expect(card.getByRole('link', { name: new RegExp(pkg.cta, 'i') })).toHaveAttribute('href', '#contact');
    });
  });

  test('prices read as a full phrase for screen readers', () => {
    render(<Pricing />);
    packages.forEach((pkg) => {
      const card = within(screen.getByRole('article', { name: pkg.name }));
      expect(card.getByText(`From ${formatPrice(pkg.price)} ${pkg.unit}`)).toBeInTheDocument();
    });
  });

  test('highlights exactly one recommended package with a text label', () => {
    render(<Pricing />);
    const featured = packages.filter((pkg) => pkg.badge);
    expect(featured).toHaveLength(1);
    const [pkg] = featured;
    const card = screen.getByRole('article', { name: pkg.name });
    expect(within(card).getByText(pkg.badge)).toBeVisible();
    // Only the featured card carries a badge.
    packages
      .filter((other) => other !== pkg)
      .forEach((other) => {
        expect(within(screen.getByRole('article', { name: other.name })).queryByText(pkg.badge)).toBeNull();
      });
  });

  test('offers the free test edit with a CTA to contact', () => {
    render(<Pricing />);
    const offer = screen.getByRole('region', { name: testEdit.title });
    expect(within(offer).getByText(testEdit.body)).toBeInTheDocument();
    expect(within(offer).getByRole('link', { name: new RegExp(testEdit.cta, 'i') })).toHaveAttribute(
      'href',
      '#contact',
    );
  });
});

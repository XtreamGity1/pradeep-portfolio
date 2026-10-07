import { render, screen } from '@testing-library/react';
import App from './App';
import { navItems, profile } from './data';

const SECTION_IDS = ['top', 'about', 'work', 'services', 'process', 'testimonials', 'contact'];

test('renders every section with its anchor id', () => {
  const { container } = render(<App />);
  for (const id of SECTION_IDS) {
    expect(container.querySelector(`#${id}`)).toBeInTheDocument();
  }
});

test('every nav link points at a section that exists', () => {
  const { container } = render(<App />);
  for (const { href } of navItems) {
    expect(container.querySelector(href)).toBeInTheDocument();
  }
});

test('page has a single h1 and a footer', () => {
  render(<App />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('contentinfo')).toHaveTextContent(profile.name);
});

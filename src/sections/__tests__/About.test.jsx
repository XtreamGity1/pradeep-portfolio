import { render, screen } from '@testing-library/react';
import About from '../About';
import { profile, stats } from '../../data';

describe('About', () => {
  test('is the #about anchor target with its heading', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section#about')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Editing is invisible\s*until it isn't\./ })).toBeInTheDocument();
    // The ScrollReveal paragraph must not show up as an extra heading.
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });

  test('renders the about copy and location', () => {
    render(<About />);
    expect(screen.getByText(profile.about)).toBeInTheDocument();
    expect(screen.getByText(profile.location)).toBeInTheDocument();
  });

  test('renders every stat with an accessible value and label', () => {
    render(<About />);
    for (const stat of stats) {
      expect(screen.getByText(stat.label)).toBeInTheDocument();
      const value = `${stat.value.toLocaleString('en-US', { useGrouping: !!stat.separator })}${stat.suffix}`;
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  });
});

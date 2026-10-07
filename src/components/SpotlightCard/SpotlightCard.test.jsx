import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SpotlightCard from './SpotlightCard';

const renderCard = (props) =>
  render(
    <SpotlightCard as="article" aria-label="Card" {...props}>
      <p>Content</p>
    </SpotlightCard>,
  );

const spotlight = () => screen.getByTestId('spotlight');

describe('SpotlightCard', () => {
  afterEach(() => vi.restoreAllMocks());

  test('renders as the requested element with its children', () => {
    renderCard();
    expect(screen.getByRole('article', { name: 'Card' })).toHaveTextContent('Content');
  });

  test('lights up under a mouse pointer and fades on leave', () => {
    renderCard();
    const card = screen.getByRole('article');
    expect(spotlight()).toHaveStyle({ opacity: '0' });

    fireEvent.pointerEnter(card, { pointerType: 'mouse' });
    fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: 40, clientY: 20 });
    expect(spotlight()).toHaveStyle({ opacity: '0.6' });

    fireEvent.pointerLeave(card, { pointerType: 'mouse' });
    expect(spotlight()).toHaveStyle({ opacity: '0' });
  });

  test('ignores touch and pen so touch devices keep the static design', () => {
    renderCard();
    const card = screen.getByRole('article');
    fireEvent.pointerEnter(card, { pointerType: 'touch' });
    fireEvent.pointerMove(card, { pointerType: 'touch', clientX: 40, clientY: 20 });
    expect(spotlight()).toHaveStyle({ opacity: '0' });
  });

  test('stays off when the user prefers reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));
    renderCard();
    const card = screen.getByRole('article');
    fireEvent.pointerEnter(card, { pointerType: 'mouse' });
    fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: 40, clientY: 20 });
    expect(spotlight()).toHaveStyle({ opacity: '0' });
  });
});

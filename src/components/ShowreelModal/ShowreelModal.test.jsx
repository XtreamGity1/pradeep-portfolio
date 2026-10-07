import { render, screen, within } from '@testing-library/react';
import ShowreelModal from './ShowreelModal';

const reel = {
  title: 'Test reel',
  duration: '0:30',
  description: 'A short test reel.',
  src: '/reel.mp4',
  poster: '/reel.jpg',
  embedUrl: '',
};

describe('ShowreelModal', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  test('renders nothing while closed', () => {
    render(<ShowreelModal open={false} reel={reel} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('plays a native video when there is no embed URL', () => {
    render(<ShowreelModal open reel={reel} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: reel.title });
    expect(dialog.querySelector('video')).toHaveAttribute('src', reel.src);
    expect(dialog.querySelector('iframe')).toBeNull();
  });

  test('prefers a titled YouTube/Vimeo iframe when an embed URL is set', () => {
    const embedUrl = 'https://player.vimeo.com/video/76979871';
    render(<ShowreelModal open reel={{ ...reel, embedUrl }} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: reel.title });
    const frame = within(dialog).getByTitle(reel.title);
    expect(frame.tagName).toBe('IFRAME');
    expect(frame).toHaveAttribute('src', embedUrl);
    expect(frame).toHaveAttribute('allow', expect.stringContaining('fullscreen'));
    expect(dialog.querySelector('video')).toBeNull();
  });

  test('shows the runtime alongside the title', () => {
    render(<ShowreelModal open reel={reel} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveTextContent(reel.duration);
  });
});

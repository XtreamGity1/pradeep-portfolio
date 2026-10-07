import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Pill } from '../../components/ui';
import { heroVideo, reelChapters } from '../../data';

// The reel chapter on screen when the background loop is `time` seconds in (undefined between chapters).
const chapterAt = time => {
  const reelTime = time + heroVideo.offset;
  return reelChapters.find(c => c.start <= reelTime && reelTime < c.end);
};

// Live badge naming the technique the hero's background video is showing. It owns its state, so
// following the playhead re-renders only this badge, not the hero. Without a video (reduced motion)
// it names the poster's chapter. Decorative: it mirrors the muted video.
export default function NowShowing({ videoRef, live, reducedMotion }) {
  const [chapter, setChapter] = useState(() => chapterAt(0));

  useEffect(() => {
    const video = videoRef.current;
    if (!live || !video) return;
    // Between chapters, keep the last one rather than flicker.
    const sync = () => setChapter(c => chapterAt(video.currentTime) ?? c);
    video.addEventListener('timeupdate', sync);
    return () => video.removeEventListener('timeupdate', sync);
  }, [videoRef, live]);

  return (
    <Pill aria-hidden="true" className="mb-8 border-accent/40 bg-ink/50 backdrop-blur-md">
      <span data-testid="hero-now-showing" className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        <span className="text-muted">Now showing ·</span>{' '}
        <motion.span
          key={chapter?.id}
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-semibold text-accent"
        >
          {chapter?.label}
        </motion.span>
      </span>
    </Pill>
  );
}

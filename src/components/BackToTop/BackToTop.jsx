import { AnimatePresence, motion } from 'motion/react';
import useScrolled from '../../hooks/useScrolled';
import { focusRing } from '../ui';

// Roughly past the hero on most screens.
const SHOW_AFTER = 600;

// Floating pill, fixed bottom-right. Mounts once the page is scrolled past SHOW_AFTER and unmounts
// near the top, so it is never a hidden tab stop. Sits under the menu overlay (z-40) and dialogs.
export default function BackToTop() {
  const show = useScrolled(SHOW_AFTER);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="back-to-top"
          href="#top"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`group fixed right-4 bottom-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-line/60 bg-ink/70 px-4 text-sm font-medium text-fg shadow-lg shadow-ink/40 backdrop-blur-md transition-colors duration-300 hover:border-fg/40 sm:right-6 sm:bottom-6 ${focusRing}`}
        >
          Back to top
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
            &uarr;
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import GooeyNav from '../components/GooeyNav/GooeyNav';
import { Eyebrow, focusRing } from '../components/ui';
import useScrolled from '../hooks/useScrolled';
import useMediaQuery from '../hooks/useMediaQuery';
import { navItems, profile } from '../data';

const MENU_ID = 'site-menu';
const DESKTOP_QUERY = '(min-width: 768px)';
const EASE = [0.22, 1, 0.36, 1];

const listVariants = {
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Hamburger lines: [closed, open] transforms. Three lines morph into an X.
const BURGER_LINES = [
  ['-translate-y-1.5', 'rotate-45'],
  ['', 'scale-x-0 opacity-0'],
  ['translate-y-1.5', '-rotate-45'],
];

// One mapped list of navItems, shared by the inline mobile bar and the overlay menu.
// `animated` enables the staggered entrance used by the overlay.
function NavLinks({ className = '', linkClassName = '', onNavigate, animated = false }) {
  const motionProps = animated ? { variants: listVariants, initial: 'hidden', animate: 'show', exit: 'hidden' } : {};
  return (
    <motion.ul className={className} {...motionProps}>
      {navItems.map(item => (
        <motion.li key={item.href} variants={animated ? itemVariants : undefined}>
          <a href={item.href} onClick={onNavigate} className={`${linkClassName} ${focusRing}`}>
            {item.label}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function MenuButton({ open, onToggle, buttonRef }) {
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls={MENU_ID}
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={`pointer-events-auto absolute top-2.5 right-4 grid size-11 place-items-center rounded-full border border-line/60 bg-ink/60 text-fg shadow-lg shadow-ink/40 backdrop-blur-md sm:right-6 md:hidden ${focusRing}`}
    >
      <span aria-hidden="true" className="relative block h-3.5 w-5">
        {BURGER_LINES.map(([closed, opened], i) => (
          <span
            key={i}
            className={`absolute top-1/2 left-0 h-0.5 w-full -mt-px rounded-full bg-current transition-all duration-300 ${open ? opened : closed}`}
          />
        ))}
      </span>
    </motion.button>
  );
}

function MenuOverlay({ dialogRef, onNavigate }) {
  return (
    <motion.div
      ref={dialogRef}
      id={MENU_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.1 } }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto bg-ink/80 px-6 py-24 backdrop-blur-xl md:hidden"
    >
      <Eyebrow tone="muted" className="mb-8">
        Menu
      </Eyebrow>
      <NavLinks
        animated
        onNavigate={onNavigate}
        className="flex flex-col gap-2"
        linkClassName="inline-block rounded-lg py-1 text-5xl font-semibold tracking-tight text-fg transition-colors hover:text-accent sm:text-6xl"
      />
      <Eyebrow tone="muted" className="mt-12">
        {profile.location}
      </Eyebrow>
    </motion.div>
  );
}

// Fixed, translucent top bar.
// - md+: logo + GooeyNav.
// - mobile at the top: slim bar with logo + inline links.
// - mobile after scrolling: the bar fades away into a floating hamburger that opens a full-screen menu.
// Only one link list is mounted per breakpoint so hidden duplicates never shadow the visible links.
export default function Navbar() {
  const scrolled = useScrolled(80);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const dialogRef = useRef(null);

  // Growing to md+ hides the overlay entirely, so derive "open" instead of syncing state.
  const open = menuOpen && !isDesktop;
  const collapsed = !isDesktop && (scrolled || open);
  const close = () => setMenuOpen(false);

  // While open: lock body scroll, focus the first link, close on Escape and keep Tab inside.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('a')?.focus();

    const onKeyDown = e => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = [buttonRef.current, ...dialogRef.current.querySelectorAll('a')].filter(Boolean);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 overflow-hidden border-b border-line/50 bg-ink/60 backdrop-blur-md transition-[background-color,border-color,backdrop-filter] duration-500 ${
          collapsed ? 'max-md:pointer-events-none max-md:border-transparent max-md:bg-transparent max-md:backdrop-blur-none' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:h-20">
          <a
            href="#top"
            className={`group flex min-w-0 shrink-0 items-center gap-3 rounded-full transition-[opacity,visibility,translate] duration-300 ${focusRing} ${
              collapsed ? 'max-md:invisible max-md:-translate-y-2 max-md:opacity-0' : ''
            }`}
          >
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-fg text-[0.7rem] font-bold tracking-tight text-ink transition-colors duration-300 group-hover:bg-accent md:size-9 md:rounded-xl md:text-xs"
            >
              {profile.initials}
            </span>
            <span className="sr-only text-base font-semibold tracking-tight sm:not-sr-only">{profile.name}</span>
          </a>

          {isDesktop ? (
            <div className="hidden text-sm font-medium md:block">
              <GooeyNav items={navItems} initialActiveIndex={0} />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="inline-links"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="md:hidden"
                >
                  <NavLinks
                    className="flex items-center gap-x-1 sm:gap-x-2"
                    linkClassName="block rounded-md px-1.5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg sm:px-2.5"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <AnimatePresence>
          {collapsed && <MenuButton open={open} onToggle={() => setMenuOpen(v => !v)} buttonRef={buttonRef} />}
        </AnimatePresence>
      </header>

      {/* Sibling of the header: its backdrop-filter would otherwise trap this fixed overlay. */}
      <AnimatePresence>{open && <MenuOverlay dialogRef={dialogRef} onNavigate={close} />}</AnimatePresence>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import GooeyNav from '../components/GooeyNav/GooeyNav';
import { Button, Eyebrow, focusRing } from '../components/ui';
import useScrolled from '../hooks/useScrolled';
import useMediaQuery from '../hooks/useMediaQuery';
import useScrollSpy from '../hooks/useScrollSpy';
import useScrollLock from '../hooks/useScrollLock';
import { navCta, navItems, profile } from '../data';

const MENU_ID = 'site-menu';
const DESKTOP_QUERY = '(min-width: 768px)';
const EASE = [0.22, 1, 0.36, 1];

const SPY_IDS = navItems.map(item => item.href.slice(1));
const COMPACT_ITEMS = navItems.filter(item => item.compact);
// On desktop the call-to-action button replaces the nav item it points at.
const DESKTOP_ITEMS = navItems.filter(item => item.href !== navCta.href);

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

// One mapped link list, shared by the inline mobile bar and the overlay menu. The link for the
// section in view gets aria-current="location". `animated` enables the overlay's staggered entrance.
function NavLinks({ items, activeHref, className = '', linkClassName = '', onNavigate, animated = false }) {
  const motionProps = animated ? { variants: listVariants, initial: 'hidden', animate: 'show', exit: 'hidden' } : {};
  return (
    <nav aria-label="Primary">
      <motion.ul className={className} {...motionProps}>
        {items.map(item => (
          <motion.li key={item.href} variants={animated ? itemVariants : undefined}>
            <a
              href={item.href}
              aria-current={item.href === activeHref ? 'location' : undefined}
              onClick={() => onNavigate?.(item)}
              className={`${linkClassName} ${focusRing}`}
            >
              {item.label}
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </nav>
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

function MenuOverlay({ dialogRef, activeHref, onNavigate }) {
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
      className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto overscroll-contain bg-ink/80 px-6 py-24 backdrop-blur-xl md:hidden"
    >
      <Eyebrow tone="muted" className="mb-8">
        Menu
      </Eyebrow>
      <NavLinks
        animated
        items={navItems}
        activeHref={activeHref}
        onNavigate={onNavigate}
        className="flex flex-col gap-2"
        linkClassName="inline-block rounded-lg py-1 text-4xl font-semibold tracking-tight text-fg transition-colors hover:text-accent aria-[current=location]:text-accent min-[400px]:text-5xl sm:text-6xl"
      />
      <Eyebrow tone="muted" className="mt-12">
        {profile.location}
      </Eyebrow>
    </motion.div>
  );
}

// Fixed, translucent top bar, preceded by a skip link.
// - md+: logo + GooeyNav + call-to-action.
// - mobile at the top: slim bar with logo + the compact inline links.
// - mobile after scrolling: the bar fades away into a floating hamburger that opens a full-screen menu.
// A scrollspy marks the link for the section in view on every layout.
// Only one link list is mounted per breakpoint so hidden duplicates never shadow the visible links.
export default function Navbar() {
  const scrolled = useScrolled(80);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [activeId, pin] = useScrollSpy(SPY_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const dialogRef = useRef(null);

  // Growing to md+ hides the overlay entirely, so derive "open" instead of syncing state.
  const open = menuOpen && !isDesktop;
  const collapsed = !isDesktop && (scrolled || open);
  const activeHref = activeId ? `#${activeId}` : null;
  // Mark a clicked link current straight away instead of flickering through the sections on the way.
  const navigate = item => pin(item.href.slice(1));
  const navigateFromMenu = item => {
    setMenuOpen(false);
    navigate(item);
  };

  useScrollLock(open);

  // While open: focus the first link, close on Escape and keep Tab inside.
  useEffect(() => {
    if (!open) return;
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
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className={`fixed top-3 left-4 z-60 -translate-y-[calc(100%+1rem)] rounded-full bg-fg px-5 py-3 text-sm font-semibold text-ink shadow-lg shadow-ink/40 transition-transform duration-300 focus:translate-y-0 ${focusRing}`}
      >
        Skip to content
      </a>
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
            {/* Initials only on phones and between md and lg, where the desktop nav needs the room. */}
            <span className="sr-only text-base font-semibold tracking-tight sm:not-sr-only md:max-lg:sr-only">
              {profile.name}
            </span>
          </a>

          {isDesktop ? (
            <div className="hidden items-center gap-2 md:flex lg:gap-4">
              <div className="text-sm font-medium">
                <GooeyNav
                  items={DESKTOP_ITEMS}
                  activeIndex={DESKTOP_ITEMS.findIndex(item => item.href === activeHref)}
                  onItemClick={navigate}
                  listClassName="gap-1 px-1 lg:gap-2"
                />
              </div>
              <Button
                href={navCta.href}
                aria-current={navCta.href === activeHref ? 'location' : undefined}
                onClick={() => navigate(navCta)}
                className="shrink-0 px-5 whitespace-nowrap aria-[current=location]:bg-accent"
              >
                {navCta.label}
              </Button>
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
                    items={COMPACT_ITEMS}
                    activeHref={activeHref}
                    onNavigate={navigate}
                    className="flex items-center gap-x-1 sm:gap-x-2"
                    linkClassName="block rounded-md px-1.5 py-3 text-sm font-medium text-muted decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-fg aria-[current=location]:text-fg aria-[current=location]:underline sm:px-2.5"
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
      <AnimatePresence>
        {open && <MenuOverlay dialogRef={dialogRef} activeHref={activeHref} onNavigate={navigateFromMenu} />}
      </AnimatePresence>
    </>
  );
}

import { useRef, useState } from 'react';
import Aurora from '../components/Aurora/Aurora';
import SplitText from '../components/SplitText/SplitText';
import RotatingText from '../components/RotatingText/RotatingText';
import BlurText from '../components/BlurText/BlurText';
import ShinyText from '../components/ShinyText/ShinyText';
import Magnet from '../components/Magnet/Magnet';
import ShowreelModal from '../components/ShowreelModal/ShowreelModal';
import { Button, Eyebrow, Pill, focusRing } from '../components/ui';
import useMediaQuery from '../hooks/useMediaQuery';
import { profile, showreel } from '../data';

const AURORA_COLORS = ['#8b5cf6', '#ff4d6d', '#ffb86b'];
// Fixed Aurora frame shown instead of the animation when motion is reduced.
const STILL_AURORA_TIME = 40;
const ROLE_TRANSITION = { type: 'spring', damping: 30, stiffness: 400 };

// The showreel button leads; these follow as secondary links.
const CTAS = [
  { label: 'View my work', href: '#work', variant: 'ghost' },
  { label: 'Get in touch', href: '#contact', variant: 'ghost' },
];
// Equal full-width buttons when stacked on phones; content-sized in a row from sm.
const CTA_CLASS = 'w-full justify-center sm:w-auto';
// Same pill + primary colors as <Button>; the play disc plus py-1 keeps the height equal to it.
const SHOWREEL_CLASS =
  'group inline-flex items-center gap-3 rounded-full border border-transparent bg-fg py-1 pr-6 pl-1 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-accent';

function PlayIcon() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-accent"
    >
      <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor">
        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
      </svg>
    </span>
  );
}

export default function Hero() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [reelOpen, setReelOpen] = useState(false);
  const reelButtonRef = useRef(null);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 md:pt-32"
    >
      {/* Decorative background: aurora + fade into the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-70">
          <Aurora
            colorStops={AURORA_COLORS}
            amplitude={1}
            blend={0.5}
            time={reducedMotion ? STILL_AURORA_TIME : undefined}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-ink/20 via-ink/40 to-ink" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <Pill className="mb-8 bg-ink/40 backdrop-blur-md">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <ShinyText
              text="Available for new projects"
              speed={3}
              color="#9a9aa6"
              shineColor="#f4f4f6"
              disabled={reducedMotion}
            />
          </span>
        </Pill>

        <SplitText
          text={profile.name}
          tag="h1"
          className="pb-2 text-5xl leading-none font-semibold tracking-tight text-fg sm:text-7xl md:text-8xl lg:text-9xl"
          delay={40}
          duration={1}
          rootMargin="0px"
          threshold={0}
        />

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-2xl font-medium tracking-tight text-fg sm:text-3xl md:text-4xl">
          <span className="font-serif font-normal italic text-muted">I edit</span>
          <RotatingText
            texts={profile.roles}
            mainClassName="overflow-hidden rounded-lg bg-accent px-3 py-0.5 text-ink sm:py-1"
            splitLevelClassName="overflow-hidden pb-1"
            staggerFrom="last"
            staggerDuration={0.025}
            rotationInterval={2200}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            // Reduced motion: roles swap in place instead of sliding.
            transition={reducedMotion ? { duration: 0 } : ROLE_TRANSITION}
          />
        </p>

        <BlurText
          text={profile.tagline}
          delay={60}
          animateBy="words"
          direction="bottom"
          className="mt-8 max-w-2xl justify-center text-base leading-relaxed text-muted sm:text-lg md:text-xl"
        />

        <div className="mt-10 flex w-full max-w-xs flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row">
          <Magnet padding={60} magnetStrength={4} disabled={reducedMotion}>
            <button
              ref={reelButtonRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={reelOpen}
              onClick={() => setReelOpen(true)}
              className={`${SHOWREEL_CLASS} ${focusRing} ${CTA_CLASS}`}
            >
              <PlayIcon />
              {showreel.cta}
              <span className="font-mono text-xs font-normal text-ink/60">{showreel.duration}</span>
            </button>
          </Magnet>
          {CTAS.map(cta => (
            <Magnet key={cta.href} padding={60} magnetStrength={4} disabled={reducedMotion}>
              <Button href={cta.href} variant={cta.variant} className={CTA_CLASS}>
                {cta.label}
              </Button>
            </Magnet>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className={`absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 [@media(max-height:44rem)]:hidden flex-col items-center gap-3 rounded-md text-muted transition-colors hover:text-fg ${focusRing}`}
      >
        <Eyebrow as="span" tone="muted">
          Scroll
        </Eyebrow>
        <span aria-hidden="true" className="h-8 w-px bg-linear-to-b from-current to-transparent motion-safe:animate-pulse" />
      </a>

      <ShowreelModal
        open={reelOpen}
        reel={showreel}
        onClose={() => setReelOpen(false)}
        returnFocusRef={reelButtonRef}
      />
    </section>
  );
}

import { useRef, useState } from 'react';
import SplitText from '../components/SplitText/SplitText';
import RotatingText from '../components/RotatingText/RotatingText';
import BlurText from '../components/BlurText/BlurText';
import Magnet from '../components/Magnet/Magnet';
import ShowreelModal from '../components/ShowreelModal/ShowreelModal';
import NowShowing from './hero/NowShowing';
import { Button, Eyebrow, focusRing } from '../components/ui';
import useMediaQuery from '../hooks/useMediaQuery';
import useFitsViewport from '../hooks/useFitsViewport';
import { heroVideo, profile, showreel } from '../data';

// Dimmed so the headline stays readable over bright footage. The footage has letterbox bars baked in
// (10% top and bottom, plus a caption in the bottom one); scaling to 125% pushes them out of frame so
// no hard black edge cuts through the scroll cue.
const HERO_MEDIA_CLASS = 'absolute inset-0 size-full scale-125 object-cover opacity-60';
const ROLE_TRANSITION = { type: 'spring', damping: 30, stiffness: 400 };

// The showreel button leads; these follow as secondary links.
const CTAS = [
  { label: 'View my work', href: '#work', variant: 'ghost' },
  { label: 'Get in touch', href: '#contact', variant: 'ghost' },
];
// Equal full-width buttons when stacked on phones; content-sized in a row from sm.
const CTA_CLASS = 'w-full justify-center sm:w-auto';
// Only the hovered button reacts (no padding), and gently enough that it can't cross the 16px gap.
const MAGNET = { padding: 0, magnetStrength: 8 };
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
  // Touch taps fire mousemove too, which would drag every stacked CTA at once — mouse/trackpad only.
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const magnetOff = reducedMotion || !finePointer;
  const [reelOpen, setReelOpen] = useState(false);
  const reelButtonRef = useRef(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  // When the hero outgrows the window (narrow or zoomed laptops), the bottom-pinned scroll cue would
  // sit below the fold, half cut off — hide it instead.
  const cueFits = useFitsViewport(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 md:pt-32"
    >
      {/* Decorative background: the reel on a muted loop (a still frame under reduced motion), faded into the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {reducedMotion ? (
          <img src={heroVideo.poster} alt="" className={HERO_MEDIA_CLASS} />
        ) : (
          <video
            src={heroVideo.src}
            poster={heroVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            ref={videoRef}
            className={HERO_MEDIA_CLASS}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/55 to-ink" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <NowShowing videoRef={videoRef} live={!reducedMotion} reducedMotion={reducedMotion} />

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
          <Magnet {...MAGNET} disabled={magnetOff}>
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
            <Magnet key={cta.href} {...MAGNET} disabled={magnetOff}>
              <Button href={cta.href} variant={cta.variant} className={CTA_CLASS}>
                {cta.label}
              </Button>
            </Magnet>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className={`absolute bottom-6 left-1/2 z-10 ${cueFits ? 'flex' : 'hidden'} -translate-x-1/2 [@media(max-height:44rem)]:hidden flex-col items-center gap-3 rounded-md text-muted transition-colors hover:text-fg ${focusRing}`}
      >
        <Eyebrow as="span" tone="muted">
          Scroll
        </Eyebrow>
        {/* A faint track with a highlight running down it into a chevron. */}
        <span aria-hidden="true" className="flex flex-col items-center gap-1">
          <span className="relative h-8 w-px overflow-hidden bg-current/20">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-transparent to-current motion-safe:animate-scroll-cue-line" />
          </span>
          <svg viewBox="0 0 12 8" fill="none" className="h-2 w-3 motion-safe:animate-scroll-cue-chevron">
            <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
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

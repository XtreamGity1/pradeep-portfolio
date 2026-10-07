import Aurora from '../components/Aurora/Aurora';
import SplitText from '../components/SplitText/SplitText';
import RotatingText from '../components/RotatingText/RotatingText';
import BlurText from '../components/BlurText/BlurText';
import ShinyText from '../components/ShinyText/ShinyText';
import Magnet from '../components/Magnet/Magnet';
import { Button, Eyebrow, Pill, focusRing } from '../components/ui';
import { profile } from '../data';

const AURORA_COLORS = ['#8b5cf6', '#ff4d6d', '#ffb86b'];

const CTAS = [
  { label: 'View my work', href: '#work', variant: 'primary' },
  { label: 'Get in touch', href: '#contact', variant: 'ghost' },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 md:pt-32"
    >
      {/* Decorative background: aurora + fade into the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-70">
          <Aurora colorStops={AURORA_COLORS} amplitude={1} blend={0.5} />
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
            <ShinyText text="Available for new projects" speed={3} color="#9a9aa6" shineColor="#f4f4f6" />
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
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          />
        </p>

        <BlurText
          text={profile.tagline}
          delay={60}
          animateBy="words"
          direction="bottom"
          className="mt-8 max-w-2xl justify-center text-base leading-relaxed text-muted sm:text-lg md:text-xl"
        />

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          {CTAS.map(cta => (
            <Magnet key={cta.href} padding={60} magnetStrength={4}>
              <Button href={cta.href} variant={cta.variant} className={focusRing}>
                {cta.label}
              </Button>
            </Magnet>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className={`absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 rounded-md text-muted transition-colors hover:text-fg ${focusRing}`}
      >
        <Eyebrow as="span" tone="muted">
          Scroll
        </Eyebrow>
        <span aria-hidden="true" className="h-8 w-px bg-linear-to-b from-current to-transparent motion-safe:animate-pulse" />
      </a>
    </section>
  );
}

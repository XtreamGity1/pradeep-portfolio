import BlurText from '../components/BlurText/BlurText';
import ClickSpark from '../components/ClickSpark/ClickSpark';
import Magnet from '../components/Magnet/Magnet';
import SplitText from '../components/SplitText/SplitText';
import { Button, ExternalLink, Eyebrow, Section } from '../components/ui';
import { profile } from '../data';

// Decorative blurred glows layered behind the content.
const glows = [
  'left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-accent/20 blur-[100px] sm:h-[28rem] sm:w-[28rem] md:h-[40rem] md:w-[40rem] md:blur-[120px]',
  'left-[60%] top-[30%] h-48 w-48 -translate-x-1/2 bg-accent-2/15 blur-[90px] sm:h-64 sm:w-64',
];

export default function Contact() {
  return (
    <Section id="contact" className="overflow-hidden border-t border-line">
      {glows.map((glow) => (
        <div key={glow} aria-hidden="true" className={`pointer-events-none absolute rounded-full ${glow}`} />
      ))}

      <ClickSpark sparkColor="#ff4d6d" sparkSize={10} sparkRadius={18} sparkCount={8} duration={450}>
        <div className="relative flex flex-col items-center py-4 text-center sm:py-8">
          <Eyebrow className="mb-6">Contact</Eyebrow>

          <SplitText
            tag="h2"
            text="Let’s make something people finish watching."
            splitType="words"
            delay={60}
            duration={1}
            textAlign="center"
            className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-fg sm:text-5xl md:text-6xl lg:text-7xl"
          />

          <BlurText
            text="Have footage sitting on a drive? Tell me about your project — I reply within 24 hours."
            delay={60}
            animateBy="words"
            direction="bottom"
            className="mt-6 max-w-xl justify-center text-base leading-relaxed text-muted sm:mt-8 md:text-lg"
          />

          <div className="mt-10 max-w-full sm:mt-12">
            <Magnet padding={80} magnetStrength={3} wrapperClassName="max-w-full">
              <Button
                href={`mailto:${profile.email}`}
                variant="primary"
                className="max-w-full py-4 break-all sm:px-8 sm:text-base"
              >
                {profile.email}
                <span aria-hidden="true">&rarr;</span>
              </Button>
            </Magnet>
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 sm:mt-12 sm:gap-x-8">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <ExternalLink
                  href={social.href}
                  className="inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 transition-colors duration-300 hover:text-fg hover:underline"
                >
                  {social.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </ClickSpark>
    </Section>
  );
}

import BlurText from '../components/BlurText/BlurText';
import ClickSpark from '../components/ClickSpark/ClickSpark';
import InquiryForm from '../components/InquiryForm/InquiryForm';
import Magnet from '../components/Magnet/Magnet';
import SplitText from '../components/SplitText/SplitText';
import { Button, ExternalLink, Eyebrow, Section } from '../components/ui';
import useMediaQuery from '../hooks/useMediaQuery';
import { sendInquiry } from '../lib/sendInquiry';
import { inquiry, profile } from '../data';

// Email inquiries straight to the inbox once a Web3Forms key is set; until then the form opens an email draft.
const sendDirect = inquiry.web3formsKey
  ? values => sendInquiry(values, { accessKey: inquiry.web3formsKey })
  : undefined;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const HEADLINE = 'Let’s make something people finish watching.';
const BLURB = 'Have footage sitting on a drive? Tell me about your project — I reply within 24 hours.';
const HEADLINE_CLASS =
  'max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-fg sm:text-5xl md:text-6xl lg:text-5xl xl:text-[3.5rem]';
const BLURB_CLASS = 'mt-6 max-w-xl text-base leading-relaxed text-muted sm:mt-8 md:text-lg';

// Decorative blurred glows layered behind the content.
const glows = [
  'left-1/2 top-1/2 size-72 -translate-1/2 bg-accent/20 blur-[100px] sm:size-112 md:size-160 md:blur-[120px]',
  'left-[20%] top-[20%] size-48 -translate-x-1/2 bg-accent-2/15 blur-[90px] sm:size-64',
];

export default function Contact() {
  // Skip the word-by-word reveals and magnetic pull when the visitor asks for less motion.
  const reduceMotion = useMediaQuery(REDUCED_MOTION);

  return (
    // overflow-clip (not hidden) clips the glows without breaking the sticky column.
    <Section id="contact" className="overflow-clip border-t border-line">
      {glows.map((glow) => (
        <div key={glow} aria-hidden="true" className={`pointer-events-none absolute rounded-full ${glow}`} />
      ))}

      <ClickSpark sparkColor="#ff4d6d" sparkSize={10} sparkRadius={18} sparkCount={8} duration={450}>
        {/* Stacked on phones and portrait tablets; pitch + form side by side from lg. */}
        <div className="relative grid gap-12 py-4 sm:py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex min-w-0 flex-col items-start lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="mb-6">Contact</Eyebrow>

            {reduceMotion ? (
              <h2 className={HEADLINE_CLASS}>{HEADLINE}</h2>
            ) : (
              <SplitText
                tag="h2"
                text={HEADLINE}
                splitType="words"
                delay={60}
                duration={1}
                textAlign="left"
                className={HEADLINE_CLASS}
              />
            )}

            {reduceMotion ? (
              <p className={BLURB_CLASS}>{BLURB}</p>
            ) : (
              <BlurText text={BLURB} delay={60} animateBy="words" direction="bottom" className={BLURB_CLASS} />
            )}

            <div className="mt-10 max-w-full">
              <Magnet padding={80} magnetStrength={3} disabled={reduceMotion} wrapperClassName="max-w-full">
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

            <ul aria-label="Social profiles" className="mt-8 flex flex-wrap gap-x-6 gap-y-1 sm:gap-x-8">
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

          <InquiryForm to={profile.email} recipient={profile.name.split(' ')[0]} send={sendDirect} />
        </div>
      </ClickSpark>
    </Section>
  );
}

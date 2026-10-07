// All portfolio content lives here — edit this file to personalize the site.

// Placeholder identity — replace name, initials, location and email with your own.
export const profile = {
  name: 'Alex Rivera',
  initials: 'AR',
  location: 'Based in Los Angeles · Editing remotely',
  email: 'hello@alexrivera.studio',
  roles: ['YouTube videos', 'Shorts', 'Reels', 'podcast clips', 'vlogs'],
  tagline:
    'Video editor for YouTube creators and short-form — turning raw footage into videos people want to finish.',
  about:
    'I cut for retention, not just rhythm. Every frame should earn its place — a hook in the first three seconds, pacing that respects the viewer, and sound that makes the story land. I’m early in my career and editing every day, so you get fresh eyes, fast replies and someone who obsesses over your video like it’s their own.',
  socials: [
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Vimeo', href: 'https://vimeo.com' },
  ],
};

// Hero showreel (modal player). Use `src` + `poster` for a self-hosted file, or set
// `embedUrl` to a YouTube/Vimeo embed link (e.g. 'https://player.vimeo.com/video/123')
// and it takes priority over the native player.
export const showreel = {
  cta: 'Watch my reel',
  title: '2026 showreel',
  duration: '1:12', // PLACEHOLDER: match your reel's runtime.
  description: 'A minute of my favourite cuts: personal projects, spec edits and re-edits, built around hooks and pacing.',
  // PLACEHOLDER: royalty-free sample clip + random poster. Swap in your own reel.
  src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  poster: 'https://picsum.photos/seed/showreel/1280/720',
  embedUrl: '',
};

export const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

// Scrolling rows under the hero: formats I cut for, and the skills that keep people watching.
export const marquee = [
  { label: 'Platforms & formats', items: ['YouTube', 'Shorts', 'Reels', 'TikTok', 'Podcasts', 'Vlogs'] },
  { label: 'Craft', items: ['Hooks', 'Pacing', 'Retention edits', 'Sound design', 'Color grading', 'Motion graphics'] },
];

// Practice numbers, not results claims. PLACEHOLDER values — replace with your real counts.
export const stats = [
  { value: 40, suffix: '+', label: 'Projects edited' },
  { value: 300, suffix: '+', label: 'Hours of footage cut' },
  { value: 6, suffix: '', label: 'Formats practiced' },
  { value: 8, suffix: '', label: 'Tools in the kit' },
];

// About section: portrait, "how I cut" principles and platform row.
export const aboutDetails = {
  // PLACEHOLDER photo — swap for your own (e.g. '/portrait.jpg' in /public) and keep the alt accurate.
  portrait: {
    src: 'https://picsum.photos/seed/editor-portrait/800/1000',
    alt: `Portrait of ${profile.name} at his editing desk`,
    width: 800,
    height: 1000,
  },
  principlesTitle: 'How I cut',
  platformsTitle: 'Platforms I edit for',
};

export const principles = [
  {
    title: 'Hook in three seconds',
    body: 'The first frame is a promise. I open on the payoff, the question or the tension — and try a few openings before I commit to one.',
  },
  {
    title: 'Cut for retention',
    body: 'I study retention graphs like game tape: where attention dips, what wins it back, what earns the next ten seconds. Every cut needs a reason.',
  },
  {
    title: 'Sound is half the picture',
    body: 'Clean dialogue, music that breathes, effects you feel more than hear. I’m obsessed with how much the audio carries a cut.',
  },
  {
    title: 'Captions for silent autoplay',
    body: 'Most feeds start muted, so captions are part of the edit for me — readable, on the beat and styled to match the video.',
  },
];

export const platforms = ['YouTube', 'TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn', 'Podcasts'];

// Swap `image` for your own thumbnails (drop files in /public and use '/my-thumb.jpg').
export const projects = [
  {
    title: 'The $1 vs $1,000 Road Trip',
    client: 'Travel creator · 2.1M subs',
    format: 'YouTube long-form',
    result: '8.4M views',
    image: 'https://picsum.photos/seed/roadtrip/900/600',
  },
  {
    title: 'Made in Oaxaca',
    client: 'Artisan coffee brand',
    format: 'Brand documentary',
    result: '+212% site traffic',
    image: 'https://picsum.photos/seed/oaxaca/900/600',
  },
  {
    title: '60-Second Science',
    client: 'EdTech startup',
    format: 'Short-form series',
    result: '40M views / 30 days',
    image: 'https://picsum.photos/seed/science/900/600',
  },
  {
    title: 'Founders Unfiltered',
    client: 'Weekly podcast',
    format: 'Video podcast + clips',
    result: '3× subscriber growth',
    image: 'https://picsum.photos/seed/podcast/900/600',
  },
  {
    title: 'Run the City',
    client: 'Athletic apparel',
    format: 'Product launch film',
    result: 'Sold out in 48h',
    image: 'https://picsum.photos/seed/runner/900/600',
  },
  {
    title: 'Kitchen Confidential',
    client: 'Food creator · 900K subs',
    format: 'YouTube + Reels',
    result: '62% avg. view duration',
    image: 'https://picsum.photos/seed/kitchen/900/600',
  },
];

// Before/after comparisons for the craft section — my own practice footage, raw vs. finished.
// `before`/`after` share a picsum seed so the slider compares the same frame.
// `overlay` (optional) decorates the finished side: 'captions' | 'reframe' | 'lowerThird'.
// PLACEHOLDER images: replace each `src` with your real raw and final frames (e.g. '/craft/grade-raw.jpg').
export const beforeAfter = {
  comparisons: [
    {
      id: 'color',
      label: 'Color grade',
      title: 'Flat log → finished grade',
      project: 'Personal project · Golden-hour street portrait',
      before: {
        label: 'Raw',
        src: 'https://picsum.photos/seed/craft-grade/1200/675?grayscale&blur=2', // placeholder
        alt: 'Ungraded camera footage: flat, washed-out and soft',
      },
      after: {
        label: 'Graded',
        src: 'https://picsum.photos/seed/craft-grade/1200/675', // placeholder
        alt: 'The same shot after color grading: rich contrast and natural color',
      },
      changed: 'Lifted the shadows, set a clean white balance and warmed the skin tones.',
      why: 'The subject now separates from the background, and the warmth carries the golden-hour mood the camera flattened out.',
    },
    {
      id: 'sound',
      label: 'Sound & captions',
      title: 'Silent frame → captioned hook',
      project: 'Practice edit · Talking-head explainer',
      before: {
        label: 'Raw',
        src: 'https://picsum.photos/seed/craft-voice/1200/675?grayscale&blur=2', // placeholder
        alt: 'Raw talking-head frame with no captions',
      },
      after: {
        label: 'Captioned',
        src: 'https://picsum.photos/seed/craft-voice/1200/675', // placeholder
        alt: 'The same frame mixed and graded, with bold burned-in captions',
      },
      overlay: { kind: 'captions', text: 'Nobody finishes a boring video', highlight: 'finishes' },
      changed: 'Cleaned room noise from the dialogue, ducked the music under the voice and added word-by-word captions.',
      why: 'Most feeds autoplay on mute, so the captions carry the hook on their own — and the key word pops so the eye lands on it first.',
    },
    {
      id: 'reframe',
      label: 'Reframe',
      title: '16:9 master → 9:16 vertical',
      project: 'Personal project · Weekend skate session',
      before: {
        label: 'Wide',
        src: 'https://picsum.photos/seed/craft-frame/1200/675?grayscale&blur=2', // placeholder
        alt: 'Original widescreen frame with the subject off-center',
      },
      after: {
        label: 'Vertical',
        src: 'https://picsum.photos/seed/craft-frame/1200/675', // placeholder
        alt: 'The same shot reframed to a 9:16 vertical crop for Shorts and Reels',
      },
      overlay: { kind: 'reframe' },
      changed: 'Tracked the subject through the shot and kept them inside the vertical safe zone.',
      why: 'Nothing important hides behind the app buttons or captions, so the clip feels native to the feed instead of a cropped afterthought.',
    },
    {
      id: 'motion',
      label: 'Motion graphics',
      title: 'Plain cut → story on screen',
      project: 'Personal project · Road-trip vlog',
      before: {
        label: 'Raw',
        src: 'https://picsum.photos/seed/craft-motion/1200/675?grayscale&blur=2', // placeholder
        alt: 'Plain travel shot with no on-screen graphics',
      },
      after: {
        label: 'Animated',
        src: 'https://picsum.photos/seed/craft-motion/1200/675', // placeholder
        alt: 'The same shot with an animated lower third and progress tracker',
      },
      overlay: { kind: 'lowerThird', title: 'Day 3 · Oaxaca', subtitle: '412 km to go' },
      changed: 'Added a lower third and a trip-progress tracker, animated to land on the music’s downbeat.',
      why: 'The graphics answer “where are we, and how far is left?” before the viewer has to wonder, so the story keeps moving.',
    },
  ],
  // "What goes into an edit" — shown as a timeline, in the order the viewer feels each layer.
  breakdown: [
    { step: 'Hook', time: '0:00', body: 'Open on the payoff. The first three seconds promise why it’s worth staying.' },
    { step: 'Pacing', time: '0:03', body: 'Cut the dead air, vary shot length and drop B-roll on every claim.' },
    { step: 'Sound', time: '0:15', body: 'Clean dialogue, music that drives the cut and SFX that sell each transition.' },
    { step: 'Color', time: '0:30', body: 'One consistent look so every shot feels like the same world.' },
    { step: 'Captions', time: '0:45', body: 'Readable on mute, timed to the voice and styled to match the video.' },
  ],
};

export const services = [
  {
    title: 'Long-form YouTube',
    body: 'Story-first edits with tight hooks, pattern interrupts and pacing that keeps viewers watching past the intro.',
    tag: '01',
    deliverables: ['Up to 20-min edit', '3 Shorts cut-downs', 'Thumbnail stills'],
    turnaround: '4 days',
    platforms: ['YouTube'],
  },
  {
    title: 'Shorts, Reels & TikTok',
    body: 'Vertical cuts built for the scroll — a hook in the first second, captions, punch-ins and a payoff before the swipe.',
    tag: '02',
    deliverables: ['Up to 60-sec verticals', 'Animated captions', 'Hook variations to test'],
    turnaround: '48 hours',
    platforms: ['TikTok', 'Reels', 'Shorts'],
  },
  {
    title: 'Podcast clips',
    body: 'Turn one recording into a week of posts: a clean multi-cam episode plus the moments worth clipping.',
    tag: '03',
    deliverables: ['Multi-cam episode edit', '5–8 highlight clips', 'Cleaned-up audio'],
    turnaround: '4 days',
    platforms: ['YouTube', 'Spotify', 'Reels'],
  },
  {
    title: 'Promo & social edits',
    body: 'Short promos for small businesses — product spots, event recaps and social posts that get to the point fast.',
    tag: '04',
    deliverables: ['15–60s promo edit', 'Vertical + square versions', 'Licensed music'],
    turnaround: '3–5 days',
    platforms: ['Instagram', 'Facebook', 'Web'],
  },
];

// Pricing packages, rendered as "From $<price> <unit>". `badge` marks the recommended plan.
// Placeholder rates — set your own before going live.
export const packages = [
  {
    name: 'Shorts',
    price: 40, // placeholder rate
    unit: 'per short',
    audience: 'For creators who want to post vertical clips consistently without living in the timeline.',
    features: ['Up to 60-second vertical edit', 'Hook-first opening and punch-ins', 'Animated captions', 'Music and sound effects'],
    turnaround: '48 hours',
    revisions: '1 revision round',
    cta: 'Order shorts',
  },
  {
    name: 'Long-form',
    price: 150, // placeholder rate
    unit: 'per video',
    audience: 'For YouTube channels that want a clean, well-paced edit on every upload.',
    features: [
      'Up to 20-minute edit',
      'Hook rework and pacing pass',
      'Captions, b-roll and simple graphics',
      'Color correction and audio cleanup',
      '3 thumbnail stills',
    ],
    turnaround: '4 days',
    revisions: '2 revision rounds',
    cta: 'Book a video edit',
  },
  {
    name: 'Creator bundle',
    price: 750, // placeholder rate
    unit: 'per month',
    badge: 'Best value',
    audience: 'For small channels posting weekly who want long-form and shorts handled in one place.',
    features: [
      '4 long-form edits a month',
      '8 shorts cut from those videos',
      'Priority slot in my edit queue',
      'Shared Frame.io review links',
      'A style guide so every upload feels consistent',
    ],
    turnaround: '3–4 days per video',
    revisions: '2 revision rounds per video',
    cta: 'Start a bundle',
  },
];

// Risk-free first step shown under the pricing cards.
export const testEdit = {
  title: 'Free 60-second test edit',
  body: 'New to working with me? Send a few minutes of raw footage and I’ll cut a 60-second test edit — free, no strings. Like the pacing? Then we talk packages.',
  cta: 'Claim your test edit',
};

export const process = [
  { step: 'Brief', body: 'We align on audience, goals, references and the one feeling the video should leave.' },
  { step: 'Rough cut', body: 'Story locked first. You get a structured cut within 72 hours of receiving footage.' },
  { step: 'Polish', body: 'Color, sound, graphics and captions — refined over two included revision rounds.' },
  { step: 'Deliver', body: 'Platform-ready exports, thumbnails-ready stills and a project file you own.' },
];

export const tools = [
  'Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Final Cut Pro',
  'Audition',
  'CapCut',
  'Descript',
  'Frame.io',
];

export const testimonials = [
  {
    quote:
      'Alex took our retention from 38% to 55% in two months. Our edits finally feel like the channel we always pictured.',
    name: 'Jordan Lee',
    role: 'Creator, 2.1M subscribers',
  },
  {
    quote:
      'Fast, communicative and genuinely creative. The brand film became our best-performing asset of the year.',
    name: 'Priya Nair',
    role: 'Head of Marketing, Ritual Coffee Co.',
  },
];

// Client names shown alongside testimonials.
export const clients = [];

export const faqs = [];

// Contact form: options and copy. Submitting opens a pre-filled email to profile.email.
export const inquiry = {
  title: 'Tell me about your video',
  intro: 'A few quick details and I’ll come back with ideas, a quote and a turnaround — usually the same day.',
  projectTypes: ['YouTube long-form', 'Shorts / Reels / TikTok', 'Podcast clips', 'Personal / event video', 'Other'],
  // Placeholder ranges — set these to your own rates.
  budgets: ['Under $100', '$100–300', '$300–750', '$750+', 'Not sure yet'],
  // Placeholder deadlines — match them to your real availability.
  timelines: ['This week', 'Within 2 weeks', 'Within a month', 'Ongoing — regular uploads', 'Flexible'],
  testEdit: {
    label: 'I’d like a free test edit first',
    hint: 'Send 2–3 minutes of footage and I’ll cut a sample, so you can see my pacing before you commit.',
  },
  submitLabel: 'Send project details',
  success: {
    title: 'Your email is ready to send.',
    body: 'Your email app should have opened with everything filled in — just hit send and I’ll reply within 24 hours. Can’t wait to see your footage.',
    retry: 'Open the email draft again',
    reset: 'Start a new inquiry',
  },
};

// Footer: availability line and quick links to sections.
export const footer = {
  availability: 'Taking on new clients',
  links: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
};

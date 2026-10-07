// All portfolio content lives here — edit this file to personalize the site.

export const profile = {
  name: 'Alex Rivera',
  initials: 'AR',
  location: 'Based in Los Angeles · Working worldwide',
  email: 'hello@alexrivera.studio',
  roles: ['YouTube videos', 'short-form', 'brand films', 'podcasts', 'documentaries'],
  tagline:
    'Content editor helping creators and brands turn raw footage into stories people actually finish watching.',
  about:
    'I cut for retention, not just rhythm. Every frame earns its place — hooks in the first three seconds, pacing that respects the viewer, and sound design that makes the story land. Six years, one obsession: keeping people watching.',
  socials: [
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Vimeo', href: 'https://vimeo.com' },
  ],
};

// Hero showreel (modal player).
export const showreel = {};

export const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const marquee = [
  'Long-form · Shorts · Reels · TikTok · Podcasts ·',
  'Color grading · Sound design · Motion graphics ·',
];

export const stats = [
  { value: 250, suffix: 'M+', label: 'Views generated' },
  { value: 1200, suffix: '+', label: 'Videos delivered', separator: ',' },
  { value: 60, suffix: '+', label: 'Creators & brands' },
  { value: 38, suffix: '%', label: 'Avg. retention lift' },
];

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
    body: 'Story-first edits with tight hooks, pattern interrupts, and pacing tuned to your retention graphs.',
    tag: '01',
  },
  {
    title: 'Short-form & Reels',
    body: 'Vertical cuts for TikTok, Reels and Shorts — captions, punch-ins, and loops built for the scroll.',
    tag: '02',
  },
  {
    title: 'Podcast & Repurposing',
    body: 'Multi-cam podcast edits plus a pipeline of clips that turn one recording into a month of content.',
    tag: '03',
  },
  {
    title: 'Brand & Commercial',
    body: 'Polished brand films, launch videos and ads with color grading, sound design and motion graphics.',
    tag: '04',
  },
];

// Pricing packages.
export const packages = [];

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

// Contact form options.
export const inquiry = {};

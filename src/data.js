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

// Before/after comparisons for the craft section.
export const beforeAfter = [];

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

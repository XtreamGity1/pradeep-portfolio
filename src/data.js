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

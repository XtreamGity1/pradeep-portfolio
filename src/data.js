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

// Before/after comparisons for the craft section.
export const beforeAfter = [];

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

// Contact form options.
export const inquiry = {};

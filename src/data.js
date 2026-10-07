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

// `duration` is the timing hint; `provide` is what the client hands over at that step.
export const process = [
  {
    step: 'Brief',
    duration: 'Day 1',
    body: 'We align on audience, goals, references and the one feeling the video should leave.',
    provide: 'Your channel or page link, 2–3 videos you love and the deadline.',
  },
  {
    step: 'Rough cut',
    duration: '72h',
    body: 'Story locked first. You get a structured cut within 72 hours of receiving footage.',
    provide: 'Raw footage via Drive or Dropbox, plus a script, outline or quick voice note.',
  },
  {
    step: 'Polish',
    duration: 'Up to 2 rounds',
    body: 'Color, sound, graphics and captions — refined over up to two included revision rounds.',
    provide: 'Timestamped notes on what to tighten, cut or keep.',
  },
  {
    step: 'Deliver',
    duration: 'Within a week',
    body: 'Platform-ready exports, thumbnails-ready stills and a project file you own.',
    provide: 'Your final OK — and where it is going live.',
  },
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

// PLACEHOLDER QUOTES — replace every entry with a real quote (and real name/role) before launch.
// Leave the array empty to hide the testimonials section entirely.
export const testimonials = [
  {
    // PLACEHOLDER — replace with a real quote.
    quote:
      'Alex re-cut my first ten videos and the difference was obvious — tighter intros, no dead air, and people actually stuck around to the end.',
    name: 'Sam Patel',
    role: 'Friend & small YouTube channel',
  },
  {
    // PLACEHOLDER — replace with a real quote.
    quote:
      'He edited our student short in a week and found a better ending in the footage than the one we had scripted.',
    name: 'Maya Chen',
    role: 'Director, film school short',
  },
  {
    // PLACEHOLDER — replace with a real quote.
    quote:
      'Quick replies, clear timelines and Reels that finally look like us. Easy to work with from the first message.',
    name: 'Luis Ortega',
    role: 'Owner, local café',
  },
];

// No client logos/names yet — kept for when there are real ones to show.
export const clients = [];

// Questions a creator or small business asks before hiring a newer editor.
export const faqs = [
  {
    question: 'Do you do a free test edit?',
    answer:
      'Yes — a free 60-second test edit, no strings. Send a few minutes of raw footage (or tick the test-edit box in the contact form) and judge the hook, pacing and style before you pay anything.',
  },
  {
    question: 'Why work with a newer editor?',
    answer:
      'You get someone with time, hunger and current short-form instincts, at a rate that reflects where I am now. Fewer clients means your project gets real attention and replies within a day.',
  },
  {
    question: 'How fast is turnaround?',
    answer:
      'Shorts and Reels come back within 48 hours. Long-form edits up to 20 minutes take about 4 days, with a first cut usually inside 72 hours. Bigger projects get a timeline agreed upfront — and I hit it.',
  },
  {
    question: 'How many revisions do I get?',
    answer:
      'Two rounds on long-form and bundle videos, one on Shorts. Leave timestamped notes in Frame.io or a Google Doc and I’ll work through every one. If something still isn’t right after that, we’ll sort it.',
  },
  {
    question: 'How do I send you footage?',
    answer:
      'Share a Google Drive, Dropbox or WeTransfer link with the original files — no need to compress. Add a script, outline or quick voice note on what matters most.',
  },
  {
    question: 'What software do you edit in?',
    answer:
      'Premiere Pro and After Effects for most edits, DaVinci Resolve for color and CapCut when a trend needs speed. Happy to match your workflow if you already have one.',
  },
  {
    question: 'Who owns the final video?',
    answer:
      'You do. Once it’s paid for, the exports and the project file are yours. I’ll only show it in my portfolio with your OK.',
  },
  {
    question: 'What about music and copyright?',
    answer:
      'I only use properly licensed music and sound effects (or tracks you already license), so uploads don’t get claimed, muted or demonetised.',
  },
];

// Contact form options.
export const inquiry = {};

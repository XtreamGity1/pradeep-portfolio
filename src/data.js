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

// Selected work (#work grid + case-study dialog). Honest, early-career projects.
// PLACEHOLDERS: every entry below is sample content — swap in your real projects, and replace
// `image` with your own thumbnails (drop files in /public and use '/my-thumb.jpg').
// - type:        'Personal' | 'Spec' | 'Collab' | 'Practice' — say exactly what it was.
// - category:    drives the format filter (one filter button per category, in order of appearance).
// - orientation: 'vertical' shows a tall 9:16 card; anything else is a landscape card.
// - embed:       optional YouTube/Vimeo embed URL, played in the case study instead of the poster.
// Order matters for a gap-free grid: landscape ×2, vertical, landscape ×3, vertical ×2 packs
// cleanly at 1, 2 and 3 columns (the "your footage could be next" card fills the last cell).
export const projects = [
  {
    // Placeholder — swap for a real project.
    title: 'Two Weeks in Lisbon',
    type: 'Personal',
    category: 'Long-form',
    format: 'Travel vlog',
    orientation: 'landscape',
    runtime: '9:42',
    focus: 'Story structure & pacing',
    image: 'https://picsum.photos/seed/lisbon/900/600',
    goal: 'Turn a pile of trip clips into a vlog with an actual arc — something a stranger would watch to the end, not just my family.',
    footage: 'About three hours of my own phone and mirrorless footage, shot with no plan and inconsistent audio.',
    approach: [
      { label: 'Hook', body: 'Opened on the funniest moment of the trip, then rewound to day one so the first 10 seconds make a promise.' },
      { label: 'Pacing', body: 'Cut every day down to one story beat and used quick montages to skip the travel-day filler.' },
      { label: 'Sound', body: 'Cleaned wind noise, laid ambience under the B-roll and cut montages to the beat of a royalty-free track.' },
      { label: 'Color', body: 'Matched phone and camera clips with a simple warm grade so it feels like one film.' },
    ],
    learned: 'Killing good shots is the job. The cut got better every time I removed a clip I liked but the story didn’t need.',
    next: 'Plan a loose shot list before filming, and record the voiceover earlier so the edit has a spine from day one.',
    tools: ['DaVinci Resolve', 'Audition'],
  },
  {
    // Placeholder — spec work: not commissioned by, or affiliated with, any brand.
    title: 'Chasing First Light',
    type: 'Spec',
    category: 'Spec ad',
    format: 'Spec ad · trail running shoes',
    orientation: 'landscape',
    runtime: '0:45',
    focus: 'Sound design & rhythm',
    image: 'https://picsum.photos/seed/trailrun/900/600',
    goal: 'Practise a commercial-style edit: one feeling (that pre-dawn rush) in 45 seconds, with no dialogue to lean on.',
    footage: 'Free stock running footage from Pexels, plus foley I recorded myself — footsteps, breathing, gravel.',
    approach: [
      { label: 'Hook', body: 'Started on black with just breathing and footsteps, so the first frame lands on the sunrise.' },
      { label: 'Pacing', body: 'Built the cut on a slow-to-fast tempo ramp, with speed ramps on the strides.' },
      { label: 'Sound', body: 'Layered my own foley under the music so every cut has a sound you feel.' },
      { label: 'Color', body: 'Pushed cool blues into the shadows and warm highlights to sell the dawn light.' },
    ],
    learned: 'Sound sells the picture. The same cut felt twice as fast once the foley hit on every edit.',
    next: 'Shoot a few of my own close-ups so the spot isn’t limited to whatever the stock libraries have.',
    tools: ['Premiere Pro', 'After Effects', 'Audition'],
  },
  {
    // Placeholder — swap for a real project.
    title: 'Why We Can’t Stop Scrolling',
    type: 'Practice',
    category: 'Short-form',
    format: 'Explainer Reel / Short',
    orientation: 'vertical',
    runtime: '0:58',
    focus: 'Hooks & captions',
    image: 'https://picsum.photos/seed/scrolling/600/1067',
    goal: 'Learn the short-form playbook by making one: a 60-second explainer that earns the next second, every second.',
    footage: 'A voiceover I wrote and recorded, public-domain archive clips and simple screen recordings.',
    approach: [
      { label: 'Hook', body: 'Wrote three opening lines, cut all three and kept the one that made friends stop scrolling.' },
      { label: 'Pacing', body: 'A visual change every 1–2 seconds: punch-ins, B-roll swaps and on-screen text.' },
      { label: 'Captions', body: 'Animated word-by-word captions, sized and placed to clear the platform UI.' },
      { label: 'Loop', body: 'Ended on a line that runs straight back into the opening for a seamless replay.' },
    ],
    learned: 'Captions are part of the edit, not an afterthought — their timing changes how the whole thing reads.',
    next: 'Post a short series and compare retention graphs to see which hooks actually hold.',
    tools: ['Premiere Pro', 'CapCut'],
  },
  {
    // Placeholder — swap for a real project.
    title: 'Late Night Chats, Ep. 3',
    type: 'Collab',
    category: 'Podcast',
    format: 'Video podcast · two-camera',
    orientation: 'landscape',
    runtime: '38:15',
    focus: 'Multicam & dialogue cleanup',
    image: 'https://picsum.photos/seed/latenight/900/600',
    goal: 'Help a friend’s new podcast look and sound like a real show on YouTube, not a recorded video call.',
    footage: 'Two cameras, two lav mics and a 52-minute conversation recorded in a living room.',
    approach: [
      { label: 'Multicam', body: 'Synced both angles and switched on whoever is speaking, with wide shots for reactions.' },
      { label: 'Pacing', body: 'Trimmed 14 minutes of false starts and tangents without losing the natural flow.' },
      { label: 'Sound', body: 'Removed room echo and hum, and balanced two very different voices.' },
      { label: 'Graphics', body: 'Simple lower thirds and chapter titles so viewers can jump to topics.' },
    ],
    learned: 'Good podcast editing is mostly invisible: tight, but never so tight that the conversation stops breathing.',
    next: 'Build a reusable template — intro, lower thirds, end screen — so each new episode is faster to turn around.',
    tools: ['DaVinci Resolve', 'Descript'],
  },
  {
    // Placeholder — swap for a real project.
    title: 'Last Train Home',
    type: 'Collab',
    category: 'Short film',
    format: 'Student short film',
    orientation: 'landscape',
    runtime: '7:30',
    focus: 'Color & mood',
    image: 'https://picsum.photos/seed/lasttrain/900/600',
    goal: 'Edit and grade a friend’s student film about a missed connection, and make the quiet moments carry it.',
    footage: 'Two shoot days of scripted scenes, several takes per shot and a temp score from the director.',
    approach: [
      { label: 'Story', body: 'Picked performances take by take and moved one scene earlier to set up the ending.' },
      { label: 'Pacing', body: 'Let silences run long on purpose, so the final moment lands harder.' },
      { label: 'Color', body: 'Graded a cold, sodium-lit night look, warming up only in the last shot.' },
      { label: 'Sound', body: 'Built station ambience and train rumble to cover gaps in the location audio.' },
    ],
    learned: 'Working with a director taught me to defend a choice with reasons — and to let it go when theirs is better.',
    next: 'Get involved before the shoot to flag coverage the edit will need.',
    tools: ['Premiere Pro', 'DaVinci Resolve'],
  },
  {
    // Placeholder — swap for a real project.
    title: 'One Pan, Three Ways',
    type: 'Personal',
    category: 'Long-form',
    format: 'Cooking video',
    orientation: 'landscape',
    runtime: '6:05',
    focus: 'B-roll & J-cuts',
    image: 'https://picsum.photos/seed/onepan/900/600',
    goal: 'Make a recipe video that moves as fast as the good cooking channels without skipping the steps people need.',
    footage: 'My own kitchen: a locked-off top shot, a handheld second angle and a lot of sizzling close-ups.',
    approach: [
      { label: 'Hook', body: 'Showed all three finished dishes first, then cooked them.' },
      { label: 'Pacing', body: 'J-cuts and L-cuts carry the voiceover across steps instead of hard stops.' },
      { label: 'Sound', body: 'Boosted the sizzles and chops — the kitchen sounds do half the work.' },
      { label: 'Graphics', body: 'Clean ingredient call-outs that stay on screen just long enough to read.' },
    ],
    learned: 'B-roll is a pacing tool: cutting away at the right moment hides a jump and keeps the energy up.',
    next: 'Cut a vertical version from the same project to see how far one shoot can stretch.',
    tools: ['Final Cut Pro'],
  },
  {
    // Placeholder — re-edit of public-domain footage; swap for a real project.
    title: 'Silent Film, Modern Cut',
    type: 'Practice',
    category: 'Short-form',
    format: 'Public-domain re-edit · Short',
    orientation: 'vertical',
    runtime: '0:45',
    focus: 'Sound design on silent footage',
    image: 'https://picsum.photos/seed/silentfilm/600/1067',
    goal: 'Re-edit a public-domain 1920s silent comedy chase into a vertical short that plays in today’s feeds.',
    footage: 'A public-domain silent film scan: 4:3, no sound and plenty of film grain.',
    approach: [
      { label: 'Reframe', body: 'Reframed 4:3 shots to 9:16, keyframing the crop to follow the action.' },
      { label: 'Pacing', body: 'Cut a three-minute chase down to 45 seconds of the best gags.' },
      { label: 'Sound', body: 'Designed every sound from scratch — footsteps, crashes, whooshes — under a modern score.' },
      { label: 'Captions', body: 'Swapped the title cards for punchy on-screen text.' },
    ],
    learned: 'Adding sound to silent footage showed me how much comic timing lives in the audio, not the picture.',
    next: 'Try the same exercise with a dialogue scene to practise re-cutting performances.',
    tools: ['Premiere Pro', 'Audition'],
  },
  {
    // Placeholder — swap for a real project.
    title: 'Late Night Chats: Clips',
    type: 'Collab',
    category: 'Podcast',
    format: 'Podcast clips · Shorts & Reels',
    orientation: 'vertical',
    runtime: '6 × 0:40',
    focus: 'Clip selection & captions',
    image: 'https://picsum.photos/seed/podclips/600/1067',
    goal: 'Turn the long episode into vertical clips that work for someone who has never heard of the show.',
    footage: 'The finished 38-minute episode and both original camera angles.',
    approach: [
      { label: 'Selection', body: 'Pulled the six moments that make sense with zero context.' },
      { label: 'Hook', body: 'Started each clip on the punchline or the hot take, then let it play out.' },
      { label: 'Reframe', body: 'Stacked both speakers in 9:16 so reactions stay on screen.' },
      { label: 'Captions', body: 'Bold, word-by-word captions with key words highlighted in colour.' },
    ],
    learned: 'The best clip is rarely the best moment of the episode — it’s the one that stands on its own.',
    next: 'Test two hooks per clip and keep notes on which openings hold attention.',
    tools: ['Descript', 'CapCut'],
  },
];

// Last cell of the work grid: invites the next collaboration.
export const workCta = {
  title: 'Your footage could be next.',
  body: 'I’m taking on my first client projects — creators, podcasts and small teams. Send raw footage and a goal.',
  label: 'Start a project',
  href: '#contact',
};

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

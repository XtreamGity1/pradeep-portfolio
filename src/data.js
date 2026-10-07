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

// Header links, in page order. `compact` items also fit the slim mobile bar at the top of the
// page; the scrolled mobile menu and the desktop nav show them all.
export const navItems = [
  { label: 'Work', href: '#work', compact: true },
  { label: 'Before & After', href: '#craft' },
  { label: 'Services', href: '#services', compact: true },
  { label: 'Pricing', href: '#pricing', compact: true },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact', compact: true },
];

// Desktop header call-to-action; it stands in for the nav item with the same href.
export const navCta = { label: "Let's talk", href: '#contact' };

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

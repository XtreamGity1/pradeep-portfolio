// All portfolio content lives here — edit this file to personalize the site.

// Identity.
export const profile = {
  name: 'Pradeep Vangoori',
  initials: 'PV',
  location: 'Based in Nalgonda, Telangana · Editing remotely',
  email: 'hello.pradeepvideo@gmail.com',
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
  duration: '0:42',
  description: 'My favourite cuts in under a minute: colour grading, pacing and sound.',
  // Web encode of media-src/Hero.MP4 (1080p H.264 + AAC). Or set `embedUrl` to a YouTube/Vimeo embed.
  src: '/media/hero-reel.mp4',
  poster: '/media/hero-poster.jpg',
  embedUrl: '',
};

// Muted background loop behind the hero: the reel's footage from 0:07.5 to 0:37.5, skipping the
// title and end cards (720p, no audio, ~4.5 MB). The poster (its first frame) shows while it
// loads, and instead of it when the viewer prefers reduced motion.
export const heroVideo = {
  src: '/media/hero-loop.mp4',
  poster: '/media/hero-poster.jpg',
  offset: 7.5, // seconds into the full reel where the loop starts
};

// The reel, segment by segment, labelled with the technique each one shows (the same labels the
// reel prints in its bottom-right corner). Times are seconds in the full reel. Drives the hero's
// live "now showing" label and the clip each Work card plays.
export const reelChapters = [
  { id: 'text-in-background', label: 'Text in background', start: 7.27, end: 9.43 },
  { id: 'colour-grading', label: 'Colour grading', start: 9.43, end: 13.73 },
  { id: 'time-remapping', label: 'Time remapping', start: 13.73, end: 17.07 },
  { id: 'masking', label: 'Masking', start: 17.07, end: 19.1 },
  { id: 'motion-tracking', label: 'Motion tracking', start: 19.1, end: 22 },
  { id: 'sky-replacement', label: 'Sky replacement', start: 22, end: 25 },
  { id: 'greenscreen-removal', label: 'Greenscreen removal', start: 25, end: 27.97 },
  { id: 'sound-design', label: 'Sound design', start: 27.97, end: 31.43 },
  { id: 'short-form', label: 'Short-form', start: 31.47, end: 34.93 },
  { id: 'long-form', label: 'Long-form', start: 34.93, end: 36.87 },
];

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

// About section: a still from the reel, "how I cut" principles and platform row.
export const aboutDetails = {
  // Still from the reel's long-form segment (media-src/Hero.MP4 at 0:36.9, letterbox cropped).
  // `position` keeps her face in frame when the 20:9 still is cropped to portrait.
  image: {
    src: '/media/reel/about-podcast.jpg',
    alt: 'A podcast host in headphones smiling at a red microphone in a sound-treated studio',
    width: 1920,
    height: 864,
    position: 'object-[40%_50%]',
    caption: 'From my 2026 showreel · Podcast',
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

// Edits that move the needle (#work): one card per technique in the 2026 showreel. Each card's
// clip is its segment of the reel (matched by `id` in `reelChapters`), so everything shown here
// is Pradeep's own footage. `group` drives the filter; `image` is a still from that segment.
export const edits = [
  {
    id: 'colour-grading',
    title: 'Colour grading',
    group: 'Colour & look',
    image: '/media/reel/edit-colour-grading.jpg',
    summary: 'Flat log footage to a finished look',
    shows: 'Two shots — a river boat in morning haze and a portrait among flowers — start flat and grey, then a wipe reveals the finished grade.',
    how: [
      { label: 'Balance', body: 'Set exposure and white balance first so every shot starts from neutral.' },
      { label: 'Shape', body: 'Build contrast and separate the subject from the background.' },
      { label: 'Style', body: 'Push the palette — teal water, warm skin, saturated pinks — into one deliberate look.' },
    ],
    why: 'A consistent grade makes footage from any camera feel intentional and premium.',
  },
  {
    id: 'sky-replacement',
    title: 'Sky replacement',
    group: 'Colour & look',
    image: '/media/reel/edit-sky-replacement.jpg',
    summary: 'An empty sky turned into a dramatic one',
    shows: 'A runway with gliders under a flat, cloudless sky, wiped over to the same shot under a sky full of clouds.',
    how: [
      { label: 'Isolate', body: 'Mask the sky away from the hills and treeline.' },
      { label: 'Replace', body: 'Drop in the new sky behind the landscape.' },
      { label: 'Match', body: 'Blend the edges and match light and colour so the two plates read as one shot.' },
    ],
    why: 'Rescues footage shot on a dull day and sets the mood without a reshoot.',
  },
  {
    id: 'greenscreen-removal',
    title: 'Greenscreen removal',
    group: 'Compositing',
    image: '/media/reel/edit-greenscreen-removal.jpg',
    summary: 'A green screen turned into a news studio',
    shows: 'A presenter filmed against a green screen, composited into an animated “NEWS flash” studio set.',
    how: [
      { label: 'Key', body: 'Remove the green while keeping hair and edges clean.' },
      { label: 'Clean up', body: 'Suppress green spill on the presenter.' },
      { label: 'Composite', body: 'Build and animate the set behind her.' },
    ],
    why: 'Gives creators a studio-quality backdrop from a simple green-screen setup.',
  },
  {
    id: 'masking',
    title: 'Masking',
    group: 'Compositing',
    image: '/media/reel/edit-masking.jpg',
    summary: 'A logo revealed in the truck’s dust',
    shows: 'A pickup drifts past a cone and a “TOYOTA” logo appears in the dust cloud it leaves behind.',
    how: [
      { label: 'Mask', body: 'Animate a mask that follows the truck through the shot.' },
      { label: 'Reveal', body: 'Let the logo appear only where the truck has already passed.' },
    ],
    why: 'Product reveals and transitions that feel built into the footage, not pasted on top.',
  },
  {
    id: 'text-in-background',
    title: 'Text in background',
    group: 'Compositing',
    image: '/media/reel/edit-text-in-background.jpg',
    summary: 'A title tucked behind a moving subject',
    shows: 'A hiker walks along a ridge in front of a large “SOLO HIKER” title that sits behind her.',
    how: [
      { label: 'Rotoscope', body: 'Cut the hiker out frame by frame as she moves.' },
      { label: 'Layer', body: 'Place the title between the landscape and the hiker.' },
    ],
    why: 'Big, bold titles that never cover the subject — a strong opener for travel and vlog intros.',
  },
  {
    id: 'motion-tracking',
    title: 'Motion tracking',
    group: 'Compositing',
    image: '/media/reel/edit-motion-tracking.jpg',
    summary: 'Text locked to a moving aerial shot',
    shows: '“FERTILE GROUND” lettering sits on a rice field and stays pinned to it as the drone moves overhead.',
    how: [
      { label: 'Track', body: 'Track the field’s surface through the camera move.' },
      { label: 'Attach', body: 'Pin the lettering to that track so it moves with the ground.' },
    ],
    why: 'Titles that live inside the world of the shot instead of floating over it.',
  },
  {
    id: 'time-remapping',
    title: 'Time remapping',
    group: 'Motion & sound',
    image: '/media/reel/edit-time-remapping.jpg',
    summary: 'Speed ramps through a race corner',
    shows: 'A superbike leans hard through a track corner, with the speed ramped through the turn.',
    how: [
      { label: 'Ramp', body: 'Keyframe the clip’s speed so it slows into the key moment and speeds out.' },
      { label: 'Smooth', body: 'Ease the ramps so the motion stays fluid.' },
    ],
    why: 'Puts emphasis on the moment that matters and lets the action hit the beat.',
  },
  {
    id: 'sound-design',
    title: 'Sound design',
    group: 'Motion & sound',
    image: '/media/reel/edit-sound-design.jpg',
    summary: 'A reef dive built around its sound',
    shows: 'A diver waves to the camera as a striped reef fish swims past — turn the sound up for this one.',
    how: [
      { label: 'Layer', body: 'Build an underwater bed of ambience and effects.' },
      { label: 'Sync', body: 'Time sounds to the movement on screen.' },
    ],
    why: 'Sound carries most of a scene’s feel; good design makes viewers feel they’re there.',
  },
];

// Last cell of the work grid: invites the next collaboration.
export const workCta = {
  title: 'Your footage could be next.',
  body: 'I’m taking on my first client projects — creators, podcasts and small teams. Send raw footage and a goal.',
  label: 'Start a project',
  href: '#contact',
};

// Before/after pairs pulled from the reel: the same footage before and after each edit
// (stills from media-src/Hero.MP4, letterbox cropped, 1600×720).
export const beforeAfter = {
  comparisons: [
    {
      id: 'grade-portrait',
      label: 'Colour grade',
      title: 'Flat log → finished grade',
      project: 'From my 2026 showreel · Portrait',
      before: { label: 'Log', src: '/media/reel/ba-portrait-before.jpg', alt: 'Ungraded log footage of a woman with flowers in her hair: grey and low contrast' },
      after: { label: 'Graded', src: '/media/reel/ba-portrait-after.jpg', alt: 'The same shot graded: warm skin, rich pinks and deep greens' },
      changed: 'Balanced the exposure, lifted the contrast and warmed the skin tones, then pushed the pinks and greens.',
      why: 'The subject now pops from the background and the frame has a mood instead of a camera default.',
    },
    {
      id: 'sky',
      label: 'Sky replacement',
      title: 'Empty sky → dramatic clouds',
      project: 'From my 2026 showreel · Airfield',
      before: { label: 'Original', src: '/media/reel/ba-sky-before.jpg', alt: 'Gliders on a runway under a flat, cloudless sky' },
      after: { label: 'Replaced', src: '/media/reel/ba-sky-after.jpg', alt: 'The same runway under a deep blue sky full of white clouds' },
      changed: 'Masked out the flat sky and composited a cloudscape behind the hills, matched to the scene’s light.',
      why: 'Same shot, different story: a quiet airfield becomes a bright, cinematic day.',
    },
    {
      id: 'greenscreen',
      label: 'Greenscreen',
      title: 'Green screen → news studio',
      project: 'From my 2026 showreel · Presenter',
      before: { label: 'Green screen', src: '/media/reel/ba-greenscreen-before.jpg', alt: 'A presenter holding a microphone in front of a green screen' },
      after: { label: 'Composite', src: '/media/reel/ba-greenscreen-after.jpg', alt: 'The same presenter in front of an animated NEWS flash studio set' },
      changed: 'Keyed out the green, cleaned the edges and spill, and built an animated news set behind her.',
      why: 'A plain green-screen recording becomes a broadcast-style segment.',
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

// "What you can count on": commitments in place of testimonials until there are real client quotes.
// Each one restates a promise made elsewhere on the page (test edit, FAQ, process), so keep them in sync.
export const promises = [
  {
    title: 'Try before you pay',
    body: 'A free 60-second test edit from your own footage, so you judge the hook, pacing and style first.',
  },
  {
    title: 'Fast, predictable turnaround',
    body: 'Shorts back within 48 hours; a long-form first cut inside 72. Bigger projects get a date we agree upfront.',
  },
  {
    title: 'Replies within a day',
    body: 'A small client list means your project gets real attention and your messages never sit for long.',
  },
  {
    title: 'Yours, and safe to upload',
    body: 'You own the exports and the project file, and every track and effect is properly licensed.',
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

// Contact form: options and copy. With a Web3Forms access key the form emails profile.email directly
// (free, 250 a month); without one it opens a pre-filled draft in the visitor's email app instead.
export const inquiry = {
  // Get a free key at https://web3forms.com (enter profile.email; the key arrives in that inbox).
  // It is safe to publish: it can only send to that inbox.
  web3formsKey: '',
  title: 'Tell me about your video',
  intro: 'A few quick details and I’ll come back with ideas, a quote and a turnaround — usually the same day.',
  projectTypes: ['YouTube long-form', 'Shorts / Reels / TikTok', 'Podcast clips', 'Personal / event video', 'Other'],
  // Placeholder ranges — set these to your own rates.
  budgets: ['Under $100', '$100–300', '$300–750', '$750+', 'Not sure yet'],
  // Placeholder deadlines — match them to your real availability.
  timelines: ['This week', 'Within 2 weeks', 'Within a month', 'Ongoing — regular uploads', 'Flexible'],
  // Budget, timeline and footage link sit behind this toggle to keep the form short.
  detailsLabel: 'Add budget, timeline or a footage link',
  testEdit: { label: 'I’d like a free test edit first' },
  submitLabel: 'Send project details',
  sendingLabel: 'Sending…',
  // Sent straight to the inbox.
  sent: {
    title: 'Message sent — thank you!',
    body: 'It’s in my inbox. I’ll reply to your email within 24 hours — can’t wait to see your footage.',
  },
  failed: {
    message: 'That didn’t go through — check your connection and try again, or',
    fallback: 'send it from your email app',
  },
  // Fallback (no access key): the visitor's email app opens a draft.
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

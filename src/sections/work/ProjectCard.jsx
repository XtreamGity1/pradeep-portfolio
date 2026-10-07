import TiltedCard from '../../components/TiltedCard/TiltedCard';
import { Pill } from '../../components/ui';

// Fills its grid cell: the grid sets the height (one row for landscape, two for vertical).
const tiltSize = {
  containerHeight: '100%',
  containerWidth: '100%',
  imageHeight: '100%',
  imageWidth: '100%',
  showMobileWarning: false,
  displayOverlayContent: true,
};

// Always-visible info overlay (no hover needed, so it works on touch devices).
// The title button stretches over the whole card, so the card itself is the click/tap target.
function ProjectOverlay({ project, onOpen, buttonRef }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between rounded-[15px] bg-linear-to-b from-ink/40 via-ink/10 to-ink/95 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <Pill tone="glass">{project.type}</Pill>
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-fg/15 bg-ink/50 text-fg backdrop-blur-sm"
        >
          ↗
        </span>
      </div>
      <div>
        <h3 className="text-lg leading-tight font-semibold text-fg">
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="dialog"
            onClick={onOpen}
            className="text-left after:absolute after:inset-0 after:rounded-[15px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-1 text-sm text-fg/75">
          {project.format} · {project.runtime}
        </p>
        <Pill tone="accent" className="mt-3 bg-ink/60">
          {project.focus}
        </Pill>
      </div>
    </div>
  );
}

// Project thumbnail card. `tilt` is off for touch and reduced-motion users.
export default function ProjectCard({ project, tilt, onOpen, buttonRef }) {
  return (
    <TiltedCard
      {...tiltSize}
      imageSrc={project.image}
      altText=""
      captionText={project.format}
      showTooltip={tilt}
      rotateAmplitude={tilt ? 8 : 0}
      scaleOnHover={tilt ? 1.04 : 1}
      overlayContent={<ProjectOverlay project={project} onOpen={onOpen} buttonRef={buttonRef} />}
    />
  );
}

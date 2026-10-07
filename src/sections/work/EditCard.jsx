import TiltedCard from '../../components/TiltedCard/TiltedCard';
import { Pill } from '../../components/ui';

// Fills its grid cell: the grid sets the height.
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
function EditOverlay({ edit, onOpen, buttonRef }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between rounded-[15px] bg-linear-to-b from-ink/40 via-ink/10 to-ink/95 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <Pill tone="glass">{edit.group}</Pill>
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-fg/15 bg-ink/50 text-fg backdrop-blur-sm"
        >
          ▶
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
            {edit.title}
          </button>
        </h3>
        <p className="mt-1 text-sm text-fg/75">{edit.summary}</p>
      </div>
    </div>
  );
}

// Technique card with a still from the reel. `tilt` is off for touch and reduced-motion users.
export default function EditCard({ edit, tilt, onOpen, buttonRef }) {
  return (
    <TiltedCard
      {...tiltSize}
      imageSrc={edit.image}
      altText=""
      captionText="Play clip"
      showTooltip={tilt}
      rotateAmplitude={tilt ? 8 : 0}
      scaleOnHover={tilt ? 1.04 : 1}
      overlayContent={<EditOverlay edit={edit} onOpen={onOpen} buttonRef={buttonRef} />}
    />
  );
}

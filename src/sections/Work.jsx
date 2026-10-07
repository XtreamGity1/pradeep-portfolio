import TiltedCard from '../components/TiltedCard/TiltedCard';
import { Pill, Section, SectionHeading } from '../components/ui';
import { projects } from '../data';

// Shared TiltedCard sizing: fluid width, one fixed height that reads well from 360px to desktop.
const CARD_HEIGHT = '280px';
const tiltProps = {
  containerHeight: CARD_HEIGHT,
  containerWidth: '100%',
  imageHeight: CARD_HEIGHT,
  imageWidth: '100%',
  scaleOnHover: 1.04,
  rotateAmplitude: 8,
  showMobileWarning: false,
  showTooltip: true,
  displayOverlayContent: true,
};

// Always-visible info overlay (no hover needed, so it works on touch devices).
function ProjectOverlay({ project }) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[15px] bg-linear-to-b from-transparent via-ink/20 to-ink/90 p-4 sm:p-5">
      <Pill tone="glass" className="self-start">
        {project.format}
      </Pill>
      <div>
        <h3 className="text-base font-semibold leading-tight text-fg sm:text-lg">{project.title}</h3>
        <p className="mt-1 text-sm text-muted">{project.client}</p>
        <Pill tone="accent" className="mt-3">
          {project.result}
        </Pill>
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <Section id="work">
      <SectionHeading eyebrow="Selected work" title="Edits that" accent="move the needle." />
      <ul className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.title}>
            <TiltedCard
              {...tiltProps}
              imageSrc={project.image}
              altText={project.title}
              captionText={project.format}
              overlayContent={<ProjectOverlay project={project} />}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

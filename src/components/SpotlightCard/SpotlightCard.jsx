'use client';

import { useRef, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';

// React Bits SpotlightCard, adapted: the glow follows a mouse pointer only (touch and pen keep
// the static card), stays off under prefers-reduced-motion, and `className` replaces the default
// skin so Tailwind token classes apply without `!` overrides.
const DEFAULT_SKIN = 'rounded-3xl border border-neutral-800 bg-neutral-900 p-8';

const SpotlightCard = ({
  as: Tag = 'div',
  children,
  className = DEFAULT_SKIN,
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
  ...rest
}) => {
  const divRef = useRef(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const isMouse = e => e.pointerType === 'mouse' && !reduceMotion;

  const handlePointerMove = e => {
    if (!divRef.current || !isMouse(e)) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(0.6);
  };

  const handlePointerEnter = e => {
    if (isMouse(e)) setOpacity(0.6);
  };

  const handlePointerLeave = () => {
    setOpacity(0);
  };

  return (
    <Tag
      ref={divRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      <div
        aria-hidden="true"
        data-testid="spotlight"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out motion-reduce:transition-none"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </Tag>
  );
};

export default SpotlightCard;

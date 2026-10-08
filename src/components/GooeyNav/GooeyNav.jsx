'use client';

import { useRef, useEffect, useState } from 'react';
import { focusRing } from '../ui';

// Styled with Tailwind; keyframes live in src/index.css (@theme --animate-gooey-*).
const PARTICLE_CLASS =
  'particle absolute top-[calc(50%-8px)] left-[calc(50%-8px)] block size-5 origin-center rounded-full opacity-0 animate-gooey-particle';
const POINT_CLASS = 'block size-5 origin-center rounded-full bg-(--color) opacity-100 animate-gooey-point';
const EFFECT_CLASS = 'pointer-events-none absolute z-1 grid place-items-center';
// SVG "goo" filter (blur + alpha threshold). Unlike the original blur/contrast trick it needs no
// opaque black backdrop, so the effect blends cleanly over translucent headers.
const GOO_FILTER_ID = 'gooey-nav-goo';

const noise = (n = 1) => n / 2 - Math.random() * n;
const pick = list => list[Math.floor(Math.random() * list.length)];
const getXY = (distance, pointIndex, totalPoints) => {
  const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};
// The particle burst is pure decoration: skip it for people who prefer reduced motion.
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// Changes from the React Bits original: optional controlled `activeIndex` (-1 = none, e.g. for a
// scrollspy) with `onItemClick`, a labelled <nav>, aria-current on the active link, real link
// activation on Enter, visible focus, 44px tap targets and no particles under reduced motion.

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  activeIndex: controlledIndex,
  onItemClick,
  ariaLabel = 'Primary',
  listClassName = 'gap-8 px-4'
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [internalIndex, setInternalIndex] = useState(initialActiveIndex);
  const activeIndex = controlledIndex ?? internalIndex;
  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: pick(colors),
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };
  const makeParticles = element => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.className = PARTICLE_CLASS;
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.className = POINT_CLASS;
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // do nothing
          }
        }, t);
      }, 30);
    }
  };
  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.textContent = element.textContent;
  };
  const handleClick = (e, index) => {
    const liEl = e.currentTarget.parentElement;
    onItemClick?.(items[index], index);
    if (activeIndex === index) return;
    setInternalIndex(index);
    if (prefersReducedMotion()) return;
    updateEffectPosition(liEl);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current.removeChild(p));
    }
    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    } else {
      // Nothing active (e.g. scrolled over a section that isn't in the nav): hide the effects.
      filterRef.current?.classList.remove('active');
      textRef.current?.classList.remove('active');
      if (textRef.current) textRef.current.textContent = '';
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="relative" ref={containerRef}>
      <svg aria-hidden="true" className="absolute size-0">
        <filter id={GOO_FILTER_ID} x="-150%" y="-300%" width="400%" height="700%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
        </filter>
      </svg>
      <nav aria-label={ariaLabel} className="relative flex transform-[translate3d(0,0,0.01px)]">
        <ul
          ref={navRef}
          className={`relative z-3 m-0 flex list-none p-0 ${listClassName} text-white [text-shadow:0_1px_1px_hsl(205deg_30%_10%/0.2)]`}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={`relative cursor-pointer rounded-full shadow-[0_0_0.5px_1.5px_transparent] transition-[background-color,color,box-shadow] duration-300 after:absolute after:inset-0 after:-z-1 after:rounded-lg after:bg-white after:transition-all after:duration-300 ${
                activeIndex === index
                  ? 'text-black text-shadow-none after:scale-100 after:opacity-100'
                  : 'text-white after:scale-0 after:opacity-0'
              }`}
            >
              <a
                onClick={e => handleClick(e, index)}
                href={item.href}
                aria-current={activeIndex === index ? 'location' : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg px-[1em] whitespace-nowrap ${focusRing}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span
        aria-hidden="true"
        className={`${EFFECT_CLASS} filter-[url(#gooey-nav-goo)] after:absolute after:inset-0 after:-z-1 after:scale-0 after:rounded-full after:bg-white after:opacity-0 [&.active]:after:animate-gooey-pill`}
        ref={filterRef}
      />
      <span
        aria-hidden="true"
        className={`${EFFECT_CLASS} text-white transition-colors duration-300 [&.active]:text-black`}
        ref={textRef}
      />
    </div>
  );
};

export default GooeyNav;

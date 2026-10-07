import { useId, useState } from 'react';
import { focusRing } from '../ui';

// Disclosure list: each title is an <h3><button aria-expanded aria-controls>, answers
// are labelled regions. Any number of items can be open at once.
export default function Accordion({ items, className = '' }) {
  const baseId = useId();
  const [open, setOpen] = useState(() => new Set());

  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const buttonId = `${baseId}-button-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={`group flex min-h-14 w-full cursor-pointer items-center justify-between gap-6 rounded-sm py-5 text-left text-lg font-semibold tracking-tight text-fg transition-colors duration-300 hover:text-accent sm:text-xl ${focusRing}`}
              >
                {item.title}
                {/* Plus that turns into a cross when open */}
                <span
                  aria-hidden="true"
                  className={`relative grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,border-color,background-color] duration-300 motion-reduce:transition-none ${
                    isOpen ? 'rotate-45 border-accent bg-accent/15 text-accent' : 'border-line text-muted group-hover:border-fg/40'
                  }`}
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span className="absolute h-3.5 w-px bg-current" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6 pr-12 motion-safe:animate-accordion-reveal"
            >
              <p className="max-w-2xl leading-relaxed text-muted">{item.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

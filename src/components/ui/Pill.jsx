const tones = {
  outline: 'border border-line px-4 py-2 text-sm text-muted transition-colors duration-300 hover:border-fg/40 hover:text-fg',
  accent: 'bg-accent/15 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/30',
  glass:
    'border border-fg/15 bg-ink/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/80 backdrop-blur-sm',
};

// Rounded chip/tag. `as` lets it render as an <li> inside lists.
export default function Pill({ as: Tag = 'span', tone = 'outline', className = '', children, ...rest }) {
  return (
    <Tag className={`inline-block rounded-full ${tones[tone]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

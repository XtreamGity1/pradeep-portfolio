const tones = {
  accent: 'text-accent',
  muted: 'text-muted',
};

// Small mono uppercase label used above headings and for row labels.
export default function Eyebrow({ as: Tag = 'p', tone = 'accent', className = '', children, ...rest }) {
  return (
    <Tag className={`font-mono text-xs uppercase tracking-[0.25em] ${tones[tone]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

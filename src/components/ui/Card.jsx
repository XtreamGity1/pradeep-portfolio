// Subtle bordered surface used for stats, services and other grid items.
export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`rounded-2xl border border-line bg-surface/50 p-5 sm:p-6 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

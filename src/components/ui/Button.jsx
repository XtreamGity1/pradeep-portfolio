import { focusRing } from './styles';

const variants = {
  primary: 'border border-transparent bg-fg text-ink hover:bg-accent',
  ghost: 'border border-line text-fg hover:border-fg',
};

// Pill-shaped link button.
export default function Button({ href, variant = 'primary', className = '', children, ...rest }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-300 ${focusRing} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

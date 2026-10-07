import { focusRing } from './styles';

// Link that opens in a new tab safely and announces it to screen readers.
export default function ExternalLink({ href, className = '', children, ...rest }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-sm ${focusRing} ${className}`}
      {...rest}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

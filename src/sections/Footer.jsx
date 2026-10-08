import { ExternalLink, focusRing } from '../components/ui';
import { footer, profile } from '../data';

// Evaluated once at module load (keeps render pure).
const YEAR = new Date().getFullYear();

const linkClass = `inline-flex min-h-11 items-center rounded-sm text-sm text-muted transition-colors duration-300 hover:text-fg ${focusRing}`;

// Brand block (name, availability, copyright) kept together, then two link columns: sections and socials.
// Extra bottom padding keeps the last links clear of the floating back-to-top pill.
export default function Footer() {
  return (
    <footer className="border-t border-line px-4 pt-8 pb-24 sm:px-6 md:pt-12 md:pb-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:justify-between md:gap-10">
        <div>
          <p className="font-semibold tracking-tight text-fg">{profile.name}</p>
          <p className="mt-1 flex items-baseline gap-2 text-sm text-muted">
            <span aria-hidden="true" className="size-2 shrink-0 -translate-y-px rounded-full bg-accent motion-safe:animate-pulse" />
            <span>
              {footer.availability} · {profile.location}
            </span>
          </p>
          <p className="mt-3 text-xs text-muted">
            &copy; {YEAR} {profile.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-10 sm:gap-x-16 md:shrink-0">
          <nav aria-label="Footer">
            <ul>
              {footer.links.map(link => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul aria-label="Social profiles">
            {profile.socials.map(social => (
              <li key={social.label}>
                <ExternalLink href={social.href} className={linkClass}>
                  {social.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

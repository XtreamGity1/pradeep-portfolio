import { ExternalLink, focusRing } from '../components/ui';
import { footer, profile } from '../data';

// Evaluated once at module load (keeps render pure).
const YEAR = new Date().getFullYear();

const linkClass = `inline-flex min-h-11 items-center rounded-sm text-sm text-muted transition-colors duration-300 hover:text-fg ${focusRing}`;

export default function Footer() {
  return (
    <footer className="border-t border-line px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
          <div>
            <p className="font-semibold tracking-tight text-fg">{profile.name}</p>
            <p className="mt-1 flex items-baseline gap-2 text-sm text-muted">
              <span aria-hidden="true" className="size-2 shrink-0 translate-y-[-1px] rounded-full bg-accent motion-safe:animate-pulse" />
              <span>
                {footer.availability} · {profile.location}
              </span>
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 md:gap-x-7">
              {footer.links.map(link => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-4 flex flex-col border-t border-line pt-2 sm:flex-row-reverse sm:items-center sm:justify-between md:mt-8 md:pt-4">
          <ul aria-label="Social profiles" className="flex flex-wrap gap-x-5 sm:gap-x-6">
            {profile.socials.map(social => (
              <li key={social.label}>
                <ExternalLink href={social.href} className={linkClass}>
                  {social.label}
                </ExternalLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-6 text-sm text-muted">
            <p>
              &copy; {YEAR} {profile.name}
            </p>
            <a href="#top" className={`group gap-2 ${linkClass}`}>
              Back to top
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
                &uarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

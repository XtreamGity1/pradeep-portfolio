import { focusRing } from '../components/ui';
import { profile } from '../data';

// Evaluated once at module load (keeps render pure).
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-line px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {YEAR} {profile.name}
        </p>
        <p>{profile.location}</p>
        <a
          href="#top"
          className={`group inline-flex items-center gap-2 self-start rounded-sm transition-colors duration-300 hover:text-fg md:self-auto ${focusRing}`}
        >
          Back to top
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
            &uarr;
          </span>
        </a>
      </div>
    </footer>
  );
}

import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { focusRing } from '../ui';
import { buildInquiryMailto } from '../../lib/mailto';
import { validateInquiry } from '../../lib/validateInquiry';
import { inquiry } from '../../data';

const EMPTY = {
  name: '',
  email: '',
  projectType: '',
  budget: '',
  timeline: '',
  footage: '',
  message: '',
  testEdit: false,
};
// Form order — the first invalid field in this list receives focus on submit.
const ORDER = ['name', 'email', 'projectType', 'budget', 'timeline', 'footage', 'message'];

// No backend: hand the composed draft to the visitor's email app.
const assignLocation = href => window.location.assign(href);

// Inputs stay at 16px on phones so iOS doesn't zoom on focus.
const control =
  'block min-h-12 w-full rounded-xl border border-line bg-ink/70 px-4 py-3 text-base text-fg transition-colors duration-300 placeholder:text-muted/60 hover:border-fg/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-invalid:border-accent';
const labelText = 'mb-2 block text-sm font-medium text-fg';

function Optional() {
  return <span className="font-normal text-muted"> (optional)</span>;
}

function ErrorText({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-accent">
      <span aria-hidden="true">&#9888;</span>
      {children}
    </p>
  );
}

// Label + control + inline error. `render` receives the a11y props for the control.
function Field({ id, label, optional, error, className = '', render }) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className={labelText}>
        {label}
        {optional && <Optional />}
      </label>
      {render({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errorId : undefined })}
      <ErrorText id={errorId}>{error}</ErrorText>
    </div>
  );
}

function SelectField({ options, placeholder, ...props }) {
  return (
    <div className="relative">
      <select className={`${control} cursor-pointer appearance-none pr-11 scheme-dark`} {...props}>
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">
        &#9662;
      </span>
    </div>
  );
}

export default function InquiryForm({ to, recipient, openMailto = assignLocation }) {
  const uid = useId();
  const id = field => `${uid}-${field}`;
  const titleId = id('title');

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [summary, setSummary] = useState('');
  const [sentHref, setSentHref] = useState(null);
  const fieldRefs = useRef({});
  const successRef = useRef(null);
  const register = field => el => {
    fieldRefs.current[field] = el;
  };

  // Re-check one field against the latest values; keeps other errors untouched.
  const recheck = (field, nextValues) =>
    setErrors(prev => {
      const { [field]: _old, ...rest } = prev;
      const message = validateInquiry(nextValues)[field];
      return message ? { ...rest, [field]: message } : rest;
    });

  const update = (field, value) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) recheck(field, next);
  };

  const touch = field => {
    setTouched(prev => ({ ...prev, [field]: true }));
    recheck(field, values);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const found = validateInquiry(values);
    const invalid = ORDER.filter(field => found[field]);

    if (invalid.length) {
      // Commit the invalid state first so the focused field is announced with its error.
      flushSync(() => {
        setErrors(found);
        setTouched(Object.fromEntries(ORDER.map(field => [field, true])));
        setSummary(
          `Almost there — ${invalid.length} ${invalid.length === 1 ? 'field needs' : 'fields need'} a quick fix.`,
        );
      });
      fieldRefs.current[invalid[0]]?.focus();
      return;
    }

    const href = buildInquiryMailto(to, values, { recipient });
    flushSync(() => {
      setSummary('');
      setSentHref(href);
    });
    successRef.current?.focus();
    openMailto(href);
  };

  const reset = () => {
    flushSync(() => {
      setValues(EMPTY);
      setErrors({});
      setTouched({});
      setSentHref(null);
    });
    fieldRefs.current.name?.focus();
  };

  const textProps = field => ({
    ref: register(field),
    name: field,
    value: values[field],
    onChange: event => update(field, event.target.value),
    onBlur: () => touch(field),
  });

  const typeErrorId = id('projectType-error');

  return (
    <div className="rounded-3xl border border-line bg-surface/70 p-5 backdrop-blur-sm sm:p-8">
      <h3 id={titleId} className="text-2xl font-semibold tracking-tight text-fg">
        {inquiry.title}
      </h3>
      {!sentHref && <p className="mt-2 leading-relaxed text-muted">{inquiry.intro}</p>}

      {/* Always mounted so screen readers announce the success message when it appears. */}
      <div role="status">
        {sentHref && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 sm:p-6">
            <span
              aria-hidden="true"
              className="mb-4 flex size-10 items-center justify-center rounded-full bg-accent text-lg text-ink"
            >
              &#10003;
            </span>
            <h4 ref={successRef} tabIndex={-1} className="text-xl font-semibold text-fg outline-none">
              {inquiry.success.title}
            </h4>
            <p className="mt-2 leading-relaxed text-muted">{inquiry.success.body}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={sentHref}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-semibold text-fg transition-colors duration-300 hover:border-fg ${focusRing}`}
              >
                {inquiry.success.retry}
              </a>
              <button
                type="button"
                onClick={reset}
                className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-semibold text-muted underline-offset-4 transition-colors duration-300 hover:text-fg hover:underline ${focusRing}`}
              >
                {inquiry.success.reset}
              </button>
            </div>
          </div>
        )}
      </div>

      {!sentHref && (
        <form aria-labelledby={titleId} noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-x-4">
          <Field
            id={id('name')}
            label="Your name"
            error={errors.name}
            render={a11y => (
              <input {...a11y} {...textProps('name')} type="text" autoComplete="name" required className={control} />
            )}
          />
          <Field
            id={id('email')}
            label="Your email"
            error={errors.email}
            render={a11y => (
              <input
                {...a11y}
                {...textProps('email')}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                className={control}
              />
            )}
          />

          <fieldset className="sm:col-span-2">
            <legend className={labelText}>Project type</legend>
            <div className="flex flex-wrap gap-2">
              {inquiry.projectTypes.map((type, i) => (
                <label
                  key={type}
                  className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm text-muted transition-colors duration-300 hover:border-fg/40 hover:text-fg has-checked:border-accent has-checked:bg-accent/15 has-checked:text-fg"
                >
                  <input
                    ref={i === 0 ? register('projectType') : undefined}
                    type="radio"
                    name="projectType"
                    value={type}
                    checked={values.projectType === type}
                    onChange={() => update('projectType', type)}
                    onBlur={() => touch('projectType')}
                    required
                    aria-invalid={errors.projectType ? true : undefined}
                    aria-describedby={errors.projectType ? typeErrorId : undefined}
                    className={`absolute -inset-px cursor-pointer appearance-none rounded-full ${focusRing}`}
                  />
                  {type}
                </label>
              ))}
            </div>
            <ErrorText id={typeErrorId}>{errors.projectType}</ErrorText>
          </fieldset>

          <Field
            id={id('budget')}
            label="Budget"
            optional
            render={a11y => (
              <SelectField {...a11y} {...textProps('budget')} options={inquiry.budgets} placeholder="Choose a range" />
            )}
          />
          <Field
            id={id('timeline')}
            label="Timeline"
            optional
            render={a11y => (
              <SelectField {...a11y} {...textProps('timeline')} options={inquiry.timelines} placeholder="When do you need it?" />
            )}
          />

          <Field
            id={id('footage')}
            label="Footage link"
            optional
            error={errors.footage}
            className="sm:col-span-2"
            render={a11y => (
              <input
                {...a11y}
                {...textProps('footage')}
                type="url"
                inputMode="url"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="https://drive.google.com/…"
                className={control}
              />
            )}
          />
          <Field
            id={id('message')}
            label="About the project"
            error={errors.message}
            className="sm:col-span-2"
            render={a11y => (
              <textarea
                {...a11y}
                {...textProps('message')}
                rows={5}
                required
                placeholder="Channel link, video length, the vibe you’re going for…"
                className={`${control} resize-y`}
              />
            )}
          />

          <div className="sm:col-span-2">
            <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
              <input
                type="checkbox"
                name="testEdit"
                checked={values.testEdit}
                onChange={event => update('testEdit', event.target.checked)}
                aria-describedby={id('testEdit-hint')}
                className={`mt-0.5 size-5 shrink-0 cursor-pointer accent-accent ${focusRing}`}
              />
              <span className="text-base font-medium text-fg">{inquiry.testEdit.label}</span>
            </label>
            <p id={id('testEdit-hint')} className="pl-8 text-sm leading-relaxed text-muted">
              {inquiry.testEdit.hint}
            </p>
          </div>

          <div className="flex flex-col sm:col-span-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              className={`inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-fg px-7 text-base font-semibold text-ink transition-colors duration-300 hover:bg-accent sm:w-auto ${focusRing}`}
            >
              {inquiry.submitLabel}
              <span aria-hidden="true">&rarr;</span>
            </button>
            {/* Stays rendered (never display:none) so the summary is announced when it fills in. */}
            <p role="alert" className="mt-4 text-sm text-accent empty:m-0 sm:mt-0 sm:ml-5">
              {Object.keys(errors).length > 0 ? summary : ''}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

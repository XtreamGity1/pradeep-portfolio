// Validation for the contact inquiry form. Pure: values in, { field: message } out.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_SCHEME = /^[a-z][a-z\d+.-]*:/i;

const REQUIRED = {
  name: 'Tell me your name.',
  email: 'Add an email so I can reply.',
  projectType: 'Pick the type of project.',
  message: 'Give me a line or two about the project.',
};

// Turns a pasted link into an absolute http(s) URL — bare domains get https:// — or null.
export function normalizeUrl(value) {
  const trimmed = value.trim();
  try {
    const url = new URL(HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`);
    const isWeb = url.protocol === 'https:' || url.protocol === 'http:';
    return isWeb && url.hostname.includes('.') ? url.href : null;
  } catch {
    return null;
  }
}

export function validateInquiry(values) {
  const errors = {};
  for (const [field, message] of Object.entries(REQUIRED)) {
    if (!values[field]?.trim()) errors[field] = message;
  }
  if (!errors.email && !EMAIL.test(values.email.trim())) {
    errors.email = 'Enter a valid email, like you@example.com.';
  }
  if (values.footage?.trim() && !normalizeUrl(values.footage)) {
    errors.footage = 'Enter a valid link, like https://drive.google.com/…';
  }
  return errors;
}

import { normalizeUrl } from './validateInquiry';

// RFC 6068: percent-encode everything after the address, with CRLF line breaks.
const encode = value => encodeURIComponent(value.replace(/\r?\n/g, '\r\n'));

export function buildMailto(to, { subject, body } = {}) {
  const params = Object.entries({ subject, body })
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encode(value)}`);
  return `mailto:${to}${params.length ? `?${params.join('&')}` : ''}`;
}

export const inquirySubject = values => `Project inquiry: ${values.projectType} — ${values.name.trim()}`;

// The filled-in optional details as [label, value] pairs; shared by the draft and the sent email.
export function inquiryDetails(values) {
  const footage = values.footage.trim() && (normalizeUrl(values.footage) ?? values.footage.trim());
  return [
    ['Project type', values.projectType],
    ['Budget', values.budget.trim()],
    ['Timeline', values.timeline.trim()],
    ['Footage', footage],
    ['Free test edit', values.testEdit && 'Yes, please'],
  ].filter(([, value]) => value);
}

// Composes the contact form into a ready-to-send email draft.
export function buildInquiryMailto(to, values, { recipient } = {}) {
  const name = values.name.trim();
  const details = inquiryDetails(values).map(([label, value]) => `${label}: ${value}`);

  const body = [
    ...(recipient ? [`Hi ${recipient},`, ''] : []),
    values.message.trim(),
    '',
    ...details,
    '',
    name,
    values.email.trim(),
  ].join('\n');

  return buildMailto(to, { subject: inquirySubject(values), body });
}

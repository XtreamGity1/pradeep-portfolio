import { buildInquiryMailto, buildMailto } from '../mailto';

// Decodes a mailto: URL back into its parts so assertions read naturally.
function parse(href) {
  const [scheme, rest] = href.split(/:(.*)/s);
  const [to, query = ''] = rest.split('?');
  const params = Object.fromEntries(
    query.split('&').filter(Boolean).map(pair => {
      const [key, value] = pair.split('=');
      return [key, decodeURIComponent(value)];
    }),
  );
  return { scheme, to, ...params };
}

const VALUES = {
  name: '  Sam Carter ',
  email: 'sam@example.com',
  projectType: 'YouTube long-form',
  budget: '$100–300',
  timeline: 'Within 2 weeks',
  footage: 'https://drive.google.com/folder/abc',
  message: 'Weekly vlog, ~15 min.\nNeed tighter hooks.',
  testEdit: true,
};

describe('buildMailto', () => {
  test('keeps the address readable and percent-encodes subject and body', () => {
    const href = buildMailto('hello@example.com', { subject: 'Hi & bye?', body: 'a b' });
    expect(href).toBe('mailto:hello@example.com?subject=Hi%20%26%20bye%3F&body=a%20b');
  });

  test('encodes line breaks as CRLF (RFC 6068)', () => {
    const href = buildMailto('hello@example.com', { subject: 's', body: 'one\ntwo' });
    expect(href).toContain('body=one%0D%0Atwo');
  });

  test('omits empty parameters', () => {
    expect(buildMailto('hello@example.com', {})).toBe('mailto:hello@example.com');
  });
});

describe('buildInquiryMailto', () => {
  test('addresses the email and names the project and sender in the subject', () => {
    const mail = parse(buildInquiryMailto('hello@example.com', VALUES));
    expect(mail.scheme).toBe('mailto');
    expect(mail.to).toBe('hello@example.com');
    expect(mail.subject).toBe('Project inquiry: YouTube long-form — Sam Carter');
  });

  test('puts the message and every detail in the body, trimmed', () => {
    const { body } = parse(buildInquiryMailto('hello@example.com', VALUES, { recipient: 'Pradeep' }));
    expect(body.startsWith('Hi Pradeep,\r\n\r\nWeekly vlog, ~15 min.\r\nNeed tighter hooks.')).toBe(true);
    expect(body).toContain('Project type: YouTube long-form');
    expect(body).toContain('Budget: $100–300');
    expect(body).toContain('Timeline: Within 2 weeks');
    expect(body).toContain('Footage: https://drive.google.com/folder/abc');
    expect(body).toContain('Free test edit: Yes, please');
    expect(body).toMatch(/Sam Carter\r\nsam@example\.com$/);
  });

  test('leaves out optional details that were not given', () => {
    const { body } = parse(
      buildInquiryMailto('hello@example.com', { ...VALUES, budget: '', timeline: ' ', footage: '', testEdit: false }),
    );
    expect(body).not.toMatch(/Budget:|Timeline:|Footage:|Free test edit:/);
    expect(body).toContain('Project type: YouTube long-form');
  });

  test('adds a scheme to a bare footage link', () => {
    const { body } = parse(buildInquiryMailto('hello@example.com', { ...VALUES, footage: 'dropbox.com/s/xyz' }));
    expect(body).toContain('Footage: https://dropbox.com/s/xyz');
  });
});

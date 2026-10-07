import { normalizeUrl, validateInquiry } from '../validateInquiry';

const VALID = {
  name: 'Sam Carter',
  email: 'sam@example.com',
  projectType: 'Podcast clips',
  budget: '',
  timeline: '',
  footage: '',
  message: 'Three clips a week from my podcast.',
  testEdit: false,
};

describe('validateInquiry', () => {
  test('returns no errors for a complete inquiry with optional fields left blank', () => {
    expect(validateInquiry(VALID)).toEqual({});
  });

  test('flags every required field that is empty or whitespace', () => {
    const errors = validateInquiry({ ...VALID, name: '  ', email: '', projectType: '', message: '\n' });
    expect(Object.keys(errors)).toEqual(['name', 'email', 'projectType', 'message']);
    Object.values(errors).forEach(message => expect(message).toEqual(expect.any(String)));
  });

  test.each(['sam', 'sam@', 'sam@example', 'sam @example.com', '@example.com'])('rejects the email %j', email => {
    expect(validateInquiry({ ...VALID, email })).toHaveProperty('email', expect.stringMatching(/valid email/i));
  });

  test('accepts a padded but valid email', () => {
    expect(validateInquiry({ ...VALID, email: ' sam@example.co.uk ' })).toEqual({});
  });

  test.each(['not a link', 'javascript:alert(1)', 'ftp://files.example.com', 'http://localhost'])(
    'rejects the footage link %j',
    footage => {
      expect(validateInquiry({ ...VALID, footage })).toHaveProperty('footage', expect.stringMatching(/valid link/i));
    },
  );

  test.each(['https://drive.google.com/drive/folders/abc', 'dropbox.com/s/xyz', 'http://frame.io/x'])(
    'accepts the footage link %j',
    footage => {
      expect(validateInquiry({ ...VALID, footage })).toEqual({});
    },
  );
});

describe('normalizeUrl', () => {
  test('adds https:// to a bare domain and keeps an explicit scheme', () => {
    expect(normalizeUrl('dropbox.com/s/xyz')).toBe('https://dropbox.com/s/xyz');
    expect(normalizeUrl(' http://frame.io/x ')).toBe('http://frame.io/x');
  });

  test('returns null for anything that is not a web link', () => {
    expect(normalizeUrl('nope')).toBeNull();
    expect(normalizeUrl('mailto:a@b.co')).toBeNull();
  });
});

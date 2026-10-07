import { buildInquiryPayload, sendInquiry, WEB3FORMS_URL } from '../sendInquiry';

const VALUES = {
  name: '  Sam Carter ',
  email: ' sam@example.com ',
  projectType: 'Podcast clips',
  budget: '$100–300',
  timeline: '',
  footage: 'drive.google.com/folder/abc',
  message: ' Three clips a week. ',
  testEdit: true,
};

const reply = (body, ok = true) => vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) });

describe('buildInquiryPayload', () => {
  test('carries the key, a readable subject and the visitor as reply-to', () => {
    const payload = buildInquiryPayload(VALUES, { accessKey: 'key-123' });
    expect(payload).toMatchObject({
      access_key: 'key-123',
      subject: 'Project inquiry: Podcast clips — Sam Carter',
      from_name: 'Sam Carter',
      name: 'Sam Carter',
      email: 'sam@example.com',
      message: 'Three clips a week.',
    });
  });

  test('lists filled details, normalising the footage link and skipping blanks', () => {
    const payload = buildInquiryPayload(VALUES, { accessKey: 'k' });
    expect(payload['Project type']).toBe('Podcast clips');
    expect(payload.Budget).toBe('$100–300');
    expect(payload.Footage).toBe('https://drive.google.com/folder/abc');
    expect(payload['Free test edit']).toBe('Yes, please');
    expect(payload).not.toHaveProperty('Timeline');
  });
});

describe('sendInquiry', () => {
  test('posts JSON to Web3Forms', async () => {
    const fetchImpl = reply({ success: true });
    await sendInquiry(VALUES, { accessKey: 'k', fetchImpl });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe(WEB3FORMS_URL);
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json', Accept: 'application/json' });
    expect(JSON.parse(init.body)).toEqual(buildInquiryPayload(VALUES, { accessKey: 'k' }));
  });

  test('rejects when the service reports a failure', async () => {
    await expect(sendInquiry(VALUES, { accessKey: 'k', fetchImpl: reply({ success: false, message: 'Bad key' }, false) })).rejects.toThrow(
      /bad key/i,
    );
    await expect(sendInquiry(VALUES, { accessKey: 'k', fetchImpl: reply({ success: false }) })).rejects.toThrow();
  });

  test('rejects on a network error', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(sendInquiry(VALUES, { accessKey: 'k', fetchImpl })).rejects.toThrow();
  });
});

import { inquiryDetails, inquirySubject } from './mailto';

// Free form-to-email relay (250 submissions/month). The access key is tied to one inbox and is
// meant to live in browser code; Web3Forms only accepts submissions sent from a browser.
export const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

// `email` doubles as the reply-to address, so replying in the inbox answers the visitor.
export function buildInquiryPayload(values, { accessKey }) {
  const name = values.name.trim();
  return {
    access_key: accessKey,
    subject: inquirySubject(values),
    from_name: name,
    name,
    email: values.email.trim(),
    ...Object.fromEntries(inquiryDetails(values)),
    message: values.message.trim(),
  };
}

// Resolves once the email is accepted; rejects on network errors or a refused submission.
export async function sendInquiry(values, { accessKey, fetchImpl = fetch }) {
  const response = await fetchImpl(WEB3FORMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(buildInquiryPayload(values, { accessKey })),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.message || `Inquiry not sent (HTTP ${response.status})`);
  }
}

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import InquiryForm from '../InquiryForm';
import { buildInquiryMailto } from '../../../lib/mailto';
import { inquiry } from '../../../data';

const TO = 'hello@example.com';

function renderForm() {
  const openMailto = vi.fn();
  render(<InquiryForm to={TO} recipient="Pradeep" openMailto={openMailto} />);
  return { openMailto, form: screen.getByRole('form', { name: inquiry.title }) };
}

const field = {
  name: () => screen.getByRole('textbox', { name: /your name/i }),
  email: () => screen.getByRole('textbox', { name: /your email/i }),
  budget: () => screen.getByRole('combobox', { name: /budget/i }),
  timeline: () => screen.getByRole('combobox', { name: /timeline/i }),
  footage: () => screen.getByRole('textbox', { name: /footage link/i }),
  message: () => screen.getByRole('textbox', { name: /about the project/i }),
  testEdit: () => screen.getByRole('checkbox', { name: inquiry.testEdit.label }),
};
const submit = () => fireEvent.click(screen.getByRole('button', { name: inquiry.submitLabel }));
const type = (input, value) => fireEvent.change(input, { target: { value } });

function fillValid() {
  type(field.name(), 'Sam Carter');
  type(field.email(), 'sam@example.com');
  fireEvent.click(screen.getByRole('radio', { name: inquiry.projectTypes[0] }));
  type(field.message(), 'Weekly vlog, ~15 minutes.');
}

// The error message an input points at via aria-describedby.
const describedErrors = input =>
  (input.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map(id => document.getElementById(id)?.textContent ?? '')
    .join(' ');

describe('InquiryForm', () => {
  test('renders labelled fields with mobile-friendly input types', () => {
    renderForm();
    expect(field.name()).toHaveAttribute('autocomplete', 'name');
    expect(field.name()).toBeRequired();
    expect(field.email()).toHaveAttribute('type', 'email');
    expect(field.email()).toHaveAttribute('autocomplete', 'email');
    expect(field.email()).toBeRequired();
    expect(field.footage()).toHaveAttribute('type', 'url');
    expect(field.footage()).toHaveAttribute('inputmode', 'url');
    expect(field.footage()).not.toBeRequired();
    expect(field.message().tagName).toBe('TEXTAREA');
    expect(field.message()).toBeRequired();
    expect(field.testEdit()).not.toBeChecked();
  });

  test('keeps the form short: optional details start tucked away and the message box is compact', () => {
    renderForm();
    const toggle = screen.getByText(/add budget, timeline or a footage link/i);
    expect(field.budget()).not.toBeVisible();
    expect(field.timeline()).not.toBeVisible();
    expect(field.footage()).not.toBeVisible();
    expect(field.message()).toHaveAttribute('rows', '3');

    fireEvent.click(toggle);
    expect(field.budget()).toBeVisible();
    expect(field.timeline()).toBeVisible();
    expect(field.footage()).toBeVisible();
  });

  test('opens the optional details to show an invalid footage link', () => {
    renderForm();
    fillValid();
    const toggle = screen.getByText(/add budget, timeline or a footage link/i);
    fireEvent.click(toggle);
    type(field.footage(), 'not a link');
    fireEvent.click(toggle); // collapse it again before submitting
    expect(field.footage()).not.toBeVisible();

    submit();
    expect(field.footage()).toBeVisible();
    expect(field.footage()).toHaveFocus();
  });

  test('offers every project type as a radio in a labelled group', () => {
    renderForm();
    const group = screen.getByRole('group', { name: /project type/i });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map(r => r.value)).toEqual(inquiry.projectTypes);
  });

  test('offers the budget and timeline options from data', () => {
    renderForm();
    const options = select => within(select).getAllByRole('option').map(o => o.textContent).slice(1);
    expect(options(field.budget())).toEqual(inquiry.budgets);
    expect(options(field.timeline())).toEqual(inquiry.timelines);
  });

  test('blocks an empty submit, marks required fields invalid and focuses the first one', () => {
    const { openMailto } = renderForm();
    submit();
    expect(openMailto).not.toHaveBeenCalled();
    for (const input of [field.name(), field.email(), field.message()]) {
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(describedErrors(input)).not.toBe('');
    }
    const firstRadio = screen.getAllByRole('radio')[0];
    expect(firstRadio).toHaveAttribute('aria-invalid', 'true');
    expect(describedErrors(firstRadio)).toMatch(/pick the type/i);
    expect(field.footage()).not.toHaveAttribute('aria-invalid', 'true');
    expect(field.name()).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent(/4 fields/i);
  });

  test('focuses the first invalid field in form order', () => {
    renderForm();
    type(field.name(), 'Sam');
    type(field.email(), 'sam@example.com');
    submit();
    expect(screen.getAllByRole('radio')[0]).toHaveFocus();
  });

  test('rejects a malformed email and footage link', () => {
    const { openMailto } = renderForm();
    fillValid();
    type(field.email(), 'sam@example');
    type(field.footage(), 'not a link');
    submit();
    expect(openMailto).not.toHaveBeenCalled();
    expect(describedErrors(field.email())).toMatch(/valid email/i);
    expect(describedErrors(field.footage())).toMatch(/valid link/i);
    expect(field.email()).toHaveFocus();
  });

  test('validates a field when it loses focus and clears the error once fixed', () => {
    renderForm();
    fireEvent.blur(field.email());
    expect(field.email()).toHaveAttribute('aria-invalid', 'true');
    type(field.email(), 'sam@example.com');
    expect(field.email()).not.toHaveAttribute('aria-invalid', 'true');
    expect(describedErrors(field.email())).not.toMatch(/email/i);
  });

  test('opens a pre-filled email and announces success on a valid submit', () => {
    const { openMailto } = renderForm();
    fillValid();
    fireEvent.change(field.budget(), { target: { value: inquiry.budgets[1] } });
    fireEvent.click(field.testEdit());
    submit();

    const expected = buildInquiryMailto(
      TO,
      {
        name: 'Sam Carter',
        email: 'sam@example.com',
        projectType: inquiry.projectTypes[0],
        budget: inquiry.budgets[1],
        timeline: '',
        footage: '',
        message: 'Weekly vlog, ~15 minutes.',
        testEdit: true,
      },
      { recipient: 'Pradeep' },
    );
    expect(openMailto).toHaveBeenCalledWith(expected);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(inquiry.success.title);
    expect(within(status).getByRole('link', { name: inquiry.success.retry })).toHaveAttribute('href', expected);
    expect(within(status).getByRole('heading', { name: inquiry.success.title })).toHaveFocus();
    expect(screen.queryByRole('button', { name: inquiry.submitLabel })).not.toBeInTheDocument();
  });

  describe('when it can send directly', () => {
    function renderSending(send) {
      const openMailto = vi.fn();
      render(<InquiryForm to={TO} recipient="Pradeep" send={send} openMailto={openMailto} />);
      return { openMailto };
    }

    test('sends the inquiry, shows progress, then confirms it was sent', async () => {
      let resolve;
      const send = vi.fn(() => new Promise(r => (resolve = r)));
      const { openMailto } = renderSending(send);
      fillValid();
      submit();

      expect(send).toHaveBeenCalledWith(expect.objectContaining({ name: 'Sam Carter', email: 'sam@example.com' }));
      const busy = screen.getByRole('button', { name: inquiry.sendingLabel });
      expect(busy).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(busy); // a second click while sending is ignored
      expect(send).toHaveBeenCalledTimes(1);

      await act(async () => resolve());
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(inquiry.sent.title);
      expect(within(status).getByRole('heading', { name: inquiry.sent.title })).toHaveFocus();
      expect(within(status).queryByRole('link')).not.toBeInTheDocument();
      expect(openMailto).not.toHaveBeenCalled();
    });

    test('on failure keeps the form filled and offers the email draft instead', async () => {
      const send = vi.fn().mockRejectedValue(new Error('offline'));
      renderSending(send);
      fillValid();
      await act(async () => submit());

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(inquiry.failed.message);
      expect(within(alert).getByRole('link', { name: inquiry.failed.fallback })).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`^mailto:${TO}\\?subject=`)),
      );
      expect(field.name()).toHaveValue('Sam Carter');
      expect(screen.getByRole('button', { name: inquiry.submitLabel })).not.toHaveAttribute('aria-disabled');
    });

    test('quietly drops submissions that fill the hidden spam trap', async () => {
      const send = vi.fn().mockResolvedValue();
      renderSending(send);
      fillValid();
      fireEvent.click(document.querySelector('input[name="botcheck"]'));
      await act(async () => submit());
      expect(send).not.toHaveBeenCalled();
      expect(screen.getByRole('status')).toHaveTextContent(inquiry.sent.title);
    });
  });

  test('starts over with an empty form', () => {
    renderForm();
    fillValid();
    submit();
    fireEvent.click(screen.getByRole('button', { name: inquiry.success.reset }));
    expect(field.name()).toHaveValue('');
    expect(field.name()).toHaveFocus();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});

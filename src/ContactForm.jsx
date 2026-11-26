import { useState } from 'react';
import { SERVICE_OPTIONS } from './data.js';

const EMPTY = { name: '', phone: '', email: '', service: '', message: '', website: '' };

// Client-side validation mirrors the server rules
export function validate(v) {
  const e = {};
  const phone = v.phone.replace(/[\s-]/g, '');
  if (v.name.trim().length < 2 || v.name.trim().length > 80) e.name = 'Please enter your name (2 to 80 characters).';
  if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (!SERVICE_OPTIONS.includes(v.service)) e.service = 'Please select a service.';
  if (v.message.trim().length < 10 || v.message.trim().length > 1000) e.message = 'Message should be 10 to 1000 characters.';
  return e;
}

function Field({ label, name, error, children }) {
  return (
    <div className={`field ${error ? 'invalid' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <span className="error" role="alert">{error}</span>}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ type: 'error', msg: 'Please correct the highlighted fields.' });
      return;
    }

    setSending(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }
      setStatus({ type: 'success', msg: data.message });
      setValues(EMPTY);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Network error. Please call us directly.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div aria-live="polite">
        {status.msg && <div className={`alert ${status.type}`}>{status.msg}</div>}
      </div>

      <div className="row">
        <Field label="Full name *" name="name" error={errors.name}>
          <input id="name" name="name" value={values.name} onChange={onChange} autoComplete="name" />
        </Field>
        <Field label="Mobile *" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" value={values.phone} onChange={onChange} autoComplete="tel" placeholder="10-digit mobile" />
        </Field>
      </div>

      <div className="row">
        <Field label="Email (optional)" name="email" error={errors.email}>
          <input id="email" name="email" type="email" value={values.email} onChange={onChange} autoComplete="email" />
        </Field>
        <Field label="Service *" name="service" error={errors.service}>
          <select id="service" name="service" value={values.service} onChange={onChange}>
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Message *" name="message" error={errors.message}>
        <textarea id="message" name="message" rows="5" value={values.message} onChange={onChange} placeholder="Tell us the location, depth or work required" />
      </Field>

      {/* Honeypot: hidden from people, bots fill it */}
      <input className="hp" tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={onChange} aria-hidden="true" />

      <button className="btn btn-yellow" type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}

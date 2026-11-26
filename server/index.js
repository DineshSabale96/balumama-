import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3001;
const BUSINESS_NAME = 'Balumama Earthmovers';
const BUSINESS_PHONE = '+91 7058490511';
const BUSINESS_ADDRESS = 'M. Post Surwadi, Tal. Phaltan, Dist. Satara, Maharashtra';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SEND_CONFIRMATION = process.env.SEND_CONFIRMATION !== 'false';

const SERVICES = [
  'Well Excavation',
  'Excavator 220 / 380',
  'Breaker Work',
  'Earth Moving',
  'JCB Services',
  'Well Ring Work',
  'Other',
];

if (!SMTP_USER || !SMTP_PASS || !BUSINESS_EMAIL) {
  console.warn('[config] SMTP_USER, SMTP_PASS or BUSINESS_EMAIL is missing. Enquiries will fail until set.');
}

// Gmail SMTP: port 587 with STARTTLS
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  requireTLS: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

transporter
  .verify()
  .then(() => console.log('[smtp] Connection to Gmail verified'))
  .catch((err) => console.error('[smtp] Verification failed:', err.message));

app.use(express.json({ limit: '10kb' }));

// Simple in-memory rate limit: 5 enquiries per IP per 15 minutes
const hits = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;
setInterval(() => hits.clear(), WINDOW_MS).unref();

function rateLimit(req, res, next) {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    return res.status(429).json({
      ok: false,
      message: 'Too many enquiries from this device. Please try again later or call us directly.',
    });
  }
  recent.push(now);
  hits.set(req.ip, recent);
  next();
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function validate(body) {
  const data = {
    name: String(body.name || '').trim(),
    phone: String(body.phone || '').replace(/[\s-]/g, ''),
    email: String(body.email || '').trim(),
    service: String(body.service || '').trim(),
    message: String(body.message || '').trim(),
  };
  const errors = {};
  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Please enter your name (2 to 80 characters).';
  if (!/^(\+91)?[6-9]\d{9}$/.test(data.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email address.';
  if (!SERVICES.includes(data.service)) errors.service = 'Please select a service.';
  if (data.message.length < 10 || data.message.length > 1000) errors.message = 'Message should be 10 to 1000 characters.';
  return { errors, data };
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/contact', rateLimit, async (req, res) => {
  // Honeypot: bots fill the hidden "website" field; pretend success and drop it
  if (req.body && req.body.website) {
    return res.json({ ok: true, message: 'Thank you! Your enquiry has been sent.' });
  }

  const { errors, data } = validate(req.body || {});
  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, errors, message: 'Please correct the highlighted fields.' });
  }

  try {
    await transporter.sendMail({
      from: `"${BUSINESS_NAME} Website" <${SMTP_USER}>`,
      to: BUSINESS_EMAIL,
      replyTo: data.email || undefined,
      subject: `New enquiry: ${data.service} - ${data.name}`,
      text: [
        'New enquiry from the website',
        '',
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email || 'Not provided'}`,
        `Service: ${data.service}`,
        '',
        'Message:',
        data.message,
      ].join('\n'),
      html: `
        <h2 style="color:#111;border-left:6px solid #FFB000;padding-left:10px">New website enquiry</h2>
        <table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">
          <tr><td><b>Name</b></td><td>${esc(data.name)}</td></tr>
          <tr><td><b>Phone</b></td><td>${esc(data.phone)}</td></tr>
          <tr><td><b>Email</b></td><td>${esc(data.email || 'Not provided')}</td></tr>
          <tr><td><b>Service</b></td><td>${esc(data.service)}</td></tr>
          <tr><td valign="top"><b>Message</b></td><td style="white-space:pre-wrap">${esc(data.message)}</td></tr>
        </table>`,
    });
  } catch (err) {
    console.error('[smtp] Business email failed:', err.message);
    return res.status(502).json({
      ok: false,
      message: `We could not send your enquiry right now. Please call ${BUSINESS_PHONE}.`,
    });
  }

  if (data.email && SEND_CONFIRMATION) {
    transporter
      .sendMail({
        from: `"${BUSINESS_NAME}" <${SMTP_USER}>`,
        to: data.email,
        subject: `We received your enquiry - ${BUSINESS_NAME}`,
        text: [
          `Dear ${data.name},`,
          '',
          `Thank you for contacting ${BUSINESS_NAME}. We have received your enquiry about "${data.service}" and will get back to you shortly.`,
          '',
          `For urgent needs, call Samir Dadas at ${BUSINESS_PHONE}.`,
          '',
          'Build Stronger... Dig Deeper...',
          `${BUSINESS_NAME}, ${BUSINESS_ADDRESS}`,
        ].join('\n'),
      })
      .catch((err) => console.error('[smtp] Confirmation email failed:', err.message));
  }

  return res.json({ ok: true, message: 'Thank you! Your enquiry has been sent. We will contact you shortly.' });
});

// Serve the built React app
const dist = path.join(__dirname, '..', 'dist');
app.use(express.static(dist));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, () => console.log(`Balumama Earthmovers running on port ${PORT}`));

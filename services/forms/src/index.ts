export interface Env {
  DB: D1Database;
  /**
   * Global Turnstile secret — used when no per-site secret exists.
   * Per-site: TURNSTILE_SECRET_<SLUG_UPPERCASE_UNDERSCORED>
   * e.g. TURNSTILE_SECRET_VAIFOOU_CONSTRUCTION, TURNSTILE_SECRET_RC_ROOFING
   */
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY: string;
  /** Optional. If set, every site's contact notify is forced here (Resend sandbox testing only). */
  NOTIFY_EMAIL?: string;
  /** Same as NOTIFY_EMAIL. Prefer per-site D1 `notify_email` in production. */
  NOTIFY_EMAIL_OVERRIDE?: string;
  /** Defaults to Resend's test sender until a client domain is verified. */
  RESEND_FROM?: string;
  /** Extra origins as JSON array or comma-separated list. */
  ALLOWED_ORIGINS?: string;
  /** Notify emails per site per UTC day. Extra leads still save. Default 1000. */
  RESEND_DAILY_LIMIT?: string;
  /** Per-site Turnstile secrets — index signature for dynamic lookup. */
  [key: string]: unknown;
}

interface SiteRow {
  slug: string;
  name: string;
  notify_email: string;
  from_email: string;
  from_name: string;
  allowed_origins: string;
}

interface Submission {
  site: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
  turnstileToken: string;
}

interface PdfSummary {
  site: string;
  email: string;
  pdf: string;
  filename: string;
  website: string;
  turnstileToken: string;
}

interface ResendEmail {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: string }[];
  idempotencyKey?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 254, phone: 40, message: 5000 };
const MAX_PDF_B64 = 3_500_000;
const DEFAULT_RESEND_DAILY_LIMIT = 1000;
const PDF_KIND = 'checkup-pdf';
const DEFAULT_PDF_FILENAME = 'vaifoou-construction-submission.pdf';

/**
 * Resolve the Turnstile secret for a given site slug.
 * Checks per-site secret first (e.g. TURNSTILE_SECRET_VAIFOOU_CONSTRUCTION),
 * then falls back to the global TURNSTILE_SECRET.
 */
function resolveTurnstileSecret(env: Env, siteSlug: string): string {
  const key = `TURNSTILE_SECRET_${siteSlug.toUpperCase().replace(/-/g, '_')}`;
  const perSite = env[key];
  if (typeof perSite === 'string' && perSite) return perSite;
  return typeof env.TURNSTILE_SECRET === 'string' ? env.TURNSTILE_SECRET : '';
}

/** Always allowed so local + Vercel preview/prod work before a custom domain exists. */
const DEFAULT_ORIGIN_PATTERNS = [
  'http://localhost:*',
  'http://127.0.0.1:*',
  'https://*.vercel.app',
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({ ok: true, service: 'massic-forms' });
    }

    if (request.method === 'OPTIONS') {
      if (!originAllowed(origin, defaultPatterns(env))) {
        return json({ ok: false, error: 'Origin not allowed' }, 403);
      }
      return cors(origin, new Response(null, { status: 204 }));
    }

    const patterns = defaultPatterns(env);

    if (request.method !== 'POST') {
      return withCors(origin, patterns, json({ ok: false, error: 'Method not allowed' }, 405));
    }

    if (url.pathname === '/email-summary') {
      return handleEmailSummary(request, env, origin, patterns);
    }

    if (url.pathname !== '/submit' && url.pathname !== '/') {
      return withCors(origin, patterns, json({ ok: false, error: 'Not found' }, 404));
    }

    return handleSubmit(request, env, origin, patterns);
  },
};

async function handleSubmit(request: Request, env: Env, origin: string, patterns: string[]): Promise<Response> {
  try {
    const body = await readBody(request);

    if (body.website) {
      return withCors(origin, patterns, json({ ok: true }));
    }

    const parsed = validate(body);
    if ('error' in parsed) {
      return withCors(origin, patterns, json({ ok: false, error: parsed.error }, 400));
    }

    const site = await env.DB.prepare('SELECT * FROM sites WHERE slug = ?')
      .bind(parsed.site)
      .first<SiteRow>();

    if (!site) {
      return withCors(origin, patterns, json({ ok: false, error: 'Unknown site' }, 400));
    }

    const allowed = [...patterns, ...parseOrigins(site.allowed_origins)];
    if (origin && !originAllowed(origin, allowed)) {
      return json({ ok: false, error: 'Origin not allowed' }, 403);
    }

    const turnstileSecret = resolveTurnstileSecret(env, parsed.site);
    const turnstileOk = await verifyTurnstile(parsed.turnstileToken, turnstileSecret, request);
    if (!turnstileOk) {
      return withCors(origin, allowed, json({ ok: false, error: 'Spam check failed' }, 400));
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO leads (id, site_slug, name, email, phone, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, site.slug, parsed.name, parsed.email, parsed.phone || null, parsed.message, createdAt)
      .run();

    const dailyLimit = parseDailyLimit(env.RESEND_DAILY_LIMIT);
    const sentToday = await emailsSentToday(env.DB, site.slug, utcDayStartIso());

    if (sentToday >= dailyLimit) {
      console.warn(`Resend skipped: ${site.slug} hit daily cap (${dailyLimit})`);
    } else {
      const notifyTo = site.notify_email;
      const from = site.from_email;

      const sent = await sendResend(env.RESEND_API_KEY, {
        from,
        to: notifyTo,
        replyTo: parsed.email,
        subject: `New website inquiry: ${parsed.name}`,
        html: emailHtml(site.name, parsed),
        text: emailText(site.name, parsed),
        idempotencyKey: `lead/${site.slug}/${id}`,
      });

      if (sent.ok) {
        await env.DB.prepare('UPDATE leads SET email_sent_at = ? WHERE id = ?')
          .bind(new Date().toISOString(), id)
          .run();
      }
    }

    // Lead is in D1. Never tell the visitor whether Resend ran.
    return withCors(origin, allowed, json({ ok: true }));
  } catch (err) {
    console.error('submit failed', err);
    return withCors(origin, patterns, json({ ok: false, error: 'Unable to submit right now' }, 500));
  }
}

async function handleEmailSummary(request: Request, env: Env, origin: string, patterns: string[]): Promise<Response> {
  try {
    const body = await readBody(request);

    if (body.website) {
      return withCors(origin, patterns, json({ ok: true }));
    }

    const parsed = validatePdfSummary(body);
    if ('error' in parsed) {
      return withCors(origin, patterns, json({ ok: false, error: parsed.error }, 400));
    }

    const site = await env.DB.prepare('SELECT * FROM sites WHERE slug = ?')
      .bind(parsed.site)
      .first<SiteRow>();

    if (!site) {
      return withCors(origin, patterns, json({ ok: false, error: 'Unknown site' }, 400));
    }

    const allowed = [...patterns, ...parseOrigins(site.allowed_origins)];
    if (origin && !originAllowed(origin, allowed)) {
      return json({ ok: false, error: 'Origin not allowed' }, 403);
    }

    const turnstileSecret2 = resolveTurnstileSecret(env, parsed.site);
    const turnstileOk = await verifyTurnstile(parsed.turnstileToken, turnstileSecret2, request);
    if (!turnstileOk) {
      return withCors(origin, allowed, json({ ok: false, error: 'Spam check failed' }, 400));
    }

    const dailyLimit = parseDailyLimit(env.RESEND_DAILY_LIMIT);
    const sentToday = await outboundSentToday(env.DB, site.slug, PDF_KIND, utcDayStartIso());

    if (sentToday >= dailyLimit) {
      return withCors(
        origin,
        allowed,
        json({ ok: false, error: 'Daily email limit reached. Download or print instead.' }, 429)
      );
    }

    const from = site.from_email;
    const sendId = crypto.randomUUID();
    const replyTo = isPlaceholderEmail(site.notify_email) ? undefined : site.notify_email;

    const sent = await sendResend(env.RESEND_API_KEY, {
      from,
      to: parsed.email,
      replyTo,
      subject: `Your ${site.name} check-up summary`,
      html: pdfEmailHtml(site.name),
      text: pdfEmailText(site.name),
      attachments: [
        {
          filename: parsed.filename,
          content: parsed.pdf,
        },
      ],
      idempotencyKey: `checkup-pdf/${site.slug}/${sendId}`,
    });

    if (!sent.ok) {
      return withCors(origin, allowed, json({ ok: false, error: sent.error }, 502));
    }

    await recordOutboundSend(env.DB, sendId, site.slug, PDF_KIND);

    return withCors(origin, allowed, json({ ok: true }));
  } catch (err) {
    console.error('email-summary failed', err);
    return withCors(origin, patterns, json({ ok: false, error: 'Unable to send right now' }, 500));
  }
}

function defaultPatterns(env: Env): string[] {
  return [...DEFAULT_ORIGIN_PATTERNS, ...parseEnvOrigins(env.ALLOWED_ORIGINS)];
}

function withCors(origin: string, patterns: string[], response: Response): Response {
  if (origin && originAllowed(origin, patterns)) {
    return cors(origin, response);
  }
  return response;
}

function cors(origin: string, response: Response): Response {
  const headers = new Headers(response.headers);
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Max-Age', '86400');
  return new Response(response.body, { status: response.status, headers });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function originMatches(origin: string, pattern: string): boolean {
  if (!origin || !pattern) return false;
  if (origin === pattern) return true;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*');
  return new RegExp(`^${escaped}$`, 'i').test(origin);
}

function originAllowed(origin: string, patterns: string[]): boolean {
  return patterns.some((pattern) => originMatches(origin, pattern));
}

function parseEnvOrigins(raw?: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    /* comma-separated */
  }
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function readBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    const data = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v == null ? '' : String(v)]));
  }

  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}

function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

function isValidPhone(phone: string): boolean {
  const digits = phoneDigits(phone);
  if (digits.length === 11 && digits.startsWith('1')) return true;
  return digits.length >= 10 && digits.length <= 15;
}

function validate(body: Record<string, string>): Submission | { error: string } {
  const site = (body.site || '').trim();
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const message = (body.message || '').trim();
  const website = (body.website || '').trim();
  const turnstileToken = (body['cf-turnstile-response'] || body.turnstileToken || '').trim();

  if (!site) return { error: 'Missing site' };
  if (name.length < 1 || name.length > MAX.name) return { error: 'Enter your name' };
  if (!EMAIL_RE.test(email) || email.length > MAX.email) return { error: 'Enter a valid email' };
  if (!isValidPhone(phone) || phone.length > MAX.phone) return { error: 'Enter a valid phone number' };
  if (message.length < 1 || message.length > MAX.message) return { error: 'Enter a message' };
  if (!turnstileToken) return { error: 'Spam check is required' };

  return { site, name, email, phone, message, website, turnstileToken };
}

function validatePdfSummary(body: Record<string, string>): PdfSummary | { error: string } {
  const site = (body.site || '').trim();
  const email = (body.email || '').trim();
  const website = (body.website || '').trim();
  const turnstileToken = (body['cf-turnstile-response'] || body.turnstileToken || '').trim();
  const pdf = normalizePdfBase64(body.pdf || '');
  const filename = sanitizeFilename(body.filename || '');

  if (!site) return { error: 'Missing site' };
  if (!EMAIL_RE.test(email) || email.length > MAX.email) return { error: 'Enter a valid email' };
  if (!pdf) return { error: 'Missing PDF' };
  if (pdf.length > MAX_PDF_B64) return { error: 'PDF is too large' };
  if (!turnstileToken) return { error: 'Spam check is required' };

  return { site, email, pdf, filename, website, turnstileToken };
}

function normalizePdfBase64(raw: string): string {
  const trimmed = raw.trim().replace(/\s/g, '');
  const comma = trimmed.indexOf(',');
  if (trimmed.startsWith('data:') && comma !== -1) return trimmed.slice(comma + 1);
  return trimmed;
}

function sanitizeFilename(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80);
  return cleaned.toLowerCase().endsWith('.pdf') ? cleaned : DEFAULT_PDF_FILENAME;
}

function parseOrigins(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

async function verifyTurnstile(token: string, secret: string, request: Request): Promise<boolean> {
  if (!secret) return false;
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function parseDailyLimit(raw?: string): number {
  const n = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_RESEND_DAILY_LIMIT;
  return n;
}

function utcDayStartIso(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

async function emailsSentToday(db: D1Database, siteSlug: string, sinceIso: string): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM leads
       WHERE site_slug = ?
         AND email_sent_at IS NOT NULL
         AND email_sent_at >= ?`
    )
    .bind(siteSlug, sinceIso)
    .first<{ n: number | string }>();
  return Number(row?.n ?? 0);
}

async function outboundSentToday(
  db: D1Database,
  siteSlug: string,
  kind: string,
  sinceIso: string
): Promise<number> {
  try {
    const row = await db
      .prepare(
        `SELECT COUNT(*) AS n FROM outbound_sends
         WHERE site_slug = ?
           AND kind = ?
           AND created_at >= ?`
      )
      .bind(siteSlug, kind, sinceIso)
      .first<{ n: number | string }>();
    return Number(row?.n ?? 0);
  } catch (err) {
    console.warn('outbound_sends lookup failed — run schema.sql', err);
    return 0;
  }
}

async function recordOutboundSend(db: D1Database, id: string, siteSlug: string, kind: string): Promise<void> {
  try {
    await db
      .prepare(`INSERT INTO outbound_sends (id, site_slug, kind, created_at) VALUES (?, ?, ?, ?)`)
      .bind(id, siteSlug, kind, new Date().toISOString())
      .run();
  } catch (err) {
    console.warn('outbound_sends insert failed — run schema.sql', err);
  }
}

function hasRealResendKey(apiKey?: string): boolean {
  if (!apiKey) return false;
  return apiKey.startsWith('re_') && apiKey.length > 20 && !/x{4,}/i.test(apiKey);
}

function isPlaceholderEmail(value: string): boolean {
  return /@example\.com$/i.test(value.trim());
}

async function sendResend(
  apiKey: string | undefined,
  email: ResendEmail
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasRealResendKey(apiKey)) {
    console.warn('Resend skipped: set a real RESEND_API_KEY on the Worker');
    return { ok: false, error: 'Unable to send email right now. Download or print instead.' };
  }

  const payload: Record<string, unknown> = {
    from: email.from,
    to: [email.to],
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  if (email.replyTo && !isPlaceholderEmail(email.replyTo)) payload.reply_to = email.replyTo;
  if (email.attachments?.length) payload.attachments = email.attachments;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (email.idempotencyKey) headers['Idempotency-Key'] = email.idempotencyKey;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend failed', res.status, errText);
    return { ok: false, error: resendUserError(res.status, errText) };
  }
  return { ok: true };
}

function resendUserError(status: number, errText: string): string {
  let message = '';
  try {
    const parsed = JSON.parse(errText) as { message?: string };
    if (typeof parsed.message === 'string') message = parsed.message;
  } catch {
    /* ignore */
  }
  if (
    status === 403 ||
    /testing emails|verify a domain|onboarding@resend\.dev/i.test(message)
  ) {
    return 'Resend is still in test mode. Use the email address on the Resend account, or verify a sending domain.';
  }
  return 'Unable to send email right now. Download or print instead.';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailHtml(siteName: string, lead: Submission): string {
  return `
    <p>New inquiry from <strong>${escapeHtml(siteName)}</strong></p>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'Not provided')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, '<br />')}</p>
  `;
}

function emailText(siteName: string, lead: Submission): string {
  return [
    `New inquiry from ${siteName}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || 'Not provided'}`,
    '',
    lead.message,
  ].join('\n');
}

function pdfEmailHtml(siteName: string): string {
  return `
    <p>Your ${escapeHtml(siteName)} check-up summary is attached as a PDF.</p>
    <p>We do not keep a copy of the file or of the answers in it. Download or print remains the option that never leaves your device.</p>
  `;
}

function pdfEmailText(siteName: string): string {
  return [
    `Your ${siteName} check-up summary is attached as a PDF.`,
    '',
    'We do not keep a copy of the file or of the answers in it.',
    'Download or print remains the option that never leaves your device.',
  ].join('\n');
}

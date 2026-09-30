# Onboarding — New client site

This is the only doc you need. Clone this repo, fill the files below, implement the Figma file, connect the stack, deploy.

The site is **Astro v7 + Tailwind v4 + Sanity + Vercel**. Every client keeps the same stack (CMS, forms/Resend, GTM, Search Console, reviews, blog, legal). What changes is identity, the design system, and page frames from Figma.

**Do not invent layout from a content brief.** Figma is the design source of truth.

When a Figma file arrives, build in this order — never skip ahead to full pages:

```
1. Design system   →  src/brand.ts (colors, type, radius) + site/contact identity
2. Atoms           →  restyle Button, Headline, inputs, cards to match Figma
3. Sections        →  one reusable widget per pattern (FAQ, hero, CTA, …)
4. Pages           →  compose those widgets; do not paste unique markup
5. Connect         →  .env, Sanity, forms, GTM, GSC
6. npm run build, deploy
```

---

## 1. Commands

Node `>= 22.12`.

| Command | Purpose |
|---|---|
| `npm install` | Install |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build |
| `npm run check` | Astro check + ESLint + Prettier |
| `npm run studio` | Sanity Studio |

```bash
cp .env.example .env
npm install
npm run dev
```

---

## 2. Files to edit per client

Do not put client details in `src/config.yaml` (that file is framework plumbing). Secrets stay in `.env`, never in git.

| File | What |
|---|---|
| `src/brand.ts` | Colors, fonts, radius |
| `src/config/site.ts` | Name, URL, SEO description, GTM, Search Console, form slug |
| `src/config/contact.ts` | Phone, email, address, hours (name comes from `site.ts`) |
| `src/config/social.ts` | Profile URLs |
| `src/config/cta.ts` | Button label + optional note |
| `src/config/schema/business.ts` | Schema extras only (`businessType`, `priceRange`, credentials) |
| `src/data/navigation.ts` | Header / footer links (legal links are added automatically) |
| `src/assets/images/logo.webp` | Logo |
| `public/favicon*` | Favicons |
| `.env` | Sanity, Turnstile, Places, Yelp, ISR secrets |
| `studio/.env` | Same Sanity project ID + Studio hostname |
| `vercel.json` | Host allowlist for indexing (match `site.url`) |

### `src/brand.ts`

If Figma has Variables or a Design System frame: copy color, type (desktop **and** mobile when both exist), and radius into `brand`. See the `tokens` rule — only derive mobile type if Figma has no mobile type.

If it does not: walk a few representative frames. Collect the most-used fills, text styles (family, weight), and corner radius. Skip one-off swatches.

Components use tokens (`text-heading`, `text-muted`, `bg-card-dark`, `bg-section-grey`, `bg-cta`, `text-accent`). Never hardcode hex in widgets or pages.

### `src/config/site.ts`

```ts
export const site = {
  name: 'Client Name',
  url: 'https://clientdomain.com',
  description: 'One-sentence SEO description.',
  formSlug: 'client-slug',
  analytics: {
    googleTagManagerId: 'GTM-XXXXXXX',
    googleAnalyticsId: '',
    googleSiteVerificationId: '', // Search Console HTML-tag content= value
  },
};
```

---

## 3. Figma build order

Authenticate the Figma MCP if tools are missing (`mcp_auth`). Then stop after each phase until it matches Figma. Do not start composing homepage sections before atoms look right.

### Phase 1 — Design system

Find Variables, a Design System / Foundations frame, or walk a few representative screens.

Put the result in `src/brand.ts`:

- Colors (accent, heading, muted, page, section, CTA, buttons)
- Fonts (heading + body family, weights) — `astro.config.ts` reads `brandFontConfig()`
- Radius

Also fill identity: `src/config/site.ts`, `contact.ts`, `social.ts`, `cta.ts`, logo, favicons.

Do not create a token per one-off swatch. Do not hardcode hex in components.

### Phase 2 — Atoms

Restyle the shared primitives in `src/components/ui/` so they match Figma. These are used everywhere — get them right before sections.

| Atom | File |
|---|---|
| Buttons | `src/components/ui/Button.astro` (`primary`, `secondary`, `ghost-light`, `ghost-dark`, `link`) |
| Headings | `src/components/ui/Headline.astro` |
| Cards | `InfoCard`, `ServiceCard`, `CardWrapper` |
| Icon + text | `IconPoint.astro` |

Change look via `brand.ts` tokens and these files. Do **not** add `HomeButton.astro` or a second FAQ toggle. If Figma shows a new atom (chip, badge, tab), add **one** primitive and reuse it.

### Phase 3 — Sections (standard widgets)

One pattern = one component, used on every page that needs it.

| Figma section | Component | Use it for |
|---|---|---|
| Hero / masthead | `Hero2` | Every page hero |
| FAQ accordion | `FAQs` | Home, services, contact — same component, different `items` |
| Text + side image | `Content` | |
| Steps / process | `Timeline` | |
| Linked cards | `ServiceCard` | |
| Heading + desc cards | `InfoCard` | |
| Page-ending CTA | `CTABanner` | Last band on pages that need it |
| Header / footer | `Header`, `Footer` | Site chrome |

Inventory: `src/registry/components.json`.

If Figma’s FAQ (or hero, CTA, …) differs from the current widget, **restyle that widget** until it matches. Do not fork `HomeFAQ` / `ServicesFAQ`. Props and slots carry copy and optional light/dark — not a new file.

New unique section shape → one new widget, register it, then use it on every page that has that shape. Never paste the markup into a page file.

Cards with a link: card `flex flex-col h-full`, body `flex-1`, CTA `mt-auto`.

### Phase 4 — Pages

For each Figma page frame, top to bottom:

1. Screenshot + structure.
2. Compose `src/pages/[route]/index.astro` from the widgets in phase 3.
3. Match backgrounds, spacing, image side, and item counts from the frame.
4. Copy and images come from Figma or CMS fields filled to match it.

Sanity CMS pages render through `src/pages/[...blog]/index.astro` — no new Astro file per CMS slug.

Always-on routes (restyle, do not delete): `/contact`, `/reviews`, `/blog`, `/privacy-policy`, `/terms`, `/accessibility`.

---

## 4. Always-on stack (do not remove)

| System | Where |
|---|---|
| Sanity | `studio/`, `src/lib/content/`, catch-all pages, `/api/revalidate` |
| Forms → Resend | `/contact` → Cloudflare Worker (`services/forms/`) → Resend |
| Turnstile | `PUBLIC_TURNSTILE_SITE_KEY` on the form; Worker secret `TURNSTILE_SECRET` |
| GTM | `site.analytics.googleTagManagerId` → `Layout.astro` |
| Search Console | `site.analytics.googleSiteVerificationId` |
| JSON-LD | `src/config/schema/` + `JsonLd.astro` |
| Reviews | `/reviews`, `/api/reviews`, daily cron in `vercel.json` |
| Blog | `/blog`, `/blog/[slug]`, `rss.xml.ts` |
| Legal | `/privacy-policy`, `/terms`, `/accessibility` |

---

## 5. Accounts to provision

Log credentials in 1Password / Bitwarden, never in git.

| Service | Create |
|---|---|
| GitHub | Private repo for this client |
| Vercel | Project linked to that repo |
| Sanity | Project + `production` dataset + Studio hostname |
| Google Tag Manager | Container → `GTM-XXXXXXX` |
| Google Search Console | Domain or URL-prefix property |
| Google Places | API key + Place ID (reviews) |
| Yelp Fusion | API key + business ID (reviews) |
| Cloudflare Turnstile | Site key for the client domain |
| Cloudflare Worker | New `sites` row on the shared form Worker |
| Resend | Sending domain (or `onboarding@resend.dev` until verified) |

---

## 6. Environment variables

Copy `.env.example` → `.env`. Set the same keys on Vercel (Production + Preview).

| Variable | Required | Notes |
|---|---|---|
| `SANITY_PROJECT_ID` | Yes | Sanity → Settings → API |
| `SANITY_DATASET` | Yes | Usually `production` |
| `SANITY_API_TOKEN` | Yes | Viewer (read-only) token |
| `SANITY_WRITE_TOKEN` | Migration only | Editor token |
| `SANITY_REVALIDATE_SECRET` | Yes | `openssl rand -hex 32` — also paste on the Sanity webhook |
| `ISR_BYPASS_TOKEN` | Yes | `openssl rand -hex 32` — Vercel ISR bypass |
| `PUBLIC_FORM_ENDPOINT` | Yes | Worker `/submit` URL |
| `PUBLIC_TURNSTILE_SITE_KEY` | Yes | Dummy `1x00000000000000000000AA` is fine locally |
| `PUBLIC_SITE_SLUG` | Yes | Must match D1 `sites.slug` and `site.formSlug` |
| `SITE_URL` | Yes | Canonical URL, no trailing slash |
| `GOOGLE_PLACES_API_KEY` | Optional | Empty skips Google reviews |
| `GOOGLE_PLACE_ID` | Optional | |
| `GOOGLE_REVIEWS_URL` | Optional | “View all” link |
| `YELP_API_KEY` | Optional | Empty skips Yelp reviews |
| `YELP_BUSINESS_ID` | Optional | |
| `YELP_REVIEWS_URL` | Optional | |

**Never put `RESEND_API_KEY` or `TURNSTILE_SECRET` on Vercel.** Those belong on the Worker.

`studio/.env`: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_HOSTNAME`.

GTM and Search Console are **not** env vars — they go in `src/config/site.ts`.

---

## 7. Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage).
2. Fill `.env` and `studio/.env`.
3. `npm run studio` and confirm it connects.
4. Create the singletons (Home, Contact, Reviews, Navigation, Footer) plus any `servicePage` / blog documents the site needs.
5. Optional seed from this repo: `npm run migrate:to-sanity` (needs `SANITY_WRITE_TOKEN`).

Webhook (instant publish, no rebuild):

| Field | Value |
|---|---|
| URL | `https://clientdomain.com/api/revalidate` |
| Method | `POST` |
| Trigger | Create, Update, Delete |
| Filter | `!(_id in path("drafts.**"))` |
| Authorization | `Bearer <SANITY_REVALIDATE_SECRET>` |

---

## 8. Contact form (shared Worker)

Leads go to the agency Cloudflare Worker + D1, then Resend. They do not go in Sanity.

From `services/forms/`:

```bash
npx wrangler login
npx wrangler d1 execute massic-forms --remote --file=./schema.sql   # first time only
```

Insert one D1 row per client (`slug` = `PUBLIC_SITE_SLUG`):

```sql
INSERT OR REPLACE INTO sites (slug, name, notify_email, from_email, from_name, allowed_origins)
VALUES (
  'client-slug',
  'Client Legal Name',
  'hello@client.com',
  'Client Name <onboarding@resend.dev>',
  'Client Legal Name',
  '["http://localhost:4321","https://*.vercel.app","https://clientdomain.com","https://www.clientdomain.com"]'
);
```

Worker secrets (once per Worker, not per Vercel project):

```bash
npx wrangler secret put TURNSTILE_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NOTIFY_EMAIL
npx wrangler deploy
```

Until the client domain is verified in Resend, send **from** `onboarding@resend.dev` **to** the Resend account inbox.

Local: `PUBLIC_FORM_ENDPOINT=http://localhost:8787/submit` and `npm run dev` inside `services/forms/`.

---

## 9. Deploy

1. Push to GitHub. Vercel → Import project (Astro is auto-detected).
2. Paste env vars. Deploy.
3. Connect the Sanity webhook (section 7).
4. Search Console: add the property. For the HTML tag method, paste the `content=` value into `site.analytics.googleSiteVerificationId`.
5. `vercel.json` host list: add the real apex + `www` (replace `example.com`) so production can index.

### Custom domain

- Register the domain at the registrar (not Vercel). Add the hostname on the Vercel project for SSL.
- Cloudflare DNS **grey cloud** (DNS only) if you use Cloudflare for DNS:

```
CNAME   @     cname.vercel-dns.com    DNS only
CNAME   www   cname.vercel-dns.com    DNS only
```

- Set `site.url` and `SITE_URL` to the canonical host, then rebuild.
- Add both hosts to D1 `allowed_origins` and to the Turnstile widget.
- After Resend verifies the domain, switch `RESEND_FROM` / `from_email` off `onboarding@resend.dev`.

---

## 10. Go-live checklist

- [ ] Design system in `src/brand.ts` matches Figma (color, type, radius)
- [ ] Atoms restyled (Button, Headline, form, cards) — no per-page forks
- [ ] Sections are shared widgets (one FAQ, one hero, one CTA band)
- [ ] Pages composed from those widgets
- [ ] `src/config/site.ts`, `contact.ts`, `social.ts`, `cta.ts` filled
- [ ] Logo + favicons replaced
- [ ] `npm run build` succeeds
- [ ] `/contact` submits; lead in D1; email arrives
- [ ] GTM container firing
- [ ] Search Console verified; sitemap submitted
- [ ] Reviews show (or empty-state if keys are not set yet)
- [ ] JSON-LD looks right at [validator.schema.org](https://validator.schema.org)
- [ ] Home, contact, blog, legal, mobile menu checked in the browser

---

## Do not

- Invent section order, card counts, or palette from a copy doc
- Skip atoms and jump straight to full-page markup
- Fork FAQ / Button / Hero per page (`HomeFAQ`, `ServicesFAQ`, …)
- Delete Sanity, forms, GTM, GSC, reviews, blog, or legal wiring
- Hardcode hex in components
- Put Resend / Turnstile secrets on Vercel
- Orange-cloud the client domain on Cloudflare (breaks Vercel SSL)

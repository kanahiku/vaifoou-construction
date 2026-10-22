/**
 * Seed the Sanity homepage singleton with the baseline copy from `src/data/home-defaults.ts`.
 *
 *   npm run seed:home              # dry run — prints what would change
 *   npm run seed:home -- --write   # fill EMPTY fields only (never overwrites editor changes)
 *
 * Safe to re-run. Existing images and any text an editor has already entered are preserved.
 * The previous document is saved to `data/backups/` before writing.
 *
 * It also migrates the legacy top-level `audienceCards` array into `intro.audienceCards`
 * (keeping the uploaded images) and adds the new label / button text fields.
 */
import { createClient } from '@sanity/client';
import { mkdirSync, writeFileSync } from 'node:fs';
import { HOME_DEFAULTS } from '../src/data/home-defaults';

const DOC_ID = 'singleton-home';
const write = process.argv.includes('--write');

const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN (or SANITY_API_TOKEN) in .env');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? '2481svtr',
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-15',
  useCdn: false,
  token,
});

type Json = Record<string, unknown>;
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const isEmpty = (v: unknown) =>
  v === undefined || v === null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0);

let keyCounter = 0;
const key = (prefix: string) => `${prefix}-${++keyCounter}`;

/** Fill only missing values in `target` from `source`. Arrays are all-or-nothing. */
function fillMissing(target: Json, source: Json): Json {
  const out: Json = { ...target };
  for (const [name, value] of Object.entries(source)) {
    if (isObject(value)) {
      out[name] = fillMissing(isObject(out[name]) ? (out[name] as Json) : {}, value);
    } else if (isEmpty(out[name])) {
      out[name] = value;
    }
  }
  return out;
}

const withKeys = (items: Json[], type: string, prefix: string) =>
  items.map((item) => ({ _key: key(prefix), _type: type, ...item }));

const d = HOME_DEFAULTS;
const existing = (await client.fetch<Json | null>(`*[_id == $id][0]`, { id: DOC_ID })) ?? { _id: DOC_ID, _type: 'homePage' };

// 1. Move legacy top-level audienceCards (with their images) into intro.audienceCards.
const legacyCards = (Array.isArray(existing.audienceCards) ? existing.audienceCards : []) as Json[];
const existingIntro = isObject(existing.intro) ? existing.intro : {};
const currentCards = (Array.isArray(existingIntro.audienceCards) ? existingIntro.audienceCards : legacyCards) as Json[];

const audienceCards = (currentCards.length ? currentCards : d.intro.audienceCards).map((card, i) => {
  const def = d.intro.audienceCards[i] ?? ({} as Json);
  const base = { _key: key('card'), _type: 'homeAudienceCard', ...(card as Json) };
  return fillMissing(base, def as unknown as Json);
});

// 2. Fill every other empty field from the defaults.
const defaults: Json = {
  seo: d.seo,
  hero: { heading: d.hero.heading, subheading: d.hero.subheading, trustBadges: d.hero.trustBadges },
  intro: { heading: d.intro.heading, body: d.intro.body },
  services: {
    heading: d.services.heading,
    items: withKeys(d.services.items as unknown as Json[], 'homeServiceCard', 'service'),
  },
  highlightBanner: {
    heading: d.highlightBanner.heading,
    body: d.highlightBanner.body,
    ctaLabel: d.highlightBanner.ctaLabel,
    ctaHref: d.highlightBanner.ctaHref,
  },
  serviceAreas: {
    heading: d.serviceAreas.heading,
    body: d.serviceAreas.body,
    ctaLabel: d.serviceAreas.ctaLabel,
    ctaHref: d.serviceAreas.ctaHref,
    areas: withKeys(d.serviceAreas.areas as unknown as Json[], 'homeServiceArea', 'area'),
  },
  reviews: d.reviews,
  cta: d.cta,
};

const { audienceCards: _legacy, ...rest } = existing;
const next = fillMissing(rest, defaults);
(next.intro as Json).audienceCards = audienceCards;

// Strip Sanity system fields we must not resend.
delete next._rev;
delete next._createdAt;
delete next._updatedAt;
next._id = DOC_ID;
next._type = 'homePage';

console.log(JSON.stringify(next, null, 2));

if (!write) {
  console.log('\nDry run only. Re-run with `-- --write` to apply.');
  process.exit(0);
}

mkdirSync('data/backups', { recursive: true });
const backupPath = `data/backups/home-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
writeFileSync(backupPath, JSON.stringify(existing, null, 2));
console.log(`\nBackup saved: ${backupPath}`);

await client.createOrReplace(next as Json & { _id: string; _type: string });
console.log(`Updated ${DOC_ID}. Publish state: written directly to the published document.`);

/**
 * Seed the About page into Sanity (copy = the previous hard-coded page).
 *
 *   npm run seed:about              # dry run
 *   npm run seed:about -- --write   # create / fill EMPTY fields only
 *
 * Images are carried over from the legacy `aboutPageMedia` document (not modified or deleted).
 * `{license}` in text is replaced with the contractor license from config at render time.
 */
import { createClient } from '@sanity/client';
import { mkdirSync, writeFileSync } from 'node:fs';

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

type Json = Record<string, any>;
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const isEmpty = (v: unknown) =>
  v === undefined || v === null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && v.length === 0);
function fillMissing(target: Json, source: Json): Json {
  const out: Json = { ...target };
  for (const [name, value] of Object.entries(source)) {
    if (value === undefined) continue;
    if (isObject(value)) out[name] = fillMissing(isObject(out[name]) ? out[name] : {}, value);
    else if (isEmpty(out[name])) out[name] = value;
  }
  return out;
}
function prune<T>(v: T): T {
  if (Array.isArray(v)) return v.map(prune) as T;
  if (isObject(v)) {
    const out: Json = {};
    for (const [k, val] of Object.entries(v)) if (val !== undefined && val !== null && val !== '') out[k] = prune(val);
    return out as T;
  }
  return v;
}


const legacy = await client.fetch<Json | null>(`*[_id == "singleton-about-page-media"][0]{heroImage, legacyImage, siaosiImage}`);
const id = 'singleton-about';
const existing = await client.fetch<Json | null>(`*[_id == $id][0]`, { id });

const doc = prune({
  _id: id,
  _type: 'aboutPage',
  seo: {
    title: 'Our Story | Vaifoou Construction',
    description:
      "Learn about Vaifoou Construction LLC, a locally and family-owned O'ahu masonry contractor built on a 25+ year legacy of quality concrete and rock wall construction.",
  },
  hero: {
    heading: 'Vaifoou Construction LLC',
    body: "A locally and family-owned masonry and concrete contractor serving O'ahu, built on a 25+ year legacy in the trade.",
    image: legacy?.heroImage,
  },
  story: {
    heading: 'Our Story',
    body: "Vaifoou Construction LLC is a locally and family-owned masonry and concrete contractor serving O'ahu. While our company operates under a modern structure today, our foundation is built on a family legacy spanning more than 25 years in the trade.",
  },
  legacy: {
    heading: 'A 25+ Year Family Legacy',
    paragraphs: [
      'Our roots in the masonry trade began around 2000 when our father first started running the business. For over two decades, the standards for heavy-duty concrete flatwork and basalt rock wall construction passed down from father to sons.',
      'From 2008 until September 2023, a brother carried the business forward on referrals, executing masonry projects around the Waikele Golf Course area. Siaosi Vaifoou later left his full-time career to formally take over the operations.',
      'Today, Vaifoou Construction LLC operates as a fully licensed entity ({license}) backed by a dedicated, core crew.',
    ],
    timeline: [
      { year: '~2000', label: 'Father founds the masonry business' },
      { year: '2008', label: 'Brother continues operations on referrals near Waikele' },
      { year: 'Sept 2023', label: 'Siaosi Vaifoou takes formal ownership' },
      { year: 'Today', label: "Fully licensed ({license}), core crew, serving all O'ahu" },
    ].map((t, i) => ({ _key: `tl-${i}`, _type: 'aboutTimelineItem', ...t })),
    image: legacy?.legacyImage,
  },
  values: {
    heading: 'Our Values',
    body: 'Our work is guided by our faith and our family.',
    items: [
      { label: 'Closed on Sundays', body: 'Our operations are closed on Sundays every week, without exception.' },
      {
        label: 'Workmanship Guarantee',
        body: "Every site we manage across O'ahu is backed by a workmanship guarantee. We stand behind the structures we build because we intend them to last.",
      },
      {
        label: 'Family Legacy',
        body: 'The standards and craft passed from our father to his sons guide every project. Our 25+ year trade legacy is not a marketing line — it is the lived history of our crew.',
      },
    ].map((v, i) => ({ _key: `val-${i}`, _type: 'aboutValue', ...v })),
  },
  crew: {
    leaderImage: legacy?.siaosiImage,
    heading: 'Our Crew',
    body: 'Three Vaifoous on the crew. The people who quote your job are the people who show up to build it.',
    members: [
      { name: 'Siaosi Vaifoou', role: 'Owner' },
      { name: 'Taliauli Vaifoou', role: 'Foreman' },
      { name: 'Nelo Vaifoou', role: 'Mason Setter' },
      { name: 'Tau Heimoana', role: 'Operator' },
      { name: 'Pohaku Kaahu', role: 'Labor' },
    ].map((m, i) => ({ _key: `crew-${i}`, _type: 'aboutCrewMember', ...m })),
  },
  cta: {
    heading: 'Work With Vaifoou Construction',
    note: "We bring our family's 25+ year trade legacy to every project site. Contact us to schedule an estimate for your masonry or concrete flatwork.",
  },
});

const merged = existing ? fillMissing(existing, doc) : doc;
for (const k of ['_rev', '_createdAt', '_updatedAt']) delete (merged as Json)[k];
const has = (v: any) => Boolean(v?.asset?._ref);
console.log(`${existing ? 'update' : 'create'}  ${id}  images: ${[merged.hero?.image, merged.legacy?.image].filter(has).length}`);
if (!write) {
  console.log('\nDry run. Re-run with `-- --write` to apply.');
  process.exit(0);
}
mkdirSync('data/backups', { recursive: true });
if (existing)
  writeFileSync(`data/backups/about-before-seed-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, JSON.stringify(existing, null, 2));
await client.createOrReplace(merged as Json & { _id: string; _type: string });
console.log('Wrote about page (published).');

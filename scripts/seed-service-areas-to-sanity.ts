/**
 * Seed the Service Areas hub and the 10 location pages into Sanity.
 *
 *   npm run seed:areas              # dry run
 *   npm run seed:areas -- --write   # create / fill EMPTY fields only (never overwrites editor changes)
 *
 * - Copy comes from `data/seed/service-areas.json` (+ the hub copy below).
 * - Images are carried over from the legacy image-only documents
 *   (`serviceAreaHubPageMedia`, `serviceAreaLocationPageMedia`), which are NOT modified or deleted.
 * - Each area's "projects" image is set to the project photo the old template picked for it
 *   (a deterministic pick from the four service-category project photos), so pages look the same.
 */
import { createClient } from '@sanity/client';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

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
let n = 0;
const keyed = (items: Json[] | undefined, type: string) =>
  (items ?? []).map((item) => ({ _key: `${type}-${++n}`, _type: type, ...item }));

const seed = JSON.parse(readFileSync('data/seed/service-areas.json', 'utf8')) as { hub: Json; locations: Json };

const HUB = {
  hero: {
    heading: "O'ahu Masonry & Concrete Service Areas",
    subheading: "Serving residential and commercial properties across the island of O'ahu.",
  },
  intro: {
    heading: 'Island-Wide Masonry & Concrete',
    body: "Operating from our main yard in Wahiawa, our crews build custom rock walls and concrete flatwork across O'ahu. We work with local property owners and serve as a concrete subcontractor to general contractors. Every project is backed by our 25+ year family legacy.",
  },
  communities: {
    heading: 'Communities We Serve',
    body: 'We deploy our crews from our home base in Wahiawa to job sites across the island.',
    cardLabel: 'View service area',
  },
  faqsHeading: "O'ahu Service Area FAQs",
  cta: {
    heading: "Start Your O'ahu Masonry Project",
    note: 'Contact us to discuss your masonry or concrete project. Every job is backed by our workmanship guarantee. Please note we are closed on Sundays.',
  },
};

// Generic "projects" copy the old AreaPageView hard-coded for every area.
const PROJECTS = {
  heading: 'View Our Projects',
  body: 'Explore our recent work and see the quality, care, and craftsmanship we bring to every project. From start to finish, our team is committed to dependable service, careful attention to detail, and results built to last.',
  ctaLabel: 'View Our Work',
  ctaHref: '/projects/',
};

const plans: Array<{ doc: Json; existing: Json | null }> = [];
const get = (id: string) => client.fetch<Json | null>(`*[_id == $id][0]`, { id });
const strip = (d: Json) => {
  for (const k of ['_rev', '_createdAt', '_updatedAt']) delete d[k];
  return d;
};

// Hub
{
  const legacy = await client.fetch<Json | null>(`*[_type == "serviceAreaHubPageMedia"][0]{heroImage, introImage}`);
  const id = 'singleton-service-areas-hub';
  const existing = await get(id);
  const doc = prune({
    _id: id,
    _type: 'serviceAreasHubPage',
    seo: { title: seed.hub.metadata.title, description: seed.hub.metadata.description },
    hero: { ...HUB.hero, image: legacy?.heroImage },
    intro: { ...HUB.intro, image: legacy?.introImage },
    communities: HUB.communities,
    faqs: { heading: HUB.faqsHeading, items: keyed(seed.hub.faqs.map((f: Json) => ({ question: f.title, answer: f.description })), 'serviceFaq') },
    cta: HUB.cta,
  });
  plans.push({ doc: strip(existing ? fillMissing(existing, doc) : doc), existing });
}

// Project photos the old template chose from
const categoryImages: Json[] = [];
for (const slug of ['rock-walls', 'retaining-walls', 'cmu-block-walls', 'concrete']) {
  const c = await get(`svc-category-${slug}`);
  if (c?.projects?.image?.asset) categoryImages.push(c.projects.image);
}

// Hub order (communities grid)
const order = ['wahiawa', 'honolulu', 'mililani', 'kaneohe', 'kailua', 'kapolei', 'north-shore', 'aiea-pearl-city', 'waipahu', 'ewa-beach'];

for (const [slug, loc] of Object.entries<Json>(seed.locations)) {
  const legacy = await client.fetch<Json | null>(
    `*[_type == "serviceAreaLocationPageMedia" && path == $path][0]{heroImage, introImage}`,
    { path: loc.path }
  );
  const hubName = seed.hub.areas.find((a: Json) => a.href === loc.path)?.name ?? loc.servicesHeading;
  const seedValue = [...loc.path].reduce((sum: number, ch: string) => sum + ch.charCodeAt(0), 0);
  const projectImage = categoryImages.length ? categoryImages[seedValue % categoryImages.length] : undefined;
  const id = `svc-area-${slug}`;
  const existing = await get(id);
  const doc = prune({
    _id: id,
    _type: 'serviceAreaPage',
    path: loc.path,
    name: hubName,
    order: order.indexOf(slug),
    seo: { title: loc.metadata.title, description: loc.metadata.description },
    hero: { heading: loc.hero.title, body: loc.hero.body, image: legacy?.heroImage },
    intro: { heading: loc.intro.heading, body: loc.intro.body, image: legacy?.introImage },
    services: {
      heading: loc.servicesHeading,
      cards: keyed(loc.services, 'serviceAreaCard'),
    },
    projects: { ...PROJECTS, image: projectImage },
    faqs: {
      heading: loc.faqs.title,
      items: keyed(loc.faqs.items.map((f: Json) => ({ question: f.title, answer: f.description })), 'serviceFaq'),
    },
    cta: { heading: loc.ctaHeading },
  });
  plans.push({ doc: strip(existing ? fillMissing(existing, doc) : doc), existing });
}

const has = (v: any) => Boolean(v?.asset?._ref);
for (const { doc, existing } of plans) {
  const imgs = [doc.hero?.image, doc.intro?.image, doc.projects?.image].filter((x) => x !== undefined);
  console.log(`${existing ? 'update' : 'create'}  ${doc._id.padEnd(40)} images: ${imgs.filter(has).length}`);
}
if (!write) {
  console.log(`\nDry run: ${plans.length} documents. Re-run with \`-- --write\` to apply.`);
  process.exit(0);
}
mkdirSync('data/backups', { recursive: true });
writeFileSync(
  `data/backups/service-areas-before-seed-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  JSON.stringify(plans.map((p) => p.existing).filter(Boolean), null, 2)
);
const tx = client.transaction();
for (const { doc } of plans) tx.createOrReplace(doc as Json & { _id: string; _type: string });
await tx.commit();
console.log(`\nWrote ${plans.length} documents (published).`);

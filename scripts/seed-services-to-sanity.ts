/**
 * Seed the Services hub, 4 category pages and 12 sub-pages into Sanity.
 *
 *   npm run seed:services              # dry run — prints a summary
 *   npm run seed:services -- --write   # create / fill EMPTY fields only (never overwrites editor changes)
 *
 * - Copy comes from `data/seed/services.json` (+ the hub copy below).
 * - Images are carried over from the legacy image-only documents
 *   (`serviceCategoryPageMedia`, `rockWallSubPageMedia`, `concreteServiceSubPageMedia`).
 *   Those legacy documents are NOT modified or deleted.
 * - Existing documents are backed up to `data/backups/` before writing.
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

/** Fill only missing values in `target` from `source`. Arrays are all-or-nothing. */
function fillMissing(target: Json, source: Json): Json {
  const out: Json = { ...target };
  for (const [name, value] of Object.entries(source)) {
    if (value === undefined) continue;
    if (isObject(value)) out[name] = fillMissing(isObject(out[name]) ? out[name] : {}, value);
    else if (isEmpty(out[name])) out[name] = value;
  }
  return out;
}

let n = 0;
const keyed = (items: Json[] | undefined, type: string) =>
  (items ?? []).map((item) => ({ _key: `${type}-${++n}`, _type: type, ...item }));

/** Remove undefined / empty-string leaves so Sanity docs stay clean. */
function prune<T>(v: T): T {
  if (Array.isArray(v)) return v.map(prune) as T;
  if (isObject(v)) {
    const out: Json = {};
    for (const [k, val] of Object.entries(v)) {
      if (val === undefined || val === null || val === '') continue;
      out[k] = prune(val);
    }
    return out as T;
  }
  return v;
}

const seed = JSON.parse(readFileSync('data/seed/services.json', 'utf8')) as { categories: Json; subPages: Json };

// ─── Services hub copy (was inline in src/pages/services/index.astro) ─────────
const HUB = {
  seo: {
    title: "O'ahu Masonry & Concrete Services | Vaifoou Construction",
    description:
      "Masonry and concrete services for O'ahu properties. Specializing in rock walls, CMU block, and concrete flatwork. Request an estimate.",
  },
  hero: {
    heading: "O'ahu Masonry & Concrete Services",
    subheading:
      "We build custom rock walls, CMU and block walls, and concrete for residential and commercial properties across O'ahu.",
  },
  intro: {
    heading: 'Dedicated to Homeowners, Property Managers and Contractors',
    body: 'Our crews handle new construction, and demolition and rebuilds of failing walls, across the island. We work directly with homeowners, commercial property owners, property managers and HOAs, and as a masonry and concrete subcontractor to general contractors.',
    cards: [
      {
        label: 'Residential',
        title: 'Working on your home?',
        ctaLabel: 'View Residential Masonry & Concrete',
        href: '/who-we-work-with/residential/',
      },
      {
        label: 'Commercial & civil',
        title: 'Managing a commercial property, an HOA or a job site?',
        ctaLabel: 'View Commercial Masonry & Concrete',
        href: '/who-we-work-with/commercial/',
      },
    ],
  },
  capabilities: {
    heading: 'Core Masonry & Concrete Capabilities',
    items: [
      {
        title: 'Rock Walls',
        icon: 'rock-wall',
        href: '/services/rock-walls/',
        description:
          'Custom property boundaries and retaining structures built with hand-selected volcanic basalt.',
      },
      {
        title: 'Retaining Walls',
        icon: 'retaining-wall',
        href: '/services/retaining-walls/',
        description: 'Rock and CMU options compared for hillside retention.',
      },
      {
        title: 'CMU & Block Walls',
        icon: 'walls',
        href: '/services/cmu-block-walls/',
        description: 'Retaining walls and block fences built for long-term stability.',
      },
      {
        title: 'Concrete Services',
        icon: 'hammer',
        href: '/services/concrete/',
        description: 'Custom driveways, new foundations, and decorative surfaces poured for durability.',
      },
    ],
  },
  scope: {
    heading: 'Service Scope',
    buildLabel: 'What We Build',
    notCoverLabel: 'What We Do Not Cover',
    rows: [
      { build: 'Rock wall construction and repair', notCover: 'Landscaping and landscape design' },
      { build: 'Concrete flatwork and foundations', notCover: 'Structural foundation repair' },
      { build: 'CMU and block retaining walls', notCover: 'Micropile drilling and tiebacks' },
      { build: 'Site preparation for concrete pours', notCover: 'General tree and shrub removal' },
    ],
  },
  cta: {
    heading: "Start Your O'ahu Masonry Project",
    note: 'Connect with our team to discuss your concrete or rock wall requirements. Please note we are closed on Sundays.',
  },
};

// ─── Build documents ──────────────────────────────────────────────────────────

type Plan = { doc: Json; existing: Json | null };
const plans: Plan[] = [];

async function legacyImages(types: string[], path: string): Promise<Json> {
  return (
    (await client.fetch(`*[_type in $types && path == $path][0]{heroImage, introImage, projectImage}`, { types, path })) ??
    {}
  );
}

async function plan(doc: Json) {
  const existing = await client.fetch<Json | null>(`*[_id == $id][0]`, { id: doc._id });
  const merged = existing ? fillMissing(existing, doc) : doc;
  for (const k of ['_rev', '_createdAt', '_updatedAt']) delete merged[k];
  plans.push({ doc: merged, existing });
}

// Hub — keep existing hero image, move legacy top-level audienceCards into intro.
{
  const existing = await client.fetch<Json | null>(`*[_id == "singleton-services-hub"][0]`);
  const legacyCards: Json[] = existing?.audienceCards ?? [];
  const currentCards: Json[] = existing?.intro?.audienceCards ?? legacyCards;
  const cards = (currentCards.length ? currentCards : HUB.intro.cards).map((card, i) => ({
    _key: card._key ?? `hubcard-${i}`,
    _type: 'servicesHubAudienceCard',
    ...fillMissing(card, HUB.intro.cards[i] ?? {}),
  }));
  const { audienceCards: _legacy, ...rest } = existing ?? { _id: 'singleton-services-hub', _type: 'servicesHubPage' };
  const next = fillMissing(rest, {
    _id: 'singleton-services-hub',
    _type: 'servicesHubPage',
    seo: HUB.seo,
    hero: HUB.hero,
    intro: { heading: HUB.intro.heading, body: HUB.intro.body },
    capabilities: { heading: HUB.capabilities.heading, items: keyed(HUB.capabilities.items, 'homeServiceCard') },
    scope: {
      heading: HUB.scope.heading,
      buildLabel: HUB.scope.buildLabel,
      notCoverLabel: HUB.scope.notCoverLabel,
      rows: keyed(HUB.scope.rows, 'servicesHubScopeRow'),
    },
    cta: HUB.cta,
  });
  next.intro.audienceCards = cards;
  for (const k of ['_rev', '_createdAt', '_updatedAt']) delete next[k];
  plans.push({ doc: next, existing });
}

// Categories
for (const [slug, c] of Object.entries<Json>(seed.categories)) {
  const img = await legacyImages(['serviceCategoryPageMedia'], c.path);
  await plan(
    prune({
      _id: `svc-category-${slug}`,
      _type: 'serviceCategoryPage',
      path: c.path,
      seo: c.seo,
      hero: { ...c.hero, image: img.heroImage },
      intro: { ...c.intro, image: img.introImage },
      subServices: { heading: c.subServices.heading, columns: c.subServices.columns, cards: keyed(c.subServices.cards, 'serviceCategoryCard') },
      projects: { ...c.projects, image: img.projectImage },
      process: { heading: c.process.heading, steps: keyed(c.process.steps, 'serviceTitledItem') },
      faqs: { heading: c.faqs.heading, items: keyed(c.faqs.items, 'serviceFaq') },
      related: { heading: c.related.heading, links: keyed(c.related.links, 'serviceLinkItem') },
      cta: c.cta,
    })
  );
}

// Sub pages
for (const [key, p] of Object.entries<Json>(seed.subPages)) {
  const [cat, slug] = key.split('/');
  const legacyType = cat === 'rock-walls' ? 'rockWallSubPageMedia' : 'concreteServiceSubPageMedia';
  const img = await legacyImages([legacyType], p.path);

  // footerNote used to be raw HTML: "text <a href="…">label</a>"
  let footer: Json = {};
  if (p.comparison.footerNote) {
    const m = p.comparison.footerNote.match(/^(.*?)\s*<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>\s*$/s);
    footer = m
      ? { footerText: m[1], footerLinkHref: m[2], footerLinkLabel: m[3] }
      : { footerText: p.comparison.footerNote.replace(/<[^>]+>/g, '') };
  }

  await plan(
    prune({
      _id: `svc-sub-${cat}-${slug}`,
      _type: 'serviceSubPage',
      path: p.path,
      seo: p.seo,
      hero: { heading: p.hero.heading, body: p.hero.body, image: img.heroImage },
      process: { heading: p.process.heading, items: keyed(p.process.items, 'serviceTitledItem') },
      materials: { heading: p.materials.heading, items: keyed(p.materials.items, 'serviceTitledItem') },
      comparison: {
        eyebrow: p.comparison.eyebrow,
        heading: p.comparison.heading,
        note: p.comparison.note,
        col1: p.comparison.col1,
        col2: p.comparison.col2,
        rows: keyed(p.comparison.rows, 'serviceTableRow'),
        ...footer,
      },
      applications: { heading: p.applications.heading, items: keyed(p.applications.items, 'serviceTitledItem') },
      related: { categoryLabel: p.related.categoryLabel, links: keyed(p.related.links, 'serviceLinkItem') },
      faqs: { heading: p.faqs.heading, items: keyed(p.faqs.items, 'serviceFaq') },
      cta: p.cta,
    })
  );
}

// ─── Report / write ───────────────────────────────────────────────────────────

const hasImg = (v: any) => Boolean(v?.asset?._ref);
for (const { doc, existing } of plans) {
  const images = [doc.hero?.image, doc.intro?.image, doc.projects?.image, doc.highlightBanner?.image]
    .filter((x) => x !== undefined)
    .map(hasImg);
  console.log(
    `${existing ? 'update' : 'create'}  ${doc._id.padEnd(48)} images: ${images.filter(Boolean).length}/${images.length}`
  );
}

if (!write) {
  console.log(`\nDry run: ${plans.length} documents. Re-run with \`-- --write\` to apply.`);
  process.exit(0);
}

mkdirSync('data/backups', { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
writeFileSync(
  `data/backups/services-before-seed-${stamp}.json`,
  JSON.stringify(plans.map((p) => p.existing).filter(Boolean), null, 2)
);

const tx = client.transaction();
for (const { doc } of plans) tx.createOrReplace(doc as Json & { _id: string; _type: string });
await tx.commit();
console.log(`\nWrote ${plans.length} documents (published).`);

/**
 * Seed script — creates a rich dummy blog post in Sanity covering every
 * content-block type supported by the BlogArticleBody renderer.
 *
 * Run:  npm run seed:blog
 *
 * The script is idempotent: re-running it overwrites the document with the
 * same _id. Safe to run multiple times.
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? '2481svtr',
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-15',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN,
});

// ── Helper: generate a short unique key ────────────────────────────────────
let _seq = 0;
function k(prefix: string): string {
  return `${prefix}-${++_seq}`;
}

// ── Portable Text helpers ──────────────────────────────────────────────────
type Span = { _type: 'span'; _key: string; text: string; marks?: string[] };
type MarkDef = { _type: string; _key: string; href?: string; blank?: boolean };

function span(text: string, ...marks: string[]): Span {
  return { _type: 'span', _key: k('s'), text, ...(marks.length ? { marks } : { marks: [] }) };
}

function paragraph(children: Span[], markDefs: MarkDef[] = []) {
  return {
    _type: 'block',
    _key: k('p'),
    style: 'normal',
    children,
    markDefs,
  };
}

function h2(text: string) {
  return {
    _type: 'block',
    _key: k('h2'),
    style: 'h2',
    children: [span(text)],
    markDefs: [],
  };
}

function h3(text: string) {
  return {
    _type: 'block',
    _key: k('h3'),
    style: 'h3',
    children: [span(text)],
    markDefs: [],
  };
}

function h4(text: string) {
  return {
    _type: 'block',
    _key: k('h4'),
    style: 'h4',
    children: [span(text)],
    markDefs: [],
  };
}

function blockquote(text: string) {
  return {
    _type: 'block',
    _key: k('bq'),
    style: 'blockquote',
    children: [span(text)],
    markDefs: [],
  };
}

function bullet(text: string, children?: Span[], markDefs: MarkDef[] = []) {
  return {
    _type: 'block',
    _key: k('bl'),
    style: 'normal',
    listItem: 'bullet' as const,
    level: 1,
    children: children ?? [span(text)],
    markDefs,
  };
}

function numbered(text: string) {
  return {
    _type: 'block',
    _key: k('nl'),
    style: 'normal',
    listItem: 'number' as const,
    level: 1,
    children: [span(text)],
    markDefs: [],
  };
}

function callout(type: 'tip' | 'info' | 'warning' | 'note', text: string) {
  return { _type: 'callout', _key: k('callout'), type, text };
}

function tableBlock(
  caption: string,
  headerRow: string[],
  rows: string[][]
) {
  return {
    _type: 'table',
    _key: k('tbl'),
    caption,
    headerRow,
    rows: rows.map((cells) => ({ _key: k('row'), cells })),
  };
}

function imageBlock(url: string, alt: string, caption?: string) {
  return {
    _type: 'image',
    _key: k('img'),
    // imageUrl is a URL-based override — Sanity stores it separately from the
    // asset pipeline. We use `asset: null` so the projection resolves imageUrl.
    asset: null,
    _sanityAsset: undefined,
    src: url,
    alt,
    ...(caption ? { caption } : {}),
  };
}

// ── The dummy document ─────────────────────────────────────────────────────
const POST_ID = 'blog-seed-masonry-concrete-guide';

// Shared link mark key
const linkKey1 = 'link1';
const linkKey2 = 'link2';

const body = [
  // ── Intro paragraphs ──────────────────────────────────────────────────
  paragraph([
    span(
      "Whether you're dealing with cracked concrete driveways, crumbling retaining walls, or eroding masonry steps, O\u02BBahu\u2019s tropical climate accelerates wear on exterior structures far faster than most mainland environments. The combination of "
    ),
    span('salt air', 'strong'),
    span(', '),
    span('heavy rainfall', 'em'),
    span(
      ', and intense UV exposure means Hawaiian homes and businesses face unique challenges that demand specialized repair techniques and materials.'
    ),
  ]),

  paragraph([
    span(
      'This guide walks you through the science of concrete degradation in a marine environment, the warning signs every O\u02BBahu property owner should know, and how to choose the right contractor before small surface cracks turn into structural failures costing tens of thousands of dollars.'
    ),
  ]),

  // ── H2 ───────────────────────────────────────────────────────────────
  h2("Why O\u02BBahu Concrete Degrades Faster"),

  paragraph([
    span('Concrete deterioration on the island is driven by three primary factors: '),
    span('chloride-induced corrosion', 'strong'),
    span(', '),
    span('thermal cycling', 'strong'),
    span(', and '),
    span('carbonation', 'em'),
    span(
      '. When salt-laden ocean air penetrates the porous surface, it reaches the reinforcing steel beneath. The steel rusts and expands \u2014 a process called '
    ),
    span('spalling', 'code'),
    span(
      ' \u2014 which pushes chunks of concrete off the surface and exposes the rebar to further corrosion.'
    ),
  ]),

  paragraph([
    span(
      'Compounding the problem: O\u02BBahu\u2019s warm, humid climate accelerates the chemical reactions responsible for deterioration. Concrete that might last 50+ years in a dry continental climate can show significant distress within 10\u201315 years if left unsealed and unmaintained near the coast.'
    ),
  ]),

  callout(
    'info',
    "Salt air can penetrate up to 2 inches into unprotected concrete within the first year of exposure in coastal Hawaiian conditions. Homes within 1 mile of the ocean are most at risk."
  ),

  // ── H2 ───────────────────────────────────────────────────────────────
  h2('Warning Signs You Need Immediate Repairs'),

  paragraph([
    span(
      'Catching problems early dramatically reduces repair costs. Walk your property every six months and look for these red flags:'
    ),
  ]),

  bullet('Cracks wider than \u00BC inch in concrete slabs, driveways, or foundation walls'),
  bullet('Rust-coloured stains bleeding through the concrete surface (indicates corroding rebar)'),
  bullet('Hollow or \u201Cdrummy\u201D sound when you tap a concrete surface \u2014 a sign of delamination'),
  bullet('Exposed aggregate or aggregate pop-out on steps and walkways'),
  bullet('Efflorescence \u2014 white chalky deposits \u2014 on masonry or block walls'),
  bullet('Heaving or settlement creating uneven surfaces or trip hazards'),
  bullet('Water pooling against foundations or retaining walls after rain'),

  callout(
    'warning',
    "Cracks in retaining walls wider than ⅛ inch, or walls that visibly lean or bow, are a structural emergency. Do not wait — engage a licensed masonry contractor immediately."
  ),

  // ── H2 ───────────────────────────────────────────────────────────────
  h2('Common Repair Methods Compared'),

  paragraph([
    span(
      'Not all concrete and masonry repairs are equal. The right method depends on the severity of deterioration, the structural role of the element, and the desired longevity. The table below summarises the most common options:'
    ),
  ]),

  tableBlock(
    'Concrete & Masonry Repair Methods at a Glance',
    ['Issue', 'Repair Method', 'Typical Lifespan', 'Best For'],
    [
      ['Hairline cracks', 'Polyurethane caulk seal', '3\u20135 years', 'Non-structural slabs'],
      ['Structural cracks', 'Epoxy injection', '10\u201320 years', 'Foundations & walls'],
      ['Surface spalling', 'Polymer-modified overlay', '7\u201312 years', 'Driveways & walkways'],
      ['Rebar corrosion', 'Remove, treat, patch & seal', '15+ years', 'Structural elements'],
      ['Retaining wall failure', 'Full rebuild in CMU or concrete', '50+ years', 'Structural retaining walls'],
      ['Efflorescence', 'Chemical wash + sealer', '3\u20135 years', 'Block & brick walls'],
    ]
  ),

  // ── H2 ───────────────────────────────────────────────────────────────
  h2('DIY vs. Professional Repairs'),

  paragraph([
    span(
      'Small cosmetic repairs \u2014 like sealing hairline cracks or washing efflorescence \u2014 are reasonable DIY tasks with the right products. But anything structural, or anything involving rebar, should be handled by a licensed contractor. Here\u2019s why:'
    ),
  ]),

  h3('When DIY Works'),

  bullet('Sealing non-structural surface cracks under ⅛ inch with flexible polyurethane caulk'),
  bullet('Applying a penetrating concrete sealer to a clean, dry driveway every 2\u20133 years'),
  bullet('Cleaning efflorescence with a diluted muriatic acid wash (with proper PPE)'),
  bullet('Re-grouting minor gaps in decorative stone or tile on patios'),

  h3('When You Must Call a Pro'),

  bullet('Any crack in a load-bearing wall, foundation, or retaining wall'),
  bullet('Spalling that exposes rebar \u2014 incorrect patching traps moisture and accelerates corrosion'),
  bullet('Retaining walls showing movement or leaning \u2014 structural failure risk'),
  bullet('Pool decks and waterproofing \u2014 improper repairs void warranties'),

  callout(
    'tip',
    "Before starting any masonry project on O\u02BBahu, check whether your property is in a special flood hazard area (SFHA). FEMA flood maps affect which repair materials and methods are code-compliant."
  ),

  // ── H2 ───────────────────────────────────────────────────────────────
  h2('How Much Does It Cost?'),

  paragraph([
    span(
      'Repair costs on O\u02BBahu are typically '
    ),
    span('20\u201340% higher', 'strong'),
    span(
      ' than national averages due to island logistics, material shipping, and the premium labour market. As a general guide:'
    ),
  ]),

  numbered('Concrete crack injection: $300\u2013$800 per linear foot for epoxy injection'),
  numbered('Surface overlay (driveway): $8\u201318 per sq ft for polymer-modified overlay'),
  numbered('Retaining wall rebuild: $60\u2013$120 per sq ft for CMU block construction'),
  numbered('Foundation repair: $2,000\u2013$8,000+ depending on severity and access'),
  numbered('Full concrete slab replacement: $12\u201322 per sq ft'),

  paragraph([
    span(
      'These are rough estimates. Get at least three written quotes from licensed contractors and ask each bidder to specify the '
    ),
    span('materials, mix design, cure time, and warranty', 'strong'),
    span(' \u2014 not just a total price.'),
  ]),

  callout(
    'note',
    "Hawaii contractors must hold a valid C-5 (Concrete) or C-23 (Masonry) specialty license issued by the DCCA. Always verify a contractor\u2019s license at pvl.ehawaii.gov before signing a contract."
  ),

  // ── H2 ───────────────────────────────────────────────────────────────
  h2('Preventive Maintenance Checklist'),

  paragraph([
    span(
      'The best repair is the one you never need. Build these tasks into your annual property maintenance schedule:'
    ),
  ]),

  bullet('Apply a penetrating silane/siloxane sealer to all concrete and masonry every 2\u20133 years'),
  bullet('Clear debris from drainage channels and weep holes in retaining walls every spring'),
  bullet('Inspect all concrete and masonry after every major storm for new cracks or movement'),
  bullet('Keep sprinkler systems directed away from foundations and block walls'),
  bullet('Trim vegetation within 12 inches of masonry \u2014 root intrusion is a leading cause of wall failure'),
  bullet('Re-grout or re-point mortar joints in block walls every 7\u201310 years'),
  bullet('Test your concrete driveway with a splash of water: if it soaks in, it\u2019s time to re-seal'),

  // ── Image placeholder ─────────────────────────────────────────────
  // (will be replaced with a client photo; using a URL for the seed)
  imageBlock(
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'Masonry contractor repairing a concrete retaining wall on O\u02BBahu',
    'Regular inspection and sealing extends the life of concrete structures in Hawaii\u2019s marine environment.'
  ),

  // ── H2 ───────────────────────────────────────────────────────────────
  h2("Why Choose Vaifoou Construction"),

  paragraph([
    span(
      "Vaifoou Construction has been building and repairing masonry and concrete structures on O\u02BBahu since 2000. As a family-owned business with deep roots in the community, we bring both technical expertise and personal accountability to every project \u2014 from a single cracked step to a full retaining wall rebuild."
    ),
  ]),

  h4('Our Commitment'),

  bullet('Licensed C-5 and C-23 specialty contractor (license CT-39534)'),
  bullet('All work backed by a written workmanship warranty'),
  bullet('No subcontracting \u2014 our own crews handle every job'),
  bullet('Free, itemised written estimates with no pressure'),
  bullet('Serving all of O\u02BBahu: Honolulu, Kailua, Kaneohe, Mililani, Ewa Beach, and beyond'),

  blockquote(
    "\u201CThe team at Vaifoou completely rebuilt our failing retaining wall after two other contractors said it couldn\u2019t be saved. Solid workmanship, honest pricing, and they cleaned up perfectly. Highly recommend.\u201D \u2014 Maria T., Kailua"
  ),

  paragraph([
    span(
      "Ready to get started? Contact us today for a free site assessment. We\u2019ll walk your property, identify every area of concern, and give you a clear, honest written quote \u2014 with no obligation."
    ),
  ]),
];

const blogPost = {
  _id: POST_ID,
  _type: 'blogPost',
  title: "The Complete Guide to Masonry & Concrete Repair on O\u02BBahu",
  slug: { _type: 'slug', current: 'masonry-concrete-repair-guide-oahu' },
  excerpt:
    "O\u02BBahu\u2019s salt air, tropical rains, and intense UV exposure put masonry and concrete under constant stress. Learn how to spot early warning signs, understand repair methods, and choose the right contractor before small cracks become costly failures.",
  publishDate: new Date('2026-09-01T08:00:00.000Z').toISOString(),
  author: 'Vaifoou Construction Team',
  imageUrl:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1440&q=80',
  imageAlt: "Workers repairing concrete steps on an O\u02BBahu property",
  category: 'Trade Tips',
  tags: [
    'concrete repair',
    'masonry',
    "O\u02BBahu",
    'retaining walls',
    'foundation',
    'maintenance',
    'salt air',
    'spalling',
  ],
  body,
  relatedPages: [],
};

// ── Upsert ─────────────────────────────────────────────────────────────────
console.log(`\nUpserting blog post: "${blogPost.title}"`);
console.log(`  → Sanity project: ${process.env.SANITY_PROJECT_ID ?? '2481svtr'} / ${process.env.SANITY_DATASET ?? 'production'}`);

try {
  const result = await client.createOrReplace(blogPost);
  console.log(`\n✅  Done! Document ID: ${result._id}`);
  console.log(`   Preview at: https://${process.env.SANITY_PROJECT_ID ?? '2481svtr'}.sanity.studio`);
  console.log(`   Live URL:   https://vaifoouconstruction.com/blog/masonry-concrete-repair-guide-oahu/\n`);
} catch (err) {
  console.error('\n❌  Seed failed:', err);
  process.exit(1);
}

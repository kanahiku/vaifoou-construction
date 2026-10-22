/**
 * Seed the "Who we work with" pages (residential, commercial, 3 commercial client pages) into Sanity
 * (copy = the previous hard-coded pages).
 *
 *   npm run seed:audiences              # dry run
 *   npm run seed:audiences -- --write   # create / fill EMPTY fields only
 *
 * Images are carried over from the legacy `audiencePageMedia` / `commercialAudienceSubPageMedia`
 * documents (not modified or deleted).
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



const get = (id: string) => client.fetch<Json | null>(`*[_id == $id][0]`, { id });
const strip = (d: Json) => {
  for (const k of ['_rev', '_createdAt', '_updatedAt']) delete d[k];
  return d;
};
let n = 0;
const keyed = (items: Json[], type: string) => items.map((i) => ({ _key: `${type}-${++n}`, _type: type, ...i }));
const faqs = (items: Array<[string, string]>) =>
  keyed(items.map(([question, answer]) => ({ question, answer })), 'serviceFaq');
const cards = (items: Array<[string, string, string]>) =>
  keyed(items.map(([name, href, description]) => ({ name, href, description })), 'audienceCard');
const points = (items: Array<[string, string]>) =>
  keyed(items.map(([heading, body]) => ({ heading, body })), 'audiencePoint');

const SITE = 'Vaifoou Construction';
const landingMedia = (path: string) =>
  client.fetch<Json | null>(`*[_type == "audiencePageMedia" && path == $path][0]{heroImage, introImage, projectImage}`, { path });
const subMedia = (path: string) =>
  client.fetch<Json | null>(`*[_type == "commercialAudienceSubPageMedia" && path == $path][0]{heroImage, introImage}`, { path });

const docs: Json[] = [];

{
  const path = '/who-we-work-with/residential/';
  const m = await landingMedia(path);
  docs.push({
    _id: 'audience-residential',
    _type: 'audienceLandingPage',
    path,
    name: 'Residential',
    seo: {
      title: `O'ahu Residential Masonry & Concrete | ${SITE}`,
      description:
        "Custom rock walls and concrete flatwork for O'ahu homeowners. We build secure property boundaries backed by a 25+ year family legacy. Request an estimate.",
    },
    hero: {
      heading: "O'ahu Residential Masonry & Concrete",
      body: "Custom rock walls and concrete flatwork for O'ahu homeowners.",
      image: m?.heroImage,
    },
    intro: {
      heading: "Upgrading O'ahu Properties",
      body: 'We work directly with local homeowners to build secure property boundaries and durable concrete surfaces. We back every project with a 25+ year family legacy in the local masonry trade and our workmanship guarantee.',
      crossPrompt: 'Managing a commercial property or HOA?',
      crossLabel: 'View Commercial Masonry & Concrete',
      crossHref: '/who-we-work-with/commercial/',
      image: m?.introImage,
    },
    services: {
      heading: 'Residential Masonry Services',
      cards: cards([
        ['Custom Rock Walls', '/services/rock-walls/', 'Property boundaries built with hand-selected volcanic basalt.'],
        ['Retaining Walls', '/services/retaining-walls/', "Rock and CMU retaining walls built for O'ahu's hillside terrain."],
        ['CMU & Block Fences', '/services/cmu-block-walls/', 'Structural division fences and security walls built for long-term stability.'],
        ['Concrete Driveways & Patios', '/services/concrete/', 'New driveway pours and custom outdoor living spaces built for durability.'],
      ]),
    },
    experience: {
      heading: 'The Homeowner Experience',
      items: points([
        ['Respect For Your Property', 'We establish clear access paths for our heavy equipment to minimize impact on your existing yard.'],
        ['Clear Project Timelines', 'Our crews maintain strict schedules to reduce disruption to your daily home life and your neighbors.'],
        ['Clean Work Site', 'We secure the work area at the end of every day and remove all construction debris before the final handover.'],
      ]),
    },
    work: {
      heading: "Our Work on O'ahu",
      body: 'From new concrete driveways to hand-laid volcanic basalt boundaries, browse our completed residential projects across the island.',
      ctaLabel: 'View Our Work',
      ctaHref: '/projects/',
      image: m?.projectImage,
    },
    faqs: {
      heading: 'Residential Masonry FAQs',
      items: faqs([
        ['Can you rebuild a failing rock wall?', 'Yes. We demolish failing, bulging or collapsed rock walls and rebuild them. See Rock Wall Repair.'],
        ['Do you work on existing properties or just new builds?', 'We handle both new residential construction and property upgrades for existing homes across the island.'],
        ['How do you handle my existing landscaping?', 'We do not provide landscape design, landscaping or plant replacement. When a concrete pour needs it, we remove trees and shrubs as site preparation only.'],
        ['Do you perform residential foundation repair?', 'No. We pour new foundations for residential builds but we do not perform structural foundation repair, micropile drilling, or tiebacks.'],
        ["Do you serve homeowners outside of O'ahu?", "No, our service area is strictly limited to the island of O'ahu."],
      ]),
    },
    cta: {
      heading: 'Start Your Residential Project',
      note: 'Connect with our team to discuss your property requirements. Please note we are closed on Sundays to put God first.',
    },
  });
}

{
  const path = '/who-we-work-with/commercial/';
  const m = await landingMedia(path);
  docs.push({
    _id: 'audience-commercial',
    _type: 'audienceLandingPage',
    path,
    name: 'Commercial',
    seo: {
      title: `O'ahu Commercial Masonry & Concrete | ${SITE}`,
      description:
        "Masonry and concrete for O'ahu property owners, property managers, HOAs and contractors. We build heavy-duty CMU and retaining walls. Request an estimate.",
    },
    hero: {
      heading: "O'ahu Commercial Masonry & Concrete",
      body: "Masonry and concrete for O'ahu property owners, property managers, HOAs and contractors.",
      image: m?.heroImage,
    },
    intro: {
      heading: "Trusted by O'ahu Property Managers",
      body: 'We work directly with commercial property owners, property managers and HOAs across the island, and as a masonry and concrete subcontractor to general contractors. We back our work with a 25+ year family legacy in the local masonry trade and our workmanship guarantee.',
      crossPrompt: 'Upgrading your personal home?',
      crossLabel: 'View Residential Masonry & Concrete',
      crossHref: '/who-we-work-with/residential/',
      image: m?.introImage,
    },
    services: {
      heading: 'Commercial Masonry Services',
      cards: cards([
        ['Commercial Concrete', '/services/concrete/', 'New foundation pours and heavy-duty flatwork for high-traffic areas.'],
        ['CMU & Block Walls', '/services/cmu-block-walls/', 'Division walls, block fences and CMU retaining walls built for long-term stability.'],
        ['Retaining Walls', '/services/retaining-walls/', 'Heavy-duty structural support to manage commercial property terrain.'],
        ['Custom Rock Walls', '/services/rock-walls/', 'Property boundaries built with hand-selected volcanic basalt.'],
      ]),
    },
    experience: {
      heading: 'The Commercial Experience',
      items: points([
        ['Clear Project Management', 'We coordinate directly with your site supervisors to maintain strict project schedules.'],
        ['Site Safety Standards', 'Our crews follow strict safety protocols to protect your tenants and employees during construction.'],
        ['Clean Work Site', 'We secure the work area at the end of every shift and remove all construction debris before handover.'],
      ]),
    },
    subPages: {
      categoryLabel: 'Commercial Clients',
      viewAllLabel: 'View All Commercial Services',
      viewAllHref: '/who-we-work-with/commercial/',
    },
    faqs: {
      heading: 'Commercial Masonry FAQs',
      items: faqs([
        ['Do you act as a general contractor?', 'No. We hold a C-31 Masonry Contractor license, CT-39534, and focus on masonry and concrete. We work directly with property owners and managers, and as a subcontractor to general contractors.'],
        ['Do you perform commercial foundation repair?', 'We pour new foundations for commercial builds but we do not perform structural foundation repair. We also do not install micropiles or tiebacks.'],
        ['Can you handle the landscaping after the concrete is poured?', 'We focus exclusively on masonry and concrete construction. We do not provide landscape design or general landscaping services.'],
        ['Do you work on Sundays?', 'No. We are closed on Sundays.'],
        ["Do you bid on projects outside of O'ahu?", "No, our commercial service area is strictly limited to the island of O'ahu."],
      ]),
    },
    cta: { heading: 'Start Your Commercial Project' },
  });
}

const subs: Array<{ slug: string; name: string; order: number; doc: Json }> = [
  {
    slug: 'property-managers-landlords',
    name: 'Property Managers & Landlords',
    order: 0,
    doc: {
      seo: {
        title: `Property Managers & Landlords | ${SITE}`,
        description: "Vaifoou Construction provides reliable masonry and concrete services for property managers and landlords across O'ahu.",
      },
      hero: {
        heading: 'Property Managers & Landlords',
        body: "We execute masonry and concrete projects for O'ahu property managers and landlords. Our crews handle multi-unit repairs and repeat maintenance contracts.",
      },
      intro: {
        heading: 'Built for Property Managers',
        body: "We execute masonry and concrete projects for O'ahu property managers and landlords. Our crews handle multi-unit repairs and repeat maintenance contracts. We coordinate directly with owners and schedule site work around active tenants to minimize disruption. Every project is backed by our workmanship guarantee.",
      },
      comparison: {
        heading: 'Commercial vs. Residential',
        col1: 'Commercial Management',
        col2: 'Standard Residential',
        rows: [
          ['Scheduling', 'Coordinated around active tenants', 'Direct homeowner schedule'],
          ['Project Scope', 'Multi-unit and repeat work', 'Single property projects'],
          ['Communication', 'Direct coordination with owners', 'Owner-occupant updates'],
        ],
      },
      faqs: [
        ['Do you coordinate work around active tenants?', 'Yes. We schedule our site work specifically to minimize disruption for your active tenants.'],
        ['Do you handle multi-unit properties?', 'Yes. We manage masonry and concrete projects for multi-unit properties and repeat maintenance contracts.'],
        ['Are your installations guaranteed?', "Yes. Every site we manage across O'ahu is backed by a workmanship guarantee."],
      ],
    },
  },
  {
    slug: 'hoa',
    name: 'HOA Masonry & Concrete',
    order: 1,
    doc: {
      seo: {
        title: `HOA Masonry & Concrete | ${SITE}`,
        description: "Vaifoou Construction provides masonry and concrete services for HOAs across O'ahu, including bid documentation and common-area work.",
      },
      hero: {
        heading: 'HOA Masonry & Concrete',
        body: "We execute masonry and concrete projects for Homeowner Associations across O'ahu. Our crews manage common-area work and supply the detailed bid documentation required for your board and committee process.",
      },
      intro: {
        heading: 'Built for HOA Requirements',
        body: "We execute masonry and concrete projects for Homeowner Associations across O'ahu. Our crews manage common-area work and supply the detailed bid documentation required for your board and committee process. Every project is backed by our workmanship guarantee.",
      },
      comparison: {
        heading: 'HOA vs. Standard Residential',
        col1: 'HOA Requirements',
        col2: 'Standard Residential',
        rows: [
          ['Approval', 'Board and committee process', 'Single homeowner decision'],
          ['Documentation', 'Formal bid documentation', 'Standard estimate'],
          ['Project Scope', 'Common-area work', 'Private property'],
        ],
      },
      faqs: [
        ['Do you provide formal bid documentation?', 'Yes. We supply the detailed bid documentation necessary to support your board and committee process.'],
        ['Do you handle common-area repairs?', 'Yes. We execute masonry and concrete projects specifically for shared community spaces and common-area work.'],
        ['Are your installations guaranteed?', "Yes. Every site we manage across O'ahu is backed by a workmanship guarantee."],
      ],
    },
  },
  {
    slug: 'contractors',
    name: 'Masonry & Concrete Subcontracting',
    order: 2,
    doc: {
      seo: {
        title: `Masonry & Concrete Subcontracting | ${SITE}`,
        description: "Vaifoou Construction partners with GCs and builders as a reliable masonry and concrete subcontractor across O'ahu.",
      },
      hero: {
        heading: 'Masonry & Concrete Subcontracting',
        body: 'We partner with general contractors and builders across O\'ahu. When you hire us as your subcontractor, we manage the specialized masonry and concrete requirements for your build.',
      },
      intro: {
        heading: 'Your Masonry & Concrete Partner',
        body: "We partner with general contractors and builders across O'ahu. When you hire us as your subcontractor, we manage the specialized masonry and concrete requirements for your build. We prioritize clear communication regarding scheduling, crew size, scope handoff, and licensing compliance. Every site is backed by our workmanship guarantee.",
      },
      comparison: {
        heading: 'Subcontractor vs. Direct to Consumer',
        col1: 'Subcontractor Role',
        col2: 'Direct Client',
        rows: [
          ['Client', 'GCs and builders', 'Homeowners and property managers'],
          ['Execution', 'Seamless scope handoff', 'Full site management'],
          ['Requirements', 'License and insurance documentation', 'Standard residential agreements'],
        ],
      },
      faqs: [
        ['Do you work with general contractors?', 'Yes. We partner directly with GCs and builders to handle dedicated masonry and concrete work.'],
        ['How do you manage the project handoff?', 'We maintain clear communication regarding site scheduling, crew size, and scope handoff to ensure a clean integration with your overall build phase.'],
        ['Are you licensed and insured?', "Yes. Vaifoou Construction LLC holds Hawai'i contractor license CT-39534, class C-31 Masonry, and we provide license and insurance documentation for your project file."],
      ],
    },
  },
];
for (const { slug, name, order, doc } of subs) {
  const path = `/who-we-work-with/commercial/${slug}/`;
  const m = await subMedia(path);
  docs.push({
    _id: `audience-sub-${slug}`,
    _type: 'audienceSubPage',
    path,
    name,
    order,
    seo: doc.seo,
    hero: { ...doc.hero, image: m?.heroImage },
    intro: { ...doc.intro, image: m?.introImage },
    comparison: {
      ...doc.comparison,
      rows: keyed(doc.comparison.rows.map(([feature, val1, val2]: string[]) => ({ feature, val1, val2 })), 'serviceTableRow'),
    },
    related: {
      categoryLabel: 'Commercial Services',
      viewAllLabel: 'View All Commercial Services',
      viewAllHref: '/who-we-work-with/commercial/',
    },
    faqs: { heading: 'Frequently Asked Questions', items: faqs(doc.faqs) },
    cta: { heading: 'Request a Site Consultation' },
  });
}

const plans: Array<{ doc: Json; existing: Json | null }> = [];
for (const raw of docs) {
  const doc = prune(raw);
  const existing = await get(doc._id);
  plans.push({ doc: strip(existing ? fillMissing(existing, doc) : doc), existing });
}
const has = (v: any) => Boolean(v?.asset?._ref);
for (const { doc, existing } of plans) {
  const imgs = [doc.hero?.image, doc.intro?.image, doc.work?.image].filter((x) => x !== undefined);
  console.log(`${existing ? 'update' : 'create'}  ${String(doc._id).padEnd(44)} images: ${imgs.filter(has).length}`);
}
if (!write) {
  console.log(`\nDry run: ${plans.length} documents. Re-run with \`-- --write\` to apply.`);
  process.exit(0);
}
mkdirSync('data/backups', { recursive: true });
writeFileSync(
  `data/backups/audiences-before-seed-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  JSON.stringify(plans.map((p) => p.existing).filter(Boolean), null, 2)
);
const tx = client.transaction();
for (const { doc } of plans) tx.createOrReplace(doc as Json & { _id: string; _type: string });
await tx.commit();
console.log(`\nWrote ${plans.length} documents (published).`);

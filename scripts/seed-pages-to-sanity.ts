/**
 * Seed the reviews, projects and blog page copy and the three legal pages into Sanity
 * (copy = the previous hard-coded pages).
 *
 *   npm run seed:pages              # dry run
 *   npm run seed:pages -- --write   # create / fill EMPTY fields only
 *
 * Hero images are carried over from the legacy `reviewsPageMedia` / `projectsPageMedia` documents
 * (not modified or deleted). Legal text uses tokens ({business}, {phone}, {email}) filled from config.
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
const key = (p: string) => `${p}-${++n}`;
const block = (text: string) => ({
  _key: key('b'),
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{ _key: key('s'), _type: 'span', text, marks: [] }],
});
const blocks = (...t: string[]) => t.map(block);

const legacyReviews = await get('singleton-reviews-page-media');
const legacyProjects = await get('singleton-projects-page-media');

const docs: Json[] = [
  {
    _id: 'singleton-reviews',
    _type: 'reviewsPage',
    seo: {
      title: 'Reviews & Testimonials | Vaifoou Construction',
      description: "Read what O'ahu property owners and homeowners say about Vaifoou Construction's masonry and concrete work.",
    },
    hero: {
      heading: 'Vaifoou Construction Reviews',
      body: 'Read feedback from people who have worked with Vaifoou Construction on rock walls, concrete, retaining walls, and other masonry projects on Oʻahu.',
      image: legacyReviews?.heroImage,
    },
    featured: {
      heading: 'Featured Customer Reviews',
      body: 'Feedback from customers who have worked with Vaifoou Construction.',
      emptyTitle: 'Coming Soon',
      emptyBody: 'Client reviews and testimonials will appear here as they are published.',
      extraReviews: [
        {
          _key: key('r'),
          _type: 'reviewsPageExtraReview',
          quote:
            'They were very respectful, efficient and treated us like family! Great group of people that built a Top of the line 2 tier retaining wall in our backyard that will be enjoyed by our family for years to come! Thank you guys!',
          name: 'Aaron A.',
          platform: 'thumbtack',
        },
        {
          _key: key('r'),
          _type: 'reviewsPageExtraReview',
          quote: 'Amazing transformation. Hard workers and fast. Beautiful job',
          name: 'Deborah M.',
          platform: 'thumbtack',
          reviewedAt: '2025-02-14',
        },
      ],
    },
    profiles: {
      heading: 'Reviews From Across the Web',
      body: 'Customer feedback about Vaifoou Construction can be found on independent review platforms.',
    },
    cta: {
      heading: 'Request a Site Consultation',
      note: 'If something is happening with your wall, walkway, or concrete, you do not need to know the solution before you call. Vaifoou can look at the site and help determine what work should be considered next. Please note we are closed on Sundays.',
    },
  },
  {
    _id: 'singleton-projects',
    _type: 'projectsPage',
    seo: {
      title: "Completed Masonry & Concrete Projects on O'ahu | Vaifoou Construction",
      description:
        "View completed rock walls, retaining walls, and concrete flatwork built across O'ahu by Vaifoou Construction. Backed by a 25+ year family trade legacy.",
    },
    hero: {
      heading: "Our Masonry & Concrete Work Across O'ahu",
      body: "Real site work completed by our family crews across O'ahu.",
      image: legacyProjects?.heroImage,
    },
    filters: {
      heading: 'Filter Projects',
      body: 'Narrow the gallery by location or the service involved.',
      locationLabel: 'Location',
      allLocationsLabel: 'All locations',
      serviceLabel: 'Project Type / Service',
      allServicesLabel: 'All services',
      resetLabel: 'Reset',
      emptyText: 'No projects match the selected filters.',
    },
    services: {
      heading: 'Explore Other Services',
      cards: [
        ['Rock Walls', 'Property boundaries and custom masonry built with hand-selected volcanic basalt.', '/services/rock-walls/', 'View Rock Wall Services', 'rock-wall'],
        ['Retaining Wall', 'Heavy-duty structural masonry built with proper drainage to hold back hillside soil.', '/services/retaining-walls/', 'View Retaining Wall Services', 'retaining-wall'],
        ['CMU & Block Walls', 'Reinforced hollow tile perimeter walls and fences built for long-term stability.', '/services/cmu-block-walls/', 'View CMU & Block Walls', 'walls'],
        ['Concrete Services', 'New driveways, walkways, stamped flatwork, and structural foundations poured from scratch.', '/services/concrete/', 'View Concrete Services', 'hammer'],
      ].map(([title, description, href, ctaLabel, icon]) => ({ _key: key('c'), _type: 'projectsServiceCard', title, description, href, ctaLabel, icon })),
    },
    cta: {
      heading: "Start Your O'ahu Masonry Project",
      note: 'Contact us to discuss your masonry or concrete project. Every job is backed by our workmanship guarantee.',
    },
  },
  {
    _id: 'singleton-blog',
    _type: 'blogPage',
    seo: {
      title: 'Blog | Vaifoou Construction',
      description: "Masonry tips, project spotlights and trade insights from the Vaifoou Construction team on O'ahu.",
    },
    hero: { heading: 'Blogs' },
    empty: { title: 'Coming Soon', body: 'New articles from our masonry team will appear here as they are published.' },
    cta: { heading: "Start Your O'ahu Masonry Project" },
  },
];

const legal = (id: string, path: string, name: string, description: string, heading: string, intro: string, sections: Array<[string, string]>, cta: string) => ({
  _id: id,
  _type: 'legalPage',
  path,
  seo: { title: `${name} | {business}`, description },
  heading,
  intro: blocks(intro),
  sections: sections.map(([h, t]) => ({ _key: key('l'), _type: 'legalSection', heading: h, body: blocks(t) })),
  cta: { heading: cta },
});

docs.push(
  legal(
    'legal-privacy-policy', '/privacy-policy/', 'Privacy Policy',
    'Learn how {business} collects and protects your personal information on our website.',
    'Legal: Privacy Policy',
    '{business} respects your privacy. This policy outlines how we handle the information collected through vaifoouconstruction.com.',
    [
      ['Information Collection', 'We collect personal data when you submit an estimate request or contact our team directly. This information includes your name and phone number. We also collect your project address and specific site details. Our website also collects basic browsing analytics to monitor site performance.'],
      ['Data Usage', 'We use your submitted information exclusively to review your project requirements and schedule site consultations. We do not sell your personal data to marketing agencies or third parties.'],
      ['Contact Us', 'For questions regarding your data or to request record removal, contact us at {email} or call {phone}.'],
    ],
    'Questions About Your Data?'
  ),
  legal(
    'legal-terms', '/terms/', 'Terms of Use',
    'Read the website terms of use for {business}.',
    'Legal: Terms of Use',
    'These terms govern your access to vaifoouconstruction.com. By browsing this website, you agree to these operational conditions.',
    [
      ['Website Content', 'All text, photography and branding on this site belong to {business}. Unauthorized reproduction is strictly prohibited.'],
      ['Service Estimates and Agreements', 'Online estimate requests do not constitute binding legal contracts. All project scopes, timeline estimates, pricing parameters, and workmanship guarantees are formalized in writing following a direct on-site consultation.'],
      ['Liability', '{business} provides website information for general reference. We are not liable for decisions made based solely on web content prior to an on-site consultation.'],
    ],
    'Ready to Start Your Project?'
  ),
  legal(
    'legal-accessibility', '/accessibility/', 'Accessibility Statement',
    '{business} is committed to ensuring digital accessibility for all website visitors.',
    'Legal: Accessibility Statement',
    '{business} is committed to digital accessibility. We are working toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA on vaifoouconstruction.com.',
    [
      ['Ongoing Improvements', 'The site is built with semantic headings, keyboard navigation, alt text on images and color contrast in mind. We review pages as they are added, and we fix issues as they are reported to us.'],
      ['Feedback and Assistance', 'If you encounter any barriers while using our website or require assistance reading our service information, contact us directly. Call {phone} or email {email}.'],
    ],
    'Need Help Accessing Our Site?'
  )
);

const plans: Array<{ doc: Json; existing: Json | null }> = [];
for (const raw of docs) {
  const doc = prune(raw);
  const existing = await get(doc._id);
  plans.push({ doc: strip(existing ? fillMissing(existing, doc) : doc), existing });
}
const has = (v: any) => Boolean(v?.asset?._ref);
for (const { doc, existing } of plans)
  console.log(`${existing ? 'update' : 'create'}  ${String(doc._id).padEnd(26)} hero image: ${has(doc.hero?.image) ? 'yes' : '-'}`);
if (!write) {
  console.log(`\nDry run: ${plans.length} documents. Re-run with \`-- --write\` to apply.`);
  process.exit(0);
}
mkdirSync('data/backups', { recursive: true });
writeFileSync(
  `data/backups/pages-before-seed-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  JSON.stringify(plans.map((p) => p.existing).filter(Boolean), null, 2)
);
const tx = client.transaction();
for (const { doc } of plans) tx.createOrReplace(doc as Json & { _id: string; _type: string });
await tx.commit();
console.log(`\nWrote ${plans.length} documents (published).`);

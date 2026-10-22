/**
 * Seed the site header navigation and footer into Sanity from `src/data/navigation.ts`.
 *
 *   npm run seed:nav              # dry run
 *   npm run seed:nav -- --write   # create / fill EMPTY fields only (the footer background image is kept)
 */
import { createClient } from '@sanity/client';
import { mkdirSync, writeFileSync } from 'node:fs';
import { navigationData } from '../src/data/navigation';

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
const key = () => `k${++n}`;
const get = (id: string) => client.fetch<Json | null>(`*[_id == $id][0]`, { id });
const strip = (d: Json) => {
  for (const k of ['_rev', '_createdAt', '_updatedAt']) delete d[k];
  return d;
};

const leaf = (l: Json) => ({ _key: key(), _type: 'navSubLink', text: l.text, href: l.href });
const group = (g: Json) => ({
  _key: key(),
  _type: 'navGroup',
  text: g.text,
  href: g.href,
  links: (g.links ?? []).map(leaf),
});
const item = (i: Json) => ({
  _key: key(),
  _type: 'navLink',
  text: i.text,
  href: i.href,
  links: (i.links ?? []).map(group),
});
const fLink = (l: Json) => ({ _key: key(), _type: 'footerLink', text: l.text, href: l.href });

const { header, footer } = navigationData as Json;
const docs: Json[] = [
  prune({
    _id: 'singleton-navigation',
    _type: 'siteNavigation',
    links: header.links.map(item),
    actions: [],
    topBar: header.topBar,
  }),
  prune({
    _id: 'singleton-footer',
    _type: 'siteFooter',
    licensedLine: footer.licensedLine,
    columns: footer.links.map((c: Json) => ({ _key: key(), _type: 'footerColumn', title: c.title, links: c.links.map(fLink) })),
    secondaryLinks: footer.secondaryLinks.map(fLink),
    socialLinks: footer.socialLinks.map((s: Json) => ({ _key: key(), _type: 'socialLink', ...s })),
    footNote: footer.footNote,
  }),
];

const plans: Array<{ doc: Json; existing: Json | null }> = [];
for (const doc of docs) {
  const existing = await get(doc._id);
  plans.push({ doc: strip(existing ? fillMissing(existing, doc) : doc), existing });
}
for (const { doc, existing } of plans) {
  const count = doc._type === 'siteNavigation' ? `${doc.links.length} menu items` : `${doc.columns.length} columns, ${doc.socialLinks.length} social`;
  console.log(`${existing ? 'update' : 'create'}  ${String(doc._id).padEnd(22)} ${count}`);
}
if (!write) {
  console.log('\nDry run. Re-run with `-- --write` to apply.');
  process.exit(0);
}
mkdirSync('data/backups', { recursive: true });
writeFileSync(
  `data/backups/nav-before-seed-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  JSON.stringify(plans.map((p) => p.existing).filter(Boolean), null, 2)
);
const tx = client.transaction();
for (const { doc } of plans) tx.createOrReplace(doc as Json & { _id: string; _type: string });
await tx.commit();
console.log(`\nWrote ${plans.length} documents (published).`);

import { CONTACT } from '../../config/contact';
import { sanityClient } from '../sanity/client';
import { resolveContentImage } from '../sanity/image';
import type { AboutPageContent } from './types';

/** About page from Sanity (`aboutPage`). No copy in code. `{license}` is replaced from config. */

const img = (field: string) => /* groq */ `{
  "src": coalesce(${field}.asset->url, ""),
  "alt": coalesce(${field}.alt, ""),
  "crop": ${field}.crop,
  "hotspot": ${field}.hotspot,
  "asset": ${field}.asset
}`;

const QUERY = /* groq */ `
  *[_type == "aboutPage" && _id == "singleton-about"][0] {
    seo { title, description },
    hero { heading, body, "image": ${img('image')} },
    story { heading, body },
    legacy { heading, paragraphs, "timeline": timeline[] { year, label }, "image": ${img('image')} },
    values { heading, body, "items": items[] { label, body } },
    crew { heading, body, "members": members[] { name, role } },
    cta { heading, note }
  }
`;

const s = (v: string | null | undefined) => v ?? '';
const fill = (v: string | null | undefined) => s(v).replaceAll('{license}', CONTACT.license ?? '');

export async function getAboutPage(): Promise<AboutPageContent | null> {
  const d = await sanityClient.fetch<any>(QUERY);
  if (!d) return null;
  return {
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), body: s(d.hero?.body), image: resolveContentImage(d.hero?.image) },
    story: { heading: s(d.story?.heading), body: fill(d.story?.body) },
    legacy: {
      heading: s(d.legacy?.heading),
      paragraphs: (d.legacy?.paragraphs ?? []).map(fill),
      timeline: (d.legacy?.timeline ?? []).map((t: any) => ({ year: s(t.year), label: fill(t.label) })),
      image: resolveContentImage(d.legacy?.image),
    },
    values: {
      heading: s(d.values?.heading),
      body: s(d.values?.body),
      items: (d.values?.items ?? []).map((i: any) => ({ label: s(i.label), body: s(i.body) })),
    },
    crew: {
      heading: s(d.crew?.heading),
      body: s(d.crew?.body),
      members: (d.crew?.members ?? []).map((m: any) => ({ name: s(m.name), role: s(m.role) })),
    },
    cta: { heading: s(d.cta?.heading), note: d.cta?.note?.trim() ? d.cta.note : undefined },
  };
}

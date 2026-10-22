import { sanityClient } from '../sanity/client';
import { resolveContentImage } from '../sanity/image';
import type { ServiceAreaListItem, ServiceAreaPageContent, ServiceAreasHubContent, ServiceFaqEntry } from './types';

/**
 * Service areas from Sanity — hub (`serviceAreasHubPage`) and location pages (`serviceAreaPage`).
 * The hub grid and each page's cross-links are built from the area documents, ordered by `order`.
 * No copy in code: a missing document returns `null`.
 */

const img = (field: string) => /* groq */ `{
  "src": coalesce(${field}.asset->url, ""),
  "alt": coalesce(${field}.alt, ""),
  "crop": ${field}.crop,
  "hotspot": ${field}.hotspot,
  "asset": ${field}.asset
}`;

const normalizePath = (path: string) => {
  const t = path.trim();
  const withLeading = t.startsWith('/') ? t : `/${t}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
};

const s = (v: string | null | undefined) => v ?? '';
const opt = (v: string | null | undefined) => (v?.trim() ? v : undefined);
const faqs = (items?: Array<Partial<ServiceFaqEntry>> | null): ServiceFaqEntry[] =>
  (items ?? []).map((i) => ({ question: s(i.question), answer: s(i.answer) }));

const AREAS_QUERY = /* groq */ `*[_type == "serviceAreaPage"] | order(order asc, name asc) { name, path }`;
const toList = (rows: Array<{ name?: string; path?: string }> | null): ServiceAreaListItem[] =>
  (rows ?? []).map((r) => ({ name: s(r.name), path: s(r.path) }));

const HUB_QUERY = /* groq */ `
  {
    "page": *[_type == "serviceAreasHubPage" && _id == "singleton-service-areas-hub"][0] {
      seo { title, description },
      hero { heading, subheading, "image": ${img('image')} },
      intro { heading, body, "image": ${img('image')} },
      communities { heading, body, cardLabel },
      faqs { heading, "items": items[] { question, answer } },
      cta { heading, note }
    },
    "areas": ${AREAS_QUERY}
  }
`;

export async function getServiceAreasHub(): Promise<ServiceAreasHubContent | null> {
  const { page: d, areas } = await sanityClient.fetch<any>(HUB_QUERY);
  if (!d) return null;
  return {
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), subheading: s(d.hero?.subheading), image: resolveContentImage(d.hero?.image) },
    intro: { heading: s(d.intro?.heading), body: s(d.intro?.body), image: resolveContentImage(d.intro?.image) },
    communities: {
      heading: s(d.communities?.heading),
      body: s(d.communities?.body),
      cardLabel: s(d.communities?.cardLabel),
      areas: toList(areas),
    },
    faqs: { heading: s(d.faqs?.heading), items: faqs(d.faqs?.items) },
    cta: { heading: s(d.cta?.heading), note: opt(d.cta?.note) },
  };
}

const AREA_QUERY = /* groq */ `
  {
    "page": *[_type == "serviceAreaPage" && path == $path][0] {
      path, name,
      seo { title, description },
      hero { heading, body, "image": ${img('image')} },
      intro { heading, body, "image": ${img('image')} },
      services { heading, "cards": cards[] { name, href, description } },
      projects { heading, body, ctaLabel, ctaHref, "image": ${img('image')} },
      faqs { heading, "items": items[] { question, answer } },
      cta { heading, note }
    },
    "areas": ${AREAS_QUERY}
  }
`;

export async function getServiceAreaPage(path: string): Promise<ServiceAreaPageContent | null> {
  const target = normalizePath(path);
  const { page: d, areas } = await sanityClient.fetch<any>(AREA_QUERY, { path: target });
  if (!d) return null;
  return {
    path: d.path,
    name: s(d.name),
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), body: s(d.hero?.body), image: resolveContentImage(d.hero?.image) },
    intro: { heading: s(d.intro?.heading), body: s(d.intro?.body), image: resolveContentImage(d.intro?.image) },
    services: {
      heading: s(d.services?.heading),
      cards: (d.services?.cards ?? []).map((c: any) => ({ name: s(c.name), href: s(c.href), description: s(c.description) })),
    },
    projects: {
      heading: s(d.projects?.heading),
      body: s(d.projects?.body),
      ctaLabel: s(d.projects?.ctaLabel),
      ctaHref: s(d.projects?.ctaHref) || '/projects/',
      image: resolveContentImage(d.projects?.image),
    },
    faqs: { heading: s(d.faqs?.heading), items: faqs(d.faqs?.items) },
    cta: { heading: s(d.cta?.heading), note: opt(d.cta?.note) },
    otherAreas: toList(areas).filter((a) => a.path !== target),
  };
}

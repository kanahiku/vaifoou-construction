import { sanityClient } from '../sanity/client';
import { resolveContentImage, type SanityImageFields } from '../sanity/image';
import type {
  ContentImage,
  HomeAudienceCard,
  HomeServiceCard,
  ServiceCategoryPageContent,
  ServiceFaqEntry,
  ServiceLinkEntry,
  ServiceSubPageContent,
  ServiceTitledItem,
  ServicesHubContent,
} from './types';

/**
 * Service pages from Sanity — hub (`servicesHubPage`), category pages (`serviceCategoryPage`)
 * and sub-pages (`serviceSubPage`). There is no copy in code: a missing document returns `null`
 * and the page responds 404 instead of rendering empty sections.
 */

type FetchedImage = ContentImage & SanityImageFields;

const img = (field: string) => /* groq */ `{
  "src": coalesce(${field}.asset->url, ""),
  "alt": coalesce(${field}.alt, ""),
  "crop": ${field}.crop,
  "hotspot": ${field}.hotspot,
  "asset": ${field}.asset
}`;

const normalizePath = (path: string) => {
  const trimmed = path.trim();
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
};

const s = (v: string | null | undefined) => v ?? '';
const opt = (v: string | null | undefined) => (v?.trim() ? v : undefined);

const titled = (items?: Array<Partial<ServiceTitledItem>> | null): ServiceTitledItem[] =>
  (items ?? []).map((i) => ({ title: s(i.title), description: s(i.description), icon: opt(i.icon) }));
const faqs = (items?: Array<Partial<ServiceFaqEntry>> | null): ServiceFaqEntry[] =>
  (items ?? []).map((i) => ({ question: s(i.question), answer: s(i.answer) }));
const links = (items?: Array<Partial<ServiceLinkEntry>> | null): ServiceLinkEntry[] =>
  (items ?? []).map((i) => ({ title: s(i.title), href: s(i.href) }));

// ─── Hub ──────────────────────────────────────────────────────────────────────

const HUB_QUERY = /* groq */ `
  *[_type == "servicesHubPage" && _id == "singleton-services-hub"][0] {
    seo { title, description },
    hero { heading, subheading, "image": ${img('image')} },
    intro {
      heading, body,
      "audienceCards": coalesce(audienceCards, ^.audienceCards)[] {
        label, title, ctaLabel, href, "image": ${img('image')}
      }
    },
    capabilities { heading, "items": items[] { title, icon, description, href } },
    scope { heading, buildLabel, notCoverLabel, "rows": rows[] { build, notCover } },
    cta { heading, note }
  }
`;

export async function getServicesHub(): Promise<ServicesHubContent | null> {
  const d = await sanityClient.fetch<any>(HUB_QUERY);
  if (!d) return null;
  return {
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), subheading: s(d.hero?.subheading), image: resolveContentImage(d.hero?.image) },
    intro: {
      heading: s(d.intro?.heading),
      body: s(d.intro?.body),
      audienceCards: (d.intro?.audienceCards ?? []).map(
        (c: Partial<HomeAudienceCard> & { image?: FetchedImage }): HomeAudienceCard => ({
          label: s(c.label),
          title: s(c.title),
          ctaLabel: s(c.ctaLabel),
          href: s(c.href),
          image: resolveContentImage(c.image),
        })
      ),
    },
    capabilities: {
      heading: s(d.capabilities?.heading),
      items: (d.capabilities?.items ?? []).map(
        (c: Partial<HomeServiceCard>): HomeServiceCard => ({
          title: s(c.title),
          icon: c.icon ?? 'rock-wall',
          description: s(c.description),
          ctaLabel: s(c.ctaLabel),
          href: s(c.href),
        })
      ),
    },
    scope: {
      heading: s(d.scope?.heading),
      buildLabel: s(d.scope?.buildLabel),
      notCoverLabel: s(d.scope?.notCoverLabel),
      rows: (d.scope?.rows ?? []).map((r: any) => ({ build: s(r.build), notCover: s(r.notCover) })),
    },
    cta: { heading: s(d.cta?.heading), note: s(d.cta?.note) },
  };
}

// ─── Category pages ───────────────────────────────────────────────────────────

const CATEGORY_QUERY = /* groq */ `
  *[_type == "serviceCategoryPage" && path == $path][0] {
    path,
    seo { title, description },
    hero { heading, subheading, "image": ${img('image')} },
    intro { heading, body, "image": ${img('image')} },
    subServices { heading, columns, "cards": cards[] { title, description, href, ctaLabel } },
    projects { heading, body, ctaLabel, ctaHref, "image": ${img('image')} },
    process { heading, "steps": steps[] { title, description } },
    faqs { heading, "items": items[] { question, answer } },
    related { heading, "links": links[] { title, href } },
    cta { heading, note }
  }
`;

export async function getServiceCategoryPage(path: string): Promise<ServiceCategoryPageContent | null> {
  const d = await sanityClient.fetch<any>(CATEGORY_QUERY, { path: normalizePath(path) });
  if (!d) return null;
  const columns = [2, 3, 4].includes(d.subServices?.columns) ? d.subServices.columns : 2;
  return {
    path: d.path,
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), subheading: s(d.hero?.subheading), image: resolveContentImage(d.hero?.image) },
    intro: { heading: s(d.intro?.heading), body: s(d.intro?.body), image: resolveContentImage(d.intro?.image) },
    subServices: {
      heading: s(d.subServices?.heading),
      columns,
      cards: (d.subServices?.cards ?? []).map((c: any) => ({
        title: s(c.title),
        description: s(c.description),
        href: opt(c.href),
        ctaLabel: opt(c.ctaLabel),
      })),
    },
    projects: {
      heading: s(d.projects?.heading),
      body: s(d.projects?.body),
      ctaLabel: s(d.projects?.ctaLabel),
      ctaHref: s(d.projects?.ctaHref) || '/projects/',
      image: resolveContentImage(d.projects?.image),
    },
    process: { heading: s(d.process?.heading), steps: titled(d.process?.steps) },
    faqs: { heading: s(d.faqs?.heading), items: faqs(d.faqs?.items) },
    related: { heading: s(d.related?.heading), links: links(d.related?.links) },
    cta: { heading: s(d.cta?.heading), note: s(d.cta?.note) },
  };
}

// ─── Sub pages ────────────────────────────────────────────────────────────────

const SUB_QUERY = /* groq */ `
  *[_type == "serviceSubPage" && path == $path][0] {
    path,
    seo { title, description },
    hero { heading, body, "image": ${img('image')} },
    process { heading, "items": items[] { title, description, icon } },
    materials { heading, "items": items[] { title, description, icon } },
    comparison {
      eyebrow, heading, note, col1, col2,
      "rows": rows[] { feature, val1, val2 },
      footerText, footerLinkLabel, footerLinkHref
    },
    applications { heading, "items": items[] { title, description, icon } },
    related { categoryLabel, "links": links[] { title, href } },
    faqs { heading, "items": items[] { question, answer } },
    cta { heading, note }
  }
`;

export async function getServiceSubPage(path: string): Promise<ServiceSubPageContent | null> {
  const d = await sanityClient.fetch<any>(SUB_QUERY, { path: normalizePath(path) });
  if (!d) return null;
  return {
    path: d.path,
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), body: s(d.hero?.body), image: resolveContentImage(d.hero?.image) },
    process: { heading: s(d.process?.heading), items: titled(d.process?.items) },
    materials: { heading: s(d.materials?.heading), items: titled(d.materials?.items) },
    comparison: {
      eyebrow: opt(d.comparison?.eyebrow),
      heading: s(d.comparison?.heading),
      note: opt(d.comparison?.note),
      col1: s(d.comparison?.col1),
      col2: opt(d.comparison?.col2),
      rows: (d.comparison?.rows ?? []).map((r: any) => ({
        feature: s(r.feature),
        val1: s(r.val1),
        val2: opt(r.val2),
      })),
      footerText: opt(d.comparison?.footerText),
      footerLinkLabel: opt(d.comparison?.footerLinkLabel),
      footerLinkHref: opt(d.comparison?.footerLinkHref),
    },
    applications: { heading: s(d.applications?.heading), items: titled(d.applications?.items) },
    related: { categoryLabel: s(d.related?.categoryLabel), links: links(d.related?.links) },
    faqs: { heading: s(d.faqs?.heading), items: faqs(d.faqs?.items) },
    cta: { heading: s(d.cta?.heading), note: s(d.cta?.note) },
  };
}

import { sanityClient } from '../sanity/client';
import { resolveContentImage } from '../sanity/image';
import type {
  AudienceLandingPageContent,
  AudienceListItem,
  AudienceSubPageContent,
  ServiceFaqEntry,
} from './types';

/**
 * "Who we work with" pages from Sanity — landing pages (`audienceLandingPage`) and commercial client
 * sub-pages (`audienceSubPage`). Sub-page link grids are built from the sub-page documents.
 * No copy in code: a missing document returns `null`.
 */

const img = (field: string) => /* groq */ `{
  "src": coalesce(${field}.asset->url, ""),
  "alt": coalesce(${field}.alt, ""),
  "crop": ${field}.crop,
  "hotspot": ${field}.hotspot,
  "asset": ${field}.asset
}`;
const s = (v: string | null | undefined) => v ?? '';
const opt = (v: string | null | undefined) => (v?.trim() ? v : undefined);
const faqs = (items?: Array<Partial<ServiceFaqEntry>> | null): ServiceFaqEntry[] =>
  (items ?? []).map((i) => ({ question: s(i.question), answer: s(i.answer) }));
const list = (rows: Array<{ name?: string; path?: string }> | null): AudienceListItem[] =>
  (rows ?? []).map((r) => ({ name: s(r.name), path: s(r.path) }));

const SUBS = /* groq */ `*[_type == "audienceSubPage"] | order(order asc, name asc) { name, path }`;

export async function getAudienceLandingPage(path: string): Promise<AudienceLandingPageContent | null> {
  const { page: d, subs } = await sanityClient.fetch<any>(
    /* groq */ `{
      "page": *[_type == "audienceLandingPage" && path == $path][0] {
        path,
        seo { title, description },
        hero { heading, body, "image": ${img('image')} },
        intro { heading, body, crossPrompt, crossLabel, crossHref, "image": ${img('image')} },
        services { heading, "cards": cards[] { name, href, description } },
        experience { heading, "items": items[] { heading, body } },
        work { heading, body, ctaLabel, ctaHref, "image": ${img('image')} },
        subPages { categoryLabel, viewAllLabel, viewAllHref },
        faqs { heading, "items": items[] { question, answer } },
        cta { heading, note }
      },
      "subs": ${SUBS}
    }`,
    { path }
  );
  if (!d) return null;
  return {
    path: d.path,
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), body: s(d.hero?.body), image: resolveContentImage(d.hero?.image) },
    intro: {
      heading: s(d.intro?.heading),
      body: s(d.intro?.body),
      crossPrompt: opt(d.intro?.crossPrompt),
      crossLabel: opt(d.intro?.crossLabel),
      crossHref: opt(d.intro?.crossHref),
      image: resolveContentImage(d.intro?.image),
    },
    services: {
      heading: s(d.services?.heading),
      cards: (d.services?.cards ?? []).map((c: any) => ({ name: s(c.name), href: s(c.href), description: s(c.description) })),
    },
    experience: {
      heading: s(d.experience?.heading),
      items: (d.experience?.items ?? []).map((i: any) => ({ heading: s(i.heading), body: s(i.body) })),
    },
    work: d.work?.heading?.trim()
      ? {
          heading: d.work.heading,
          body: s(d.work.body),
          ctaLabel: s(d.work.ctaLabel),
          ctaHref: s(d.work.ctaHref),
          image: resolveContentImage(d.work.image),
        }
      : undefined,
    subPages: d.subPages?.categoryLabel?.trim()
      ? {
          categoryLabel: d.subPages.categoryLabel,
          viewAllLabel: opt(d.subPages.viewAllLabel),
          viewAllHref: opt(d.subPages.viewAllHref),
          items: list(subs),
        }
      : undefined,
    faqs: { heading: s(d.faqs?.heading), items: faqs(d.faqs?.items) },
    cta: { heading: s(d.cta?.heading), note: opt(d.cta?.note) },
  };
}

export async function getAudienceSubPage(path: string): Promise<AudienceSubPageContent | null> {
  const { page: d, subs } = await sanityClient.fetch<any>(
    /* groq */ `{
      "page": *[_type == "audienceSubPage" && path == $path][0] {
        path, name,
        seo { title, description },
        hero { heading, body, "image": ${img('image')} },
        intro { heading, body, "image": ${img('image')} },
        comparison { heading, col1, col2, "rows": rows[] { feature, val1, val2 } },
        related { categoryLabel, viewAllLabel, viewAllHref },
        faqs { heading, "items": items[] { question, answer } },
        cta { heading, note }
      },
      "subs": ${SUBS}
    }`,
    { path }
  );
  if (!d) return null;
  return {
    path: d.path,
    name: s(d.name),
    seo: { title: s(d.seo?.title), description: s(d.seo?.description) },
    hero: { heading: s(d.hero?.heading), body: s(d.hero?.body), image: resolveContentImage(d.hero?.image) },
    intro: { heading: s(d.intro?.heading), body: s(d.intro?.body), image: resolveContentImage(d.intro?.image) },
    comparison: {
      heading: s(d.comparison?.heading),
      col1: s(d.comparison?.col1),
      col2: opt(d.comparison?.col2),
      rows: (d.comparison?.rows ?? []).map((r: any) => ({ feature: s(r.feature), val1: s(r.val1), val2: opt(r.val2) })),
    },
    related: {
      categoryLabel: s(d.related?.categoryLabel),
      viewAllLabel: opt(d.related?.viewAllLabel),
      viewAllHref: opt(d.related?.viewAllHref),
      items: list(subs).filter((i) => i.path !== d.path),
    },
    faqs: { heading: s(d.faqs?.heading), items: faqs(d.faqs?.items) },
    cta: { heading: s(d.cta?.heading), note: opt(d.cta?.note) },
  };
}

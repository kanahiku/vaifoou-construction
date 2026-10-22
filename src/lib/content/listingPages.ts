import { sanityClient } from '../sanity/client';
import { resolveContentImage } from '../sanity/image';
import type { BlogPageContent, ProjectsPageContent, ReviewsPageContent } from './types';

/**
 * Copy around the reviews / projects / blog listings. No copy in code: a missing document returns `null`.
 * (The testimonials, projects and posts themselves are separate documents.)
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
const seo = (d: any) => ({ title: s(d?.title), description: s(d?.description) });

export async function getReviewsPage(): Promise<ReviewsPageContent | null> {
  const d = await sanityClient.fetch<any>(/* groq */ `
    *[_type == "reviewsPage" && _id == "singleton-reviews"][0] {
      seo { title, description },
      hero { heading, body, "image": ${img('image')} },
      featured { heading, body, emptyTitle, emptyBody, "extraReviews": extraReviews[] { quote, name, platform, reviewedAt } },
      profiles { heading, body },
      cta { heading, note }
    }`);
  if (!d) return null;
  return {
    seo: seo(d.seo),
    hero: { heading: s(d.hero?.heading), body: s(d.hero?.body), image: resolveContentImage(d.hero?.image) },
    featured: {
      heading: s(d.featured?.heading),
      body: s(d.featured?.body),
      emptyTitle: s(d.featured?.emptyTitle),
      emptyBody: s(d.featured?.emptyBody),
      extraReviews: (d.featured?.extraReviews ?? [])
        .filter((r: any) => r?.quote?.trim() && r?.name?.trim())
        .map((r: any) => ({
          quote: r.quote,
          name: r.name,
          platform: ['google', 'yelp', 'thumbtack'].includes(r.platform) ? r.platform : undefined,
          reviewedAt: opt(r.reviewedAt),
        })),
    },
    profiles: { heading: s(d.profiles?.heading), body: s(d.profiles?.body) },
    cta: { heading: s(d.cta?.heading), note: opt(d.cta?.note) },
  };
}

export async function getProjectsPage(): Promise<ProjectsPageContent | null> {
  const d = await sanityClient.fetch<any>(/* groq */ `
    *[_type == "projectsPage" && _id == "singleton-projects"][0] {
      seo { title, description },
      hero { heading, body, "image": ${img('image')} },
      filters { heading, body, locationLabel, allLocationsLabel, serviceLabel, allServicesLabel, resetLabel, emptyText },
      services { heading, "cards": cards[] { title, description, href, ctaLabel, icon } },
      cta { heading, note }
    }`);
  if (!d) return null;
  const f = d.filters ?? {};
  return {
    seo: seo(d.seo),
    hero: { heading: s(d.hero?.heading), body: s(d.hero?.body), image: resolveContentImage(d.hero?.image) },
    filters: {
      heading: s(f.heading),
      body: s(f.body),
      locationLabel: s(f.locationLabel),
      allLocationsLabel: s(f.allLocationsLabel),
      serviceLabel: s(f.serviceLabel),
      allServicesLabel: s(f.allServicesLabel),
      resetLabel: s(f.resetLabel),
      emptyText: s(f.emptyText),
    },
    services: {
      heading: s(d.services?.heading),
      cards: (d.services?.cards ?? []).map((c: any) => ({
        title: s(c.title),
        description: s(c.description),
        href: s(c.href),
        ctaLabel: s(c.ctaLabel),
        icon: s(c.icon),
      })),
    },
    cta: { heading: s(d.cta?.heading), note: opt(d.cta?.note) },
  };
}

export async function getBlogPage(): Promise<BlogPageContent | null> {
  const d = await sanityClient.fetch<any>(/* groq */ `
    *[_type == "blogPage" && _id == "singleton-blog"][0] {
      seo { title, description }, hero { heading }, empty { title, body }, cta { heading, note }
    }`);
  if (!d) return null;
  return {
    seo: seo(d.seo),
    hero: { heading: s(d.hero?.heading) },
    empty: { title: s(d.empty?.title), body: s(d.empty?.body) },
    cta: { heading: s(d.cta?.heading), note: opt(d.cta?.note) },
  };
}

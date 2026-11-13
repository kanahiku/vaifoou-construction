import type { ArticleInfo, BreadcrumbItem, JsonLdContext, PageSchema } from './types';
import { normalizePath } from './urls';

const HOME: BreadcrumbItem = { name: 'Home', path: '/' };

const LABELS: Record<string, string> = {
  'who-we-work-with': 'Who We Work With',
  'cmu-block-walls': 'CMU Block Walls',
  'aiea-pearl-city': 'Aiea & Pearl City',
  hoa: 'HOA',
  'property-managers-landlords': 'Property Managers & Landlords',
};

function labelFor(segment: string): string {
  return (
    LABELS[segment] ??
    segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

/** "Rock Walls | Vaifoou Construction" → "Rock Walls". */
function cleanTitle(title: string | undefined, fallback: string): string {
  const base = (title ?? '').split('|')[0]?.trim();
  return base || fallback;
}

function breadcrumbFor(segments: string[]): BreadcrumbItem[] {
  const crumbs = [HOME];
  segments.forEach((segment, index) => {
    crumbs.push({ name: labelFor(segment), path: `/${segments.slice(0, index + 1).join('/')}` });
  });
  return crumbs;
}

/**
 * Schema for any route that has no hand-written entry in `pages.ts`.
 * Page type comes from the URL structure; name and description come from the page's own meta.
 */
export function derivePageSchema(pathname: string, ctx: JsonLdContext): PageSchema | undefined {
  const path = normalizePath(pathname);
  const segments = path.split('/').filter(Boolean);
  if (!segments.length || segments[0] === '404' || segments[0] === 'api') return undefined;

  const [root, second] = segments;
  const fallbackName = labelFor(segments[segments.length - 1]);
  const base = {
    name: cleanTitle(ctx.title, fallbackName),
    path,
    description: ctx.description ?? null,
    faq: [],
    breadcrumb: breadcrumbFor(segments),
  };

  if (root === 'about') return { ...base, schemaType: 'AboutPage' };
  if (root === 'services' && second) {
    return { ...base, schemaType: 'Service', serviceType: labelFor(segments[segments.length - 1]) };
  }
  if (root === 'service-areas' && second) {
    return { ...base, schemaType: 'Service', serviceType: 'Masonry and concrete construction', areaName: labelFor(second) };
  }
  if (root === 'blog' && second) {
    const article: ArticleInfo | undefined = ctx.article;
    return { ...base, schemaType: 'BlogPosting', article };
  }
  if (root === 'projects' || root === 'services' || root === 'service-areas') {
    return { ...base, schemaType: 'CollectionPage' };
  }
  return { ...base, schemaType: 'WebPage' };
}

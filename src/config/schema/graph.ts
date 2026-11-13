import { business } from './business';
import { pages } from './pages';
import { derivePageSchema } from './auto';
import type { BusinessSchema, JsonLdContext, JsonLdNode, PageSchema } from './types';
import { absoluteUrl, businessId, normalizePath, siteOrigin } from './urls';

function buildWebsiteJson(entity: BusinessSchema): JsonLdNode {
  const origin = siteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: entity.name,
    publisher: { '@id': businessId(entity.idFragment) },
  };
}

function buildBusinessJson(entity: BusinessSchema): JsonLdNode {
  const origin = siteOrigin();
  const out: JsonLdNode = {
    '@context': 'https://schema.org',
    '@type': entity.businessType,
    '@id': businessId(entity.idFragment),
    name: entity.name,
    url: `${origin}/`,
    telephone: entity.telephone,
    email: entity.email,
    priceRange: entity.priceRange,
    address: { '@type': 'PostalAddress', ...entity.address },
    description: entity.description,
  };

  if (entity.openingHoursSpecification?.length) {
    out.openingHoursSpecification = entity.openingHoursSpecification;
  }
  if (entity.hasCredential?.length) out.hasCredential = entity.hasCredential;
  if (entity.memberOf) out.memberOf = entity.memberOf;
  if (entity.award?.length) out.award = entity.award;
  if (entity.sameAs?.length) out.sameAs = entity.sameAs;
  if (entity.areaServed) out.areaServed = entity.areaServed;
  if (entity.logo) out.logo = entity.logo;
  if (entity.logo) out.image = entity.logo;
  if (entity.hasMap) out.hasMap = entity.hasMap;
  if (entity.geo) out.geo = { '@type': 'GeoCoordinates', ...entity.geo };

  return out;
}

function buildPageNodes(page: PageSchema, entity: BusinessSchema): JsonLdNode[] {
  const nodes: JsonLdNode[] = [];

  if (page.schemaType !== 'FAQOnly') {
    const main: JsonLdNode = {
      '@context': 'https://schema.org',
      '@type': page.schemaType,
      name: page.name,
      url: absoluteUrl(page.path),
      description: page.description,
    };

    if (page.schemaType === 'BlogPosting') {
      main.headline = page.name;
      main.mainEntityOfPage = absoluteUrl(page.path);
      main.author = { '@type': 'Organization', name: page.article?.author || entity.name };
      main.publisher = { '@id': businessId(entity.idFragment) };
      if (page.article?.datePublished) main.datePublished = page.article.datePublished;
      main.dateModified = page.article?.dateModified || page.article?.datePublished;
      if (page.article?.image) main.image = page.article.image;
    } else if (page.schemaType !== 'Service') {
      main.isPartOf = { '@id': `${siteOrigin()}/#website` };
    }

    if (page.schemaType === 'Service') {
      main.serviceType = page.serviceType;
      main.provider = { '@id': businessId(entity.idFragment) };
      main.areaServed = page.areaName
        ? { '@type': 'City', name: `${page.areaName}, Hawaii` }
        : entity.areaServed || { '@type': 'AdministrativeArea', name: 'Oahu, Hawaii' };
    }

    nodes.push(main);
  }

  if (page.faq?.length) {
    nodes.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  return nodes;
}

function buildBreadcrumbJson(page: PageSchema): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: page.breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const pagesByPath = new Map(pages.map((page) => [normalizePath(page.path), page]));

function parseOverride(raw: string | undefined): JsonLdNode[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as JsonLdNode | JsonLdNode[];
    return (Array.isArray(parsed) ? parsed : [parsed]).filter((node) => node && typeof node === 'object');
  } catch {
    return [];
  }
}

/**
 * JSON-LD blocks for the current request path.
 * Homepage always includes WebSite + business type. Every other page emits its
 * Service/WebPage/etc. node (hand-written in pages.ts, otherwise derived from the URL) plus breadcrumbs.
 * A Sanity `seo.schemaOverride` can append to or replace the automatic output.
 */
export function getJsonLdBlocks(pathname: string, ctx: JsonLdContext = {}): JsonLdNode[] {
  if (!siteOrigin()) return [];

  const path = normalizePath(pathname);
  const entity: BusinessSchema = { ...business, ...(ctx.business ?? {}) };
  const blocks: JsonLdNode[] = [];
  const page = pagesByPath.get(path) ?? derivePageSchema(path, ctx);

  if (path === '/') {
    blocks.push(buildWebsiteJson(entity));
    blocks.push(buildBusinessJson(entity));
  }

  if (page) {
    blocks.push(...buildPageNodes(page, entity));
    if (page.breadcrumb.length > 1) blocks.push(buildBreadcrumbJson(page));
  }

  const custom = parseOverride(ctx.schemaOverride);
  if (ctx.schemaMode === 'replace' && custom.length) return custom;
  if (ctx.schemaMode === 'append') return [...blocks, ...custom];
  return blocks;
}

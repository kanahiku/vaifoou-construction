export const prerender = false;

import type { APIRoute } from 'astro';
import { getPublicContentPaths } from '~/lib/content';
import { canonicalSiteOrigin, isIndexableHost } from '~/lib/indexing';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeSitemapPath(path: string) {
  if (!path || path === '/') return '/';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return `${withLeadingSlash.replace(/\/+$/, '')}/`;
}

export const GET: APIRoute = async ({ request }) => {
  const isIndexable = isIndexableHost(request.headers.get('host'));
  const origin = canonicalSiteOrigin();
  const paths = [...new Set((await getPublicContentPaths()).map(normalizeSitemapPath))];
  const urls = paths
    .map((path) => {
      const loc = `${origin}${path === '/' ? '/' : path}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
      ...(!isIndexable ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
    },
  });
};

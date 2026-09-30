import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, fontProviders } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { brandFontConfig } from './src/brand';
import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

const isrBypassToken = process.env.ISR_BYPASS_TOKEN || 'dev-isr-bypass-token-32-chars-min';

export default defineConfig({
  output: 'server',
  trailingSlash: 'always',
  adapter: vercel({
    edgeMiddleware: true,
    isr: {
      expiration: 60 * 5,
      bypassToken: isrBypassToken,
      exclude: [/^\/api(\/|$)/, '/sitemap.xml', '/robots.txt'],
    },
  }),

  redirects: {
    '/our-locations': '/locations',
    '/work-with-us': '/careers',
    '/terms-of-service': '/terms',
    '/residential': {
      status: 301,
      destination: '/who-we-work-with/residential',
    },
    '/residential/': {
      status: 301,
      destination: '/who-we-work-with/residential/',
    },
    '/commercial': {
      status: 301,
      destination: '/who-we-work-with/commercial',
    },
    '/commercial/': {
      status: 301,
      destination: '/who-we-work-with/commercial/',
    },
    '/who-we-work-with': {
      status: 301,
      destination: '/services',
    },
    '/who-we-work-with/': {
      status: 301,
      destination: '/services/',
    },
  },

  // Hover/tap only. Prefetching every nav + footer URL on load contended with
  // the hero image and pushed LCP past 10s on a cold homepage.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fonts: brandFontConfig().map((font): any =>
    font.provider === 'google'
      ? {
          name: font.name,
          cssVariable: font.cssVariable,
          provider: fontProviders.google(),
          weights: font.weights,
          styles: font.styles,
          subsets: font.subsets,
          fallbacks: font.fallbacks,
        }
      : {
          name: font.name,
          cssVariable: font.cssVariable,
          provider: fontProviders.local(),
          fallbacks: font.fallbacks,
          options: (font as unknown as { options: unknown }).options,
        }
  ),

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      // csso off on purpose: its parser doesn't understand the media range
      // syntax Tailwind v4 emits for breakpoints (`@media (width>=48rem)`) and
      // silently drops every one of those blocks — the site then renders as if
      // all `md:`/`lg:` classes were missing. lightningcss parses it correctly.
      CSS: { csso: false, lightningcss: { minify: true } },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    // Astro's default Sharp service handles local images.
    //
    // Most remote CDN images (Unsplash, Cloudinary, Imgix…) are routed by
    // src/components/common/Image.astro through `unpic`, which rewrites the
    // URL with CDN-side query parameters and serves it straight from the
    // provider — Astro never downloads it, so they don't need to be listed.
    //
    // `domains` only matters for remote URLs that fall through to Astro's
    // native <Image /> (i.e. providers Unpic can't detect, like Pixabay).
    // Listed entries are authorized to be processed by Sharp.
    domains: ['cdn.pixabay.com', 'cdn.sanity.io'],

    // Emit responsive styles for the native <Image layout=…> used by
    // src/components/common/Image.astro (local images). Utility classes on
    // each usage still win, since these styles use low-specificity selectors.
    responsiveStyles: true,
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});

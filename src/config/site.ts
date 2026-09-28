/**
 * Site identity and public analytics IDs.
 *
 * Edit this file for every client. Secrets (Sanity, Resend, Places, Yelp) stay in `.env`.
 *
 * Sibling files:
 *   src/brand.ts           colors, fonts, radius
 *   src/config/contact.ts  phone, email, address, hours
 *   src/config/social.ts   profile URLs
 *   src/config/cta.ts      button labels
 *   src/config/schema/business.ts  schema.org extras (price range, credentials)
 */
export const site = {
  name: 'Vaifoou Construction',
  url: 'https://vaifoouconstruction.com',
  description: "O'ahu's trusted family-owned masonry and concrete contractor since 2000. We build rock walls, CMU block walls, and concrete for O'ahu homeowners, HOAs, and contractors.",
  footerTagline: "O'ahu's trusted family-owned masonry and concrete contractor since 2000. Built to last, built right.",
  trailingSlash: true,

  /** Cloudflare Worker `sites.slug`. `PUBLIC_SITE_SLUG` in env overrides this. */
  formSlug: 'vaifoou-construction',

  analytics: {
    /** Google Tag Manager container. Empty until the client GTM is created. */
    googleTagManagerId: '',
    /** Optional. Leave empty when tags are installed through GTM. */
    googleAnalyticsId: '',
    /** Search Console HTML-tag verification (`content=` value only). */
    googleSiteVerificationId: '',
  },
} as const;

export type SiteConfig = typeof site;

export function siteOrigin(): string {
  return site.url.replace(/\/$/, '');
}

export function siteHost(): string {
  return siteOrigin().replace(/^https?:\/\//, '');
}

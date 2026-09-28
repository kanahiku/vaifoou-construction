/**
 * Brand tokens — the only file to edit when a Figma file (or a new client)
 * changes colors, type, or radius.
 *
 * Flow:
 * 1. Paste values extracted from Figma (MCP `get_variable_defs`, or walk
 *    fills/text if there is no Variables / Design System frame).
 * 2. `CustomStyles.astro` and `astro.config.ts` read this file at build time.
 * 3. Components never hardcode hex — they use Tailwind tokens backed by these CSS vars.
 *
 * Do not put contact data, GTM, nav links, or page copy here.
 * Those live in `src/config/site.ts`, `src/config/contact.ts`, and siblings.
 */

export const brand = {
  fonts: {
    /** Barlow Condensed — headings, display, ticker. */
    heading: {
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow-condensed',
      provider: 'google' as const,
      weights: ['400', '500', '600', '700'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['sans-serif'] as string[],
    },
    /** Work Sans — body copy, labels, buttons. */
    body: {
      name: 'Work Sans',
      cssVariable: '--font-work-sans',
      provider: 'google' as const,
      weights: ['400', '500', '600', '700'] as string[],
      styles: ['normal', 'italic'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['sans-serif'] as string[],
    },
  },

  /**
   * Design system palette.
   * Primary #964025 · Secondary #605E5A · Tertiary #406146 · Neutral #827470
   */
  colors: {
    accent: '#964025',       // Primary — terracotta
    accentHover: '#B04E2C',  // Primary lightened
    heading: '#1A100C',      // Near-black warm for headings
    muted: '#605E5A',        // Secondary — warm grey
    eyebrow: '#827470',      // Neutral — taupe
    page: '#F2EBE6',         // Warm off-white page bg
    /** Top utility bar — Figma 4:436 / 4:480. */
    banner: '#E5E2DC',
    bannerLine: '#D5D1C9',
    bannerText: '#382E2B',
    bannerDot: '#89726C',
    bannerNote: '#55423D',
    /** Navbar estimate button — Figma 4:476. */
    navCta: '#772911',
    sectionGrey: '#E0D6D0',  // Light warm grey section
    sectionDark: '#406146',  // Tertiary — forest green
    card: '#FAF6F3',         // Card bg — near white warm
    cardMist: '#D6CCC6',     // Muted card border / mist
    cardDark: '#2D4533',     // Tertiary darkened — deep green
    ctaBg: '#406146',        // Tertiary — CTA band start
    ctaEnd: '#2D4533',       // Tertiary darkened — CTA band end
    ctaTan: '#964025',       // Primary for secondary buttons
    tanText: '#B04E2C',      // Primary hover for secondary buttons
    tanBody: '#1A100C',      // Body text on tan
    featureCard: '#FAF6F3',
    primary: '#964025',      // Primary
    secondary: '#605E5A',    // Secondary
    navy: '#1A100C',         // Dark — near black warm
    white: '#FAF6F3',        // Lightest surface
    cream: '#F2EBE6',        // Warm page bg
    nav: '#827470',          // Neutral — nav tint
    black: '#1A100C',
    footerBg: '#21201F',   // Footer background
  },

  type: {
    /**
     * Style Guide 110:2377 (desktop). No mobile type in the file —
     * mobile sizes are an optical scale (not a flat %), so Norca-Rough
     * still has a clear h1 > h2 > h3 step on a 390px screen.
     * Faces: h1–h3 + button = Norca-Rough; tag/accent/quote = Wreck Script;
     * body = Host Grotesk.
     */
    h1: { size: '72px', mobile: '40px', lineHeight: '1', tracking: '0' },
    h2: { size: '52px', mobile: '28px', lineHeight: '1', tracking: '0' },
    h3: { size: '32px', mobile: '24px', lineHeight: '1', tracking: '0' },
    /** Extra — not in the Style Guide. */
    h4: { size: '24px', mobile: '18px', lineHeight: '1', tracking: '0' },
    body: { size: '14px', mobile: '14px', lineHeight: '1.3', tracking: '-0.01em' },
    bodyLg: { size: '16px', mobile: '15px', lineHeight: '1.3', tracking: '-0.01em' },
    button: { size: '14px', mobile: '14px', lineHeight: '1', tracking: '0' },
    /** Figma `tag`. */
    eyebrow: { size: '16px', mobile: '14px', lineHeight: '1', tracking: '0' },
    small: { size: '12px', mobile: '12px', lineHeight: '1.3', tracking: '-0.01em' },
    caption: { size: '11px', mobile: '11px', lineHeight: '1.3', tracking: '0' },
    /** Footer column titles — extra, not in the Style Guide. */
    label: { size: '18px', mobile: '16px', lineHeight: '1', tracking: '0.06em' },
    /** Figma `accent`. */
    ticker: { size: '32px', mobile: '24px', lineHeight: '1', tracking: '0' },
    /** Figma `quote`. */
    quote: { size: '22px', mobile: '18px', lineHeight: '1.2', tracking: '0' },
  },

  radius: {
    base: '0px',
    lg: '0px',
    xl: '0px',
    hero: '0px',
    full: '9999px',
  },

  motif: {
    heroOpacity: 0,
    darkOpacity: 0,
    greyOpacity: 0,
    whiteOpacity: 0,
    ctaOpacity: 0,
    /** Page wallpaper leaf overlay — cacao on the green–blue gradient. */
    pageOpacity: 0.22,
    ctaColor: '#3D2819',
  },
} as const;

export type Brand = typeof brand;

/** Strip # and expand 3-digit hex. */
export function hexToChannels(hex: string): string {
  const raw = hex.replace('#', '').trim();
  const h =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n)) return '0 0 0';
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** `rgb(237 217 116)` or `rgb(237 217 116 / 50%)`. */
export function rgb(hex: string, alpha?: number): string {
  const channels = hexToChannels(hex);
  if (alpha === undefined) return `rgb(${channels})`;
  const a = alpha <= 1 ? `${Math.round(alpha * 100)}%` : String(alpha);
  return `rgb(${channels} / ${a})`;
}

/** Per-variant CTA colors — hibiscus fill, cream ghost on photos. */
function ctaButtonVars(c: Brand['colors']): string {
  const primary = `
    --aw-color-btn-primary-bg: ${rgb(c.accent)};
    --aw-color-btn-primary-text: ${rgb(c.cream)};
    --aw-color-btn-primary-border: ${rgb(c.accent)};
    --aw-color-btn-primary-bg-hover: ${rgb(c.navy)};
    --aw-color-btn-primary-text-hover: ${rgb(c.cream)};
    --aw-color-btn-primary-border-hover: ${rgb(c.navy)};`;

  const secondary = `
    --aw-color-btn-secondary-bg: ${rgb(c.ctaTan)};
    --aw-color-btn-secondary-text: ${rgb(c.cream)};
    --aw-color-btn-secondary-border: ${rgb(c.ctaTan)};
    --aw-color-btn-secondary-bg-hover: ${rgb(c.tanText)};
    --aw-color-btn-secondary-text-hover: ${rgb(c.cream)};
    --aw-color-btn-secondary-border-hover: ${rgb(c.tanText)};`;

  const ghostLight = `
    --aw-color-btn-ghost-light-bg: transparent;
    --aw-color-btn-ghost-light-text: ${rgb(c.heading)};
    --aw-color-btn-ghost-light-border: ${rgb(c.heading)};
    --aw-color-btn-ghost-light-bg-hover: ${rgb(c.accent)};
    --aw-color-btn-ghost-light-text-hover: ${rgb(c.cream)};
    --aw-color-btn-ghost-light-border-hover: ${rgb(c.accent)};`;

  const ghostDark = `
    --aw-color-btn-ghost-dark-bg: transparent;
    --aw-color-btn-ghost-dark-text: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-border: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-bg-hover: ${rgb(c.cream, 0.12)};
    --aw-color-btn-ghost-dark-text-hover: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-border-hover: ${rgb(c.cream)};`;

  return [primary, secondary, ghostLight, ghostDark].join('');
}

function rootVars(b: Brand): string {
  const { colors: c, fonts: f, radius: r, motif: m, type: t } = b;
  const accent = rgb(c.accent);
  const accentHover = rgb(c.accentHover);
  const heading = rgb(c.heading);
  const muted = rgb(c.muted);

  return `
    --aw-font-sans: var(${f.body.cssVariable});
    --aw-font-serif: var(${f.heading.cssVariable});
    --aw-font-heading: var(${f.heading.cssVariable});
    --aw-font-script: var(${f.body.cssVariable});
    --aw-font-rough: var(${f.heading.cssVariable});

    --aw-text-h1: ${t.h1.size};
    --aw-text-h1-mobile: ${t.h1.mobile};
    --aw-leading-h1: ${t.h1.lineHeight};
    --aw-text-h2: ${t.h2.size};
    --aw-text-h2-mobile: ${t.h2.mobile};
    --aw-leading-h2: ${t.h2.lineHeight};
    --aw-text-h3: ${t.h3.size};
    --aw-text-h3-mobile: ${t.h3.mobile};
    --aw-leading-h3: ${t.h3.lineHeight};
    --aw-text-h4: ${t.h4.size};
    --aw-text-h4-mobile: ${t.h4.mobile};
    --aw-leading-h4: ${t.h4.lineHeight};
    --aw-text-body: ${t.body.size};
    --aw-text-body-mobile: ${t.body.mobile};
    --aw-leading-body: ${t.body.lineHeight};
    --aw-tracking-body: ${t.body.tracking};
    --aw-text-body-lg: ${t.bodyLg.size};
    --aw-text-body-lg-mobile: ${t.bodyLg.mobile};
    --aw-tracking-body-lg: ${t.bodyLg.tracking};
    --aw-text-button: ${t.button.size};
    --aw-text-eyebrow: ${t.eyebrow.size};
    --aw-text-eyebrow-mobile: ${t.eyebrow.mobile};
    --aw-tracking-eyebrow: ${t.eyebrow.tracking};
    --aw-text-small: ${t.small.size};
    --aw-leading-small: ${t.small.lineHeight};
    --aw-text-caption: ${t.caption.size};
    --aw-text-label: ${t.label.size};
    --aw-text-label-mobile: ${t.label.mobile};
    --aw-tracking-label: ${t.label.tracking};
    --aw-text-ticker: ${t.ticker.size};
    --aw-text-ticker-mobile: ${t.ticker.mobile};
    --aw-text-quote: ${t.quote.size};
    --aw-text-quote-mobile: ${t.quote.mobile};
    --aw-leading-quote: ${t.quote.lineHeight};

    --aw-color-primary: ${rgb(c.primary)};
    --aw-color-secondary: ${rgb(c.secondary)};
    --aw-color-accent: ${accent};
    --aw-color-accent-hover: ${accentHover};

    --aw-color-text-heading: ${heading};
    --aw-color-text-default: ${heading};
    --aw-color-text-muted: ${muted};
    --aw-color-text-eyebrow: ${rgb(c.eyebrow)};
    --aw-color-text-page: ${rgb(c.page)};
    --aw-color-bg-banner: ${rgb(c.banner)};
    --aw-color-banner-line: ${rgb(c.bannerLine)};
    --aw-color-banner-text: ${rgb(c.bannerText)};
    --aw-color-banner-dot: ${rgb(c.bannerDot)};
    --aw-color-banner-note: ${rgb(c.bannerNote)};
    --aw-color-nav-cta: ${rgb(c.navCta)};
    --aw-color-bg-page: ${rgb(c.page)};
    --aw-color-bg-page-end: ${rgb(c.white)};
    --aw-color-bg-section-white: ${rgb(c.page)};
    --aw-color-bg-section-grey: ${rgb(c.sectionGrey)};
    --aw-color-bg-section-dark: ${rgb(c.sectionDark)};
    --aw-color-bg-card: ${rgb(c.card)};
    --aw-color-bg-card-dark: ${rgb(c.cardDark)};
    --aw-color-bg-card-light: ${rgb(c.cardMist)};
    --aw-color-bg-feature-card: ${rgb(c.featureCard)};
    --aw-color-bg-cta: ${rgb(c.ctaBg)};
    --aw-color-bg-cta-end: ${rgb(c.ctaEnd)};
    --aw-color-text-tan: ${rgb(c.tanText)};
    --aw-color-text-tan-body: ${rgb(c.tanBody)};
    --aw-opacity-motif-page: ${m.pageOpacity};
    --aw-shadow-card-mist: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.cardMist)};
    --aw-color-nav-glass: ${rgb(c.nav, 0.25)};

    --aw-color-card-heading-dark: ${rgb(c.white)};
    --aw-color-card-body-dark: ${rgb(c.white, 0.6)};
    --aw-color-card-link-dark: ${rgb(c.cream)};

    --aw-color-card-heading-light: var(--aw-color-text-heading);
    --aw-color-card-body-light: var(--aw-color-text-muted);
    --aw-color-card-link-light: var(--aw-color-btn-link);

    --aw-color-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-card-border-light: transparent;

    --aw-color-bg-card-outlined: ${rgb(c.white)};
    --aw-color-card-border-outlined: ${rgb(c.black, 0.12)};
    --aw-color-card-heading-outlined: var(--aw-color-text-heading);
    --aw-color-card-body-outlined: var(--aw-color-text-muted);
    --aw-color-card-link-outlined: var(--aw-color-btn-link);

    --aw-color-bg-card-glass: ${rgb(c.white, 0.08)};
    --aw-color-card-border-glass: ${rgb(c.white, 0.15)};
    --aw-color-card-heading-glass: ${rgb(c.white)};
    --aw-color-card-body-glass: ${rgb(c.white, 0.7)};
    --aw-color-card-link-glass: ${rgb(c.cream)};

    ${ctaButtonVars(c)}

    --aw-color-btn-link: ${rgb(c.accent)};
    --aw-color-btn-link-hover: ${accentHover};

    --aw-color-headline-light: var(--aw-color-text-heading);
    --aw-color-headline-dark: ${rgb(c.white)};
    --aw-color-headline-subtitle-light: var(--aw-color-text-muted);
    --aw-color-headline-subtitle-dark: ${rgb(c.white, 0.7)};

    --aw-color-timeline-icon-light: var(--aw-color-text-heading);
    --aw-color-timeline-icon-border-light: transparent;
    --aw-color-timeline-icon-bg-light: var(--aw-color-bg-cta);
    --aw-color-timeline-step-light: var(--aw-color-text-muted);
    --aw-color-timeline-title-light: var(--aw-color-text-heading);
    --aw-color-timeline-desc-light: var(--aw-color-text-muted);

    --aw-color-timeline-icon-dark: var(--aw-color-text-heading);
    --aw-color-timeline-icon-border-dark: transparent;
    --aw-color-timeline-icon-bg-dark: var(--aw-color-bg-cta);
    --aw-color-timeline-title-dark: ${rgb(c.white)};
    --aw-color-timeline-desc-dark: ${rgb(c.white, 0.6)};

    --aw-color-testimonial-card-bg-light: ${rgb(c.card)};
    --aw-color-testimonial-card-border-light: transparent;
    --aw-color-testimonial-text-light: var(--aw-color-text-muted);
    --aw-color-testimonial-name-light: var(--aw-color-text-heading);
    --aw-color-testimonial-job-light: var(--aw-color-text-muted);
    --aw-color-testimonial-hr-light: rgb(226 232 240);

    --aw-color-testimonial-card-bg-dark: ${rgb(c.white, 0.05)};
    --aw-color-testimonial-card-border-dark: ${rgb(c.white, 0.15)};
    --aw-color-testimonial-text-dark: ${rgb(c.white, 0.7)};
    --aw-color-testimonial-name-dark: ${rgb(c.white)};
    --aw-color-testimonial-job-dark: ${rgb(c.white, 0.5)};
    --aw-color-testimonial-hr-dark: ${rgb(c.white, 0.1)};

    --aw-color-faq-border-light: ${rgb(c.secondary, 0.45)};
    --aw-color-faq-question-light: var(--aw-color-text-heading);
    --aw-color-faq-answer-light: var(--aw-color-text-muted);
    --aw-color-faq-toggle-border-light: rgb(209 213 219);
    --aw-color-faq-toggle-text-light: rgb(107 114 128);
    --aw-color-faq-toggle-active-light: var(--aw-color-accent);

    --aw-color-faq-border-dark: ${rgb(c.white, 0.2)};
    --aw-color-faq-question-dark: ${rgb(c.white)};
    --aw-color-faq-answer-dark: var(--aw-color-accent);
    --aw-color-faq-toggle-border-dark: ${rgb(c.white, 0.3)};
    --aw-color-faq-toggle-text-dark: ${rgb(c.white, 0.5)};
    --aw-color-faq-toggle-active-dark: var(--aw-color-accent);

    --aw-color-projects-card-bg-light: ${rgb(c.card)};
    --aw-color-projects-card-border-light: transparent;
    --aw-color-projects-title-light: var(--aw-color-text-heading);
    --aw-color-projects-desc-light: var(--aw-color-text-muted);

    --aw-color-projects-card-bg-dark: ${rgb(c.cardDark)};
    --aw-color-projects-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-projects-title-dark: ${rgb(c.white)};
    --aw-color-projects-desc-dark: ${rgb(c.white, 0.6)};

    --aw-color-bg-page-dark: ${rgb(c.navy)};
    --aw-color-bg-footer: ${rgb(c.footerBg)};

    --aw-color-motif-hero: var(--aw-color-accent);
    --aw-color-motif-dark: var(--aw-color-accent);
    --aw-color-motif-grey: var(--aw-color-accent);
    --aw-color-motif-white: var(--aw-color-accent);
    --aw-color-motif-cta: ${rgb(m.ctaColor)};

    --aw-opacity-motif-hero: ${m.heroOpacity};
    --aw-opacity-motif-dark: ${m.darkOpacity};
    --aw-opacity-motif-grey: ${m.greyOpacity};
    --aw-opacity-motif-white: ${m.whiteOpacity};
    --aw-opacity-motif-cta: ${m.ctaOpacity};

    --aw-shadow-card: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.secondary)};
    --aw-shadow-header: 0 0.25rem 3.5rem 0 color-mix(in srgb, var(--aw-color-text-heading) 8%, transparent);
    --aw-border-card: ${rgb(c.secondary, 0.16)};

    --aw-radius: ${r.base};
    --aw-radius-lg: ${r.lg};
    --aw-radius-xl: ${r.xl};
    --aw-radius-hero: ${r.hero};
    --aw-radius-full: ${r.full};
  `.trim();
}

function darkVars(b: Brand): string {
  const { colors: c, fonts: f, motif: m } = b;
  const accent = rgb(c.accent);

  return `
    --aw-font-sans: var(${f.body.cssVariable});
    --aw-font-serif: var(${f.heading.cssVariable});
    --aw-font-heading: var(${f.heading.cssVariable});
    --aw-font-script: var(${f.body.cssVariable});
    --aw-font-rough: var(${f.heading.cssVariable});

    --aw-color-primary: ${accent};
    --aw-color-secondary: ${rgb(c.accentHover)};
    --aw-color-accent: ${accent};
    --aw-color-accent-hover: ${rgb(c.accentHover)};

    --aw-color-text-heading: rgb(247 250 252);
    --aw-color-text-default: rgb(226 232 240);
    --aw-color-text-muted: ${rgb(c.secondary)};
    --aw-color-text-page: ${rgb(c.page)};
    --aw-color-bg-page: ${rgb(c.navy)};
    --aw-color-bg-page-end: ${rgb(c.navy)};
    --aw-color-bg-section-white: ${rgb(c.navy)};
    --aw-color-bg-section-grey: rgb(12 45 90);
    --aw-color-bg-section-dark: ${rgb(c.black)};
    --aw-color-bg-card-dark: ${rgb(c.cardDark)};
    --aw-color-bg-card-light: rgb(12 45 90);
    --aw-color-bg-cta: ${rgb(c.ctaBg)};

    --aw-color-card-heading-dark: ${rgb(c.white)};
    --aw-color-card-body-dark: ${rgb(c.white, 0.6)};
    --aw-color-card-link-dark: ${rgb(c.cream)};

    --aw-color-card-heading-light: rgb(247 250 252);
    --aw-color-card-body-light: ${rgb(c.secondary)};
    --aw-color-card-link-light: var(--aw-color-accent);

    --aw-color-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-card-border-light: ${rgb(c.accent, 0.5)};

    ${ctaButtonVars(c)}
    --aw-color-btn-link: ${rgb(c.accent)};
    --aw-color-btn-link-hover: ${rgb(c.accentHover)};

    --aw-color-motif-hero: var(--aw-color-accent);
    --aw-color-motif-dark: var(--aw-color-accent);
    --aw-color-motif-grey: var(--aw-color-accent);
    --aw-color-motif-white: var(--aw-color-accent);
    --aw-color-motif-cta: ${rgb(m.ctaColor)};

    --aw-opacity-motif-hero: ${m.heroOpacity};
    --aw-opacity-motif-dark: ${m.darkOpacity};
    --aw-opacity-motif-grey: ${m.greyOpacity};
    --aw-opacity-motif-white: ${m.whiteOpacity};
    --aw-opacity-motif-cta: ${m.ctaOpacity};
  `.trim();
}

/** Full stylesheet injected by CustomStyles.astro. */
export function brandStylesheet(b: Brand = brand): string {
  const accent = rgb(b.colors.accent, 0.3);
  return `:root {
  ${rootVars(b)}

  ::selection {
    background-color: ${accent};
  }
}

.dark {
  ${darkVars(b)}

  ::selection {
    background-color: ${accent};
    color: snow;
  }
}`;
}

/** Astro Fonts API entries — used by astro.config.ts and Layout.astro. */
export function brandFontConfig() {
  const { heading, body } = brand.fonts;
  return [
    {
      name: heading.name,
      cssVariable: heading.cssVariable,
      provider: heading.provider,
      weights: heading.weights,
      styles: heading.styles,
      subsets: heading.subsets,
      fallbacks: heading.fallbacks,
      preload: true,
    },
    {
      name: body.name,
      cssVariable: body.cssVariable,
      provider: body.provider,
      weights: body.weights,
      styles: body.styles,
      subsets: body.subsets,
      fallbacks: body.fallbacks,
      preload: true,
    },
  ];
}

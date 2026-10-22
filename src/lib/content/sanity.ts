import { sanityClient } from '../sanity/client';
import { resolveContentImage, resolveContentImageOrEmpty, type SanityImageFields } from '../sanity/image';
import type {
  BlogContentBlock,
  BlogPost,
  Book,
  BookCta,
  BookSeries,
  ContactPageMediaContent,
  PodcastEpisode,
  PodcastEpisodeStatus,
  PodcastPartGroup,
  ProjectCardContent,
  ProjectTag,
  Testimonial,
  ContactPageContent,
  ContentImage,
  FooterMediaContent,
  FormHelpOption,
  HomePageContent,
  HomeAudienceCard,
  HomeLink,
  HomeServiceCard,
  NavigationContent,
  ServicePageContent,
  ServiceSection,
  SplitContentSection,
} from './types';
import { HOME_DEFAULTS } from '../../data/home-defaults';

const IMAGE_PROJECTION = /* groq */ `
  "src": coalesce(image.asset->url, imageUrl, ""),
  "alt": coalesce(image.alt, imageAlt, ""),
  "crop": image.crop,
  "hotspot": image.hotspot,
  "asset": image.asset
`;

const IMAGE_MOBILE_PROJECTION = /* groq */ `
  "src": coalesce(imageMobile.asset->url, imageMobileUrl, ""),
  "alt": coalesce(imageMobile.alt, imageMobileAlt, ""),
  "crop": imageMobile.crop,
  "hotspot": imageMobile.hotspot,
  "asset": imageMobile.asset
`;

type FetchedImage = ContentImage & SanityImageFields;

const homeImage = (field: string) => /* groq */ `
  "src": coalesce(${field}.asset->url, ""),
  "alt": coalesce(${field}.alt, ""),
  "crop": ${field}.crop,
  "hotspot": ${field}.hotspot,
  "asset": ${field}.asset
`;

const HOME_QUERY = /* groq */ `
  *[_type == "homePage" && _id == "singleton-home"][0] {
    seo { title, description },
    hero {
      heading,
      subheading,
      ctaLabel,
      ctaHref,
      trustBadges,
      "image": { ${homeImage('heroImage')} },
      "imageMobile": { ${homeImage('heroImageMobile')} }
    },
    intro {
      heading,
      body,
      "audienceCards": coalesce(audienceCards, ^.audienceCards)[] {
        label,
        title,
        ctaLabel,
        href,
        "image": { ${homeImage('image')} }
      }
    },
    services {
      heading,
      "items": items[] { title, icon, description, ctaLabel, href }
    },
    highlightBanner {
      heading,
      body,
      ctaLabel,
      ctaHref,
      "image": { ${homeImage('image')} }
    },
    serviceAreas {
      heading,
      body,
      ctaLabel,
      ctaHref,
      "areas": areas[] { label, href }
    },
    reviews { heading, count, ctaLabel, ctaHref },
    cta { heading, note }
  }
`;

type RawHome = {
  seo?: Partial<HomePageContent['seo']>;
  hero?: Partial<Omit<HomePageContent['hero'], 'image' | 'imageMobile'>> & {
    image?: FetchedImage;
    imageMobile?: FetchedImage;
  };
  intro?: {
    heading?: string;
    body?: string;
    audienceCards?: Array<Partial<Omit<HomeAudienceCard, 'image'>> & { image?: FetchedImage }> | null;
  };
  services?: { heading?: string; items?: Array<Partial<HomeServiceCard>> | null };
  highlightBanner?: Partial<Omit<HomePageContent['highlightBanner'], 'image'>> & { image?: FetchedImage };
  serviceAreas?: Partial<Omit<HomePageContent['serviceAreas'], 'areas'>> & { areas?: Array<Partial<HomeLink>> | null };
  reviews?: Partial<HomePageContent['reviews']>;
  cta?: Partial<HomePageContent['cta']>;
};

/** Non-empty string from Sanity, else the default. */
const str = (value: string | null | undefined, fallback: string) => (value?.trim() ? value : fallback);
/** Non-empty array from Sanity, else the default. */
const list = <T>(value: T[] | null | undefined, fallback: T[]) => (value?.length ? value : fallback);

export async function getSanityHomeContent(): Promise<HomePageContent> {
  const raw = (await sanityClient.fetch<RawHome | null>(HOME_QUERY)) ?? {};
  const d = HOME_DEFAULTS;

  // Pathway cards: Sanity decides the order and count; defaults only fill empty text fields by position.
  const rawCards = raw.intro?.audienceCards ?? [];
  const audienceCards: HomeAudienceCard[] = (rawCards.length ? rawCards : d.intro.audienceCards).map((card, i) => {
    const fallback = d.intro.audienceCards[i];
    return {
      label: str(card.label, fallback?.label ?? ''),
      title: str(card.title, fallback?.title ?? ''),
      ctaLabel: str(card.ctaLabel, fallback?.ctaLabel ?? ''),
      href: str(card.href, fallback?.href ?? '#'),
      image: resolveContentImage((card as { image?: FetchedImage }).image),
    };
  });

  return {
    seo: {
      title: str(raw.seo?.title, d.seo.title),
      description: str(raw.seo?.description, d.seo.description),
    },
    hero: {
      heading: str(raw.hero?.heading, d.hero.heading),
      subheading: str(raw.hero?.subheading, d.hero.subheading),
      ctaLabel: raw.hero?.ctaLabel?.trim() || undefined,
      ctaHref: raw.hero?.ctaHref?.trim() || undefined,
      trustBadges: list(raw.hero?.trustBadges, d.hero.trustBadges),
      image: resolveContentImage(raw.hero?.image),
      imageMobile: resolveContentImage(raw.hero?.imageMobile),
    },
    intro: {
      heading: str(raw.intro?.heading, d.intro.heading),
      body: str(raw.intro?.body, d.intro.body),
      audienceCards,
    },
    services: {
      heading: str(raw.services?.heading, d.services.heading),
      items: list(raw.services?.items, d.services.items).map((item, i) => {
        const fallback = d.services.items[i];
        return {
          title: str(item.title, fallback?.title ?? ''),
          icon: item.icon ?? fallback?.icon ?? 'rock-wall',
          description: str(item.description, fallback?.description ?? ''),
          ctaLabel: str(item.ctaLabel, fallback?.ctaLabel ?? ''),
          href: str(item.href, fallback?.href ?? '#'),
        };
      }),
    },
    highlightBanner: {
      heading: str(raw.highlightBanner?.heading, d.highlightBanner.heading),
      body: str(raw.highlightBanner?.body, d.highlightBanner.body),
      ctaLabel: str(raw.highlightBanner?.ctaLabel, d.highlightBanner.ctaLabel),
      ctaHref: str(raw.highlightBanner?.ctaHref, d.highlightBanner.ctaHref),
      image: resolveContentImage(raw.highlightBanner?.image),
    },
    serviceAreas: {
      heading: str(raw.serviceAreas?.heading, d.serviceAreas.heading),
      body: str(raw.serviceAreas?.body, d.serviceAreas.body),
      ctaLabel: str(raw.serviceAreas?.ctaLabel, d.serviceAreas.ctaLabel),
      ctaHref: str(raw.serviceAreas?.ctaHref, d.serviceAreas.ctaHref),
      areas: list(raw.serviceAreas?.areas, d.serviceAreas.areas).map((area) => ({
        label: area.label ?? '',
        href: area.href ?? '#',
      })),
    },
    reviews: {
      heading: str(raw.reviews?.heading, d.reviews.heading),
      count: raw.reviews?.count ?? d.reviews.count,
      ctaLabel: str(raw.reviews?.ctaLabel, d.reviews.ctaLabel),
      ctaHref: str(raw.reviews?.ctaHref, d.reviews.ctaHref),
    },
    cta: {
      heading: str(raw.cta?.heading, d.cta.heading),
      note: str(raw.cta?.note, d.cta.note),
    },
  };
}

const CONTACT_PAGE_MEDIA_QUERY = /* groq */ `
  *[_type == "contactPageMedia" && _id == "singleton-contact-page-media"][0] {
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    }
  }
`;

export async function getSanityContactPageMediaContent(): Promise<ContactPageMediaContent | null> {
  const doc = await sanityClient.fetch<{ heroImage?: FetchedImage } | null>(CONTACT_PAGE_MEDIA_QUERY);

  if (!doc) return null;

  return {
    heroImage: resolveContentImage(doc.heroImage),
  };
}

const NAVIGATION_QUERY = /* groq */ `
  {
    "header": *[_type == "siteNavigation" && _id == "singleton-navigation"][0] {
      "links": links[] {
        text,
        href,
        "links": links[] {
          text,
          href,
          "links": links[] { text, href }
        }
      },
      "actions": actions[] { variant, text, href },
      "topBar": topBar { items, note }
    },
    "footer": *[_type == "siteFooter" && _id == "singleton-footer"][0] {
      licensedLine,
      "links": columns[] {
        title,
        "links": links[] { text, href }
      },
      "secondaryLinks": secondaryLinks[] { text, href },
      "socialLinks": socialLinks[] { ariaLabel, icon, href },
      footNote
    }
  }
`;

const FOOTER_MEDIA_QUERY = /* groq */ `
  *[_type == "siteFooter" && _id == "singleton-footer"][0] {
    "backgroundImage": {
      "src": coalesce(backgroundImage.asset->url, ""),
      "alt": coalesce(backgroundImage.alt, ""),
      "crop": backgroundImage.crop,
      "hotspot": backgroundImage.hotspot,
      "asset": backgroundImage.asset
    }
  }
`;

/** Drops nulls Sanity returns for empty fields so components can rely on optional props. */
function cleanNav<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cleanNav) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === null || v === undefined || v === '') continue;
      out[k] = cleanNav(v);
    }
    return out as T;
  }
  return value;
}

/** Returns `null` when the navigation or footer document has not been created yet. */
export async function getSanityNavigationContent(): Promise<NavigationContent | null> {
  const raw = await sanityClient.fetch<any>(NAVIGATION_QUERY);
  if (!raw?.header || !raw?.footer) return null;
  const nav = cleanNav(raw) as any;
  return {
    header: {
      links: nav.header.links ?? [],
      actions: nav.header.actions ?? [],
      topBar: nav.header.topBar ? { items: nav.header.topBar.items ?? [], note: nav.header.topBar.note } : undefined,
    },
    footer: {
      licensedLine: nav.footer.licensedLine,
      links: (nav.footer.links ?? []).map((c: any) => ({ title: c.title ?? '', links: c.links ?? [] })),
      secondaryLinks: nav.footer.secondaryLinks ?? [],
      socialLinks: nav.footer.socialLinks ?? [],
      footNote: nav.footer.footNote ?? '',
    },
  };
}

export async function getSanityFooterMediaContent(): Promise<FooterMediaContent | null> {
  const doc = await sanityClient.fetch<{ backgroundImage?: FetchedImage } | null>(FOOTER_MEDIA_QUERY);
  if (!doc) return null;

  return {
    backgroundImage: resolveContentImage(doc.backgroundImage),
  };
}

const SERVICE_PAGE_QUERY = /* groq */ `
  *[_type == "servicePage" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    meta,
    hero {
      title,
      visualSubheading,
      subtitle,
      ctaText,
      ctaHref,
      phoneCtaText,
      phoneCtaHref,
      imagePlaceholder,
      "image": {
        ${IMAGE_PROJECTION}
      },
      "imageMobile": {
        ${IMAGE_MOBILE_PROJECTION}
      }
    },
    "sections": sections[_type != "faqsSection"] {
      _type,
      heading,
      intro,
      layout,
      display,
      title,
      paragraphs,
      featureLabel,
      column1,
      column2,
      column3,
      ctaText,
      ctaHref,
      linkText,
      linkHref,
      surface,
      isReversed,
      sources,
      imagePlaceholder,
      "image": {
        ${IMAGE_PROJECTION}
      },
      "items": select(
        _type == "linkedCardsSection" => items[] { title, description, linkText, href },
        _type == "bulletCardsSection" => items[] { title, items },
        _type == "checklistSection" => items[] { text },
        _type == "yelpReviewsSection" => items[] { name, reviewId, userId },
        _type == "quoteCardsSection" => items[] { name, quote },
        items[] { title, description, icon }
      ),
      "steps": steps[] { title, description, icon },
      "rows": rows[] { feature, cell1, cell2, cell3 }
    },
    faqs {
      title,
      "items": items[] { "title": question, "description": answer }
    },
    ctaBanner {
      title,
      subtitle,
      ctaText,
      ctaHref,
      showAfterHoursNote,
      extraLines,
      license
    }
  }
`;

function normalizeHeroImage<
  T extends { image?: FetchedImage | ContentImage; imageMobile?: FetchedImage | ContentImage },
>(hero: T): T {
  return {
    ...hero,
    image: resolveContentImage(hero.image as FetchedImage | undefined),
    imageMobile: resolveContentImage(hero.imageMobile as FetchedImage | undefined),
  };
}

function normalizeSplit(section: SplitContentSection & { image?: FetchedImage | ContentImage }): SplitContentSection {
  return { ...section, image: resolveContentImage(section.image as FetchedImage | undefined) };
}

function resolveSectionImage<T extends { image?: FetchedImage | ContentImage }>(section: T): T {
  return { ...section, image: resolveContentImage(section.image as FetchedImage | undefined) };
}

const HERO_PROJECTION = /* groq */ `
  title,
  visualSubheading,
  subtitle,
  ctaText,
  ctaHref,
  phoneCtaText,
  phoneCtaHref,
  imagePlaceholder,
  "image": {
    ${IMAGE_PROJECTION}
  },
  "imageMobile": {
    ${IMAGE_MOBILE_PROJECTION}
  }
`;

const SPLIT_PROJECTION = /* groq */ `
  heading,
  paragraphs,
  ctaText,
  ctaHref,
  linkText,
  linkHref,
  isReversed,
  imagePlaceholder,
  "image": {
    ${IMAGE_PROJECTION}
  }
`;

const CTA_BANNER_PROJECTION = /* groq */ `
  title,
  subtitle,
  ctaText,
  ctaHref,
  showAfterHoursNote,
  extraLines,
  license
`;

export async function getSanityServicePage(slug: string): Promise<ServicePageContent | null> {
  const page = await sanityClient.fetch<ServicePageContent | null>(SERVICE_PAGE_QUERY, { slug });
  if (!page) return null;

  return {
    ...page,
    sections: ((page.sections ?? []) as ServiceSection[]).map((section) => {
      const withImage = resolveSectionImage(section as ServiceSection & { image?: FetchedImage });
      if (withImage._type !== 'splitContentSection') return withImage;
      return normalizeSplit(withImage as SplitContentSection);
    }),
    faqs: page.faqs?.items?.length ? page.faqs : undefined,
    hero: normalizeHeroImage(page.hero),
  };
}

const CONTACT_PAGE_QUERY = /* groq */ `
  *[_type == "contactPage" && _id == "singleton-contact"][0] {
    meta,
    hero { ${HERO_PROJECTION} },
    form {
      heading,
      intro,
      topicLabel,
      topicPlaceholder,
      "helpOptions": helpOptions[] { label, value },
      messageLabel,
      submitLabel,
      mapHeading,
      addressLine1,
      addressLine2,
      mapsQuery,
      directionsLabel
    },
    touchpoints {
      heading,
      "items": items[] { title, description, icon },
      "links": links[] { text, href }
    },
    unsureSection { ${SPLIT_PROJECTION} },
    reasons {
      heading,
      intro,
      display,
      "items": items[] { title, description, linkText, href }
    },
    ctaBanner { ${CTA_BANNER_PROJECTION} }
  }
`;

export async function getSanityContactPage(): Promise<ContactPageContent> {
  const page = await sanityClient.fetch<ContactPageContent | null>(CONTACT_PAGE_QUERY);
  if (!page) {
    throw new Error('Sanity contactPage document is missing (singleton-contact).');
  }
  return {
    ...page,
    hero: normalizeHeroImage(page.hero),
    unsureSection: normalizeSplit({ ...page.unsureSection, _type: 'splitContentSection' }),
    reasons: { ...page.reasons, _type: 'linkedCardsSection' },
  };
}

const CONTACT_HELP_OPTIONS_QUERY = /* groq */ `
  *[_type == "contactPage" && _id == "singleton-contact"][0].form.helpOptions[] { label, value }
`;

export async function getSanityContactHelpOptions(): Promise<FormHelpOption[]> {
  const options = await sanityClient.fetch<FormHelpOption[] | null>(CONTACT_HELP_OPTIONS_QUERY);
  return (options ?? []).filter((option) => option?.label && option?.value);
}

type SanityMarkDef = {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
};

type SanitySpan = {
  _type: string;
  _key?: string;
  text?: string;
  marks?: string[];
};

type SanityPortableBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: SanitySpan[];
  markDefs?: SanityMarkDef[];
  // image fields
  src?: string;
  alt?: string;
  caption?: string;
  // table fields
  headerRow?: string[];
  rows?: Array<{ _key?: string; cells?: string[] }>;
  // callout fields (projected as calloutType from the "type" Sanity field)
  calloutType?: string;
  text?: string;
} & SanityImageFields;

type SanityBlogPost = Omit<BlogPost, 'image' | 'relatedPages' | 'body' | 'contentBlocks' | 'tags'> & {
  image?: ContentImage;
  relatedPages?: string[] | null;
  tags?: string[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  body?: SanityPortableBlock[] | null;
};

function cleanPortableText(text: string): string {
  return text.replace(/\r?\n?__BR__\r?\n?/g, ' ');
}

function portableBlockText(block: SanityPortableBlock): string {
  return Array.isArray(block.children)
    ? block.children.map((child) => cleanPortableText(child.text ?? '')).join('')
    : '';
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spansToHtml(children: SanitySpan[] | undefined, markDefs: SanityMarkDef[] | undefined): string {
  if (!Array.isArray(children)) return '';
  const defsMap = new Map((markDefs ?? []).map((d) => [d._key, d]));

  return children
    .map((span, index) => {
      if (span._type !== 'span') return '';
      let text = cleanPortableText(span.text ?? '');
      if (index === 0) {
        text = text.trimStart();
      }
      let html = escapeHtml(text);
      for (const mark of span.marks ?? []) {
        const def = defsMap.get(mark);
        if (def?._type === 'link') {
          const targetAttr = def.blank !== false ? ' target="_blank" rel="noopener noreferrer"' : '';
          html = `<a href="${escapeHtml(def.href ?? '')}"${targetAttr}>${html}</a>`;
        } else if (mark === 'strong') {
          html = `<strong>${html}</strong>`;
        } else if (mark === 'em') {
          html = `<em>${html}</em>`;
        } else if (mark === 'underline') {
          html = `<u>${html}</u>`;
        } else if (mark === 'strike-through') {
          html = `<s>${html}</s>`;
        } else if (mark === 'code') {
          html = `<code>${html}</code>`;
        }
      }
      return html;
    })
    .join('');
}

const CTA_DIRECTIVE_REGEX =
  /^\s*(?:\((?:create a )?cta button\)|\[(?:insert )?cta button(?::\s*|\s+)?\])\s*(.*)$/i;
const FAQ_HEADING_REGEX =
  /frequently asked|faqs?$|^faq\b|what homeowners most often want to know|questions homeowners ask|common questions/i;

function detectCtaButton(
  block: SanityPortableBlock
): { text: string; href: string; variant?: 'ghost-light' | 'primary' } | null {
  if (block._type === 'button' || block._type === 'ctaButton') {
    if (block.text?.trim() && block.href?.trim()) {
      return {
        text: block.text.trim(),
        href: block.href.trim(),
        variant: block.variant === 'primary' ? 'primary' : 'ghost-light',
      };
    }
    return null;
  }

  // List items must NEVER be converted to CTA buttons
  if (block.listItem) {
    return null;
  }

  if (block._type !== 'block' || (block.style && block.style !== 'normal')) {
    return null;
  }

  const markDefs = block.markDefs;
  if (!markDefs || markDefs.length === 0) return null;

  const children = block.children ?? [];
  const linkDefs = new Map(
    markDefs.filter((d) => d._type === 'link' && d.href).map((d) => [d._key, d.href as string])
  );

  if (linkDefs.size === 0) return null;

  const fullText = portableBlockText(block).trim();
  if (!fullText) return null;

  const directiveMatch = fullText.match(CTA_DIRECTIVE_REGEX);
  const rawTarget = directiveMatch ? directiveMatch[1].trim() : fullText;
  const targetText = rawTarget.replace(/^\[+|\]+$/g, '').trim();

  const linkSpans = children.filter((c) => (c.marks ?? []).some((m) => linkDefs.has(m)));
  const linkText = linkSpans.map((c) => c.text ?? '').join('').replace(/^\[+|\]+$/g, '').trim();

  // If there is an explicit author directive, e.g. (Create a CTA button) ... or [Insert CTA button: ...]
  if (directiveMatch && (linkText || targetText)) {
    const firstLinkMark = linkSpans.flatMap((c) => c.marks ?? []).find((m) => linkDefs.has(m));
    const href = firstLinkMark ? linkDefs.get(firstLinkMark) : undefined;
    if (href) {
      return {
        text: linkText || targetText,
        href,
        variant: 'ghost-light',
      };
    }
  }

  // Standalone call-to-action link paragraphs with action phrasing or bracketed prompts
  const CTA_ACTION_WORDS = /^(schedule|contact|call|get an estimate|request a|request an|book|get a quote|explore our|view our|check out|reach out)/i;
  if (linkText && linkText === targetText && (CTA_ACTION_WORDS.test(linkText) || (fullText.startsWith('[') && fullText.endsWith(']')))) {
    const firstLinkMark = linkSpans.flatMap((c) => c.marks ?? []).find((m) => linkDefs.has(m));
    const href = firstLinkMark ? linkDefs.get(firstLinkMark) : undefined;
    if (href) {
      return {
        text: linkText,
        href,
        variant: 'ghost-light',
      };
    }
  }

  return null;
}

function portableTextToContentBlocks(body: SanityPortableBlock[] | null | undefined): BlogContentBlock[] {
  if (!Array.isArray(body)) return [];

  const result: BlogContentBlock[] = [];

  // Buffer for consecutive list items of the same type
  let listBuffer: { _key: string; html: string; level: number }[] = [];
  let listType: 'bullet' | 'number' | null = null;
  let listStartKey = '';

  function flushList() {
    if (!listBuffer.length || !listType) return;
    result.push({ _type: 'list', _key: `list-${listStartKey}`, listType, items: listBuffer });
    listBuffer = [];
    listType = null;
    listStartKey = '';
  }

  // Buffer for explicit faqItem blocks
  let faqBuffer: { _key?: string; question: string; answer: string }[] = [];
  let faqStartKey = '';

  function flushFaq() {
    if (!faqBuffer.length) return;
    result.push({
      _type: 'faq',
      _key: `faq-${faqStartKey}`,
      items: faqBuffer,
    });
    faqBuffer = [];
    faqStartKey = '';
  }

  // State for FAQ section authored under an FAQ H2
  let inFaqSection = false;
  let faqSectionStartKey = '';
  let faqSectionItems: { _key?: string; question: string; answer: string }[] = [];

  function flushFaqSection() {
    if (!faqSectionItems.length) {
      inFaqSection = false;
      return;
    }
    result.push({
      _type: 'faq',
      _key: `faq-section-${faqSectionStartKey}`,
      items: faqSectionItems,
    });
    faqSectionItems = [];
    inFaqSection = false;
    faqSectionStartKey = '';
  }

  body.forEach((block, index) => {
    const key = block._key || `block-${index}`;

    // ── Explicit Button / CTA ─────────────────────────────────────────────────
    if (block._type === 'button' || block._type === 'ctaButton') {
      flushList();
      flushFaq();
      flushFaqSection();
      const btn = detectCtaButton(block);
      if (btn) {
        result.push({ _type: 'button', _key: key, ...btn });
      }
      return;
    }

    // ── Explicit FAQ item ─────────────────────────────────────────────────────
    if (block._type === 'faqItem') {
      flushList();
      if (inFaqSection) {
        if (block.question?.trim() && block.answer?.trim()) {
          faqSectionItems.push({
            _key: key,
            question: block.question.trim(),
            answer: block.answer.trim(),
          });
        }
        return;
      }
      if (!faqBuffer.length) {
        faqStartKey = key;
      }
      if (block.question?.trim() && block.answer?.trim()) {
        faqBuffer.push({
          _key: key,
          question: block.question.trim(),
          answer: block.answer.trim(),
        });
      }
      return;
    }

    // ── Image ─────────────────────────────────────────────────────────────────
    if (block._type === 'image') {
      flushList();
      flushFaq();
      flushFaqSection();
      const image = resolveContentImage({
        src: block.src,
        alt: block.alt,
        crop: block.crop,
        hotspot: block.hotspot,
        asset: block.asset,
      });
      if (!image?.src) return;
      const caption = typeof block.caption === 'string' ? block.caption.trim() : '';
      result.push({ _type: 'image', _key: key, image, ...(caption ? { caption } : {}) });
      return;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    if (block._type === 'table') {
      flushList();
      flushFaq();
      flushFaqSection();
      const headerRow = (block.headerRow ?? []).filter(Boolean);
      if (headerRow.length < 2) return;
      result.push({
        _type: 'table',
        _key: key,
        ...(block.caption ? { caption: block.caption } : {}),
        headerRow,
        rows: (block.rows ?? []).map((row, ri) => ({
          _key: row._key || `row-${ri}`,
          cells: row.cells ?? [],
        })),
      });
      return;
    }

    // ── Callout ───────────────────────────────────────────────────────────────
    if (block._type === 'callout') {
      flushList();
      flushFaq();
      flushFaqSection();
      if (!block.text?.trim()) return;
      const calloutType = (['tip', 'info', 'warning', 'note'] as const).includes(
        block.calloutType as 'tip' | 'info' | 'warning' | 'note'
      )
        ? (block.calloutType as 'tip' | 'info' | 'warning' | 'note')
        : 'note';
      result.push({ _type: 'callout', _key: key, calloutType, text: block.text.trim() });
      return;
    }

    // ── Standard block ────────────────────────────────────────────────────────
    if (block._type !== 'block') return;

    // Check if the standard block is a standalone CTA button link
    const cta = detectCtaButton(block);
    if (cta) {
      flushList();
      flushFaq();
      flushFaqSection();
      result.push({ _type: 'button', _key: key, ...cta });
      return;
    }

    const text = portableBlockText(block).trim();
    if (!text) return;

    const html = spansToHtml(block.children, block.markDefs) || escapeHtml(text);

    // Headings
    if (block.style === 'h1' || block.style === 'h2') {
      flushList();
      flushFaq();
      flushFaqSection();
      result.push({ _type: 'heading', _key: key, level: 2, text });

      if (FAQ_HEADING_REGEX.test(text)) {
        inFaqSection = true;
        faqSectionStartKey = key;
      }
      return;
    }
    if (block.style === 'h3' || block.style === 'h4') {
      flushList();
      flushFaq();

      if (inFaqSection) {
        faqSectionItems.push({ _key: key, question: text, answer: '' });
        return;
      }

      flushFaqSection();
      result.push({ _type: 'heading', _key: key, level: 3, text });
      return;
    }

    // Check for FAQ question & answer under FAQ section
    if (inFaqSection) {
      flushList();
      flushFaq();

      let hasBold = false;
      let hasNonBoldText = false;
      for (const c of block.children ?? []) {
        const marks = c.marks ?? [];
        if (marks.includes('strong')) {
          hasBold = true;
        } else if ((c.text ?? '').trim().length > 0) {
          hasNonBoldText = true;
        }
      }
      const isAllBold = hasBold && !hasNonBoldText;
      const isQuestion = isAllBold || text.endsWith('?');

      if (isQuestion) {
        faqSectionItems.push({ _key: key, question: text, answer: '' });
        return;
      } else if (faqSectionItems.length > 0) {
        const last = faqSectionItems[faqSectionItems.length - 1];
        last.answer = last.answer ? `${last.answer}<br><br>${html}` : html;
        return;
      }
    }

    // List items
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      flushFaq();
      if (inFaqSection && faqSectionItems.length > 0) {
        const last = faqSectionItems[faqSectionItems.length - 1];
        last.answer = last.answer ? `${last.answer}<br>• ${html}` : `• ${html}`;
        return;
      }
      if (listType !== block.listItem) {
        flushList();
        listType = block.listItem;
        listStartKey = key;
      }
      listBuffer.push({ _key: key, html, level: block.level ?? 1 });
      return;
    }

    // Paragraph / blockquote
    flushList();
    flushFaq();
    flushFaqSection();
    result.push({
      _type: 'paragraph',
      _key: key,
      text,
      html,
      ...(block.style === 'blockquote' ? { quote: true } : {}),
    });
  });

  flushList();
  flushFaq();
  flushFaqSection();
  return result;
}

function portableTextToParagraphs(body: SanityPortableBlock[] | null | undefined): string[] {
  return portableTextToContentBlocks(body)
    .filter((block): block is Extract<BlogContentBlock, { _type: 'paragraph' }> => block._type === 'paragraph')
    .map((block) => block.text); // plain text only — used for excerpts and lead paragraphs
}

function normalizeBlogPost(post: SanityBlogPost): BlogPost {
  const contentBlocks = portableTextToContentBlocks(post.body);
  const body = portableTextToParagraphs(post.body);
  const excerpt = post.excerpt || body[0] || '';
  return {
    title: post.title,
    slug: post.slug,
    excerpt,
    metaTitle: post.metaTitle?.trim() || undefined,
    metaDescription: post.metaDescription?.trim() || undefined,
    publishDate: post.publishDate,
    author: post.author,
    category: post.category,
    tags: (post.tags ?? []).filter((t): t is string => Boolean(t?.trim())),
    image: resolveContentImage(post.image as FetchedImage | undefined),
    relatedPages: (post.relatedPages ?? []).map((key) => key.replace(/^\/+/, '')).filter(Boolean),
    meta: {
      title: post.metaTitle?.trim() || post.title,
      description: post.metaDescription?.trim() || excerpt,
    },
    heroParagraphs: body.slice(0, 2),
    sections:
      body.length > 2
        ? [
            {
              _type: 'editorialSection',
              heading: post.title,
              paragraphs: body.slice(2),
            },
          ]
        : [],
    ctaBanner: {
      title: 'Get in touch',
      subtitle: 'Replace this banner copy from the Figma file.',
      ctaText: 'Start the assessment',
      ctaHref: '/form',
    },
    body,
    contentBlocks,
  };
}

const BLOG_POST_CARD_PROJECTION = /* groq */ `
  title,
  "slug": slug.current,
  excerpt,
  metaTitle,
  metaDescription,
  publishDate,
  author,
  category,
  tags,
  "image": {
    "src": coalesce(image.asset->url, imageUrl, "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1440&q=80"),
    "alt": coalesce(image.alt, imageAlt, title),
    "crop": image.crop,
    "hotspot": image.hotspot,
    "asset": image.asset
  },
  relatedPages
`;

const BLOG_POST_PROJECTION = /* groq */ `
  ${BLOG_POST_CARD_PROJECTION},
  body[] {
    ...,
    _type == "image" => {
      ...,
      "src": asset->url,
      "alt": coalesce(alt, ""),
      caption,
      crop,
      hotspot,
      asset
    },
    _type == "callout" => {
      _type,
      _key,
      "calloutType": type,
      text
    },
    _type == "table" => {
      _type,
      _key,
      caption,
      headerRow,
      "rows": rows[] { _key, cells }
    }
  }
`;

const BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(publishDate desc) {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

const BLOG_POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${BLOG_POST_PROJECTION}
  }
`;

const BLOG_POSTS_RELATED_TO_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current) && $pageSlug in relatedPages] | order(publishDate desc) [0...3] {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

export async function getSanityBlogPosts(): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_QUERY);
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

export async function getSanityBlogPost(slug: string): Promise<BlogPost | null> {
  const post = await sanityClient.fetch<SanityBlogPost | null>(BLOG_POST_BY_SLUG_QUERY, { slug });
  if (!post?.slug || !post.title) return null;
  return normalizeBlogPost(post);
}

export async function getSanityBlogPostsRelatedTo(pageSlug: string): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_RELATED_TO_QUERY, { pageSlug });
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

const SERVICE_PAGE_SLUGS_QUERY = /* groq */ `
  *[_type == "servicePage" && defined(slug.current)].slug.current
`;

const BLOG_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)].slug.current
`;

export async function getSanityServicePageSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(SERVICE_PAGE_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}

export async function getSanityBlogPostSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(BLOG_POST_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}

type SanityBook = {
  _id: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: FetchedImage | null;
  badges?: string[] | null;
  publisher?: { name?: string; year?: number } | null;
  ctas?: { _key?: string; label?: string; href?: string }[] | null;
  podcastHref?: string | null;
  series?: string | null;
  order?: number | null;
};

const BOOKS_QUERY = /* groq */ `
  *[_type == "book" && defined(slug.current)] | order(order asc, title asc) {
    _id,
    "slug": slug.current,
    title,
    subtitle,
    description,
    "image": {
      ${IMAGE_PROJECTION}
    },
    badges,
    publisher { name, year },
    ctas[] { _key, label, href },
    podcastHref,
    series,
    order
  }
`;

const BOOK_SERIES: BookSeries[] = ['textbook', 'guidebook', 'bargaining'];

function isBookSeries(value: string | null | undefined): value is BookSeries {
  return BOOK_SERIES.includes(value as BookSeries);
}

function normalizeBook(doc: SanityBook): Book | null {
  if (!doc._id || !doc.slug || !doc.title) return null;

  const ctas: BookCta[] = (doc.ctas ?? [])
    .filter((cta): cta is { _key?: string; label: string; href: string } => Boolean(cta?.label && cta?.href))
    .map((cta) => ({ _key: cta._key, label: cta.label, href: cta.href }));

  const publisherName = doc.publisher?.name?.trim();
  const publisherYear = doc.publisher?.year;
  const publisherNote = [publisherName, publisherYear].filter(Boolean).join(' · ') || undefined;

  return {
    _id: doc._id,
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || undefined,
    description: doc.description || undefined,
    image: resolveContentImage(doc.image),
    badges: (doc.badges ?? []).filter((badge): badge is string => Boolean(badge?.trim())),
    publisherName,
    publisherYear,
    publisherNote,
    ctas,
    podcastHref: doc.podcastHref || undefined,
    series: isBookSeries(doc.series) ? doc.series : 'guidebook',
    order: typeof doc.order === 'number' ? doc.order : 0,
  };
}

export async function getSanityBooks(): Promise<Book[]> {
  const docs = await sanityClient.fetch<SanityBook[]>(BOOKS_QUERY);
  return (docs ?? []).map(normalizeBook).filter((book): book is Book => Boolean(book));
}

// ─── Podcast ──────────────────────────────────────────────────────────────────

const PODCAST_EPISODES_QUERY = /* groq */ `
  *[_type == "podcastEpisode"] | order(order asc) {
    _id,
    "slug": slug.current,
    title,
    description,
    status,
    order,
    part,
    partName,
    partDescription,
    spotifyUrl,
    youtubeUrl,
    guidebookHref,
  }
`;

type SanityPodcastEpisode = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  status: string;
  order: number;
  part: number;
  partName: string;
  partDescription?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  guidebookHref?: string;
};

function isPodcastStatus(s: unknown): s is PodcastEpisodeStatus {
  return s === 'live' || s === 'coming-soon';
}

function normalizePodcastEpisode(doc: SanityPodcastEpisode): PodcastEpisode | null {
  if (!doc?._id || !doc.title) return null;
  return {
    _id: doc._id,
    slug: doc.slug || doc._id,
    title: doc.title,
    description: doc.description || undefined,
    status: isPodcastStatus(doc.status) ? doc.status : 'coming-soon',
    order: typeof doc.order === 'number' ? doc.order : 0,
    part: typeof doc.part === 'number' ? doc.part : 1,
    partName: doc.partName || '',
    partDescription: doc.partDescription || undefined,
    spotifyUrl: doc.spotifyUrl || undefined,
    youtubeUrl: doc.youtubeUrl || undefined,
    guidebookHref: doc.guidebookHref || undefined,
  };
}

export async function getSanityPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const docs = await sanityClient.fetch<SanityPodcastEpisode[]>(PODCAST_EPISODES_QUERY);
  return (docs ?? []).map(normalizePodcastEpisode).filter((ep): ep is PodcastEpisode => Boolean(ep));
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS_QUERY = /* groq */ `
  *[_type == "testimonial" && defined(quote) && defined(name)] | order(order asc, name asc) {
    _id,
    quote,
    name,
    age,
    location,
    tenure,
    platform,
    reviewedAt,
    order
  }
`;

type SanityTestimonial = {
  _id: string;
  quote?: string;
  name?: string;
  age?: number;
  location?: string;
  tenure?: string;
  platform?: string;
  reviewedAt?: string;
  order?: number;
};

function normalizeTestimonial(doc: SanityTestimonial): Testimonial | null {
  if (!doc?._id || !doc.quote?.trim() || !doc.name?.trim()) return null;
  const platform =
    doc.platform === 'google' || doc.platform === 'yelp' || doc.platform === 'thumbtack' ? doc.platform : undefined;
  return {
    _id: doc._id,
    quote: doc.quote.trim(),
    name: doc.name.trim(),
    age: typeof doc.age === 'number' ? doc.age : undefined,
    location: doc.location?.trim() || undefined,
    tenure: doc.tenure?.trim() || undefined,
    platform,
    reviewedAt: doc.reviewedAt || undefined,
    order: typeof doc.order === 'number' ? doc.order : 0,
  };
}

export async function getSanityTestimonials(): Promise<Testimonial[]> {
  const docs = await sanityClient.fetch<SanityTestimonial[]>(TESTIMONIALS_QUERY);
  return (docs ?? []).map(normalizeTestimonial).filter((item): item is Testimonial => Boolean(item));
}

// ─── Projects ────────────────────────────────────────────────────────────────

const PROJECTS_QUERY = /* groq */ `
  *[_type == "project" && defined(title) && defined(description)] | order(order asc, title asc) {
    _id,
    title,
    description,
    location,
    "tags": tags[] { label, href },
    "beforeImage": {
      "src": coalesce(beforeImage.asset->url, ""),
      "alt": coalesce(beforeImage.alt, ""),
      "crop": beforeImage.crop,
      "hotspot": beforeImage.hotspot,
      "asset": beforeImage.asset
    },
    "afterImage": {
      "src": coalesce(afterImage.asset->url, ""),
      "alt": coalesce(afterImage.alt, ""),
      "crop": afterImage.crop,
      "hotspot": afterImage.hotspot,
      "asset": afterImage.asset
    },
    "galleryImages": galleryImages[] {
      "src": coalesce(asset->url, ""),
      "alt": coalesce(alt, ""),
      "crop": crop,
      "hotspot": hotspot,
      "asset": asset
    },
    beforeLabel,
    afterLabel,
    order
  }
`;

type SanityProject = {
  _id: string;
  title?: string;
  description?: string;
  location?: string;
  tags?: ProjectTag[];
  beforeImage?: FetchedImage;
  afterImage?: FetchedImage;
  galleryImages?: FetchedImage[];
  beforeLabel?: string;
  afterLabel?: string;
  order?: number;
};

function normalizeProject(doc: SanityProject): ProjectCardContent | null {
  if (!doc?._id || !doc.title?.trim() || !doc.description?.trim()) return null;

  return {
    _id: doc._id,
    title: doc.title.trim(),
    description: doc.description.trim(),
    location: doc.location?.trim() || undefined,
    tags: (doc.tags ?? [])
      .filter((tag) => tag?.label?.trim())
      .map((tag) => ({
        label: tag.label.trim(),
        href: tag.href?.trim() || undefined,
      })),
    beforeImage: resolveContentImage(doc.beforeImage),
    afterImage: resolveContentImage(doc.afterImage),
    galleryImages: (doc.galleryImages ?? [])
      .map((image) => resolveContentImage(image))
      .filter((image): image is ContentImage => Boolean(image)),
    beforeLabel: doc.beforeLabel?.trim() || 'Before',
    afterLabel: doc.afterLabel?.trim() || 'After',
    order: typeof doc.order === 'number' ? doc.order : 0,
  };
}

export async function getSanityProjects(): Promise<ProjectCardContent[]> {
  const docs = await sanityClient.fetch<SanityProject[]>(PROJECTS_QUERY);
  return (docs ?? []).map(normalizeProject).filter((project): project is ProjectCardContent => Boolean(project));
}

/** Returns episodes grouped by part (sorted by part number, then episode order). */
export function groupEpisodesByPart(episodes: PodcastEpisode[]): PodcastPartGroup[] {
  const map = new Map<number, PodcastPartGroup>();
  for (const ep of episodes) {
    if (!map.has(ep.part)) {
      map.set(ep.part, {
        part: ep.part,
        partName: ep.partName,
        partDescription: ep.partDescription,
        episodes: [],
      });
    }
    map.get(ep.part)!.episodes.push(ep);
  }
  return [...map.values()].sort((a, b) => a.part - b.part);
}

import { sanityClient } from '../sanity/client';
import { resolveContentImage, resolveContentImageOrEmpty, type SanityImageFields } from '../sanity/image';
import type {
  AboutPageMediaContent,
  AudiencePageMediaContent,
  BlogContentBlock,
  BlogPost,
  Book,
  BookCta,
  BookSeries,
  CommercialAudienceSubPageMediaContent,
  ContactPageMediaContent,
  PodcastEpisode,
  PodcastEpisodeStatus,
  PodcastPartGroup,
  ProjectCardContent,
  ProjectTag,
  ProjectsPageMediaContent,
  ReviewsPageMediaContent,
  Testimonial,
  ContactPageContent,
  ContentImage,
  FooterMediaContent,
  FormHelpOption,
  HomePageContent,
  HomeMediaContent,
  NavigationContent,
  ReviewsPageContent,
  ServiceAreaHubMediaContent,
  ServiceAreaLocationMediaContent,
  ServiceCategoryPageMediaContent,
  ServicesHubMediaContent,
  ServicePageContent,
  ServiceSection,
  ServiceSubPageMediaContent,
  SplitContentSection,
} from './types';

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

const HOME_QUERY = /* groq */ `
  *[_type == "homePage" && _id == "singleton-home"][0] {
    meta,
    hero {
      titleLine1,
      titleLine2,
      subtitleParagraph1,
      ctaText,
      ctaHref,
      phoneCtaText,
      phoneCtaHref,
      "heroImage": {
        "src": coalesce(heroImage.asset->url, heroImageUrl, ""),
        "alt": coalesce(heroImage.alt, ""),
        "crop": heroImage.crop,
        "hotspot": heroImage.hotspot,
        "asset": heroImage.asset
      },
      "heroImageMobile": {
        "src": coalesce(heroImageMobile.asset->url, heroImageMobileUrl, ""),
        "alt": coalesce(heroImageMobile.alt, heroImage.alt, ""),
        "crop": heroImageMobile.crop,
        "hotspot": heroImageMobile.hotspot,
        "asset": heroImageMobile.asset
      }
    },
    "statsBar": statsBar[] { stat, label },
    whyInspect {
      heading,
      paragraph1,
      paragraph2,
      ctaText,
      ctaHref,
      "image": {
        ${IMAGE_PROJECTION}
      }
    },
    servicesSection {
      title,
      subtitle,
      "services": services[] { title, description, linkText, linkHref }
    },
    faqs {
      title,
      "items": items[] { question, answer }
    },
    ctaBanner {
      title,
      subtitle,
      ctaText,
      ctaHref,
      showAfterHoursNote
    }
  }
`;

export async function getSanityHomeContent(): Promise<HomePageContent> {
  const page = await sanityClient.fetch<
    HomePageContent & {
      hero: HomePageContent['hero'] & { heroImage: FetchedImage; heroImageMobile?: FetchedImage };
      whyInspect: HomePageContent['whyInspect'] & { image: FetchedImage };
    }
  >(HOME_QUERY);
  return {
    ...page,
    hero: {
      ...page.hero,
      heroImage: resolveContentImageOrEmpty(page.hero?.heroImage),
      heroImageMobile: resolveContentImage(page.hero?.heroImageMobile),
    },
    whyInspect: {
      ...page.whyInspect,
      image: resolveContentImageOrEmpty(page.whyInspect?.image),
    },
  };
}

const HOME_MEDIA_QUERY = /* groq */ `
  *[_type == "homePage" && _id == "singleton-home"][0] {
    hero {
      "heroImage": {
        "src": coalesce(heroImage.asset->url, ""),
        "alt": coalesce(heroImage.alt, ""),
        "crop": heroImage.crop,
        "hotspot": heroImage.hotspot,
        "asset": heroImage.asset
      },
      "heroImageMobile": {
        "src": coalesce(heroImageMobile.asset->url, ""),
        "alt": coalesce(heroImageMobile.alt, heroImage.alt, ""),
        "crop": heroImageMobile.crop,
        "hotspot": heroImageMobile.hotspot,
        "asset": heroImageMobile.asset
      }
    },
    "audienceCards": audienceCards[] {
      title,
      href,
      "image": {
        ${IMAGE_PROJECTION}
      }
    },
    highlightBanner {
      "image": {
        ${IMAGE_PROJECTION}
      }
    }
  }
`;

export async function getSanityHomeMediaContent(): Promise<HomeMediaContent | null> {
  const page = await sanityClient.fetch<{
    hero?: { heroImage?: FetchedImage; heroImageMobile?: FetchedImage };
    audienceCards?: Array<{ title?: string; href?: string; image?: FetchedImage }>;
    highlightBanner?: { image?: FetchedImage };
  } | null>(HOME_MEDIA_QUERY);

  if (!page) return null;

  return {
    heroImage: resolveContentImage(page.hero?.heroImage),
    heroImageMobile: resolveContentImage(page.hero?.heroImageMobile),
    audienceCards: (page.audienceCards ?? []).map((card) => ({
      title: card.title,
      href: card.href,
      image: resolveContentImage(card.image),
    })),
    bannerImage: resolveContentImage(page.highlightBanner?.image),
  };
}

const SERVICES_HUB_MEDIA_QUERY = /* groq */ `
  *[_type == "servicesHubPage" && _id == "singleton-services-hub"][0] {
    hero {
      "image": {
        ${IMAGE_PROJECTION}
      }
    },
    "audienceCards": audienceCards[] {
      title,
      href,
      "image": {
        ${IMAGE_PROJECTION}
      }
    }
  }
`;

export async function getSanityServicesHubMediaContent(): Promise<ServicesHubMediaContent | null> {
  const page = await sanityClient.fetch<{
    hero?: { image?: FetchedImage };
    audienceCards?: Array<{ title?: string; href?: string; image?: FetchedImage }>;
  } | null>(SERVICES_HUB_MEDIA_QUERY);

  if (!page) return null;

  return {
    heroImage: resolveContentImage(page.hero?.image),
    audienceCards: (page.audienceCards ?? []).map((card) => ({
      title: card.title,
      href: card.href,
      image: resolveContentImage(card.image),
    })),
  };
}

const ABOUT_PAGE_MEDIA_QUERY = /* groq */ `
  *[_type == "aboutPageMedia" && _id == "singleton-about-page-media"][0] {
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    },
    "legacyImage": {
      "src": coalesce(legacyImage.asset->url, ""),
      "alt": coalesce(legacyImage.alt, ""),
      "crop": legacyImage.crop,
      "hotspot": legacyImage.hotspot,
      "asset": legacyImage.asset
    },
    "siaosiImage": {
      "src": coalesce(siaosiImage.asset->url, ""),
      "alt": coalesce(siaosiImage.alt, ""),
      "crop": siaosiImage.crop,
      "hotspot": siaosiImage.hotspot,
      "asset": siaosiImage.asset
    }
  }
`;

export async function getSanityAboutPageMediaContent(): Promise<AboutPageMediaContent | null> {
  const doc = await sanityClient.fetch<{
    heroImage?: FetchedImage;
    legacyImage?: FetchedImage;
    siaosiImage?: FetchedImage;
  } | null>(ABOUT_PAGE_MEDIA_QUERY);

  if (!doc) return null;

  return {
    heroImage: resolveContentImage(doc.heroImage),
    legacyImage: resolveContentImage(doc.legacyImage),
    siaosiImage: resolveContentImage(doc.siaosiImage),
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

const PROJECTS_PAGE_MEDIA_QUERY = /* groq */ `
  *[_type == "projectsPageMedia" && _id == "singleton-projects-page-media"][0] {
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    }
  }
`;

export async function getSanityProjectsPageMediaContent(): Promise<ProjectsPageMediaContent | null> {
  const doc = await sanityClient.fetch<{ heroImage?: FetchedImage } | null>(PROJECTS_PAGE_MEDIA_QUERY);

  if (!doc) return null;

  return {
    heroImage: resolveContentImage(doc.heroImage),
  };
}

const REVIEWS_PAGE_MEDIA_QUERY = /* groq */ `
  *[_type == "reviewsPageMedia" && _id == "singleton-reviews-page-media"][0] {
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    }
  }
`;

export async function getSanityReviewsPageMediaContent(): Promise<ReviewsPageMediaContent | null> {
  const doc = await sanityClient.fetch<{ heroImage?: FetchedImage } | null>(REVIEWS_PAGE_MEDIA_QUERY);

  if (!doc) return null;

  return {
    heroImage: resolveContentImage(doc.heroImage),
  };
}

const AUDIENCE_PAGE_MEDIA_QUERY = /* groq */ `
  *[_type == "audiencePageMedia" && path == $path][0] {
    title,
    path,
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    },
    "introImage": {
      "src": coalesce(introImage.asset->url, ""),
      "alt": coalesce(introImage.alt, ""),
      "crop": introImage.crop,
      "hotspot": introImage.hotspot,
      "asset": introImage.asset
    },
    "projectImage": {
      "src": coalesce(projectImage.asset->url, ""),
      "alt": coalesce(projectImage.alt, ""),
      "crop": projectImage.crop,
      "hotspot": projectImage.hotspot,
      "asset": projectImage.asset
    }
  }
`;

const COMMERCIAL_AUDIENCE_SUB_PAGE_MEDIA_QUERY = /* groq */ `
  *[_type == "commercialAudienceSubPageMedia" && path == $path][0] {
    title,
    path,
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    },
    "introImage": {
      "src": coalesce(introImage.asset->url, ""),
      "alt": coalesce(introImage.alt, ""),
      "crop": introImage.crop,
      "hotspot": introImage.hotspot,
      "asset": introImage.asset
    }
  }
`;

const SERVICE_AREA_HUB_MEDIA_QUERY = /* groq */ `
  *[_type == "serviceAreaHubPageMedia" && _id == "singleton-service-area-hub"][0] {
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    },
    "introImage": {
      "src": coalesce(introImage.asset->url, ""),
      "alt": coalesce(introImage.alt, ""),
      "crop": introImage.crop,
      "hotspot": introImage.hotspot,
      "asset": introImage.asset
    }
  }
`;

const SERVICE_AREA_LOCATION_MEDIA_QUERY = /* groq */ `
  *[_type == "serviceAreaLocationPageMedia" && path == $path][0] {
    title,
    path,
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    },
    "introImage": {
      "src": coalesce(introImage.asset->url, ""),
      "alt": coalesce(introImage.alt, ""),
      "crop": introImage.crop,
      "hotspot": introImage.hotspot,
      "asset": introImage.asset
    },
    "recentWorkImage": {
      "src": coalesce(recentWorkImage.asset->url, ""),
      "alt": coalesce(recentWorkImage.alt, ""),
      "crop": recentWorkImage.crop,
      "hotspot": recentWorkImage.hotspot,
      "asset": recentWorkImage.asset
    }
  }
`;

const SERVICE_CATEGORY_PAGE_MEDIA_QUERY = /* groq */ `
  *[_type == "serviceCategoryPageMedia" && path == $path][0] {
    title,
    path,
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    },
    "introImage": {
      "src": coalesce(introImage.asset->url, ""),
      "alt": coalesce(introImage.alt, ""),
      "crop": introImage.crop,
      "hotspot": introImage.hotspot,
      "asset": introImage.asset
    },
    "projectImage": {
      "src": coalesce(projectImage.asset->url, ""),
      "alt": coalesce(projectImage.alt, ""),
      "crop": projectImage.crop,
      "hotspot": projectImage.hotspot,
      "asset": projectImage.asset
    }
  }
`;

const normalizePath = (path: string) => {
  const trimmed = path.trim();
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
};

export async function getSanityAudiencePageMedia(path: string): Promise<AudiencePageMediaContent | null> {
  const doc = await sanityClient.fetch<
    | (Omit<AudiencePageMediaContent, 'heroImage' | 'introImage' | 'projectImage'> & {
        heroImage?: FetchedImage;
        introImage?: FetchedImage;
        projectImage?: FetchedImage;
      })
    | null
  >(AUDIENCE_PAGE_MEDIA_QUERY, { path: normalizePath(path) });

  if (!doc) return null;

  return {
    title: doc.title,
    path: doc.path,
    heroImage: resolveContentImage(doc.heroImage),
    introImage: resolveContentImage(doc.introImage),
    projectImage: resolveContentImage(doc.projectImage),
  };
}

export async function getSanityCommercialAudienceSubPageMedia(
  path: string
): Promise<CommercialAudienceSubPageMediaContent | null> {
  const doc = await sanityClient.fetch<
    | (Omit<CommercialAudienceSubPageMediaContent, 'heroImage' | 'introImage'> & {
        heroImage?: FetchedImage;
        introImage?: FetchedImage;
      })
    | null
  >(COMMERCIAL_AUDIENCE_SUB_PAGE_MEDIA_QUERY, { path: normalizePath(path) });

  if (!doc) return null;

  return {
    title: doc.title,
    path: doc.path,
    heroImage: resolveContentImage(doc.heroImage),
    introImage: resolveContentImage(doc.introImage),
  };
}

export async function getSanityServiceAreaHubMediaContent(): Promise<ServiceAreaHubMediaContent | null> {
  const doc = await sanityClient.fetch<{
    heroImage?: FetchedImage;
    introImage?: FetchedImage;
  } | null>(SERVICE_AREA_HUB_MEDIA_QUERY);

  if (!doc) return null;

  return {
    heroImage: resolveContentImage(doc.heroImage),
    introImage: resolveContentImage(doc.introImage),
  };
}

export async function getSanityServiceAreaLocationMedia(path: string): Promise<ServiceAreaLocationMediaContent | null> {
  const doc = await sanityClient.fetch<
    | (Omit<ServiceAreaLocationMediaContent, 'heroImage' | 'introImage' | 'recentWorkImage'> & {
        heroImage?: FetchedImage;
        introImage?: FetchedImage;
        recentWorkImage?: FetchedImage;
      })
    | null
  >(SERVICE_AREA_LOCATION_MEDIA_QUERY, { path: normalizePath(path) });

  if (!doc) return null;

  return {
    title: doc.title,
    path: doc.path,
    heroImage: resolveContentImage(doc.heroImage),
    introImage: resolveContentImage(doc.introImage),
    recentWorkImage: resolveContentImage(doc.recentWorkImage),
  };
}

export async function getSanityServiceCategoryPageMedia(path: string): Promise<ServiceCategoryPageMediaContent | null> {
  const doc = await sanityClient.fetch<
    | (Omit<ServiceCategoryPageMediaContent, 'heroImage' | 'introImage' | 'projectImage'> & {
        heroImage?: FetchedImage;
        introImage?: FetchedImage;
        projectImage?: FetchedImage;
      })
    | null
  >(SERVICE_CATEGORY_PAGE_MEDIA_QUERY, { path: normalizePath(path) });

  if (!doc) return null;

  return {
    title: doc.title,
    path: doc.path,
    heroImage: resolveContentImage(doc.heroImage),
    introImage: resolveContentImage(doc.introImage),
    projectImage: resolveContentImage(doc.projectImage),
  };
}

const SERVICE_SUB_PAGE_MEDIA_QUERY = /* groq */ `
  *[
    _type in ["rockWallSubPageMedia", "concreteServiceSubPageMedia"] &&
    path == $path
  ][0] {
    title,
    path,
    "heroImage": {
      "src": coalesce(heroImage.asset->url, ""),
      "alt": coalesce(heroImage.alt, ""),
      "crop": heroImage.crop,
      "hotspot": heroImage.hotspot,
      "asset": heroImage.asset
    }
  }
`;

export async function getSanityServiceSubPageMedia(path: string): Promise<ServiceSubPageMediaContent | null> {
  const doc = await sanityClient.fetch<
    (Omit<ServiceSubPageMediaContent, 'heroImage'> & { heroImage?: FetchedImage }) | null
  >(SERVICE_SUB_PAGE_MEDIA_QUERY, { path: normalizePath(path) });

  if (!doc) return null;

  return {
    title: doc.title,
    path: doc.path,
    heroImage: resolveContentImage(doc.heroImage),
  };
}

const NAVIGATION_QUERY = /* groq */ `
  {
    "header": *[_type == "siteNavigation" && _id == "singleton-navigation"][0] {
      "links": links[] {
        text,
        href,
        "links": subLinks[] { text, href },
        "columns": columns[] {
          title,
          "links": links[] { text, href }
        }
      },
      "actions": actions[] { variant, text, href },
      phone
    },
    "footer": *[_type == "siteFooter" && _id == "singleton-footer"][0] {
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

export async function getSanityNavigationContent(): Promise<NavigationContent> {
  return sanityClient.fetch<NavigationContent>(NAVIGATION_QUERY);
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

const REVIEWS_PAGE_QUERY = /* groq */ `
  *[_type == "reviewsPage" && _id == "singleton-reviews"][0] {
    meta,
    hero { ${HERO_PROJECTION} },
    liveReviews { heading, intro },
    platforms {
      heading,
      intro,
      "items": items[] { title, ratingNote, href, linkText, icon }
    },
    gallerySection {
      heading,
      paragraphs,
      ctaText,
      ctaHref,
      "previewImages": previewImages[] {
        ${IMAGE_PROJECTION}
      }
    },
    ctaBanner { ${CTA_BANNER_PROJECTION} }
  }
`;

export async function getSanityReviewsPage(): Promise<ReviewsPageContent> {
  const page = await sanityClient.fetch<ReviewsPageContent | null>(REVIEWS_PAGE_QUERY);
  if (!page) {
    throw new Error('Sanity reviewsPage document is missing (singleton-reviews).');
  }
  return {
    ...page,
    hero: normalizeHeroImage(page.hero),
    gallerySection: {
      ...page.gallerySection,
      _type: 'splitContentSection',
      previewImages: (page.gallerySection.previewImages ?? [])
        .map((image) => resolveContentImage(image as FetchedImage))
        .filter((image): image is ContentImage => Boolean(image?.src)),
    },
  };
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
  body?: SanityPortableBlock[] | null;
};

function portableBlockText(block: SanityPortableBlock): string {
  return Array.isArray(block.children) ? block.children.map((child) => child.text ?? '').join('') : '';
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spansToHtml(children: SanitySpan[] | undefined, markDefs: SanityMarkDef[] | undefined): string {
  if (!Array.isArray(children)) return '';
  const defsMap = new Map((markDefs ?? []).map((d) => [d._key, d]));

  return children
    .map((span) => {
      if (span._type !== 'span') return '';
      let html = escapeHtml(span.text ?? '');
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

  body.forEach((block, index) => {
    const key = block._key || `block-${index}`;

    // ── Image ─────────────────────────────────────────────────────────────────
    if (block._type === 'image') {
      flushList();
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

    const text = portableBlockText(block).trim();
    if (!text) return;

    const html = spansToHtml(block.children, block.markDefs) || escapeHtml(text);

    // Headings
    if (block.style === 'h1' || block.style === 'h2') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 2, text });
      return;
    }
    if (block.style === 'h3' || block.style === 'h4') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 3, text });
      return;
    }

    // List items
    if (block.listItem === 'bullet' || block.listItem === 'number') {
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
    result.push({
      _type: 'paragraph',
      _key: key,
      text,
      html,
      ...(block.style === 'blockquote' ? { quote: true } : {}),
    });
  });

  flushList();
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
    publishDate: post.publishDate,
    author: post.author,
    category: post.category,
    tags: (post.tags ?? []).filter((t): t is string => Boolean(t?.trim())),
    image: resolveContentImage(post.image as FetchedImage | undefined),
    relatedPages: (post.relatedPages ?? []).map((key) => key.replace(/^\/+/, '')).filter(Boolean),
    meta: {
      title: post.title,
      description: excerpt,
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
  publishDate,
  author,
  category,
  tags,
  "image": {
    "src": coalesce(image.asset->url, imageUrl, ""),
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

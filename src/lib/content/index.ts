import type {
  AboutPageContent,
  BlogPost,
  Book,
  BookSeries,
  ContactPageMediaContent,
  ContactPageContent,
  FooterMediaContent,
  HomePageContent,
  NavigationContent,
  PodcastEpisode,
  PodcastPartGroup,
  ProjectCardContent,
  ServicePageContent,
  Testimonial,
} from './types';
import {
  getSanityBlogPost,
  getSanityBlogPosts,
  getSanityBlogPostSlugs,
  getSanityBooks,
  getSanityContactPageMediaContent,
  getSanityPodcastEpisodes,
  getSanityTestimonials,
  groupEpisodesByPart,
  getSanityContactHelpOptions,
  getSanityContactPage,
  getSanityFooterMediaContent,
  getSanityHomeContent,
  getSanityNavigationContent,
  getSanityProjects,
  getSanityServicePage,
  getSanityServicePageSlugs,
} from './sanity';
/* contact page removed */
import { CONTACT } from '../../config/contact';
import { HOME_DEFAULTS } from '../../data/home-defaults';
import { navigationData } from '../../data/navigation';

export { getServicesHub, getServiceCategoryPage, getServiceSubPage } from './services';
export { getServiceAreasHub, getServiceAreaPage } from './serviceAreas';
export { getAboutPage } from './about';
export { getReviewsPage, getProjectsPage, getBlogPage } from './listingPages';
export { getLegalPage } from './legal';
export { getAudienceLandingPage, getAudienceSubPage } from './audiences';

/**
 * Homepage copy + images from Sanity, with per-field fallback to `HOME_DEFAULTS`
 * so the page still renders if Sanity is unreachable.
 */
export async function getHomeContent(): Promise<HomePageContent> {
  try {
    return await getSanityHomeContent();
  } catch (error) {
    console.warn('Sanity homepage unavailable; using default copy and placeholder images.', error);
    return HOME_DEFAULTS;
  }
}

export async function getContactPageMediaContent(): Promise<ContactPageMediaContent | null> {
  try {
    return await getSanityContactPageMediaContent();
  } catch (error) {
    console.warn('Sanity contact page media unavailable; using placeholder fallback.', error);
    return null;
  }
}

export async function getContactPage(): Promise<ContactPageContent | null> {
  try {
    return await getSanityContactPage();
  } catch (error) {
    console.warn('Sanity contact page unavailable; using local form fallback.', error);
    return null;
  }
}

/* getContactHelpOptions removed — contact page deleted */

/** Replaces tokens editors can use in Sanity text: {license}, {year}. */
function fillNavTokens(nav: NavigationContent): NavigationContent {
  const fill = (v: string) => v.replaceAll('{license}', CONTACT.license ?? '').replaceAll('{year}', String(new Date().getFullYear()));
  return {
    ...nav,
    header: {
      ...nav.header,
      topBar: nav.header.topBar
        ? { ...nav.header.topBar, items: nav.header.topBar.items.map(fill).filter(Boolean) }
        : undefined,
    },
    footer: { ...nav.footer, footNote: fill(nav.footer.footNote) },
  };
}

/**
 * Header + footer navigation from Sanity (`siteNavigation`, `siteFooter`).
 * Falls back to `src/data/navigation.ts` only if the documents are missing or Sanity is unreachable,
 * so the site never renders without a menu.
 */
export async function getNavigationContent(): Promise<NavigationContent> {
  try {
    const nav = await getSanityNavigationContent();
    if (nav) return fillNavTokens(nav);
  } catch (error) {
    console.warn('Sanity navigation unavailable; using local fallback.', error);
  }
  return fillNavTokens(navigationData);
}

export async function getFooterMediaContent(): Promise<FooterMediaContent | null> {
  try {
    return await getSanityFooterMediaContent();
  } catch (error) {
    console.warn('Sanity footer media unavailable; using solid footer background.', error);
    return null;
  }
}

export async function findServicePage(slug: string): Promise<ServicePageContent | null> {
  return getSanityServicePage(slug);
}

export async function getServicePage(slug: string): Promise<ServicePageContent> {
  const page = await findServicePage(slug);
  if (!page) {
    throw new Error(`Sanity servicePage document is missing for slug "${slug}".`);
  }
  return page;
}

export async function getServicePageSlugs(): Promise<string[]> {
  try {
    return await getSanityServicePageSlugs();
  } catch (error) {
    console.warn('Sanity service page slugs unavailable.', error);
    return [];
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  return getSanityBlogPostSlugs().catch(() => [] as string[]);
}

const STATIC_PATHS = [
  '/',
  '/about',
  '/blog',
  '/reviews',
  '/projects',
  '/privacy-policy',
  '/terms',
  '/accessibility',
  '/contact',
  '/services',
  '/services/rock-walls',
  '/services/rock-walls/planter-garden',
  '/services/rock-walls/repair',
  '/services/rock-walls/retaining',
  '/services/rock-walls/veneer',
  '/services/retaining-walls',
  '/services/cmu-block-walls',
  '/services/concrete',
  '/services/concrete/driveways',
  '/services/concrete/foundations',
  '/services/concrete/patios',
  '/services/concrete/sealing',
  '/services/concrete/sidewalks',
  '/services/concrete/stamped-decorative',
  '/services/concrete/stem-walls',
  '/services/concrete/steps',
  '/service-areas',
  '/service-areas/aiea-pearl-city',
  '/service-areas/ewa-beach',
  '/service-areas/honolulu',
  '/service-areas/kailua',
  '/service-areas/kaneohe',
  '/service-areas/kapolei',
  '/service-areas/mililani',
  '/service-areas/north-shore',
  '/service-areas/wahiawa',
  '/service-areas/waipahu',
  '/who-we-work-with/residential',
  '/who-we-work-with/commercial',
  '/who-we-work-with/commercial/contractors',
  '/who-we-work-with/commercial/hoa',
  '/who-we-work-with/commercial/property-managers-landlords',
];

export async function getPublicContentPaths(): Promise<string[]> {
  const [pageSlugs, postSlugs] = await Promise.all([getServicePageSlugs(), getBlogPostSlugs()]);
  return [
    ...STATIC_PATHS,
    ...pageSlugs.map((slug) => `/${slug.replace(/^\/+/, '')}`),
    ...postSlugs.map((slug) => `/blog/${slug.replace(/^\/+/, '')}`),
  ];
}

export function getBlogPermalink(slug: string): string {
  return `/blog/${slug}`;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await getSanityBlogPosts();
  } catch (error) {
    console.warn('Sanity blog posts unavailable.', error);
  }
  return [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    return (await getSanityBlogPost(slug)) ?? undefined;
  } catch (error) {
    console.warn(`Sanity blog post "${slug}" unavailable.`, error);
  }
  return undefined;
}

export async function getBlogPostsRelatedTo(pageSlug: string): Promise<BlogPost[]> {
  const key = pageSlug.replace(/^\/+/, '');
  const posts = await getBlogPosts();
  return posts.filter((post) => post.relatedPages.includes(key)).slice(0, 3);
}

export async function getBooks(): Promise<Book[]> {
  try {
    return await getSanityBooks();
  } catch (error) {
    console.warn('Sanity books unavailable.', error);
    return [];
  }
}

export async function getRelatedBlogPosts(post: BlogPost, max = 3): Promise<BlogPost[]> {
  const keys = new Set(post.relatedPages);
  if (!keys.size) return [];

  const posts = await getBlogPosts();
  return posts
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score: item.relatedPages.filter((key) => keys.has(key)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.publishDate.localeCompare(a.item.publishDate))
    .slice(0, max)
    .map(({ item }) => item);
}

export type {
  AboutPageContent,
  BlogPost,
  Book,
  BookSeries,
  ContactPageContent,
  FooterMediaContent,
  HomePageContent,
  NavigationContent,
  PodcastEpisode,
  PodcastPartGroup,
  ProjectCardContent,
  ServicePageContent,
  Testimonial,
};

export { groupEpisodesByPart };

export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  try {
    return await getSanityPodcastEpisodes();
  } catch (error) {
    console.warn('Sanity podcast episodes unavailable.', error);
    return [];
  }
}

export function formatTestimonialAttribution(item: Testimonial): string {
  const identity = typeof item.age === 'number' ? `${item.name}, ${item.age}` : item.name;
  return [identity, item.location, item.tenure].filter(Boolean).join(' · ');
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await getSanityTestimonials();
  } catch (error) {
    console.warn('Sanity testimonials unavailable.', error);
    return [];
  }
}

const PROJECT_FALLBACKS: ProjectCardContent[] = [
  {
    _id: 'fallback-retaining-rock-wall-repair',
    title: '6-Foot Retaining Rock Wall Repair & Reconstruction',
    description:
      'This approximately 6-foot-high retaining rock wall suffered heavy deterioration and structural failure caused by poor drainage. Our crew demolished and hauled away the damaged stonework, excavated behind the slope, and prepped the retaining footing. We rebuilt the wall using natural volcanic rock, installed new drainage and weep holes to relieve water pressure behind the structure, and finished the top line with a vinyl privacy fence.',
    tags: [
      { label: 'Rock Walls', href: '/services/rock-walls/' },
      { label: 'Retaining Walls', href: '/services/retaining-walls/' },
    ],
    beforeLabel: 'Before',
    afterLabel: 'After',
    order: 1,
  },
  {
    _id: 'fallback-makakilo-concrete-sidewalk',
    title: 'Makakilo Concrete Sidewalk Extension',
    description:
      'Our team prepped and graded the site to pour a new concrete sidewalk extension for a residential property in Makakilo, expanding the usable walkway space with a clean, durable finish that ties seamlessly into the existing layout.',
    tags: [
      { label: 'Concrete Services', href: '/services/concrete/' },
      { label: 'Kapolei & Makakilo Service Area', href: '/service-areas/kapolei/' },
    ],
    beforeLabel: 'Before',
    afterLabel: 'After',
    order: 2,
  },
  {
    _id: 'fallback-wahiawa-stamped-concrete',
    title: 'Wahiawa Stamped Concrete Perimeter & Sealing',
    description:
      'For this project in our home base of Wahiawa, our crew demolished and removed the aging concrete around the property perimeter. Once the sub-base was graded and prepped, we poured new stamped concrete flatwork and applied a protective sealant for long-term weather durability.',
    tags: [
      { label: 'Concrete Services', href: '/services/concrete/' },
      { label: 'Wahiawa Service Area', href: '/service-areas/wahiawa/' },
    ],
    beforeLabel: 'Before',
    afterLabel: 'After',
    order: 3,
  },
];

export async function getProjects(): Promise<ProjectCardContent[]> {
  try {
    const projects = await getSanityProjects();
    if (projects.length > 0) return projects;
  } catch (error) {
    console.warn('Sanity projects unavailable; using local fallback content.', error);
  }

  return PROJECT_FALLBACKS;
}

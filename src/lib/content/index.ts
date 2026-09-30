import type {
  AboutPageMediaContent,
  AudiencePageMediaContent,
  BlogPost,
  Book,
  BookSeries,
  CommercialAudienceSubPageMediaContent,
  ContactPageMediaContent,
  ContactPageContent,
  FooterMediaContent,
  HomeMediaContent,
  HomePageContent,
  NavigationContent,
  PodcastEpisode,
  PodcastPartGroup,
  ProjectCardContent,
  ProjectsPageMediaContent,
  ReviewsPageMediaContent,
  ReviewsPageContent,
  ServiceAreaHubMediaContent,
  ServiceAreaLocationMediaContent,
  ServiceCategoryPageMediaContent,
  ServicesHubMediaContent,
  ServicePageContent,
  ServiceSubPageMediaContent,
  Testimonial,
} from './types';
import {
  getSanityAboutPageMediaContent,
  getSanityAudiencePageMedia,
  getSanityBlogPost,
  getSanityBlogPosts,
  getSanityBlogPostSlugs,
  getSanityBooks,
  getSanityCommercialAudienceSubPageMedia,
  getSanityContactPageMediaContent,
  getSanityPodcastEpisodes,
  getSanityTestimonials,
  groupEpisodesByPart,
  getSanityContactHelpOptions,
  getSanityContactPage,
  getSanityFooterMediaContent,
  getSanityHomeContent,
  getSanityHomeMediaContent,
  getSanityNavigationContent,
  getSanityProjectsPageMediaContent,
  getSanityReviewsPage,
  getSanityReviewsPageMediaContent,
  getSanityProjects,
  getSanityServiceAreaHubMediaContent,
  getSanityServiceAreaLocationMedia,
  getSanityServiceCategoryPageMedia,
  getSanityServicePage,
  getSanityServicePageSlugs,
  getSanityServicesHubMediaContent,
  getSanityServiceSubPageMedia,
} from './sanity';
/* contact page removed */
import { navigationData } from '../../data/navigation';

export async function getHomeContent(): Promise<HomePageContent> {
  const page = await getSanityHomeContent();
  if (!page) {
    throw new Error('Sanity homePage document is missing (singleton-home).');
  }
  return page;
}

export async function getHomeMediaContent(): Promise<HomeMediaContent | null> {
  try {
    return await getSanityHomeMediaContent();
  } catch (error) {
    console.warn('Sanity homepage media unavailable; using placeholder fallback.', error);
    return null;
  }
}

export async function getServicesHubMediaContent(): Promise<ServicesHubMediaContent | null> {
  try {
    return await getSanityServicesHubMediaContent();
  } catch (error) {
    console.warn('Sanity services hub media unavailable; using placeholder fallback.', error);
    return null;
  }
}

export async function getAboutPageMediaContent(): Promise<AboutPageMediaContent | null> {
  try {
    return await getSanityAboutPageMediaContent();
  } catch (error) {
    console.warn('Sanity about page media unavailable; using placeholder fallback.', error);
    return null;
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

export async function getProjectsPageMediaContent(): Promise<ProjectsPageMediaContent | null> {
  try {
    return await getSanityProjectsPageMediaContent();
  } catch (error) {
    console.warn('Sanity projects page media unavailable; using placeholder fallback.', error);
    return null;
  }
}

export async function getReviewsPageMediaContent(): Promise<ReviewsPageMediaContent | null> {
  try {
    return await getSanityReviewsPageMediaContent();
  } catch (error) {
    console.warn('Sanity reviews page media unavailable; using placeholder fallback.', error);
    return null;
  }
}

export async function getAudiencePageMedia(path: string): Promise<AudiencePageMediaContent | null> {
  try {
    return await getSanityAudiencePageMedia(path);
  } catch (error) {
    console.warn(`Sanity audience page media unavailable for "${path}"; using placeholder fallback.`, error);
    return null;
  }
}

export async function getCommercialAudienceSubPageMedia(
  path: string
): Promise<CommercialAudienceSubPageMediaContent | null> {
  try {
    return await getSanityCommercialAudienceSubPageMedia(path);
  } catch (error) {
    console.warn(
      `Sanity commercial audience sub-page media unavailable for "${path}"; using placeholder fallback.`,
      error
    );
    return null;
  }
}

export async function getServiceAreaHubMediaContent(): Promise<ServiceAreaHubMediaContent | null> {
  try {
    return await getSanityServiceAreaHubMediaContent();
  } catch (error) {
    console.warn('Sanity service area hub media unavailable; using placeholder fallback.', error);
    return null;
  }
}

export async function getServiceAreaLocationMedia(path: string): Promise<ServiceAreaLocationMediaContent | null> {
  try {
    return await getSanityServiceAreaLocationMedia(path);
  } catch (error) {
    console.warn(`Sanity service area location media unavailable for "${path}"; using placeholder fallback.`, error);
    return null;
  }
}

export async function getServiceCategoryPageMedia(path: string): Promise<ServiceCategoryPageMediaContent | null> {
  try {
    return await getSanityServiceCategoryPageMedia(path);
  } catch (error) {
    console.warn(`Sanity service category media unavailable for "${path}"; using placeholder fallback.`, error);
    return null;
  }
}

export async function getServiceSubPageMedia(path: string): Promise<ServiceSubPageMediaContent | null> {
  try {
    return await getSanityServiceSubPageMedia(path);
  } catch (error) {
    console.warn(`Sanity service sub-page media unavailable for "${path}"; using placeholder fallback.`, error);
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

export async function getReviewsPage(): Promise<ReviewsPageContent | null> {
  try {
    return await getSanityReviewsPage();
  } catch (error) {
    console.warn('Sanity reviews page unavailable; using live review feed fallback.', error);
    return null;
  }
}

/* getContactHelpOptions removed — contact page deleted */

const LEGAL_FOOTER_LINKS = [
  { text: 'Privacy Policy', href: '/privacy-policy' },
  { text: 'Terms', href: '/terms' },
  { text: 'Accessibility', href: '/accessibility' },
];

const HIDDEN_NAV_HREFS = new Set(['/chapters', '/guidebooks']);
const HIDDEN_NAV_LABELS = new Set(['chapters', 'guidebooks', 'guidebook series']);
const PROJECTS_LINK = { text: 'Projects', href: '/projects/' };

function isHiddenNavLink(link: { text: string; href?: string }): boolean {
  return (link.href != null && HIDDEN_NAV_HREFS.has(link.href)) || HIDDEN_NAV_LABELS.has(link.text.toLowerCase());
}

function hidePagesFromUi(nav: NavigationContent): NavigationContent {
  return {
    ...nav,
    header: {
      ...nav.header,
      links: nav.header.links.filter((link) => !isHiddenNavLink(link)),
    },
    footer: {
      ...nav.footer,
      links: nav.footer.links
        .filter((column) => column.title.toLowerCase() !== 'chapters')
        .map((column) => ({
          ...column,
          links: column.links.filter((link) => !isHiddenNavLink(link)),
        })),
    },
  };
}

function ensureLegalFooterLinks(nav: NavigationContent): NavigationContent {
  const existing = nav.footer.secondaryLinks ?? [];
  const byHref = new Map(existing.map((link) => [link.href, link]));
  const merged = LEGAL_FOOTER_LINKS.map((link) => byHref.get(link.href) ?? link);

  for (const link of existing) {
    if (!merged.some((item) => item.href === link.href)) merged.push(link);
  }

  return {
    ...nav,
    footer: { ...nav.footer, secondaryLinks: merged },
  };
}

function insertLinkAfter(
  links: Array<{ text?: string; href?: string }>,
  link: { text: string; href: string },
  afterHref: string
) {
  if (links.some((item) => item.href === link.href)) return links;

  const index = links.findIndex((item) => item.href === afterHref);
  if (index === -1) return [...links, link];

  return [...links.slice(0, index + 1), link, ...links.slice(index + 1)];
}

function ensureProjectsLinks(nav: NavigationContent): NavigationContent {
  const headerLinks = insertLinkAfter(nav.header.links ?? [], PROJECTS_LINK, '/reviews/');
  const footerColumns = nav.footer.links ?? [];
  const companyIndex = footerColumns.findIndex((column) => column.title.toLowerCase() === 'company');
  const companyColumn =
    companyIndex >= 0
      ? footerColumns[companyIndex]
      : {
          title: 'COMPANY',
          links: [],
        };
  const updatedCompanyColumn = {
    ...companyColumn,
    links: insertLinkAfter(companyColumn.links ?? [], PROJECTS_LINK, '/reviews/'),
  };
  const updatedFooterColumns =
    companyIndex >= 0
      ? footerColumns.map((column, index) => (index === companyIndex ? updatedCompanyColumn : column))
      : [...footerColumns, updatedCompanyColumn];

  return {
    ...nav,
    header: {
      ...nav.header,
      links: headerLinks as NavigationContent['header']['links'],
    },
    footer: {
      ...nav.footer,
      links: updatedFooterColumns,
    },
  };
}

export async function getNavigationContent(): Promise<NavigationContent> {
  try {
    const nav = await getSanityNavigationContent();
    if (nav?.header && nav?.footer) {
      return hidePagesFromUi(ensureProjectsLinks(ensureLegalFooterLinks(nav)));
    }
  } catch (error) {
    console.warn('Sanity navigation unavailable; using local fallback.', error);
  }
  return hidePagesFromUi(ensureProjectsLinks(ensureLegalFooterLinks(navigationData)));
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
  AboutPageMediaContent,
  AudiencePageMediaContent,
  BlogPost,
  Book,
  BookSeries,
  CommercialAudienceSubPageMediaContent,
  ContactPageContent,
  FooterMediaContent,
  HomeMediaContent,
  HomePageContent,
  NavigationContent,
  PodcastEpisode,
  PodcastPartGroup,
  ProjectCardContent,
  ProjectsPageMediaContent,
  ReviewsPageMediaContent,
  ReviewsPageContent,
  ServiceAreaHubMediaContent,
  ServiceAreaLocationMediaContent,
  ServiceCategoryPageMediaContent,
  ServicesHubMediaContent,
  ServicePageContent,
  ServiceSubPageMediaContent,
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

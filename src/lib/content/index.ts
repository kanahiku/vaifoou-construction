import type {
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
  getSanityPodcastEpisodes,
  getSanityTestimonials,
  groupEpisodesByPart,
  getSanityContactHelpOptions,
  getSanityContactPage,
  getSanityFooterMediaContent,
  getSanityHomeContent,
  getSanityHomeMediaContent,
  getSanityNavigationContent,
  getSanityReviewsPage,
  getSanityServiceAreaHubMediaContent,
  getSanityServiceAreaLocationMedia,
  getSanityServiceCategoryPageMedia,
  getSanityServicePage,
  getSanityServicePageSlugs,
  getSanityServicesHubMediaContent,
  getSanityServiceSubPageMedia,
} from './sanity';
import { blogPosts as localBlogPosts } from '../../data/pages/blogPosts';
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
    console.warn('Sanity homepage media unavailable; using local photo fallback.', error);
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
    console.warn('Sanity about page media unavailable; using fallback images.', error);
    return null;
  }
}

export async function getAudiencePageMedia(path: string): Promise<AudiencePageMediaContent | null> {
  try {
    return await getSanityAudiencePageMedia(path);
  } catch (error) {
    console.warn(`Sanity audience page media unavailable for "${path}"; using fallback images.`, error);
    return null;
  }
}

export async function getCommercialAudienceSubPageMedia(
  path: string
): Promise<CommercialAudienceSubPageMediaContent | null> {
  try {
    return await getSanityCommercialAudienceSubPageMedia(path);
  } catch (error) {
    console.warn(`Sanity commercial audience sub-page media unavailable for "${path}"; using fallback images.`, error);
    return null;
  }
}

export async function getServiceAreaHubMediaContent(): Promise<ServiceAreaHubMediaContent | null> {
  try {
    return await getSanityServiceAreaHubMediaContent();
  } catch (error) {
    console.warn('Sanity service area hub media unavailable; using fallback images.', error);
    return null;
  }
}

export async function getServiceAreaLocationMedia(path: string): Promise<ServiceAreaLocationMediaContent | null> {
  try {
    return await getSanityServiceAreaLocationMedia(path);
  } catch (error) {
    console.warn(`Sanity service area location media unavailable for "${path}"; using fallback images.`, error);
    return null;
  }
}

export async function getServiceCategoryPageMedia(path: string): Promise<ServiceCategoryPageMediaContent | null> {
  try {
    return await getSanityServiceCategoryPageMedia(path);
  } catch (error) {
    console.warn(`Sanity service category media unavailable for "${path}"; using fallback images.`, error);
    return null;
  }
}

export async function getServiceSubPageMedia(path: string): Promise<ServiceSubPageMediaContent | null> {
  try {
    return await getSanityServiceSubPageMedia(path);
  } catch (error) {
    console.warn(`Sanity service sub-page media unavailable for "${path}"; using fallback image.`, error);
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

export async function getNavigationContent(): Promise<NavigationContent> {
  try {
    const nav = await getSanityNavigationContent();
    if (nav?.header && nav?.footer) {
      return hidePagesFromUi(ensureLegalFooterLinks(nav));
    }
  } catch (error) {
    console.warn('Sanity navigation unavailable; using local fallback.', error);
  }
  return hidePagesFromUi(ensureLegalFooterLinks(navigationData));
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
  const [sanitySlugs, localSlugs] = await Promise.all([
    getSanityBlogPostSlugs().catch(() => [] as string[]),
    Promise.resolve(localBlogPosts.map((post) => post.slug)),
  ]);
  return [...new Set([...localSlugs, ...sanitySlugs])];
}

const STATIC_PATHS = ['/', '/blog', '/reviews', '/privacy-policy', '/terms', '/accessibility', '/contact'];

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

function overlayCmsFields(local: BlogPost, sanity: BlogPost): BlogPost {
  return {
    ...local,
    title: sanity.title || local.title,
    excerpt: sanity.excerpt || local.excerpt,
    publishDate: sanity.publishDate || local.publishDate,
    author: sanity.author || local.author,
    image: sanity.image?.src ? sanity.image : local.image,
    relatedPages: sanity.relatedPages.length ? sanity.relatedPages : local.relatedPages,
    contentBlocks: sanity.contentBlocks?.length ? sanity.contentBlocks : local.contentBlocks,
  };
}

function mergeBlogPosts(sanityPosts: BlogPost[], localPosts: BlogPost[]): BlogPost[] {
  const localBySlug = new Map(localPosts.map((post) => [post.slug, post]));
  const sanityBySlug = new Map(sanityPosts.map((post) => [post.slug, post]));
  const slugs = new Set([...localBySlug.keys(), ...sanityBySlug.keys()]);

  return [...slugs]
    .map((slug) => {
      const sanity = sanityBySlug.get(slug);
      const local = localBySlug.get(slug);
      if (sanity && local) return overlayCmsFields(local, sanity);
      return (sanity ?? local)!;
    })
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getSanityBlogPosts();
    if (posts.length) return mergeBlogPosts(posts, localBlogPosts);
  } catch (error) {
    console.warn('Sanity blog posts unavailable; using local articles.', error);
  }
  return [...localBlogPosts].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const local = localBlogPosts.find((post) => post.slug === slug);
  let sanity: BlogPost | undefined;
  try {
    sanity = (await getSanityBlogPost(slug)) ?? undefined;
  } catch (error) {
    console.warn(`Sanity blog post "${slug}" unavailable; checking local articles.`, error);
  }

  if (sanity && local) return overlayCmsFields(local, sanity);
  return sanity ?? local;
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

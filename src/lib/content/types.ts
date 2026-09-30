// ─── Shared primitives ────────────────────────────────────────────────────────

export interface ContentImage {
  src: string;
  alt: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavSubLink {
  text: string;
  href: string;
  /** Optional grandchildren — renders a right-side flyout on desktop, nested accordion on mobile. */
  links?: Array<{ text: string; href: string }>;
}

export interface NavColumn {
  title: string;
  links: NavSubLink[];
}

export interface NavLink {
  text: string;
  href?: string;
  links?: NavSubLink[];
  columns?: NavColumn[];
}

export interface NavPhone {
  text: string;
  href: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  ariaLabel: string;
  icon: string;
  href: string;
}

export interface NavigationContent {
  header: {
    links: NavLink[];
    actions: { variant?: string; text?: string; href?: string }[];
    phone?: NavPhone;
  };
  footer: {
    links: FooterColumn[];
    secondaryLinks: FooterLink[];
    socialLinks: SocialLink[];
    footNote: string;
  };
}

export interface FooterMediaContent {
  backgroundImage?: ContentImage;
}

// ─── Homepage section types ───────────────────────────────────────────────────

export interface StatItem {
  stat: string;
  label: string;
}

export interface InfoCardItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export interface TimelineStep {
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Full homepage content ─────────────────────────────────────────────────────

export interface HomePageContent {
  meta: {
    title: string;
    description: string;
  };

  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitleParagraph1: string;
    ctaText: string;
    ctaHref: string;
    phoneCtaText?: string;
    phoneCtaHref?: string;
    heroImage: ContentImage;
    heroImageMobile?: ContentImage;
  };

  statsBar: StatItem[];

  whyInspect: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    ctaText: string;
    ctaHref: string;
    image: ContentImage;
  };

  servicesSection: {
    title: string;
    subtitle: string;
    services: ServiceItem[];
  };

  faqs: {
    title: string;
    items: FAQItem[];
  };

  ctaBanner: {
    title: string;
    subtitle: string;
    ctaText?: string;
    ctaHref?: string;
    showAfterHoursNote: boolean;
  };
}

export interface HomeMediaCard {
  title?: string;
  href?: string;
  image?: ContentImage;
}

export interface HomeMediaContent {
  heroImage?: ContentImage;
  heroImageMobile?: ContentImage;
  audienceCards: HomeMediaCard[];
  bannerImage?: ContentImage;
}

export interface ServicesHubMediaContent {
  heroImage?: ContentImage;
  audienceCards: HomeMediaCard[];
}

export interface AudiencePageMediaContent {
  title?: string;
  path: string;
  heroImage?: ContentImage;
  introImage?: ContentImage;
  projectImage?: ContentImage;
}

export interface CommercialAudienceSubPageMediaContent {
  title?: string;
  path: string;
  heroImage?: ContentImage;
  introImage?: ContentImage;
}

export interface AboutPageMediaContent {
  heroImage?: ContentImage;
  legacyImage?: ContentImage;
  siaosiImage?: ContentImage;
}

export interface ContactPageMediaContent {
  heroImage?: ContentImage;
}

export interface ServiceAreaHubMediaContent {
  heroImage?: ContentImage;
  introImage?: ContentImage;
}

export interface ServiceAreaLocationMediaContent {
  title?: string;
  path: string;
  heroImage?: ContentImage;
  introImage?: ContentImage;
  recentWorkImage?: ContentImage;
}

export interface ServiceCategoryPageMediaContent {
  title?: string;
  path: string;
  heroImage?: ContentImage;
  introImage?: ContentImage;
  projectImage?: ContentImage;
}

export interface ServiceSubPageMediaContent {
  title?: string;
  path: string;
  heroImage?: ContentImage;
}

// ─── Shared CMS sections (service pages and later templates) ───────────────────

export interface LinkedCardItem {
  title: string;
  description: string;
  href: string;
  linkText: string;
}

export interface PageHero {
  title: string;
  visualSubheading?: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  phoneCtaText?: string;
  phoneCtaHref?: string;
  image?: ContentImage;
  imageMobile?: ContentImage;
  imagePlaceholder?: string;
}

export interface CtaBannerContent {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  showAfterHoursNote?: boolean;
  extraLines?: string[];
  license?: string;
}

export interface IconPointsSection {
  _type: 'iconPointsSection';
  heading: string;
  intro?: string;
  layout?: 'auto' | 'grid' | 'band';
  items: InfoCardItem[];
}

export interface TimelineSection {
  _type: 'timelineSection';
  heading: string;
  intro?: string;
  steps: TimelineStep[];
}

export interface LinkedCardsSection {
  _type: 'linkedCardsSection';
  heading: string;
  intro?: string;
  display?: 'cards' | 'directory';
  items: LinkedCardItem[];
}

export interface InfoCardsSection {
  _type: 'infoCardsSection';
  heading: string;
  intro?: string;
  items: InfoCardItem[];
}

export interface EditorialSection {
  _type: 'editorialSection';
  heading: string;
  paragraphs: string[];
}

export interface ComparisonRow {
  feature: string;
  cell1: string;
  cell2: string;
  cell3?: string;
}

export interface ComparisonTableSection {
  _type: 'comparisonTableSection';
  heading: string;
  intro?: string;
  featureLabel: string;
  column1: string;
  column2: string;
  column3?: string;
  rows: ComparisonRow[];
}

export interface BulletCardItem {
  title: string;
  items: string[];
}

export interface BulletCardsSection {
  _type: 'bulletCardsSection';
  heading: string;
  intro?: string;
  items: BulletCardItem[];
}

export interface ChecklistSection {
  _type: 'checklistSection';
  heading: string;
  intro?: string;
  items: Array<{ text: string }>;
}

export interface YelpReviewItem {
  name: string;
  reviewId: string;
  userId: string;
}

export interface YelpReviewsSection {
  _type: 'yelpReviewsSection';
  heading: string;
  intro?: string;
  items?: YelpReviewItem[];
}

export interface LiveReviewsSection {
  _type: 'liveReviewsSection';
  heading: string;
  intro?: string;
  sources?: 'both' | 'google' | 'yelp';
}

export interface SplitContentSection {
  _type: 'splitContentSection';
  heading: string;
  paragraphs: string[];
  ctaText?: string;
  ctaHref?: string;
  linkText?: string;
  linkHref?: string;
  image?: ContentImage;
  imagePlaceholder?: string;
  isReversed?: boolean;
}

export interface QuoteCardItem {
  name: string;
  quote: string;
}

export interface QuoteCardsSection {
  _type: 'quoteCardsSection';
  heading: string;
  intro?: string;
  items: QuoteCardItem[];
}

export interface PageFaqs {
  title: string;
  items: Array<{ title: string; description: string }>;
}

export type ServiceSection = (
  | IconPointsSection
  | TimelineSection
  | LinkedCardsSection
  | InfoCardsSection
  | EditorialSection
  | ComparisonTableSection
  | BulletCardsSection
  | ChecklistSection
  | YelpReviewsSection
  | LiveReviewsSection
  | SplitContentSection
  | QuoteCardsSection
) & { surface?: 'white' | 'grey' | 'dark' };

export interface ServicePageContent {
  title: string;
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  hero: PageHero;
  sections: ServiceSection[];
  faqs?: PageFaqs;
  ctaBanner: CtaBannerContent;
}

export interface FormHelpOption {
  label: string;
  value: string;
}

export interface ContactLinkItem {
  text: string;
  href: string;
}

export interface ContactPageContent {
  meta: {
    title: string;
    description: string;
  };
  hero: PageHero;
  form: {
    heading: string;
    intro?: string;
    topicLabel?: string;
    topicPlaceholder?: string;
    helpOptions: FormHelpOption[];
    messageLabel?: string;
    submitLabel?: string;
    mapHeading?: string;
    addressLine1?: string;
    addressLine2?: string;
    mapsQuery?: string;
    directionsLabel?: string;
  };
  touchpoints: {
    heading: string;
    items: InfoCardItem[];
    links?: ContactLinkItem[];
  };
  unsureSection: SplitContentSection;
  reasons: LinkedCardsSection;
  ctaBanner: CtaBannerContent;
}

export interface ReviewPlatformItem {
  title: string;
  ratingNote: string;
  href: string;
  linkText: string;
  icon?: string;
}

export interface ReviewsPageContent {
  meta: {
    title: string;
    description: string;
  };
  hero: PageHero;
  liveReviews: {
    heading: string;
    intro?: string;
  };
  platforms: {
    heading: string;
    intro?: string;
    items: ReviewPlatformItem[];
  };
  gallerySection: SplitContentSection & {
    previewImages?: ContentImage[];
  };
  ctaBanner: CtaBannerContent;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  author?: string;
  category?: string;
  tags?: string[];
  image?: ContentImage;
  imagePlaceholder?: string;
  meta: {
    title: string;
    description: string;
  };
  /** Page paths (no leading slash) where this post should appear in Related blogs. */
  relatedPages: string[];
  heroParagraphs: string[];
  sections: ServiceSection[];
  ctaBanner: CtaBannerContent;
  /** Fallback plain paragraphs when a CMS post has no structured sections. */
  body: string[];
  /** Article body in document order, including inline images from Sanity. */
  contentBlocks?: BlogContentBlock[];
}

export type BlogContentBlock =
  | BlogContentParagraph
  | BlogContentHeading
  | BlogContentImage
  | BlogContentList
  | BlogContentTable
  | BlogContentCallout;

export interface BlogContentParagraph {
  _type: 'paragraph';
  _key: string;
  /** Plain text — used for excerpts, lead paragraphs, and TOC. */
  text: string;
  /** HTML string with inline formatting (bold, italic, links). Use set:html to render. */
  html: string;
  quote?: boolean;
}

export interface BlogContentHeading {
  _type: 'heading';
  _key: string;
  level: 2 | 3;
  text: string;
}

export interface BlogContentImage {
  _type: 'image';
  _key: string;
  image: ContentImage;
  caption?: string;
}

export interface BlogContentList {
  _type: 'list';
  _key: string;
  listType: 'bullet' | 'number';
  items: BlogContentListItem[];
}

export interface BlogContentListItem {
  _key: string;
  /** HTML string with inline formatting. Use set:html to render. */
  html: string;
  level: number;
}

export interface BlogContentTable {
  _type: 'table';
  _key: string;
  caption?: string;
  headerRow: string[];
  rows: { _key: string; cells: string[] }[];
}

export interface BlogContentCallout {
  _type: 'callout';
  _key: string;
  calloutType: 'tip' | 'info' | 'warning' | 'note';
  text: string;
}

// ─── Books ────────────────────────────────────────────────────────────────────

export type BookSeries = 'textbook' | 'guidebook' | 'bargaining';

export interface BookCta {
  _key?: string;
  label: string;
  href: string;
}

export interface Book {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: ContentImage;
  badges: string[];
  publisherName?: string;
  publisherYear?: number;
  publisherNote?: string;
  ctas: BookCta[];
  podcastHref?: string;
  series: BookSeries;
  order: number;
}

// ─── Podcast ──────────────────────────────────────────────────────────────────

export type PodcastEpisodeStatus = 'live' | 'coming-soon';

export interface PodcastEpisode {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  status: PodcastEpisodeStatus;
  order: number;
  part: number;
  partName: string;
  partDescription?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  guidebookHref?: string;
}

/** Episodes grouped by part number (1–5). */
export type PodcastPartGroup = {
  part: number;
  partName: string;
  partDescription?: string;
  episodes: PodcastEpisode[];
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export type ReviewPlatform = 'google' | 'yelp' | 'thumbtack';

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  age?: number;
  location?: string;
  tenure?: string;
  platform?: ReviewPlatform;
  reviewedAt?: string;
  order: number;
}

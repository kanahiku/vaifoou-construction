// ─── Shared primitives ────────────────────────────────────────────────────────

export interface ContentImage {
  src: string;
  alt: string;
}

export interface ProjectTag {
  label: string;
  href?: string;
}

export interface ProjectCardContent {
  _id: string;
  title: string;
  description: string;
  location?: string;
  tags: ProjectTag[];
  beforeImage?: ContentImage;
  afterImage?: ContentImage;
  galleryImages: ContentImage[];
  beforeLabel?: string;
  afterLabel?: string;
  order: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavSubLink {
  text: string;
  href?: string;
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
  href?: string;
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
    topBar?: { items: string[]; note?: string };
  };
  footer: {
    licensedLine?: string;
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

// ─── Homepage content (Sanity `homePage`, section by section) ──────────────────

export type HomeServiceIcon = 'rock-wall' | 'retaining-wall' | 'walls' | 'hammer';

export interface HomeAudienceCard {
  label: string;
  title: string;
  ctaLabel: string;
  href: string;
  image?: ContentImage;
}

export interface HomeServiceCard {
  title: string;
  icon: HomeServiceIcon;
  description: string;
  ctaLabel: string;
  href: string;
}

export interface HomeLink {
  label: string;
  href: string;
}

export interface HomePageContent {
  seo: { title: string; description: string };
  hero: {
    heading: string;
    subheading: string;
    /** Empty → sitewide primary CTA from `src/config/cta.ts`. */
    ctaLabel?: string;
    ctaHref?: string;
    trustBadges: string[];
    image?: ContentImage;
    imageMobile?: ContentImage;
  };
  intro: {
    heading: string;
    body: string;
    audienceCards: HomeAudienceCard[];
  };
  services: { heading: string; items: HomeServiceCard[] };
  highlightBanner: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    image?: ContentImage;
  };
  serviceAreas: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    areas: HomeLink[];
  };
  reviews: { heading: string; count: number; ctaLabel: string; ctaHref: string };
  cta: { heading: string; note: string };
}

export interface HomeMediaCard {
  title?: string;
  href?: string;
  image?: ContentImage;
}

export interface AboutPageContent {
  seo: { title: string; description: string };
  hero: { heading: string; body: string; image?: ContentImage };
  story: { heading: string; body: string };
  legacy: {
    heading: string;
    paragraphs: string[];
    timeline: Array<{ year: string; label: string }>;
    image?: ContentImage;
  };
  values: { heading: string; body: string; items: Array<{ label: string; body: string }> };
  crew: { heading: string; body: string; members: Array<{ name: string; role: string }> };
  cta: { heading: string; note?: string };
}

export interface ContactPageMediaContent {
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
  metaTitle?: string;
  metaDescription?: string;
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
  | BlogContentCallout
  | BlogContentButton
  | BlogContentFaq;

export interface BlogContentButton {
  _type: 'button';
  _key: string;
  text: string;
  href: string;
  variant?: 'ghost-light' | 'primary';
}

export interface BlogContentFaqItem {
  _key?: string;
  question: string;
  answer: string;
}

export interface BlogContentFaq {
  _type: 'faq';
  _key: string;
  items: BlogContentFaqItem[];
}

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

// ─── Service pages (Sanity: servicesHubPage, serviceCategoryPage, serviceSubPage) ───

export interface ServiceTitledItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceFaqEntry {
  question: string;
  answer: string;
}

export interface ServiceLinkEntry {
  title: string;
  href: string;
}

export interface ServicesHubContent {
  seo: { title: string; description: string };
  hero: { heading: string; subheading: string; image?: ContentImage };
  intro: { heading: string; body: string; audienceCards: HomeAudienceCard[] };
  capabilities: { heading: string; items: HomeServiceCard[] };
  scope: { heading: string; buildLabel: string; notCoverLabel: string; rows: Array<{ build: string; notCover: string }> };
  cta: { heading: string; note: string };
}

export interface ServiceCategoryPageContent {
  path: string;
  seo: { title: string; description: string };
  hero: { heading: string; subheading: string; image?: ContentImage };
  intro: { heading: string; body: string; image?: ContentImage };
  subServices: {
    heading: string;
    columns: 2 | 3 | 4;
    cards: Array<{ title: string; description: string; href?: string; ctaLabel?: string }>;
  };
  projects: { heading: string; body: string; ctaLabel: string; ctaHref: string; image?: ContentImage };
  process: { heading: string; steps: ServiceTitledItem[] };
  faqs: { heading: string; items: ServiceFaqEntry[] };
  related: { heading: string; links: ServiceLinkEntry[] };
  cta: { heading: string; note: string };
}

export interface ServiceSubPageContent {
  path: string;
  seo: { title: string; description: string };
  hero: { heading: string; body: string; image?: ContentImage };
  process: { heading: string; items: ServiceTitledItem[] };
  materials: { heading: string; items: ServiceTitledItem[] };
  comparison: {
    eyebrow?: string;
    heading: string;
    note?: string;
    col1: string;
    col2?: string;
    rows: Array<{ feature: string; val1: string; val2?: string }>;
    footerText?: string;
    footerLinkLabel?: string;
    footerLinkHref?: string;
  };
  applications: { heading: string; items: ServiceTitledItem[] };
  related: { categoryLabel: string; links: ServiceLinkEntry[] };
  faqs: { heading: string; items: ServiceFaqEntry[] };
  cta: { heading: string; note: string };
}

// ─── Service areas (Sanity: serviceAreasHubPage, serviceAreaPage) ──────────────────

export interface ServiceAreaListItem {
  name: string;
  path: string;
}

export interface ServiceAreasHubContent {
  seo: { title: string; description: string };
  hero: { heading: string; subheading: string; image?: ContentImage };
  intro: { heading: string; body: string; image?: ContentImage };
  communities: { heading: string; body: string; cardLabel: string; areas: ServiceAreaListItem[] };
  faqs: { heading: string; items: ServiceFaqEntry[] };
  cta: { heading: string; note?: string };
}

export interface ServiceAreaPageContent {
  path: string;
  name: string;
  seo: { title: string; description: string };
  hero: { heading: string; body: string; image?: ContentImage };
  intro: { heading: string; body: string; image?: ContentImage };
  services: { heading: string; cards: Array<{ name: string; href: string; description: string }> };
  projects: { heading: string; body: string; ctaLabel: string; ctaHref: string; image?: ContentImage };
  faqs: { heading: string; items: ServiceFaqEntry[] };
  cta: { heading: string; note?: string };
  /** Every other area, in order — for the cross-link grid. */
  otherAreas: ServiceAreaListItem[];
}

// ─── Listing pages (reviews / projects / blog) and legal pages ───────────────

export interface ReviewsPageContent {
  seo: { title: string; description: string };
  hero: { heading: string; body: string; image?: ContentImage };
  featured: {
    heading: string;
    body: string;
    emptyTitle: string;
    emptyBody: string;
    extraReviews: Array<{
      quote: string;
      name: string;
      platform?: 'google' | 'yelp' | 'thumbtack';
      reviewedAt?: string;
    }>;
  };
  profiles: { heading: string; body: string };
  cta: { heading: string; note?: string };
}

export interface ProjectsPageContent {
  seo: { title: string; description: string };
  hero: { heading: string; body: string; image?: ContentImage };
  filters: {
    heading: string;
    body: string;
    locationLabel: string;
    allLocationsLabel: string;
    serviceLabel: string;
    allServicesLabel: string;
    resetLabel: string;
    emptyText: string;
  };
  services: {
    heading: string;
    cards: Array<{ title: string; description: string; href: string; ctaLabel: string; icon: string }>;
  };
  cta: { heading: string; note?: string };
}

export interface BlogPageContent {
  seo: { title: string; description: string };
  hero: { heading: string };
  empty: { title: string; body: string };
  cta: { heading: string; note?: string };
}

export interface LegalPageContent {
  path: string;
  seo: { title: string; description: string };
  heading: string;
  /** Pre-rendered, escaped HTML paragraphs (tokens already replaced). */
  intro: string[];
  sections: Array<{ heading: string; body: string[] }>;
  cta: { heading: string; note?: string };
}

// ─── Who we work with ────────────────────────────────────────────────────────

export interface AudienceListItem {
  name: string;
  path: string;
}

export interface AudienceLandingPageContent {
  path: string;
  seo: { title: string; description: string };
  hero: { heading: string; body: string; image?: ContentImage };
  intro: {
    heading: string;
    body: string;
    crossPrompt?: string;
    crossLabel?: string;
    crossHref?: string;
    image?: ContentImage;
  };
  services: { heading: string; cards: Array<{ name: string; href: string; description: string }> };
  experience: { heading: string; items: Array<{ heading: string; body: string }> };
  work?: { heading: string; body: string; ctaLabel: string; ctaHref: string; image?: ContentImage };
  subPages?: { categoryLabel: string; viewAllLabel?: string; viewAllHref?: string; items: AudienceListItem[] };
  faqs: { heading: string; items: ServiceFaqEntry[] };
  cta: { heading: string; note?: string };
}

export interface AudienceSubPageContent {
  path: string;
  name: string;
  seo: { title: string; description: string };
  hero: { heading: string; body: string; image?: ContentImage };
  intro: { heading: string; body: string; image?: ContentImage };
  comparison: {
    heading: string;
    col1: string;
    col2?: string;
    rows: Array<{ feature: string; val1: string; val2?: string }>;
  };
  related: { categoryLabel: string; viewAllLabel?: string; viewAllHref?: string; items: AudienceListItem[] };
  faqs: { heading: string; items: ServiceFaqEntry[] };
  cta: { heading: string; note?: string };
}

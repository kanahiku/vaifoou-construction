export type SchemaType =
  | 'Service'
  | 'WebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'CollectionPage'
  | 'BlogPosting'
  | 'FAQOnly';

export interface FaqItem {
  q: string;
  a: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface Credential {
  '@type': 'EducationalOccupationalCredential';
  credentialCategory: string;
  name: string;
  recognizedBy?: {
    '@type': 'Organization';
    name: string;
  };
}

export interface AreaServed {
  '@type': 'AdministrativeArea';
  name: string;
}

export interface BusinessSchema {
  /** Fragment used in the business @id, e.g. "organization". */
  idFragment: string;
  name: string;
  businessType: string;
  telephone: string;
  email: string;
  priceRange: string;
  address: PostalAddress;
  description: string;
  openingHoursSpecification?: OpeningHoursSpecification[] | null;
  hasCredential?: Credential[] | null;
  memberOf?: { '@type': 'Organization'; name: string } | null;
  award?: string[] | null;
  sameAs?: string[] | null;
  areaServed?: AreaServed | AreaServed[] | null;
  logo?: string | null;
  geo?: { latitude: number; longitude: number } | null;
  hasMap?: string | null;
}

export interface PageSchema {
  name: string;
  path: string;
  schemaType: SchemaType;
  serviceType?: string;
  description?: string | null;
  faq?: FaqItem[] | null;
  breadcrumb: BreadcrumbItem[];
  /** BlogPosting only. */
  article?: ArticleInfo;
  /** Service area pages: the locality the service page is about. */
  areaName?: string;
}

export interface ArticleInfo {
  datePublished?: string;
  dateModified?: string;
  author?: string;
  image?: string;
}

/** Per-request context handed to the JSON-LD builder (from Layout). */
export interface JsonLdContext {
  title?: string;
  description?: string;
  article?: ArticleInfo;
  /** Sanity `seo` object for this page: custom schema + mode. */
  schemaMode?: 'auto' | 'append' | 'replace';
  schemaOverride?: string;
  /** Sanity Site Settings → LocalBusiness overrides. */
  business?: Partial<BusinessSchema>;
}

export type JsonLdNode = Record<string, unknown>;

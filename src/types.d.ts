import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { HTMLAttributes, ImageMetadata } from 'astro/types';

export interface Post {
  /** Unique ID identifying the post. */
  id: string;
  /** URL-friendly slug derived from the post name. */
  slug: string;
  /** Fully resolved permalink, computed from the configured pattern. */
  permalink: string;

  publishDate: Date;
  updateDate?: Date;

  title: string;
  /** Optional summary of post content. */
  excerpt?: string;
  image?: ImageMetadata | string;

  category?: Taxonomy;
  tags?: Taxonomy[];
  author?: string;

  metadata?: MetaData;

  draft?: boolean;

  /** Rendered Astro component factory for the post body. */
  Content?: AstroComponentFactory;

  /** Estimated reading time in minutes. */
  readingTime?: number;
}

export interface Taxonomy {
  slug: string;
  title: string;
}

export interface MetaData {
  title?: string;
  ignoreTitleTemplate?: boolean;

  canonical?: string;

  robots?: MetaDataRobots;

  description?: string;

  openGraph?: MetaDataOpenGraph;
  twitter?: MetaDataTwitter;
}

export interface MetaDataRobots {
  index?: boolean;
  follow?: boolean;
}

export interface MetaDataImage {
  url: string;
  width?: number;
  height?: number;
}

export interface MetaDataOpenGraph {
  url?: string;
  siteName?: string;
  images?: Array<MetaDataImage>;
  locale?: string;
  type?: string;
}

export interface MetaDataTwitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

export interface Image {
  src: string;
  alt?: string;
}

export interface Widget {
  id?: string;
  isDark?: boolean;
  bg?: string;
  animate?: boolean;
  classes?: Record<string, string | Record<string, string>>;
}

export interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
  classes?: Record<string, string>;
}

export interface Item {
  title?: string;
  description?: string;
  icon?: string;
  classes?: Record<string, string>;
  callToAction?: CallToAction;
  image?: Image;
}

// COMPONENTS
export interface CallToAction extends Omit<HTMLAttributes<'a'>, 'slot'> {
  variant?: 'primary' | 'ghost' | 'secondary' | 'tertiary' | 'ghost-light' | 'ghost-dark' | 'link';
  text?: string;
  icon?: string;
  classes?: Record<string, string>;
  type?: 'button' | 'submit' | 'reset';
  /** Hide the inspection/estimate line. Use in the header and other compact chrome. */
  hideNote?: boolean;
  /** Color for the primary-CTA micro-copy. Default follows light sections + `.dark`. */
  noteTone?: 'light' | 'onDark' | 'cta';
}

export interface Collapse {
  iconUp?: string;
  iconDown?: string;
  items?: Array<Item>;
  columns?: number;
  classes?: Record<string, string>;
}

export interface HeroWord {
  text: string;
  italic?: boolean;
  /** Vertical alignment in the words-row hero (Figma Peak / Slope / Floor). */
  align?: 'start' | 'center' | 'end';
}

// WIDGETS
export interface Hero extends Omit<Headline, 'classes'>, Omit<Widget, 'isDark' | 'classes'> {
  content?: string;
  actions?: string | CallToAction[];
  image?: string | unknown;
  /** Optional phone-only crop. Falls back to `image` below the `md` breakpoint. */
  imageMobile?: string | unknown;
  /** `split` = text + side image. `overlay` = photo + headline/CTAs. `words` = photo + three positioned words. `page` = light gradient + title left / lede right. `title` = photo + centered h1 (Figma 64:935 Chapters). */
  variant?: 'split' | 'overlay' | 'words' | 'page' | 'title' | 'split-dark';
  /** Three-word overlay hero (e.g. Peak. Slope. Floor.). Used when `variant="words"`. */
  words?: HeroWord[];
  /** Image on the left when `variant="split"`. Default is image right. */
  isReversed?: boolean;
  /** Pull hero under the sticky header. Disable when another block sits above the hero. */
  overlapHeader?: boolean;
  /** `variant="page"` only — stack title and subtitle vertically (flex-col) instead of side-by-side. Figma node 121:15 Books hero. */
  stacked?: boolean;
  /** `variant="page"` only — full-width 1200×400 image under the title/lede (Figma 176:115). Pass `image` for the photo; otherwise a grey placeholder. */
  withImage?: boolean;
  /** `variant="split-dark"` only — omit the side image column for text-only heroes. */
  hideImage?: boolean;
}

export interface Faqs extends Omit<Headline, 'classes'>, Widget {
  items?: Array<Item>;
  columns?: number;
}

export interface Content extends Omit<Headline, 'classes'>, Widget {
  content?: string;
  image?: string | unknown;
  items?: Array<Item>;
  columns?: number;
  isReversed?: boolean;
  isAfterContent?: boolean;
  /** `bleed` = full-height photo column (P-03 default). `framed` = inset square for grids. */
  imageFit?: 'bleed' | 'framed';
  callToAction?: CallToAction;
}

// Singletons
import { siteNavigation } from './singletons/navigation';
import { siteFooter } from './singletons/footer';
import { blogPost } from './documents/blogPost';
import { testimonial } from './documents/testimonial';

// Navigation objects
import { navLink, navSubLink } from './objects/navLink';
import { footerColumn, footerLink, socialLink } from './objects/footerColumn';

// Shared item objects
import {
  statItem,
  infoCardItem,
  serviceItem,
  timelineStep,
  faqItem,
} from './objects/homeObjects';

// Shared section objects (reused across page templates)
import {
  linkedCard,
  pageHero,
  ctaBanner,
  iconPointsSection,
  timelineSection,
  linkedCardsSection,
  infoCardsSection,
  editorialSection,
  comparisonRow,
  comparisonTableSection,
  bulletCardItem,
  bulletCardsSection,
  checklistItem,
  checklistSection,
  yelpReviewItem,
  yelpReviewsSection,
  liveReviewsSection,
  splitContentSection,
  quoteCardItem,
  quoteCardsSection,
  faqsSection,
  formHelpOption,
  contactLink,
  reviewPlatformItem,
  previewImageItem,
} from './objects/sectionObjects';

export const schemaTypes = [
  // Documents
  siteNavigation,
  siteFooter,
  blogPost,
  testimonial,

  // Objects — nav
  navLink,
  navSubLink,

  // Objects — footer
  footerColumn,
  footerLink,
  socialLink,

  // Objects — items
  statItem,
  infoCardItem,
  serviceItem,
  timelineStep,
  faqItem,
  linkedCard,
  quoteCardItem,

  // Objects — page sections
  pageHero,
  ctaBanner,
  iconPointsSection,
  timelineSection,
  linkedCardsSection,
  infoCardsSection,
  editorialSection,
  comparisonRow,
  comparisonTableSection,
  bulletCardItem,
  bulletCardsSection,
  checklistItem,
  checklistSection,
  yelpReviewItem,
  yelpReviewsSection,
  liveReviewsSection,
  splitContentSection,
  quoteCardsSection,
  faqsSection,
  formHelpOption,
  contactLink,
  reviewPlatformItem,
  previewImageItem,
];

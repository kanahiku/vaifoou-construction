// Singletons
import { siteNavigation } from './singletons/navigation';
import { siteFooter } from './singletons/footer';
import { homePage, homeAudienceCard } from './documents/homePage';
import { aboutPageMedia } from './documents/aboutPageMedia';
import { contactPageMedia } from './documents/contactPageMedia';
import { projectsPageMedia } from './documents/projectsPageMedia';
import { reviewsPageMedia } from './documents/reviewsPageMedia';
import { servicesHubPage, servicesHubAudienceCard } from './documents/servicesHubPage';
import { audiencePageMedia } from './documents/audiencePageMedia';
import { commercialAudienceSubPageMedia } from './documents/commercialAudienceSubPageMedia';
import { serviceCategoryPageMedia } from './documents/serviceCategoryPageMedia';
import { concreteServiceSubPageMedia, rockWallSubPageMedia } from './documents/serviceSubPageMedia';
import { serviceAreaHubPageMedia } from './documents/serviceAreaHubPageMedia';
import { serviceAreaLocationPageMedia } from './documents/serviceAreaLocationPageMedia';
import { blogPost } from './documents/blogPost';
import { testimonial } from './documents/testimonial';
import { project, projectTag } from './documents/project';

// Navigation objects
import { navLink, navSubLink } from './objects/navLink';
import { footerColumn, footerLink, socialLink } from './objects/footerColumn';

// Shared item objects
import { statItem, infoCardItem, serviceItem, timelineStep, faqItem } from './objects/homeObjects';

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
  homePage,
  aboutPageMedia,
  contactPageMedia,
  projectsPageMedia,
  reviewsPageMedia,
  servicesHubPage,
  audiencePageMedia,
  commercialAudienceSubPageMedia,
  serviceCategoryPageMedia,
  rockWallSubPageMedia,
  concreteServiceSubPageMedia,
  serviceAreaHubPageMedia,
  serviceAreaLocationPageMedia,
  project,
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
  homeAudienceCard,
  servicesHubAudienceCard,
  projectTag,
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

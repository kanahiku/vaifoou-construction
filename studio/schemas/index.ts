// Singletons
import { siteNavigation } from './singletons/navigation';
import { siteFooter } from './singletons/footer';
import { homePage, homeAudienceCard, homeServiceCard, homeServiceArea } from './documents/homePage';
import { reviewsPage, projectsPage, blogPage } from './documents/listingPages';
import { legalPage } from './documents/legalPage';
import { audienceLandingPage, audienceSubPage, audienceCard, audiencePoint } from './documents/audiencePages';
import { aboutPage } from './documents/aboutPage';
import { contactPageMedia } from './documents/contactPageMedia';
import { servicesHubPage, servicesHubAudienceCard, servicesHubScopeRow } from './documents/servicesHubPage';
import {
  serviceCategoryPage,
  serviceSubPage,
  serviceTitledItem,
  serviceFaq,
  serviceLinkItem,
  serviceCategoryCard,
  serviceTableRow,
} from './documents/servicePages';
import { serviceAreasHubPage, serviceAreaPage, serviceAreaCard } from './documents/serviceAreaPages';
import { blogPost } from './documents/blogPost';
import { testimonial } from './documents/testimonial';
import { project, projectTag } from './documents/project';

// Navigation objects
import { navLink, navGroup, navSubLink } from './objects/navLink';
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
  aboutPage,
  audienceLandingPage,
  audienceSubPage,
  audienceCard,
  audiencePoint,
  reviewsPage,
  projectsPage,
  blogPage,
  legalPage,
  contactPageMedia,
  servicesHubPage,
  serviceCategoryPage,
  serviceSubPage,
  serviceAreasHubPage,
  serviceAreaPage,
  project,
  blogPost,
  testimonial,

  // Objects — nav
  navLink,
  navGroup,
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
  homeServiceCard,
  homeServiceArea,
  servicesHubAudienceCard,
  servicesHubScopeRow,
  serviceTitledItem,
  serviceFaq,
  serviceLinkItem,
  serviceCategoryCard,
  serviceTableRow,
  serviceAreaCard,
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

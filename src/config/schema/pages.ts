import type { BreadcrumbItem, PageSchema } from './types';

const HOME: BreadcrumbItem = { name: 'Home', path: '/' };

/**
 * Per-page schema.org data. Add an entry when Figma MCP creates a new route.
 * System routes below ship with every site (contact, reviews, blog, legal).
 */
export const pages: PageSchema[] = [
  {
    name: 'Home',
    path: '/',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: [HOME],
  },
  {
    name: 'Contact',
    path: '/contact',
    schemaType: 'ContactPage',
    description: null,
    faq: [],
    breadcrumb: [HOME, { name: 'Contact', path: '/contact' }],
  },
  {
    name: 'Reviews',
    path: '/reviews',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: [HOME, { name: 'Reviews', path: '/reviews' }],
  },
  {
    name: 'Blog',
    path: '/blog',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: [HOME, { name: 'Blog', path: '/blog' }],
  },
  {
    name: 'Privacy Policy',
    path: '/privacy-policy',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: [HOME, { name: 'Privacy Policy', path: '/privacy-policy' }],
  },
  {
    name: 'Terms',
    path: '/terms',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: [HOME, { name: 'Terms', path: '/terms' }],
  },
  {
    name: 'Accessibility',
    path: '/accessibility',
    schemaType: 'WebPage',
    description: null,
    faq: [],
    breadcrumb: [HOME, { name: 'Accessibility', path: '/accessibility' }],
  },
];

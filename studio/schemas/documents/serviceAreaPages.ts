import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, link, longText, seoFields, text } from '../helpers';

/**
 * Service areas.
 *
 *  - `serviceAreasHubPage` — /service-areas/ (singleton `singleton-service-areas-hub`)
 *  - `serviceAreaPage`     — /service-areas/<slug>/ (one document per location)
 *
 * The hub's community grid and every page's "Explore Other Service Areas" links are built
 * automatically from the `serviceAreaPage` documents (ordered by `order`), so there is nothing
 * to keep in sync by hand.
 */

const section = (name: string, title: string, group: string, fields: any[]) =>
  defineField({ name, title, type: 'object', group, options: { collapsible: false }, fields });

const seoSection = () => section('seo', 'SEO', 'seo', seoFields());

const faqsSection = (group: string) =>
  section('faqs', 'FAQs', group, [
    text('heading', 'Heading (H2)', undefined, true),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [defineArrayMember({ type: 'serviceFaq' })],
    }),
  ]);

const ctaSection = () =>
  section('cta', 'Closing CTA', 'cta', [
    text('heading', 'Heading (H2)', undefined, true),
    longText('note', 'Supporting text', 3, 'Leave empty to use the default closing text.'),
  ]);

// ─── Hub ──────────────────────────────────────────────────────────────────────

export const serviceAreasHubPage = defineType({
  name: 'serviceAreasHubPage',
  title: 'Service Areas Hub',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'intro', title: '2 · Island-wide intro' },
    { name: 'communities', title: '3 · Communities' },
    { name: 'faqs', title: '4 · FAQs' },
    { name: 'cta', title: '5 · Closing CTA' },
  ],
  fields: [
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('subheading', 'Subheading', 3),
      imageWithAlt('image', 'Hero image', 'Full-width background image for /service-areas/.'),
    ]),
    section('intro', 'Island-wide intro', 'intro', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Body', 6),
      imageWithAlt('image', 'Intro image', 'Side image beside the intro text (4:3).'),
    ]),
    section('communities', 'Communities', 'communities', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Body', 3),
      text('cardLabel', 'Card link label', 'Shown under each community name, e.g. "View service area".'),
    ]),
    faqsSection('faqs'),
    ctaSection(),
  ],
  preview: {
    prepare() {
      return { title: 'Service Areas Hub', subtitle: '/service-areas/ — text and images' };
    },
  },
});

// ─── Location page ────────────────────────────────────────────────────────────

export const serviceAreaCard = defineType({
  name: 'serviceAreaCard',
  title: 'Service card',
  type: 'object',
  fields: [
    text('name', 'Title', undefined, true),
    link('href', 'Link'),
    longText('description', 'Description', 3),
  ],
  preview: { select: { title: 'name', subtitle: 'href' } },
});

export const serviceAreaPage = defineType({
  name: 'serviceAreaPage',
  title: 'Service area page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'intro', title: '2 · Intro' },
    { name: 'services', title: '3 · Services' },
    { name: 'projects', title: '4 · Projects teaser' },
    { name: 'faqs', title: '5 · FAQs' },
    { name: 'cta', title: '6 · Closing CTA' },
  ],
  fields: [
    defineField({
      name: 'path',
      title: 'Route path',
      type: 'string',
      description: 'Must match the page URL exactly, e.g. /service-areas/kailua/. Do not change for live pages.',
      validation: (r) => r.required().regex(/^\/service-areas\/[^/]+\/$/, { name: 'service area route' }),
    }),
    defineField({
      name: 'name',
      title: 'Area name',
      type: 'string',
      description: 'Used in the hub grid and the "Explore Other Service Areas" links on every area page.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Position in the hub grid and in cross-links (lowest first).',
      validation: (r) => r.required().integer().min(0),
    }),
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('body', 'Lead paragraph', 3),
      imageWithAlt('image', 'Hero image', 'Full-width background at the top of the page.'),
    ]),
    section('intro', 'Intro', 'intro', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Body', 6),
      imageWithAlt('image', 'Intro image', 'Side image beside the intro text (4:3).'),
    ]),
    section('services', 'Services', 'services', [
      text('heading', 'Heading (H2)', undefined, true),
      defineField({
        name: 'cards',
        title: 'Service cards',
        type: 'array',
        of: [defineArrayMember({ type: 'serviceAreaCard' })],
      }),
    ]),
    section('projects', 'Projects teaser', 'projects', [
      text('heading', 'Heading (H2)'),
      longText('body', 'Body', 4),
      text('ctaLabel', 'Link label'),
      link('ctaHref', 'Link'),
      imageWithAlt('image', 'Project image', 'Photo beside the teaser (4:3).'),
    ]),
    faqsSection('faqs'),
    ctaSection(),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'path', media: 'hero.image' },
  },
});

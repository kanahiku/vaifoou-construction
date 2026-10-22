import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, link, longText, seoFields, text } from '../helpers';

/**
 * Who we work with.
 *
 *  - `audienceLandingPage` — /who-we-work-with/residential/ and /who-we-work-with/commercial/
 *  - `audienceSubPage`     — /who-we-work-with/commercial/<slug>/ (property managers, HOA, contractors)
 *
 * The commercial landing page's "Commercial Clients" links and each sub-page's cross-links are built
 * automatically from the `audienceSubPage` documents (ordered by `order`).
 */

const section = (name: string, title: string, group: string, fields: any[]) =>
  defineField({ name, title, type: 'object', group, options: { collapsible: false }, fields });
const seoSection = () => section('seo', 'SEO', 'seo', seoFields());
const faqsSection = () =>
  section('faqs', 'FAQs', 'faqs', [
    text('heading', 'Heading (H2)', undefined, true),
    defineField({ name: 'items', title: 'Questions', type: 'array', of: [defineArrayMember({ type: 'serviceFaq' })] }),
  ]);
const ctaSection = () =>
  section('cta', 'Closing CTA', 'cta', [
    text('heading', 'Heading', undefined, true),
    longText('note', 'Note', 3, 'Optional. Leave empty to use the default text.'),
  ]);
const pathField = (example: string, regex: RegExp) =>
  defineField({
    name: 'path',
    title: 'Path',
    type: 'string',
    description: `URL of the page, e.g. ${example}. Do not change for existing pages.`,
    validation: (r) => r.required().regex(regex, { name: 'path' }),
  });

export const audienceCard = defineType({
  name: 'audienceCard',
  title: 'Card',
  type: 'object',
  fields: [text('name', 'Title', undefined, true), link('href', 'Link'), longText('description', 'Description', 3)],
  preview: { select: { title: 'name', subtitle: 'description' } },
});

export const audiencePoint = defineType({
  name: 'audiencePoint',
  title: 'Point',
  type: 'object',
  fields: [text('heading', 'Title', undefined, true), longText('body', 'Text', 3)],
  preview: { select: { title: 'heading', subtitle: 'body' } },
});

export const audienceLandingPage = defineType({
  name: 'audienceLandingPage',
  title: 'Who we work with — landing page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'intro', title: 'Intro' },
    { name: 'services', title: 'Services' },
    { name: 'experience', title: 'Experience' },
    { name: 'work', title: 'Our work' },
    { name: 'subpages', title: 'Client sub-pages' },
    { name: 'faqs', title: 'FAQs' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    { ...pathField('/who-we-work-with/residential/', /^\/who-we-work-with\/(residential|commercial)\/$/), group: 'hero' },
    { ...text('name', 'Name (for the Studio list)', undefined, true), group: 'hero' },
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('body', 'Subheading', 3),
      imageWithAlt('image', 'Hero image'),
    ]),
    section('intro', 'Intro', 'intro', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Paragraph', 5),
      text('crossPrompt', 'Prompt before the link', 'e.g. "Managing a commercial property or HOA?"'),
      text('crossLabel', 'Link label'),
      link('crossHref', 'Link'),
      imageWithAlt('image', 'Intro image', 'Side image (4:3).'),
    ]),
    section('services', 'Services', 'services', [
      text('heading', 'Heading (H2)', undefined, true),
      defineField({ name: 'cards', title: 'Cards', type: 'array', of: [defineArrayMember({ type: 'audienceCard' })] }),
    ]),
    section('experience', 'Experience', 'experience', [
      text('heading', 'Heading (H2)', undefined, true),
      defineField({ name: 'items', title: 'Points', type: 'array', of: [defineArrayMember({ type: 'audiencePoint' })] }),
    ]),
    section('work', 'Our work', 'work', [
      text('heading', 'Heading (H2)', 'Leave the heading empty to hide this section.'),
      longText('body', 'Text', 4),
      text('ctaLabel', 'Link label'),
      link('ctaHref', 'Link'),
      imageWithAlt('image', 'Image', 'Side image (4:3).'),
    ]),
    section('subPages', 'Client sub-pages', 'subpages', [
      text('categoryLabel', 'Section label', 'Leave empty to hide the sub-page links (heading reads "Explore Other {label}").'),
      text('viewAllLabel', '"View all" button label'),
      link('viewAllHref', '"View all" link'),
    ]),
    faqsSection(),
    ctaSection(),
  ],
  preview: { select: { title: 'name', subtitle: 'path', media: 'hero.image' } },
});

export const audienceSubPage = defineType({
  name: 'audienceSubPage',
  title: 'Who we work with — client sub-page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'intro', title: 'Intro' },
    { name: 'comparison', title: 'Comparison table' },
    { name: 'related', title: 'Related' },
    { name: 'faqs', title: 'FAQs' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    { ...pathField('/who-we-work-with/commercial/hoa/', /^\/who-we-work-with\/commercial\/[^/]+\/$/), group: 'hero' },
    {
      ...text('name', 'Link name', 'Label used in the cross-link grids on the other commercial pages.', true),
      group: 'hero',
    },
    {
      ...defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 0 }),
      group: 'hero',
    },
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('body', 'Subheading', 4),
      imageWithAlt('image', 'Hero image'),
    ]),
    section('intro', 'Intro', 'intro', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Paragraph', 6),
      imageWithAlt('image', 'Intro image', 'Side image (4:3).'),
    ]),
    section('comparison', 'Comparison table', 'comparison', [
      text('heading', 'Heading (H2)', undefined, true),
      text('col1', 'Column 1 header', undefined, true),
      text('col2', 'Column 2 header'),
      defineField({ name: 'rows', title: 'Rows', type: 'array', of: [defineArrayMember({ type: 'serviceTableRow' })] }),
    ]),
    section('related', 'Related', 'related', [
      text('categoryLabel', 'Section label', 'Heading reads "Explore Other {label}".', true),
      text('viewAllLabel', '"View all" button label'),
      link('viewAllHref', '"View all" link'),
    ]),
    faqsSection(),
    ctaSection(),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'path', media: 'hero.image' } },
});

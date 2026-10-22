import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, link, longText, seoFields, text } from '../helpers';

/**
 * Service pages.
 *
 *  - `serviceCategoryPage` — /services/rock-walls/, /retaining-walls/, /cmu-block-walls/, /concrete/
 *  - `serviceSubPage`      — /services/rock-walls/<slug>/ and /services/concrete/<slug>/
 *
 * Each is one document per URL. Text and images both live here.
 * `path` is the lookup key used by the site, so keep it identical to the route.
 */

// ─── Shared items ─────────────────────────────────────────────────────────────

export const serviceTitledItem = defineType({
  name: 'serviceTitledItem',
  title: 'Title + description',
  type: 'object',
  fields: [
    text('title', 'Title', undefined, true),
    longText('description', 'Description', 4),
    text('icon', 'Icon name', 'Optional Tabler icon, e.g. tabler:mountain. Only shown on card-style sections.'),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
});

export const serviceFaq = defineType({
  name: 'serviceFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    text('question', 'Question', undefined, true),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
});

export const serviceLinkItem = defineType({
  name: 'serviceLinkItem',
  title: 'Link',
  type: 'object',
  fields: [text('title', 'Label', undefined, true), link('href', 'Link', undefined)],
  preview: { select: { title: 'title', subtitle: 'href' } },
});

export const serviceCategoryCard = defineType({
  name: 'serviceCategoryCard',
  title: 'Service card',
  type: 'object',
  fields: [
    text('title', 'Title', undefined, true),
    longText('description', 'Description', 3),
    link('href', 'Link', 'Leave empty to send visitors to the sitewide estimate request.'),
    text('ctaLabel', 'Link label', 'Leave empty for "View {title}" (or the estimate button label when there is no link).'),
  ],
  preview: { select: { title: 'title', subtitle: 'href' } },
});

export const serviceTableRow = defineType({
  name: 'serviceTableRow',
  title: 'Table row',
  type: 'object',
  fields: [
    text('feature', 'Row label', undefined, true),
    text('val1', 'Column 1', undefined, true),
    text('val2', 'Column 2', 'Leave empty for a one-column table.'),
  ],
  preview: { select: { title: 'feature', subtitle: 'val1' } },
});

const itemsField = (name: string, title: string, type: string, description?: string) =>
  defineField({ name, title, type: 'array', description, of: [defineArrayMember({ type })] });

const section = (name: string, title: string, group: string, fields: any[]) =>
  defineField({ name, title, type: 'object', group, options: { collapsible: false }, fields });

const seoSection = () => section('seo', 'SEO', 'seo', seoFields());

const ctaSection = () =>
  section('cta', 'Closing CTA', 'cta', [text('heading', 'Heading (H2)', undefined, true), longText('note', 'Supporting text', 3)]);

// ─── Category page ────────────────────────────────────────────────────────────

export const serviceCategoryPage = defineType({
  name: 'serviceCategoryPage',
  title: 'Service category page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'intro', title: '2 · Intro' },
    { name: 'services', title: '3 · Services / options' },
    { name: 'projects', title: '4 · Projects teaser' },
    { name: 'process', title: '5 · Process' },
    { name: 'faqs', title: '6 · FAQs' },
    { name: 'related', title: '7 · Related' },
    { name: 'cta', title: '8 · Closing CTA' },
  ],
  fields: [
    defineField({
      name: 'path',
      title: 'Route path',
      type: 'string',
      description: 'Must match the page URL exactly, e.g. /services/rock-walls/. Do not change for live pages.',
      validation: (r) =>
        r.required().regex(/^\/services\/(rock-walls|retaining-walls|cmu-block-walls|concrete)\/$/, {
          name: 'service category route',
        }),
    }),
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('subheading', 'Subheading', 3),
      imageWithAlt('image', 'Hero image', 'Full-width background at the top of the page.'),
    ]),
    section('intro', 'Intro', 'intro', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Body', 6),
      imageWithAlt('image', 'Intro image', 'Side image beside the intro text (4:3).'),
    ]),
    section('subServices', 'Services / options', 'services', [
      text('heading', 'Heading (H2)', undefined, true),
      defineField({
        name: 'columns',
        title: 'Cards per row (desktop)',
        type: 'number',
        options: { list: [2, 3, 4] },
        initialValue: 2,
      }),
      itemsField('cards', 'Cards', 'serviceCategoryCard'),
    ]),
    section('projects', 'Projects teaser', 'projects', [
      text('heading', 'Heading (H3)'),
      longText('body', 'Body', 4),
      text('ctaLabel', 'Button label'),
      link('ctaHref', 'Button link'),
      imageWithAlt('image', 'Project image', 'Photo beside the projects teaser (4:3).'),
    ]),
    section('process', 'Process', 'process', [
      text('heading', 'Heading (H2)', undefined, true),
      itemsField('steps', 'Steps', 'serviceTitledItem', 'Numbered automatically. Icons are not used here.'),
    ]),
    section('faqs', 'FAQs', 'faqs', [
      text('heading', 'Heading (H2)', undefined, true),
      itemsField('items', 'Questions', 'serviceFaq'),
    ]),
    section('related', 'Related services', 'related', [
      text('heading', 'Heading (H2)', undefined, true),
      itemsField('links', 'Links', 'serviceLinkItem'),
    ]),
    ctaSection(),
  ],
  preview: {
    select: { title: 'hero.heading', subtitle: 'path', media: 'hero.image' },
  },
});

// ─── Sub page ─────────────────────────────────────────────────────────────────

export const serviceSubPage = defineType({
  name: 'serviceSubPage',
  title: 'Service sub-page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: '1 · Hero', default: true },
    { name: 'process', title: '2 · Process' },
    { name: 'materials', title: '3 · Materials' },
    { name: 'comparison', title: '4 · Comparison table' },
    { name: 'applications', title: '5 · Applications' },
    { name: 'related', title: '6 · Related services' },
    { name: 'faqs', title: '7 · FAQs' },
    { name: 'cta', title: '8 · Closing CTA' },
  ],
  fields: [
    defineField({
      name: 'path',
      title: 'Route path',
      type: 'string',
      description: 'Must match the page URL exactly, e.g. /services/concrete/driveways/. Do not change for live pages.',
      validation: (r) =>
        r.required().regex(/^\/services\/(rock-walls|concrete)\/[^/]+\/$/, { name: 'service sub-page route' }),
    }),
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('body', 'Lead paragraph', 6),
      imageWithAlt('image', 'Hero image', 'Full-width background at the top of the page.'),
    ]),
    section('process', 'Process', 'process', [
      text('heading', 'Heading (H2)', undefined, true),
      itemsField('items', 'Steps', 'serviceTitledItem', 'Numbered automatically.'),
    ]),
    section('materials', 'Materials', 'materials', [
      text('heading', 'Heading (H2)', undefined, true),
      itemsField('items', 'Cards', 'serviceTitledItem'),
    ]),
    section('comparison', 'Comparison table', 'comparison', [
      text('eyebrow', 'Eyebrow', 'Optional small label shown before the heading.'),
      text('heading', 'Heading (H2)', undefined, true),
      longText('note', 'Intro text', 3, 'Optional paragraph above the table.'),
      text('col1', 'Column 1 header', undefined, true),
      text('col2', 'Column 2 header', 'Leave empty for a one-column table.'),
      itemsField('rows', 'Rows', 'serviceTableRow'),
      longText('footerText', 'Text below the table', 2, 'Optional.'),
      text('footerLinkLabel', 'Link label (below table)'),
      link('footerLinkHref', 'Link (below table)'),
    ]),
    section('applications', 'Applications', 'applications', [
      text('heading', 'Heading (H2)', undefined, true),
      itemsField('items', 'Cards', 'serviceTitledItem'),
    ]),
    section('related', 'Related services', 'related', [
      text('categoryLabel', 'Category label', 'Heading reads "Explore Other {label}", e.g. "Concrete Services".', true),
      itemsField('links', 'Links', 'serviceLinkItem', 'Sibling service pages to cross-link.'),
    ]),
    section('faqs', 'FAQs', 'faqs', [
      text('heading', 'Heading (H2)', undefined, true),
      itemsField('items', 'Questions', 'serviceFaq'),
    ]),
    ctaSection(),
  ],
  preview: {
    select: { title: 'hero.heading', subtitle: 'path', media: 'hero.image' },
  },
});

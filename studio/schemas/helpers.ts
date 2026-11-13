import { defineField } from 'sanity';
import { altRequired, validJsonLd } from '../lib/validation';

/** Shared field builders for page documents. */

export const imageWithAlt = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    description,
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe the photo for accessibility and SEO.',
        validation: altRequired,
      }),
      defineField({
        name: 'decorative',
        title: 'Decorative image',
        type: 'boolean',
        description: 'Tick only if the image adds no information (empty alt).',
        initialValue: false,
      }),
    ],
  });

export const text = (name: string, title: string, description?: string, required = false) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    validation: required ? (r) => r.required() : undefined,
  });

export const longText = (name: string, title: string, rows = 4, description?: string) =>
  defineField({ name, title, type: 'text', rows, description });

export const link = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description: description ?? 'Internal path (e.g. /contact/) or full URL.',
  });

/** Fields of the shared `seo` object (see objects/seo.ts). One panel, same on every page. */
export const seoFields = () => [
  text('title', 'Page title', 'Shown in the browser tab and search results (aim for under 60 characters).', true),
  defineField({
    name: 'description',
    title: 'Meta description',
    type: 'text',
    rows: 3,
    description: 'Aim for 140–160 characters.',
    validation: (r) => r.max(160).warning('Over 160 characters — Google will cut it off.'),
  }),
  defineField({
    name: 'canonical',
    title: 'Canonical URL',
    type: 'url',
    description: 'Leave empty to use the page URL. Only set this when the page duplicates another page.',
    validation: (r) => r.uri({ scheme: ['https'] }),
  }),
  defineField({
    name: 'noIndex',
    title: 'Hide from search engines (noindex)',
    type: 'boolean',
    initialValue: false,
  }),
  text('ogTitle', 'Social share title', 'Shown when the link is shared. Empty = page title.'),
  longText('ogDescription', 'Social share text', 2, 'Empty = meta description.'),
  defineField({
    name: 'ogImage',
    title: 'Social share image',
    type: 'imageWithAlt',
    description: 'Best at 1200×630. Empty = site default.',
  }),
  defineField({
    name: 'schemaMode',
    title: 'Structured data (schema)',
    type: 'string',
    initialValue: 'auto',
    options: {
      layout: 'radio',
      list: [
        { title: 'Use automatic schema', value: 'auto' },
        { title: 'Add my JSON-LD to the automatic schema', value: 'append' },
        { title: 'Replace automatic schema with my JSON-LD', value: 'replace' },
      ],
    },
  }),
  defineField({
    name: 'schemaOverride',
    title: 'Custom JSON-LD',
    type: 'text',
    rows: 10,
    description: 'Paste JSON-LD (one object or an array). Checked for valid JSON before publish. Ignored when "automatic" is selected.',
    hidden: ({ parent }) => !parent?.schemaMode || parent.schemaMode === 'auto',
    validation: validJsonLd,
  }),
];

export const seoField = (group = 'seo') =>
  defineField({ name: 'seo', title: 'SEO', type: 'seo', group, options: { collapsible: false } });

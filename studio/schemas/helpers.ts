import { defineField } from 'sanity';

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
        validation: (r) => r.required().warning('Describe the photo for accessibility and SEO.'),
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

export const seoFields = () => [
  text('title', 'Page title', 'Shown in the browser tab and search results (aim for under 60 characters).', true),
  longText('description', 'Meta description', 3, 'Aim for 140–160 characters.'),
];

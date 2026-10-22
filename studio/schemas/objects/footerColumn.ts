import { defineField, defineType } from 'sanity';

export const footerLink = defineType({
  name: 'footerLink',
  title: 'Footer Link',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Leave empty to show plain (non-clickable) text, e.g. "Closed on Sundays".',
    }),
  ],
  preview: { select: { title: 'text', subtitle: 'href' } },
});

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer Column',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Column Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'footerLink' }],
    }),
  ],
  preview: { select: { title: 'title' } },
});

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({ name: 'ariaLabel', title: 'Name (e.g. Facebook)', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Tabler icon name, e.g. tabler:brand-facebook',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'href', title: 'Profile URL', type: 'url', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'ariaLabel', subtitle: 'href' } },
});

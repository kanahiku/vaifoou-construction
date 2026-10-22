import { defineArrayMember, defineField, defineType } from 'sanity';

/** Header menu: top-level item → group (dropdown) → leaf (flyout). */

export const navSubLink = defineType({
  name: 'navSubLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'text', subtitle: 'href' } },
});

export const navGroup = defineType({
  name: 'navGroup',
  title: 'Dropdown item',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', description: 'Optional if it has a flyout of links.' }),
    defineField({
      name: 'links',
      title: 'Flyout links',
      description: 'Optional third level, shown as a side flyout (desktop) or nested list (mobile).',
      type: 'array',
      of: [defineArrayMember({ type: 'navSubLink' })],
    }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'href', links: 'links' },
    prepare: ({ title, subtitle, links }) => ({
      title,
      subtitle: links?.length ? `${links.length} links` : subtitle,
    }),
  },
});

export const navLink = defineType({
  name: 'navLink',
  title: 'Menu item',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description: 'Leave empty for a dropdown label that is not itself a link.',
    }),
    defineField({
      name: 'links',
      title: 'Dropdown',
      type: 'array',
      of: [defineArrayMember({ type: 'navGroup' })],
    }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'href', links: 'links' },
    prepare: ({ title, subtitle, links }) => ({
      title,
      subtitle: links?.length ? `Dropdown · ${links.length} items` : subtitle,
    }),
  },
});

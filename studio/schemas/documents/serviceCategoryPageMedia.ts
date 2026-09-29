import { defineField, defineType } from 'sanity';

const imageWithAlt = (name: string, title: string, description?: string) =>
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

export const serviceCategoryPageMedia = defineType({
  name: 'serviceCategoryPageMedia',
  title: 'Service Category Images',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'path',
      title: 'Route path',
      type: 'string',
      description: 'Example: /services/rock-walls/',
      validation: (r) =>
        r.required().regex(/^\/services\/(rock-walls|retaining-walls|cmu-block-walls|concrete)\/$/, {
          name: 'service category route',
          invert: false,
        }),
    }),
    imageWithAlt('heroImage', 'Hero image', 'Full-width background image at the top of the page.'),
    imageWithAlt('introImage', 'Intro section image', 'Side image beside the first text section.'),
    imageWithAlt('projectImage', 'Project section image', 'Project photo in the services/cards section.'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'path', media: 'heroImage' },
  },
});

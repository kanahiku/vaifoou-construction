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

export const audiencePageMedia = defineType({
  name: 'audiencePageMedia',
  title: 'Who We Work With Images',
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
      description: 'Example: /who-we-work-with/residential/',
      validation: (r) =>
        r.required().regex(/^\/who-we-work-with\/(residential|commercial)\/$/, {
          name: 'who we work with first-level route',
          invert: false,
        }),
    }),
    imageWithAlt('heroImage', 'Hero image', 'Full-width background image at the top of the page.'),
    imageWithAlt('introImage', 'Intro section image', 'Side image beside the first text section.'),
    imageWithAlt('projectImage', 'Project section image', 'Optional recent-work image used on residential.'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'path', media: 'heroImage' },
  },
});

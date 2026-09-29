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

export const commercialAudienceSubPageMedia = defineType({
  name: 'commercialAudienceSubPageMedia',
  title: 'Commercial Audience Sub-page Images',
  type: 'document',
  description: 'Hero and intro images for /who-we-work-with/commercial/ sub-pages.',
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
      description: 'Example: /who-we-work-with/commercial/property-managers-landlords/.',
      validation: (r) =>
        r.required().regex(/^\/who-we-work-with\/commercial\/(property-managers-landlords|hoa|contractors)\/$/, {
          name: 'commercial audience sub-page route',
          invert: false,
        }),
    }),
    imageWithAlt('heroImage', 'Hero image', 'Full-width background image at the top of the page.'),
    imageWithAlt('introImage', 'Intro section image', 'Side image beside the first text section.'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'path', media: 'heroImage' },
  },
});

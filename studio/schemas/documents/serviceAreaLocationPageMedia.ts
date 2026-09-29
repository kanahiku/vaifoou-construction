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

export const serviceAreaLocationPageMedia = defineType({
  name: 'serviceAreaLocationPageMedia',
  title: 'Service Area Location Images',
  type: 'document',
  description: 'Images for individual service area location pages.',
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
      description: 'Example: /service-areas/wahiawa/.',
      validation: (r) =>
        r.required().regex(
          /^\/service-areas\/(wahiawa|honolulu|mililani|kaneohe|kailua|kapolei|north-shore|aiea-pearl-city|waipahu|ewa-beach)\/$/,
          { name: 'service area location route', invert: false }
        ),
    }),
    imageWithAlt('heroImage', 'Hero image', 'Full-width background image at the top of the location page.'),
    imageWithAlt('introImage', 'Intro section image', 'Side image beside the location intro section.'),
    imageWithAlt('recentWorkImage', 'Recent work image', 'Image shown beside the recent-work section.'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'path', media: 'heroImage' },
  },
});

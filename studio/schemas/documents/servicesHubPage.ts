import { defineArrayMember, defineField, defineType } from 'sanity';

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

export const servicesHubAudienceCard = defineType({
  name: 'servicesHubAudienceCard',
  title: 'Services hub audience card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Card title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'href',
      title: 'Card link',
      type: 'string',
      validation: (r) => r.required(),
    }),
    imageWithAlt('image', 'Card image', 'Photo shown at the top of this services page card.'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'href', media: 'image' },
  },
});

export const servicesHubPage = defineType({
  name: 'servicesHubPage',
  title: 'Services Hub',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [imageWithAlt('image', 'Hero image', 'Full-width background image for /services/.')],
    }),
    defineField({
      name: 'audienceCards',
      title: 'Audience cards',
      type: 'array',
      description: 'The two pathway cards on the Services hub page.',
      of: [defineArrayMember({ type: 'servicesHubAudienceCard' })],
      validation: (r) => r.max(2).warning('The services hub design has two audience cards.'),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Services Hub', subtitle: 'Hero and audience card images' };
    },
  },
});

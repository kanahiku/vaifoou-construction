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

export const homeAudienceCard = defineType({
  name: 'homeAudienceCard',
  title: 'Homepage audience card',
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
    imageWithAlt('image', 'Card image', 'Photo shown at the top of this homepage pathway card.'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'href', media: 'image' },
  },
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        imageWithAlt('heroImage', 'Desktop hero image', 'Full-width hero background on tablet and desktop.'),
        imageWithAlt(
          'heroImageMobile',
          'Mobile hero image',
          'Optional tighter mobile crop. If empty, the desktop hero image is used.'
        ),
      ],
    }),
    defineField({
      name: 'audienceCards',
      title: 'Audience cards',
      type: 'array',
      description: 'The two pathway cards near the top of the homepage.',
      of: [defineArrayMember({ type: 'homeAudienceCard' })],
      validation: (r) => r.max(2).warning('The homepage design has two audience cards.'),
    }),
    defineField({
      name: 'highlightBanner',
      title: 'Highlight banner',
      type: 'object',
      fields: [imageWithAlt('image', 'Banner image', 'Photo used behind the homepage highlight banner.')],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage', subtitle: 'Hero, audience cards, and highlight banner images' };
    },
  },
});

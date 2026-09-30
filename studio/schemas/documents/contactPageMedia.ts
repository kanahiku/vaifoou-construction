import { defineField, defineType } from 'sanity';

const imageWithAlt = defineField({
  name: 'heroImage',
  title: 'Hero image',
  type: 'image',
  options: { hotspot: true },
  description: 'Full-width background image at the top of /contact/.',
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (r) => r.required().warning('Describe the photo for accessibility and SEO.'),
    }),
  ],
});

export const contactPageMedia = defineType({
  name: 'contactPageMedia',
  title: 'Contact Page Images',
  type: 'document',
  fields: [imageWithAlt],
  preview: {
    prepare() {
      return { title: 'Contact Page', subtitle: 'Hero image' };
    },
  },
});

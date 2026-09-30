import { defineField, defineType } from 'sanity';

const imageWithAlt = defineField({
  name: 'heroImage',
  title: 'Hero image',
  type: 'image',
  options: { hotspot: true },
  description: 'Full-width background image at the top of /projects/.',
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (r) => r.required().warning('Describe the photo for accessibility and SEO.'),
    }),
  ],
});

export const projectsPageMedia = defineType({
  name: 'projectsPageMedia',
  title: 'Projects Page Images',
  type: 'document',
  fields: [imageWithAlt],
  preview: {
    prepare() {
      return { title: 'Projects Page', subtitle: 'Hero image' };
    },
  },
});

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

export const aboutPageMedia = defineType({
  name: 'aboutPageMedia',
  title: 'About Page Images',
  type: 'document',
  fields: [
    imageWithAlt('heroImage', 'Hero image', 'Full-width background image at the top of /about/.'),
    imageWithAlt('legacyImage', 'Family legacy image', 'Image beside the 25+ year family legacy section.'),
    imageWithAlt('siaosiImage', 'Siaosi Vaifoou image', 'Team photo for Siaosi Vaifoou.'),
  ],
  preview: {
    prepare() {
      return { title: 'About Page', subtitle: 'Hero, legacy, and team images' };
    },
  },
});

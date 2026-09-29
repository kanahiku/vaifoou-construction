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

export const serviceAreaHubPageMedia = defineType({
  name: 'serviceAreaHubPageMedia',
  title: 'Service Areas Hub Images',
  type: 'document',
  fields: [
    imageWithAlt('heroImage', 'Hero image', 'Full-width background image for /service-areas/.'),
    imageWithAlt('introImage', 'Island-wide intro image', 'Side image beside the island-wide masonry section.'),
  ],
  preview: {
    prepare() {
      return { title: 'Service Areas Hub', subtitle: 'Hero and island-wide section images' };
    },
  },
});

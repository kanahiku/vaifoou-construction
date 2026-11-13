import { defineField, defineType } from 'sanity';
import { altRequired } from '../../lib/validation';

/** Shared image object. Alt text is required unless the image is marked decorative. */
export const imageWithAltType = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the photo for screen readers and image search.',
      validation: altRequired,
    }),
    defineField({
      name: 'decorative',
      title: 'Decorative image',
      type: 'boolean',
      description: 'Tick only if the image adds no information. The site will use an empty alt.',
      initialValue: false,
    }),
  ],
});

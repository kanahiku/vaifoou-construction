import { defineField, defineType } from 'sanity';

const imageWithAlt = defineField({
  name: 'heroImage',
  title: 'Hero image',
  type: 'image',
  options: { hotspot: true },
  description: 'Hero photo for this second-level service page.',
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (r) => r.required().warning('Describe the photo for accessibility and SEO.'),
    }),
  ],
});

const pageTitle = defineField({
  name: 'title',
  title: 'Page title',
  type: 'string',
  validation: (r) => r.required(),
});

const pathField = (pattern: RegExp, description: string, validationName: string) =>
  defineField({
    name: 'path',
    title: 'Route path',
    type: 'string',
    description,
    validation: (r) =>
      r.required().regex(pattern, {
        name: validationName,
        invert: false,
      }),
  });

export const rockWallSubPageMedia = defineType({
  name: 'rockWallSubPageMedia',
  title: 'Rock Wall Sub-page Images',
  type: 'document',
  description: 'Hero images for second-level Rock Walls pages only.',
  fields: [
    pageTitle,
    pathField(/^\/services\/rock-walls\/[^/]+\/$/, 'Example: /services/rock-walls/repair/.', 'rock wall sub-page route'),
    imageWithAlt,
  ],
  preview: {
    select: { title: 'title', subtitle: 'path', media: 'heroImage' },
  },
});

export const concreteServiceSubPageMedia = defineType({
  name: 'concreteServiceSubPageMedia',
  title: 'Concrete Service Sub-page Images',
  type: 'document',
  description: 'Hero images for second-level Concrete Services pages only.',
  fields: [
    pageTitle,
    pathField(
      /^\/services\/concrete\/[^/]+\/$/,
      'Example: /services/concrete/driveways/.',
      'concrete service sub-page route'
    ),
    imageWithAlt,
  ],
  preview: {
    select: { title: 'title', subtitle: 'path', media: 'heroImage' },
  },
});

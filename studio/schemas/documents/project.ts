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

export const projectTag = defineType({
  name: 'projectTag',
  title: 'Project tag',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Optional internal route, for example /services/rock-walls/',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Services tied to this project',
      type: 'array',
      of: [defineArrayMember({ type: 'projectTag' })],
      validation: (r) => r.min(1).warning('Add at least one service or area tag.'),
    }),
    imageWithAlt('beforeImage', 'Before image', 'Optional photo shown in the before panel.'),
    imageWithAlt('afterImage', 'After image', 'Optional photo shown in the after panel.'),
    defineField({
      name: 'beforeLabel',
      title: 'Before label',
      type: 'string',
      initialValue: 'Before',
    }),
    defineField({
      name: 'afterLabel',
      title: 'After label',
      type: 'string',
      initialValue: 'After',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
      validation: (r) => r.integer(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'afterImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle.slice(0, 80)}${subtitle.length > 80 ? '...' : ''}` : undefined,
        media,
      };
    },
  },
});

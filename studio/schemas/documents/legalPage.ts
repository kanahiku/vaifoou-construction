import { defineArrayMember, defineField, defineType } from 'sanity';
import { longText, seoFields, text } from '../helpers';

/**
 * Legal pages — one document per page (privacy policy, terms, accessibility).
 *
 * Text supports tokens that the site fills from config, so they stay correct everywhere:
 *   {business}  business name      {phone}  linked phone number      {email}  linked email address
 */

const richText = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    description,
    of: [
      defineArrayMember({
        type: 'block',
        styles: [{ title: 'Normal', value: 'normal' }],
        lists: [],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [defineField({ name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }) })],
            },
          ],
        },
      }),
    ],
  });

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'content', title: 'Content', default: true },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    defineField({
      name: 'path',
      title: 'Path',
      type: 'string',
      group: 'content',
      description: 'URL of the page, e.g. /privacy-policy/. Do not change for existing pages.',
      validation: (r) => r.required().regex(/^\/[a-z0-9-]+\/$/, { name: 'path' }),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: { collapsible: false },
      fields: seoFields(),
    }),
    { ...text('heading', 'Page heading (H1)', undefined, true), group: 'content' },
    { ...richText('intro', 'Introduction'), group: 'content' },
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'legalSection',
          title: 'Section',
          fields: [text('heading', 'Heading', undefined, true), richText('body', 'Text')],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Closing CTA',
      type: 'object',
      group: 'cta',
      options: { collapsible: false },
      fields: [text('heading', 'Heading', undefined, true), longText('note', 'Note', 3, 'Optional.')],
    }),
  ],
  preview: { select: { title: 'heading', subtitle: 'path' } },
});

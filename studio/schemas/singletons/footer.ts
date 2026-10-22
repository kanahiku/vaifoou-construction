import { defineField, defineType } from 'sanity';

export const siteFooter = defineType({
  name: 'siteFooter',
  title: 'Footer',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'licensedLine',
      title: 'Brand column line',
      type: 'string',
      description: 'Line under the license number, e.g. "Licensed & Insured in O\u02BBahu, Hawai\u02BBi".',
    }),
    defineField({
      name: 'columns',
      title: 'Link Columns',
      description: 'Up to four columns, shown to the right of the brand column, in this order.',
      type: 'array',
      of: [{ type: 'footerColumn' }],
    }),
    defineField({
      name: 'secondaryLinks',
      title: 'Bottom Links (Privacy Policy, Terms, Accessibility)',
      type: 'array',
      of: [{ type: 'footerLink' }],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [{ type: 'socialLink' }],
    }),
    defineField({
      name: 'footNote',
      title: 'Footer Note (copyright)',
      type: 'string',
      description: 'Use {year} for the current year, e.g. © {year} Vaifoou Construction LLC. All rights reserved.',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
      description: 'Rock texture/photo shown behind the dark footer overlay.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Leave blank if decorative.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer' };
    },
  },
});

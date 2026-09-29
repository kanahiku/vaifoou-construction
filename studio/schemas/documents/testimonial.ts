import { defineField, defineType } from 'sanity';
import { CommentIcon } from '@sanity/icons';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'name',
      title: 'Reviewer Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Attribution / Location',
      type: 'string',
      description: 'Shown under the name, e.g. "Kailua" or "Homeowner".',
    }),
    defineField({
      name: 'platform',
      title: 'Review Platform',
      type: 'string',
      description: 'Leave empty when the quote is a direct customer testimonial.',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'Yelp', value: 'yelp' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Review Date',
      type: 'date',
      description: 'Shown on the card when the original review has a date.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first on the reviews page and homepage.',
      initialValue: 0,
      validation: (r) => r.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      platform: 'platform',
      quote: 'quote',
    },
    prepare({ title, platform, quote }) {
      return {
        title: title || 'Untitled',
        subtitle: [platform, quote?.slice(0, 60)].filter(Boolean).join(' · '),
      };
    },
  },
});

import { defineField, defineType } from 'sanity';

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service page',
  type: 'document',
  groups: [
    { name: 'meta', title: 'SEO' },
    { name: 'hero', title: 'Hero' },
    { name: 'body', title: 'Sections' },
    { name: 'faqs', title: 'FAQs' },
    { name: 'cta', title: 'CTA banner' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Studio title',
      type: 'string',
      description: 'Internal name in the sidebar (not shown on the site).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Path without a leading slash, e.g. services/consulting. A new published slug goes live on the website without a developer deploy. Do not use reserved paths like contact, blog, reviews, privacy-policy, terms, or accessibility.',
      options: { source: 'title' },
      validation: (r) => r.required(),
      group: 'meta',
    }),
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      group: 'meta',
      fields: [
        defineField({ name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required() }),
        defineField({
          name: 'description',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      group: 'hero',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      group: 'body',
      description:
        'Stack sections top to bottom after the hero. Backgrounds alternate grey → black → white automatically. FAQs and the yellow CTA sit after these sections.',
      of: [
        { type: 'iconPointsSection' },
        { type: 'timelineSection' },
        { type: 'linkedCardsSection' },
        { type: 'infoCardsSection' },
        { type: 'editorialSection' },
        { type: 'comparisonTableSection' },
        { type: 'bulletCardsSection' },
        { type: 'checklistSection' },
        { type: 'yelpReviewsSection' },
        { type: 'liveReviewsSection' },
        { type: 'splitContentSection' },
        { type: 'quoteCardsSection' },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'faqsSection',
      group: 'faqs',
      description: 'Optional. Always renders after the page sections and before the CTA banner. Leave empty on pages with no FAQ.',
    }),
    defineField({
      name: 'ctaBanner',
      title: 'CTA banner',
      type: 'ctaBanner',
      group: 'cta',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title: title || 'Service page', subtitle: slug ? `/${slug}` : 'No slug' };
    },
  },
});

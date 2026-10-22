import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, link, longText, seoFields, text } from '../helpers';

/**
 * Services hub singleton (`singleton-services-hub`) — /services/
 * One tab per section, in page order.
 */

const GROUPS = [
  { name: 'seo', title: 'SEO' },
  { name: 'hero', title: '1 · Hero', default: true },
  { name: 'intro', title: '2 · Audience pathways' },
  { name: 'capabilities', title: '3 · Capabilities' },
  { name: 'scope', title: '4 · Service scope' },
  { name: 'cta', title: '5 · Closing CTA' },
];

export const servicesHubAudienceCard = defineType({
  name: 'servicesHubAudienceCard',
  title: 'Services hub pathway card',
  type: 'object',
  fields: [
    text('label', 'Tag label', 'Short audience label, e.g. "Residential". Used as image fallback text.'),
    text('title', 'Card title', undefined, true),
    text('ctaLabel', 'Button label', undefined, true),
    link('href', 'Button link'),
    imageWithAlt('image', 'Card image', 'Photo shown at the top of this card.'),
  ],
  preview: { select: { title: 'title', subtitle: 'href', media: 'image' } },
});

export const servicesHubScopeRow = defineType({
  name: 'servicesHubScopeRow',
  title: 'Scope row',
  type: 'object',
  fields: [text('build', 'What we build', undefined, true), text('notCover', 'What we do not cover', undefined, true)],
  preview: { select: { title: 'build', subtitle: 'notCover' } },
});

export const servicesHubPage = defineType({
  name: 'servicesHubPage',
  title: 'Services Hub',
  type: 'document',
  groups: GROUPS,
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: { collapsible: false },
      fields: seoFields(),
    }),

    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H1)', undefined, true),
        longText('subheading', 'Subheading', 3),
        imageWithAlt('image', 'Hero image', 'Full-width background image for /services/.'),
      ],
    }),

    defineField({
      name: 'intro',
      title: 'Audience pathways',
      type: 'object',
      group: 'intro',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        longText('body', 'Body', 5),
        defineField({
          name: 'audienceCards',
          title: 'Pathway cards',
          type: 'array',
          of: [defineArrayMember({ type: 'servicesHubAudienceCard' })],
          validation: (r) => r.max(2).warning('The services hub design has two pathway cards.'),
        }),
      ],
    }),

    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'object',
      group: 'capabilities',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        defineField({
          name: 'items',
          title: 'Capability cards',
          type: 'array',
          description: 'Each card links to a service category page.',
          of: [defineArrayMember({ type: 'homeServiceCard' })],
        }),
      ],
    }),

    defineField({
      name: 'scope',
      title: 'Service scope',
      type: 'object',
      group: 'scope',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        text('buildLabel', 'Left column header'),
        text('notCoverLabel', 'Right column header'),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [defineArrayMember({ type: 'servicesHubScopeRow' })],
        }),
      ],
    }),

    defineField({
      name: 'cta',
      title: 'Closing CTA',
      type: 'object',
      group: 'cta',
      options: { collapsible: false },
      fields: [text('heading', 'Heading (H2)', undefined, true), longText('note', 'Supporting text', 3)],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Services Hub', subtitle: '/services/ — all sections: text and images' };
    },
  },
});

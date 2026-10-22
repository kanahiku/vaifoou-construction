import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, link, longText, text } from '../helpers';

/**
 * Homepage singleton (`singleton-home`).
 *
 * One tab (group) per section of the page, in page order:
 * SEO · Hero · Intro · Services · Highlight banner · Service areas · Reviews · Closing CTA
 *
 * Text and images both live here. Sitewide data (phone, license, primary CTA
 * fallback) stays in `src/config/*`.
 */

const GROUPS = [
  { name: 'seo', title: 'SEO' },
  { name: 'hero', title: '1 · Hero', default: true },
  { name: 'intro', title: '2 · Intro & pathways' },
  { name: 'services', title: '3 · Core services' },
  { name: 'highlight', title: '4 · Highlight banner' },
  { name: 'areas', title: '5 · Service areas' },
  { name: 'reviews', title: '6 · Reviews' },
  { name: 'cta', title: '7 · Closing CTA' },
];

export const homeAudienceCard = defineType({
  name: 'homeAudienceCard',
  title: 'Homepage pathway card',
  type: 'object',
  fields: [
    text('label', 'Tag label', 'Short audience label, e.g. "Residential". Used as image fallback text.'),
    text('title', 'Card title', undefined, true),
    text('ctaLabel', 'Button label', undefined, true),
    link('href', 'Button link'),
    imageWithAlt('image', 'Card image', 'Photo shown at the top of this pathway card.'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'href', media: 'image' },
  },
});

export const homeServiceCard = defineType({
  name: 'homeServiceCard',
  title: 'Service card',
  type: 'object',
  fields: [
    text('title', 'Title', undefined, true),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: 'Rock wall', value: 'rock-wall' },
          { title: 'Retaining wall', value: 'retaining-wall' },
          { title: 'Block / CMU walls', value: 'walls' },
          { title: 'Hammer (concrete)', value: 'hammer' },
        ],
        layout: 'radio',
      },
      initialValue: 'rock-wall',
    }),
    longText('description', 'Description', 3),
    text('ctaLabel', 'Link label', 'Used on the homepage. Other pages that reuse this card may ignore it.'),
    link('href', 'Link destination'),
  ],
  preview: { select: { title: 'title', subtitle: 'href' } },
});

export const homeServiceArea = defineType({
  name: 'homeServiceArea',
  title: 'Homepage service area',
  type: 'object',
  fields: [text('label', 'Label', undefined, true), link('href', 'Link')],
  preview: { select: { title: 'label', subtitle: 'href' } },
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: GROUPS,
  fields: [
    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: { collapsible: false },
      fields: [
        text('title', 'Page title', 'Shown in the browser tab and search results (aim for under 60 characters).'),
        longText('description', 'Meta description', 3, 'Aim for 140–160 characters.'),
      ],
    }),

    // ── 1. Hero ───────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H1)', undefined, true),
        longText('subheading', 'Subheading', 3),
        text('ctaLabel', 'Primary button label', 'Leave empty to use the sitewide primary CTA.'),
        link('ctaHref', 'Primary button link', 'Leave empty to use the sitewide primary CTA.'),
        defineField({
          name: 'trustBadges',
          title: 'Trust bar',
          type: 'array',
          description:
            'Short items under the buttons. The license number (from site contact settings) is always shown first.',
          of: [defineArrayMember({ type: 'string' })],
        }),
        imageWithAlt('heroImage', 'Desktop hero image', 'Full-width hero background on tablet and desktop.'),
        imageWithAlt(
          'heroImageMobile',
          'Mobile hero image',
          'Optional tighter mobile crop. If empty, the desktop hero image is used.'
        ),
      ],
    }),

    // ── 2. Intro & pathways ───────────────────────────────────────────────
    defineField({
      name: 'intro',
      title: 'Intro & pathways',
      type: 'object',
      group: 'intro',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        longText('body', 'Body', 6),
        defineField({
          name: 'audienceCards',
          title: 'Pathway cards',
          type: 'array',
          description: 'The two audience cards under the intro (residential / commercial).',
          of: [defineArrayMember({ type: 'homeAudienceCard' })],
          validation: (r) => r.max(2).warning('The homepage design has two pathway cards.'),
        }),
      ],
    }),

    // ── 3. Core services ──────────────────────────────────────────────────
    defineField({
      name: 'services',
      title: 'Core services',
      type: 'object',
      group: 'services',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        defineField({
          name: 'items',
          title: 'Service cards',
          type: 'array',
          of: [defineArrayMember({ type: 'homeServiceCard' })],
        }),
      ],
    }),

    // ── 4. Highlight banner ───────────────────────────────────────────────
    defineField({
      name: 'highlightBanner',
      title: 'Highlight banner',
      type: 'object',
      group: 'highlight',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H3)', undefined, true),
        longText('body', 'Body', 4),
        text('ctaLabel', 'Button label'),
        link('ctaHref', 'Button link'),
        imageWithAlt('image', 'Banner image', 'Photo used behind the highlight banner.'),
      ],
    }),

    // ── 5. Service areas ──────────────────────────────────────────────────
    defineField({
      name: 'serviceAreas',
      title: 'Service areas',
      type: 'object',
      group: 'areas',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        longText('body', 'Body', 5),
        text('ctaLabel', 'Button label'),
        link('ctaHref', 'Button link'),
        defineField({
          name: 'areas',
          title: 'Area tiles',
          type: 'array',
          of: [defineArrayMember({ type: 'homeServiceArea' })],
        }),
      ],
    }),

    // ── 6. Reviews ────────────────────────────────────────────────────────
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'object',
      group: 'reviews',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        defineField({
          name: 'count',
          title: 'Number of reviews to show',
          type: 'number',
          description: 'Reviews are pulled from the Testimonials list in order.',
          validation: (r) => r.min(1).max(6).integer(),
          initialValue: 3,
        }),
        text('ctaLabel', 'Button label'),
        link('ctaHref', 'Button link'),
      ],
    }),

    // ── 7. Closing CTA ────────────────────────────────────────────────────
    defineField({
      name: 'cta',
      title: 'Closing CTA',
      type: 'object',
      group: 'cta',
      options: { collapsible: false },
      fields: [
        text('heading', 'Heading (H2)', undefined, true),
        longText('note', 'Supporting text', 3),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage', subtitle: 'All homepage sections: text and images' };
    },
  },
});

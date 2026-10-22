import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, link, longText, seoFields, text } from '../helpers';

/**
 * Listing pages — the copy around the testimonials, projects and blog posts.
 * The items themselves (testimonial / project / blogPost documents) are managed separately.
 *
 *  - `reviewsPage`  — /reviews/  (singleton `singleton-reviews`)
 *  - `projectsPage` — /projects/ (singleton `singleton-projects`)
 *  - `blogPage`     — /blog/     (singleton `singleton-blog`)
 */

const section = (name: string, title: string, group: string, fields: any[]) =>
  defineField({ name, title, type: 'object', group, options: { collapsible: false }, fields });

const seoSection = () => section('seo', 'SEO', 'seo', seoFields());
const ctaSection = () =>
  section('cta', 'Closing CTA', 'cta', [
    text('heading', 'Heading', undefined, true),
    longText('note', 'Note', 3, 'Optional. Leave empty to use the default text.'),
  ]);

export const reviewsPage = defineType({
  name: 'reviewsPage',
  title: 'Reviews Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'featured', title: 'Featured reviews' },
    { name: 'profiles', title: 'Review profiles' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('body', 'Subheading', 3),
      imageWithAlt('image', 'Hero image'),
    ]),
    section('featured', 'Featured reviews', 'featured', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Intro', 3),
      defineField({
        name: 'extraReviews',
        title: 'Additional reviews',
        type: 'array',
        description:
          'Shown after the testimonials (testimonial documents fill the first slots; the grid shows 6 in total).',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'reviewsPageExtraReview',
            title: 'Review',
            fields: [
              longText('quote', 'Quote', 4),
              text('name', 'Reviewer name', undefined, true),
              defineField({
                name: 'platform',
                title: 'Platform',
                type: 'string',
                options: {
                  list: [
                    { title: 'Google', value: 'google' },
                    { title: 'Yelp', value: 'yelp' },
                    { title: 'Thumbtack', value: 'thumbtack' },
                  ],
                  layout: 'radio',
                },
              }),
              defineField({ name: 'reviewedAt', title: 'Review date', type: 'date' }),
            ],
            preview: { select: { title: 'name', subtitle: 'quote' } },
          }),
        ],
      }),
      text('emptyTitle', 'Empty-state title', 'Shown only when there are no reviews.'),
      longText('emptyBody', 'Empty-state text', 2),
    ]),
    section('profiles', 'Review profiles', 'profiles', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Intro', 3, 'Platform cards (Google / Yelp / Thumbtack) and their URLs live in src/config/social.ts.'),
    ]),
    ctaSection(),
  ],
  preview: {
    prepare() {
      return { title: 'Reviews Page', subtitle: '/reviews/' };
    },
  },
});

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'filters', title: 'Filters' },
    { name: 'services', title: 'Other services' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    seoSection(),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('body', 'Subheading', 3),
      imageWithAlt('image', 'Hero image'),
    ]),
    section('filters', 'Filters', 'filters', [
      text('heading', 'Heading', undefined, true),
      longText('body', 'Intro', 2),
      text('locationLabel', 'Location filter label'),
      text('allLocationsLabel', '"All locations" option'),
      text('serviceLabel', 'Service filter label'),
      text('allServicesLabel', '"All services" option'),
      text('resetLabel', 'Reset button label'),
      text('emptyText', 'No-results text'),
    ]),
    section('services', 'Other services', 'services', [
      text('heading', 'Heading (H2)', undefined, true),
      defineField({
        name: 'cards',
        title: 'Cards',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'projectsServiceCard',
            title: 'Service card',
            fields: [
              text('title', 'Title', undefined, true),
              longText('description', 'Description', 3),
              link('href', 'Link'),
              text('ctaLabel', 'Link label'),
              defineField({
                name: 'icon',
                title: 'Icon',
                type: 'string',
                options: {
                  list: [
                    { title: 'Rock wall', value: 'rock-wall' },
                    { title: 'Retaining wall', value: 'retaining-wall' },
                    { title: 'CMU / block walls', value: 'walls' },
                    { title: 'Hammer (concrete)', value: 'hammer' },
                  ],
                },
              }),
            ],
            preview: { select: { title: 'title', subtitle: 'href' } },
          }),
        ],
      }),
    ]),
    ctaSection(),
  ],
  preview: {
    prepare() {
      return { title: 'Projects Page', subtitle: '/projects/' };
    },
  },
});

export const blogPage = defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'empty', title: 'Empty state' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    seoSection(),
    section('hero', 'Hero', 'hero', [text('heading', 'Heading (H1)', undefined, true)]),
    section('empty', 'Empty state', 'empty', [
      text('title', 'Title', 'Shown only when there are no posts.'),
      longText('body', 'Text', 2),
    ]),
    ctaSection(),
  ],
  preview: {
    prepare() {
      return { title: 'Blog Page', subtitle: '/blog/' };
    },
  },
});

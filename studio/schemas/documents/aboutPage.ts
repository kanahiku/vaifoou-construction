import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, longText, seoFields, text } from '../helpers';

/**
 * About page — /about/ (singleton `singleton-about`).
 * Text may contain `{license}`, which the site replaces with the contractor license from config.
 */

const section = (name: string, title: string, group: string, fields: any[]) =>
  defineField({ name, title, type: 'object', group, options: { collapsible: false }, fields });

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero', default: true },
    { name: 'story', title: 'Our story' },
    { name: 'legacy', title: 'Family legacy' },
    { name: 'values', title: 'Values' },
    { name: 'crew', title: 'Crew' },
    { name: 'cta', title: 'Closing CTA' },
  ],
  fields: [
    section('seo', 'SEO', 'seo', seoFields()),
    section('hero', 'Hero', 'hero', [
      text('heading', 'Heading (H1)', undefined, true),
      longText('body', 'Subheading', 3),
      imageWithAlt('image', 'Hero image', 'Full-width background image.'),
    ]),
    section('story', 'Our story', 'story', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Intro paragraph', 5),
    ]),
    section('legacy', 'Family legacy', 'legacy', [
      text('heading', 'Heading (H2)', undefined, true),
      defineField({
        name: 'paragraphs',
        title: 'Paragraphs',
        type: 'array',
        of: [defineArrayMember({ type: 'text', rows: 4 })],
        description: 'Use {license} to insert the contractor license number.',
      }),
      defineField({
        name: 'timeline',
        title: 'Timeline',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'aboutTimelineItem',
            title: 'Timeline item',
            fields: [text('year', 'Year / label', undefined, true), text('label', 'Description', 'Supports {license}.', true)],
            preview: { select: { title: 'year', subtitle: 'label' } },
          }),
        ],
      }),
      imageWithAlt('image', 'Image', 'Portrait photo beside the legacy text (4:5).'),
    ]),
    section('values', 'Values', 'values', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Intro', 3),
      defineField({
        name: 'items',
        title: 'Values',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'aboutValue',
            title: 'Value',
            fields: [text('label', 'Title', undefined, true), longText('body', 'Body', 4)],
            preview: { select: { title: 'label', subtitle: 'body' } },
          }),
        ],
      }),
    ]),
    section('crew', 'Crew', 'crew', [
      text('heading', 'Heading (H2)', undefined, true),
      longText('body', 'Intro', 3),
      imageWithAlt('leaderImage', 'Owner photo (Siaosi Vaifoou)', 'Kept for the "Meet the Team" section; not shown on the page yet.'),
      defineField({
        name: 'members',
        title: 'Crew members',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'aboutCrewMember',
            title: 'Crew member',
            fields: [text('name', 'Name', undefined, true), text('role', 'Role', undefined, true)],
            preview: { select: { title: 'name', subtitle: 'role' } },
          }),
        ],
      }),
    ]),
    section('cta', 'Closing CTA', 'cta', [text('heading', 'Heading', undefined, true), longText('note', 'Note', 3)]),
  ],
  preview: {
    prepare() {
      return { title: 'About Page', subtitle: '/about/' };
    },
  },
});

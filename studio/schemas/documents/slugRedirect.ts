import { defineField, defineType } from 'sanity';
import { ArrowRightIcon } from '@sanity/icons';

/** 301 redirect. Created automatically when a slug/path changes on publish; can also be added by hand. */
export const slugRedirect = defineType({
  name: 'slugRedirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'Old path',
      type: 'string',
      description: 'e.g. /blog/old-slug/',
      validation: (r) => r.required().regex(/^\/.*\/$/, { name: 'path', invert: false }).error('Start and end with "/".'),
    }),
    defineField({
      name: 'to',
      title: 'New path',
      type: 'string',
      description: 'e.g. /blog/new-slug/ or a full URL.',
      validation: (r) =>
        r.required().custom((to, ctx) => ((ctx.document as { from?: string })?.from === to ? 'Cannot redirect to itself.' : true)),
    }),
    defineField({ name: 'permanent', title: 'Permanent (301)', type: 'boolean', initialValue: true }),
    defineField({
      name: 'auto',
      title: 'Created automatically',
      type: 'boolean',
      readOnly: true,
      initialValue: false,
    }),
  ],
  preview: { select: { title: 'from', subtitle: 'to' } },
});

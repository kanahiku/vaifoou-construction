import { defineField, defineType } from 'sanity';

/** Shared call-to-action: label + destination. */
export const ctaType = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Button label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (e.g. /contact/), tel: / mailto: link, or full URL.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false }),
  ],
});

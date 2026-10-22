import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Header: top utility bar + main menu (up to 3 levels).
 * The phone number comes from site config (src/config/contact.ts) so it stays identical everywhere.
 */
export const siteNavigation = defineType({
  name: 'siteNavigation',
  title: 'Navigation (header)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'menu', title: 'Menu', default: true },
    { name: 'topbar', title: 'Top bar' },
  ],
  fields: [
    defineField({
      name: 'links',
      title: 'Menu',
      group: 'menu',
      description: 'Top-level items in display order. Each can have a dropdown, and dropdown items a flyout.',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
    defineField({
      name: 'actions',
      title: 'Extra buttons (optional)',
      group: 'menu',
      description: 'Additional buttons next to the phone button.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navAction',
          fields: [
            defineField({ name: 'text', title: 'Button label', type: 'string' }),
            defineField({ name: 'href', title: 'URL', type: 'string' }),
            defineField({
              name: 'variant',
              title: 'Style',
              type: 'string',
              options: { list: ['primary', 'secondary', 'ghost-light', 'ghost-dark'] },
              initialValue: 'primary',
            }),
          ],
          preview: { select: { title: 'text', subtitle: 'href' } },
        }),
      ],
    }),
    defineField({
      name: 'topBar',
      title: 'Top bar',
      group: 'topbar',
      type: 'object',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'items',
          title: 'Left items',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          description: 'Shown separated by dots. Use {license} to insert the contractor license number.',
        }),
        defineField({ name: 'note', title: 'Right text', type: 'string' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation (header)' }) },
});

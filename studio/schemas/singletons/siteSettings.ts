import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';
import { longText, text } from '../helpers';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Site Settings — business info that feeds the LocalBusiness JSON-LD on every page.
 * Empty fields fall back to src/config (contact.ts, social.ts), so nothing breaks while it is unfilled.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    text('businessName', 'Business name', undefined, true),
    defineField({
      name: 'businessType',
      title: 'Business type (schema.org)',
      type: 'string',
      initialValue: 'GeneralContractor',
      options: {
        list: ['LocalBusiness', 'GeneralContractor', 'HomeAndConstructionBusiness', 'RoofingContractor', 'Plumber', 'Electrician'],
      },
    }),
    longText('description', 'Business description', 3),
    text('phone', 'Phone', 'International format, e.g. +1-808-778-6954'),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    text('priceRange', 'Price range', 'e.g. $$'),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        text('street', 'Street'),
        text('city', 'City'),
        text('state', 'State'),
        text('zip', 'ZIP'),
        text('country', 'Country (2-letter)'),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'days',
              title: 'Days',
              type: 'array',
              of: [{ type: 'string' }],
              options: { list: DAYS },
              validation: (r) => r.required().min(1),
            }),
            defineField({ name: 'opens', title: 'Opens (HH:MM)', type: 'string', validation: (r) => r.required().regex(/^\d{2}:\d{2}$/) }),
            defineField({ name: 'closes', title: 'Closes (HH:MM)', type: 'string', validation: (r) => r.required().regex(/^\d{2}:\d{2}$/) }),
          ],
          preview: { select: { title: 'days', subtitle: 'opens' } },
        }),
      ],
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Service area',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Cities or regions served, e.g. Honolulu, Kapolei, Kailua.',
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt' }),
    defineField({
      name: 'geo',
      title: 'Map location',
      type: 'object',
      fields: [
        defineField({ name: 'latitude', title: 'Latitude', type: 'number', validation: (r) => r.min(-90).max(90) }),
        defineField({ name: 'longitude', title: 'Longitude', type: 'number', validation: (r) => r.min(-180).max(180) }),
      ],
    }),
    defineField({ name: 'mapUrl', title: 'Google Maps link', type: 'url' }),
    defineField({
      name: 'socialLinks',
      title: 'Social profiles',
      type: 'array',
      of: [{ type: 'url' }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
});

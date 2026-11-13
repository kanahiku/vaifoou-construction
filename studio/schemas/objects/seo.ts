import { defineType } from 'sanity';
import { seoFields } from '../helpers';

/** The one SEO panel used on every page document: title, description, canonical, noindex, social, schema. */
export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: false },
  fields: seoFields(),
});

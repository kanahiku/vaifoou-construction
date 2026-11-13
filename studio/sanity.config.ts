import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';
import { structure, singletonTypes } from './structure';
import { withSlugRedirect } from './lib/slugRedirect';

export default defineConfig({
  name: 'vaifoou-construction',
  title: 'Vaifoou Construction',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '2481svtr',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Singletons are opened from the desk structure only — never created from the "+" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // On publish, a changed slug/path creates a 301 redirect automatically.
    actions: (prev, { schemaType }) =>
      // Navigation and footer are singletons: no duplicate / delete / unpublish.
      ['siteNavigation', 'siteFooter'].includes(schemaType)
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : ['blogPost', 'serviceCategoryPage', 'serviceSubPage', 'serviceAreaPage', 'legalPage', 'audienceLandingPage', 'audienceSubPage'].includes(schemaType)
        ? prev.map((action) => (action.action === 'publish' ? withSlugRedirect(action) : action))
        : prev,
  },
});

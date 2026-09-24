import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';
import { structure } from './structure';

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
  },
});

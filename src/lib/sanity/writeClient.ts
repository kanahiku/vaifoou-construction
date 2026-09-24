import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID ?? '2481svtr';
const dataset = import.meta.env.SANITY_DATASET ?? 'production';
const token = import.meta.env.SANITY_WRITE_TOKEN || import.meta.env.SANITY_API_TOKEN || undefined;

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-15',
  useCdn: false,
  ...(token ? { token } : {}),
});

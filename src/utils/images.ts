import type { ImageMetadata } from 'astro';
import type { MetaDataOpenGraph } from '~/types';

/**
 * Resolve an image reference to either ImageMetadata or a string URL.
 * Accepts:
 *   - `null` / `undefined`         → returned as-is
 *   - `ImageMetadata`              → returned as-is (already imported)
 *   - `"http(s)://…"` or `"/path"` → returned as-is (external or public/)
 */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  if (typeof imagePath !== 'string') return imagePath;
  return imagePath;
};

/**
 * Adapt OpenGraph image URLs to absolute URLs.
 * Used by Metadata.astro to produce social-card-ready URLs.
 */
export const adaptOpenGraphImages = async (
  openGraph: MetaDataOpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<MetaDataOpenGraph> => {
  if (!openGraph?.images?.length) return openGraph;

  const adaptedImages = await Promise.all(
    openGraph.images.map(async (image) => {
      if (!image?.url) return { url: '' };

      const resolved = await findImage(image.url);
      if (!resolved) return { url: '' };

      return {
        ...image,
        url: String(new URL(String(resolved), astroSite)),
      };
    })
  );

  return { ...openGraph, images: adaptedImages };
};

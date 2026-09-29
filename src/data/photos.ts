import { urlFor } from '~/lib/sanity/image';

export interface SitePhoto {
  src: string;
  alt: string;
}

const sanityImageUrl = (assetId: string) =>
  urlFor({
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  })
    .auto('format')
    .url();

/** Project photos used across page heroes and split sections. */
export const photos = {
  hero: {
    src: sanityImageUrl('image-7ff3c1ef9fe03938b0ffdb3806ca083be2fccffa-1983x793-png'),
    alt: "Volcanic basalt rock wall overlooking O'ahu",
  },
  residential: {
    src: sanityImageUrl('image-2b70767aa2c93f6e0dd880e8d1276172a03759eb-1672x941-png'),
    alt: "Residential volcanic rock boundary wall at an O'ahu home",
  },
  commercial: {
    src: sanityImageUrl('image-bc572018682500dc0d3e8688a4d53ca05be37554-1672x941-png'),
    alt: "CMU block wall and concrete flatwork under construction on O'ahu",
  },
  veneer: {
    src: sanityImageUrl('image-5f35b57c48b3cb93ec78f80a566c6d19c1e593d2-1983x793-png'),
    alt: "Completed veneer rock wall at an O'ahu residence",
  },
} as const satisfies Record<string, SitePhoto>;

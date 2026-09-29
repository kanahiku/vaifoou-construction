import type { ImageMetadata } from 'astro';
import hero from '~/assets/hero.png';
import residential from '~/assets/images/residential-rock-wall.jpg';
import commercial from '~/assets/images/commercial-cmu.jpg';
import veneer from '~/assets/images/veneer-rock-wall.jpg';

export interface SitePhoto {
  src: ImageMetadata;
  alt: string;
}

/** Project photos used across page heroes and split sections. */
export const photos = {
  hero: {
    src: hero,
    alt: "Volcanic basalt rock wall overlooking O'ahu",
  },
  residential: {
    src: residential,
    alt: "Residential volcanic rock boundary wall at an O'ahu home",
  },
  commercial: {
    src: commercial,
    alt: "CMU block wall and concrete flatwork under construction on O'ahu",
  },
  veneer: {
    src: veneer,
    alt: "Completed veneer rock wall at an O'ahu residence",
  },
} as const satisfies Record<string, SitePhoto>;

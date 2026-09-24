/**
 * Per-site motif (background pattern).
 *
 * Temporary starter uses a page-level wallpaper (`PageBg` in Layout).
 * Replace the pattern and colors when the new Figma design system arrives.
 * Sections that should show it stay transparent; sections that should not,
 * keep a solid fill (`bg-page`, `bg-card`, ...).
 *
 * Per-section `<SectionBg>` still works — leave `sections` off so the motif
 * is not painted twice.
 *
 * To restyle a new website:
 * 1. Drop a new SVG/PNG in `src/assets/images/patterns/` (black shape, transparent ground).
 * 2. Point `pattern` at that file.
 * 3. Toggle page vs section, plus fade / tile size / repeat.
 * 4. Colors and opacity stay in `src/brand.ts`.
 */
import type { ImageMetadata } from 'astro';
import leafMotif from '~/assets/images/small-leaf-motif.webp';

export type MotifFade = 'top-to-bottom' | 'bottom-to-top' | 'none';
export type MotifSection = 'hero' | 'dark' | 'grey' | 'white' | 'cta';

export const MOTIF = {
  /** Black-on-transparent tile used as a CSS mask. Swap this file per client. */
  pattern: leafMotif as ImageMetadata,

  /**
   * Per-section MotifLayer. Leave false — the wallpaper lives on the page
   * (`PageBg`), and individual sections punch through or cover it.
   */
  sections: {
    hero: false,
    dark: false,
    grey: false,
    white: false,
    cta: false,
  } satisfies Record<MotifSection, boolean>,

  fade: 'none' as MotifFade,

  /**
   * CSS mask-size. Pixel size + `repeat` tiles the produce motif.
   * Native artboard is 622×1024; 400px wide keeps a dense wallpaper.
   */
  size: '622px auto',

  /** CSS mask-repeat. Pair with a pixel `size` for wallpaper tiling. */
  repeat: 'repeat',

  /** Opacity of the page wallpaper leaves (`brand.motif.pageOpacity`). */
  pageOpacity: 'var(--aw-opacity-motif-page)',
};

export const MOTIF_COLOR_VARS: Record<Exclude<MotifSection, 'cta'> | 'cta', string> = {
  hero: 'var(--aw-color-motif-hero)',
  dark: 'var(--aw-color-motif-dark)',
  grey: 'var(--aw-color-motif-grey)',
  white: 'var(--aw-color-motif-white)',
  cta: 'var(--aw-color-motif-cta)',
};

export const MOTIF_OPACITY_VARS: Record<MotifSection, string> = {
  hero: 'var(--aw-opacity-motif-hero)',
  dark: 'var(--aw-opacity-motif-dark)',
  grey: 'var(--aw-opacity-motif-grey)',
  white: 'var(--aw-opacity-motif-white)',
  cta: 'var(--aw-opacity-motif-cta)',
};

export function motifFadeMask(fade: MotifFade = MOTIF.fade): string | undefined {
  if (fade === 'none') return undefined;
  if (fade === 'bottom-to-top') return 'linear-gradient(to top, black 0%, transparent 100%)';
  return 'linear-gradient(to bottom, black 0%, transparent 100%)';
}

/** Accept a number (0.15), a percent string ("15%"), or pass through a CSS value. */
export function parseMotifOpacity(value: number | string | undefined, fallbackCss: string): string {
  if (value === undefined || value === '') return fallbackCss;
  if (typeof value === 'number') return String(value);
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) return String(Number.parseFloat(trimmed) / 100);
  return trimmed;
}

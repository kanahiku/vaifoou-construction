import type { CustomValidatorResult, ValidationContext } from 'sanity';

/**
 * Publish validation shared by every schema.
 * Sanity blocks Publish while any rule below returns an error, so incomplete content can't go live.
 */

// Rule generics differ per field type (string, slug, document…); these helpers are shared, so keep the rule loose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRule = any;
type Parent = { decorative?: boolean; asset?: unknown } | undefined;

/** Alt text is required on every image unless the editor marks it decorative (then alt stays empty). */
export const altRequired = (rule: AnyRule) =>
  rule.custom((alt: unknown, context: ValidationContext): CustomValidatorResult => {
    const parent = context.parent as Parent;
    if (!parent?.asset) return true; // no image uploaded yet — nothing to describe
    if (parent.decorative) return true;
    return typeof alt === 'string' && alt.trim() ? true : 'Add alt text, or tick "Decorative image" if it adds no meaning.';
  });

/** Slug must exist and be lowercase URL-safe. */
export const slugRequired = (rule: AnyRule) =>
  rule.custom((value: unknown): CustomValidatorResult => {
    const current = (value as { current?: string } | undefined)?.current;
    if (!current) return 'Slug is required — click "Generate".';
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current) ? true : 'Use lowercase letters, numbers and hyphens only.';
  });

/** Internal path like /services/rock-walls/ — leading and trailing slash. */
export const internalPath = (rule: AnyRule) =>
  rule.custom((value: unknown) =>
    typeof value === 'string' && /^\/(?:[a-z0-9-]+\/)*$/.test(value) ? true : 'Use an internal path such as /services/rock-walls/'
  );

/** Custom JSON-LD must be valid JSON, and every node needs @type (or @graph). */
export const validJsonLd = (rule: AnyRule) =>
  rule.custom((value: unknown): CustomValidatorResult => {
    if (typeof value !== 'string' || !value.trim()) return true;
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      return `Not valid JSON: ${(error as Error).message}`;
    }
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    const ok = nodes.every((n) => n && typeof n === 'object' && ('@type' in n || '@graph' in n));
    return ok ? true : 'Every JSON-LD block needs an "@type" (e.g. "LocalBusiness", "FAQPage").';
  });

/** Document-level guard: title and slug must both be present before publishing. */
export const requireTitleAndSlug = (rule: AnyRule) =>
  rule.custom((doc: unknown): CustomValidatorResult => {
    const d = doc as { title?: string; slug?: { current?: string } } | undefined;
    if (!d?.title?.trim()) return 'Title is required to publish.';
    if (!d?.slug?.current) return 'Slug is required to publish.';
    return true;
  });

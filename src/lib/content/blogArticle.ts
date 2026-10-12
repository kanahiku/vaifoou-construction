import type { BlogContentBlock, BlogContentImage, BlogPost, ServiceSection } from './types';

export interface TocItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

export interface ArticleBlock {
  section: ServiceSection;
  headingId?: string;
  showHeading: boolean;
  images: BlogContentImage[];
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function uniqueHeadingId(text: string, used: Set<string>): string {
  let id = slugifyHeading(text) || 'section';
  let unique = id;
  let n = 2;
  while (used.has(unique)) {
    unique = `${id}-${n++}`;
  }
  used.add(unique);
  return unique;
}

function normalizeHeading(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function hasRichLocalSections(post: BlogPost): boolean {
  return post.sections.some((section) => section._type !== 'editorialSection');
}

export function shouldUsePortableBody(post: BlogPost): boolean {
  if (!post.contentBlocks?.length) return false;
  return !hasRichLocalSections(post);
}

function groupInlineImages(blocks: BlogContentBlock[] | undefined): Map<string, BlogContentImage[]> {
  const groups = new Map<string, BlogContentImage[]>();
  let current = '';

  for (const block of blocks ?? []) {
    if (block._type === 'heading' && block.level === 2) {
      current = normalizeHeading(block.text);
      continue;
    }
    if (block._type !== 'image') continue;
    const list = groups.get(current) ?? [];
    list.push(block);
    groups.set(current, list);
  }

  return groups;
}

export function getLeadInlineImages(post: BlogPost): BlogContentImage[] {
  if (shouldUsePortableBody(post)) return [];
  return groupInlineImages(post.contentBlocks).get('') ?? [];
}

function imagesForHeading(groups: Map<string, BlogContentImage[]>, heading?: string): BlogContentImage[] {
  if (!heading) return [];
  return groups.get(normalizeHeading(heading)) ?? [];
}

export function getUnmatchedInlineImages(post: BlogPost): BlogContentImage[] {
  if (shouldUsePortableBody(post)) return [];
  const groups = groupInlineImages(post.contentBlocks);
  const matched = new Set(
    post.sections.map((section) => normalizeHeading(section.heading ?? '')).filter(Boolean)
  );
  const leftover: BlogContentImage[] = [];

  for (const [heading, images] of groups) {
    if (!heading || matched.has(heading)) continue;
    leftover.push(...images);
  }

  return leftover;
}

export function getArticleToc(post: BlogPost): TocItem[] {
  if (shouldUsePortableBody(post)) {
    const used = new Set<string>();
    return (post.contentBlocks ?? [])
      .filter(
        (block): block is Extract<BlogContentBlock, { _type: 'heading' }> =>
          block._type === 'heading' && (block.level === 2 || block.level === 3)
      )
      .map((block) => ({
        id: uniqueHeadingId(block.text, used),
        title: block.text,
        level: block.level as 2 | 3,
      }));
  }

  const used = new Set<string>();
  const items: TocItem[] = [];

  for (const section of post.sections) {
    const heading = section.heading?.trim();
    if (!heading || heading === post.title) continue;
    items.push({ id: uniqueHeadingId(heading, used), title: heading, level: 2 });
  }

  return items;
}

export function getArticleBlocks(post: BlogPost): ArticleBlock[] {
  const toc = getArticleToc(post);
  const imageGroups = groupInlineImages(post.contentBlocks);
  let tocIndex = 0;

  return post.sections.map((section) => {
    const heading = section.heading?.trim() ?? '';
    const showHeading = Boolean(heading) && heading !== post.title;
    return {
      section,
      headingId: showHeading ? toc[tocIndex++]?.id : undefined,
      showHeading,
      images: imagesForHeading(imageGroups, heading),
    };
  });
}

export function getPortableHeadingId(post: BlogPost, key: string): string | undefined {
  const used = new Set<string>();
  for (const block of post.contentBlocks ?? []) {
    if (block._type !== 'heading' || (block.level !== 2 && block.level !== 3)) continue;
    const id = uniqueHeadingId(block.text, used);
    if (block._key === key) return id;
  }
  return undefined;
}

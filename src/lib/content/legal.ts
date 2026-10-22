import { CONTACT } from '../../config/contact';
import { sanityClient } from '../sanity/client';
import type { LegalPageContent } from './types';

/**
 * Legal pages from Sanity (`legalPage`, matched by `path`).
 * Portable Text paragraphs are rendered to escaped HTML here (bold / italic / links supported).
 * Tokens filled from config: {business}, {phone} (linked), {email} (linked).
 */

type Span = { _type?: string; text?: string; marks?: string[] };
type Block = { _type: string; children?: Span[]; markDefs?: Array<{ _key: string; _type: string; href?: string }> };

const esc = (v: string) =>
  v.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const LINK_CLASS = 'text-nav-cta transition-colors hover:text-accent';

function tokens(html: string): string {
  return html
    .replaceAll('{business}', esc(CONTACT.businessName))
    .replaceAll('{phone}', `<a href="${esc(CONTACT.phone.href)}" class="${LINK_CLASS}">${esc(CONTACT.phone.display)}</a>`)
    .replaceAll('{email}', `<a href="mailto:${esc(CONTACT.email)}" class="${LINK_CLASS}">${esc(CONTACT.email)}</a>`);
}

function blockToHtml(block: Block): string {
  if (block._type !== 'block') return '';
  const html = (block.children ?? [])
    .map((span) => {
      let out = esc(span.text ?? '');
      for (const mark of span.marks ?? []) {
        if (mark === 'strong') out = `<strong>${out}</strong>`;
        else if (mark === 'em') out = `<em>${out}</em>`;
        else {
          const def = block.markDefs?.find((m) => m._key === mark);
          if (def?.href) out = `<a href="${esc(def.href)}" class="${LINK_CLASS}">${out}</a>`;
        }
      }
      return out;
    })
    .join('');
  return tokens(html);
}

const paragraphs = (blocks?: Block[] | null) => (blocks ?? []).map(blockToHtml).filter(Boolean);

export async function getLegalPage(path: string): Promise<LegalPageContent | null> {
  const d = await sanityClient.fetch<any>(
    /* groq */ `*[_type == "legalPage" && path == $path][0] {
      path, seo { title, description }, heading, intro,
      "sections": sections[] { heading, body },
      cta { heading, note }
    }`,
    { path }
  );
  if (!d) return null;
  const plain = (v?: string | null) => (v ?? '').replaceAll('{business}', CONTACT.businessName);
  return {
    path: d.path,
    seo: { title: plain(d.seo?.title), description: plain(d.seo?.description) },
    heading: plain(d.heading),
    intro: paragraphs(d.intro),
    sections: (d.sections ?? []).map((sec: any) => ({ heading: plain(sec.heading), body: paragraphs(sec.body) })),
    cta: { heading: plain(d.cta?.heading), note: d.cta?.note?.trim() ? plain(d.cta.note) : undefined },
  };
}

import { useClient, type DocumentActionComponent } from 'sanity';

/**
 * When a page's URL changes on publish (blog slug or a page `path`), automatically create a
 * permanent redirect document so the old URL keeps working. The site's 404 handler reads these.
 */

type Doc = { _type?: string; slug?: { current?: string }; path?: unknown } | null | undefined;

export function urlOf(doc: Doc): string | null {
  if (!doc) return null;
  if (doc._type === 'blogPost') return doc.slug?.current ? `/blog/${doc.slug.current}/` : null;
  return typeof doc.path === 'string' && doc.path ? doc.path : null;
}

const idFor = (from: string) => `slugRedirect-${from.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root'}`;

type Client = ReturnType<typeof useClient>;

async function saveRedirect(client: Client, from: string, to: string) {
  const tx = client.transaction();
  // Never leave a redirect pointing back at the live URL (A→B then B→A).
  tx.delete(idFor(to));
  tx.createOrReplace({ _id: idFor(from), _type: 'slugRedirect', from, to, permanent: true, auto: true });
  // Collapse chains: anything that pointed at the old URL now points at the new one.
  const chained = await client.fetch<Array<{ _id: string }>>('*[_type == "slugRedirect" && to == $from]{_id}', { from });
  chained.forEach(({ _id }) => tx.patch(_id, (p) => p.set({ to })));
  await tx.commit();
}

export const withSlugRedirect =
  (original: DocumentActionComponent): DocumentActionComponent => {
    const Action: DocumentActionComponent = (props) => {
      const client = useClient({ apiVersion: '2024-01-01' });
      const base = original(props);
      if (!base) return base;
      return {
        ...base,
        onHandle: async () => {
          const from = urlOf(props.published as Doc);
          const to = urlOf(props.draft as Doc);
          if (from && to && from !== to) await saveRedirect(client, from, to);
          base.onHandle?.();
        },
      };
    };
    Action.action = original.action;
    return Action;
  };

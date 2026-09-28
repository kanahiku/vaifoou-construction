import type { StructureBuilder } from 'sanity/structure';

const SINGLETONS: Record<string, string> = {
  siteNavigation: 'singleton-navigation',
  siteFooter: 'singleton-footer',
};

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Navigation')
        .child(S.document().schemaType('siteNavigation').documentId('singleton-navigation').title('Navigation')),

      S.listItem()
        .title('Footer')
        .child(S.document().schemaType('siteFooter').documentId('singleton-footer').title('Footer')),

      S.divider(),

      S.listItem()
        .title('Blog')
        .schemaType('blogPost')
        .child(
          S.documentTypeList('blogPost').title('Blog posts').defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('Testimonials')
        .schemaType('testimonial')
        .child(
          S.documentTypeList('testimonial').title('Testimonials').defaultOrdering([
            { field: 'order', direction: 'asc' },
            { field: 'name', direction: 'asc' },
          ])
        ),
    ]);

export const singletonTypes = new Set(Object.keys(SINGLETONS));

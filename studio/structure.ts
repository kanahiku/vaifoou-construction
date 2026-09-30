import type { StructureBuilder } from 'sanity/structure';

const SINGLETONS: Record<string, string> = {
  siteNavigation: 'singleton-navigation',
  siteFooter: 'singleton-footer',
  homePage: 'singleton-home',
  contactPageMedia: 'singleton-contact-page-media',
  servicesHubPage: 'singleton-services-hub',
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
        .title('Homepage')
        .child(S.document().schemaType('homePage').documentId('singleton-home').title('Homepage')),

      S.listItem()
        .title('About Page Images')
        .child(
          S.document().schemaType('aboutPageMedia').documentId('singleton-about-page-media').title('About Page Images')
        ),

      S.listItem()
        .title('Contact Page Images')
        .child(
          S.document()
            .schemaType('contactPageMedia')
            .documentId('singleton-contact-page-media')
            .title('Contact Page Images')
        ),

      S.listItem()
        .title('Services Hub')
        .child(S.document().schemaType('servicesHubPage').documentId('singleton-services-hub').title('Services Hub')),

      S.listItem()
        .title('Who We Work With Images')
        .schemaType('audiencePageMedia')
        .child(S.documentTypeList('audiencePageMedia').title('Who We Work With Images')),

      S.listItem()
        .title('Commercial Audience Sub-page Images')
        .schemaType('commercialAudienceSubPageMedia')
        .child(S.documentTypeList('commercialAudienceSubPageMedia').title('Commercial Audience Sub-page Images')),

      S.listItem()
        .title('Service Category Images')
        .schemaType('serviceCategoryPageMedia')
        .child(S.documentTypeList('serviceCategoryPageMedia').title('Service Category Images')),

      S.listItem()
        .title('Rock Wall Sub-page Images')
        .schemaType('rockWallSubPageMedia')
        .child(S.documentTypeList('rockWallSubPageMedia').title('Rock Wall Sub-page Images')),

      S.listItem()
        .title('Concrete Service Sub-page Images')
        .schemaType('concreteServiceSubPageMedia')
        .child(S.documentTypeList('concreteServiceSubPageMedia').title('Concrete Service Sub-page Images')),

      S.listItem()
        .title('Service Areas Hub Images')
        .child(
          S.document()
            .schemaType('serviceAreaHubPageMedia')
            .documentId('singleton-service-area-hub')
            .title('Service Areas Hub Images')
        ),

      S.listItem()
        .title('Service Area Location Images')
        .schemaType('serviceAreaLocationPageMedia')
        .child(S.documentTypeList('serviceAreaLocationPageMedia').title('Service Area Location Images')),

      S.divider(),

      S.listItem()
        .title('Blog')
        .schemaType('blogPost')
        .child(
          S.documentTypeList('blogPost')
            .title('Blog posts')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('Testimonials')
        .schemaType('testimonial')
        .child(
          S.documentTypeList('testimonial')
            .title('Testimonials')
            .defaultOrdering([
              { field: 'order', direction: 'asc' },
              { field: 'name', direction: 'asc' },
            ])
        ),
    ]);

export const singletonTypes = new Set(Object.keys(SINGLETONS));

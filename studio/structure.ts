import type { StructureBuilder } from 'sanity/structure';

const SINGLETONS: Record<string, string> = {
  siteNavigation: 'singleton-navigation',
  siteFooter: 'singleton-footer',
  homePage: 'singleton-home',
  contactPageMedia: 'singleton-contact-page-media',
  servicesHubPage: 'singleton-services-hub',
};

const singleton = (S: StructureBuilder, title: string, schemaType: string, documentId: string) =>
  S.listItem().title(title).id(documentId).child(S.document().schemaType(schemaType).documentId(documentId).title(title));

const list = (S: StructureBuilder, title: string, schemaType: string) =>
  S.listItem().title(title).schemaType(schemaType).child(S.documentTypeList(schemaType).title(title));

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // ── Pages whose text + images are fully managed in Sanity ──────────
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              singleton(S, 'Homepage', 'homePage', 'singleton-home'),
              singleton(S, 'About (/about/)', 'aboutPage', 'singleton-about'),
              singleton(S, 'Reviews (/reviews/)', 'reviewsPage', 'singleton-reviews'),
              singleton(S, 'Projects (/projects/)', 'projectsPage', 'singleton-projects'),
              singleton(S, 'Blog (/blog/)', 'blogPage', 'singleton-blog'),
              S.listItem()
                .title('Who we work with')
                .id('audience-pages')
                .child(
                  S.list()
                    .title('Who we work with')
                    .items([
                      S.listItem()
                        .title('Residential & Commercial')
                        .schemaType('audienceLandingPage')
                        .child(S.documentTypeList('audienceLandingPage').title('Landing pages').defaultOrdering([{ field: 'path', direction: 'asc' }])),
                      S.listItem()
                        .title('Commercial client pages')
                        .schemaType('audienceSubPage')
                        .child(S.documentTypeList('audienceSubPage').title('Commercial client pages').defaultOrdering([{ field: 'order', direction: 'asc' }])),
                    ])
                ),
              S.listItem()
                .title('Legal pages')
                .schemaType('legalPage')
                .child(S.documentTypeList('legalPage').title('Legal pages').defaultOrdering([{ field: 'path', direction: 'asc' }])),
              S.divider(),
              S.listItem()
                .title('Services')
                .id('services-pages')
                .child(
                  S.list()
                    .title('Services')
                    .items([
                      singleton(S, 'Services Hub (/services/)', 'servicesHubPage', 'singleton-services-hub'),
                      S.divider(),
                      S.listItem()
                        .title('Service categories')
                        .schemaType('serviceCategoryPage')
                        .child(
                          S.documentTypeList('serviceCategoryPage')
                            .title('Service categories')
                            .defaultOrdering([{ field: 'path', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Rock wall pages')
                        .schemaType('serviceSubPage')
                        .child(
                          S.documentList()
                            .title('Rock wall pages')
                            .schemaType('serviceSubPage')
                            .filter('_type == "serviceSubPage" && path match "/services/rock-walls/*"')
                            .defaultOrdering([{ field: 'path', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Concrete pages')
                        .schemaType('serviceSubPage')
                        .child(
                          S.documentList()
                            .title('Concrete pages')
                            .schemaType('serviceSubPage')
                            .filter('_type == "serviceSubPage" && path match "/services/concrete/*"')
                            .defaultOrdering([{ field: 'path', direction: 'asc' }])
                        ),
                    ])
                ),
              S.listItem()
                .title('Service areas')
                .id('service-areas-pages')
                .child(
                  S.list()
                    .title('Service areas')
                    .items([
                      singleton(S, 'Service Areas Hub (/service-areas/)', 'serviceAreasHubPage', 'singleton-service-areas-hub'),
                      S.divider(),
                      S.listItem()
                        .title('Area pages')
                        .schemaType('serviceAreaPage')
                        .child(
                          S.documentTypeList('serviceAreaPage')
                            .title('Area pages')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                    ])
                ),
            ])
        ),

      // ── Pages that are still image-only (text lives in code for now) ───
      S.listItem()
        .title('Contact page images')
        .id('page-images')
        .child(
          S.list()
            .title('Contact page images')
            .items([
              singleton(S, 'Contact Page Images', 'contactPageMedia', 'singleton-contact-page-media'),
            ])
        ),

      S.divider(),

      // ── Collections ────────────────────────────────────────────────────
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([
              { field: 'order', direction: 'asc' },
              { field: 'title', direction: 'asc' },
            ])
        ),

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

      S.divider(),

      // ── Site-wide ──────────────────────────────────────────────────────
      S.listItem()
        .title('Site settings')
        .id('site-settings')
        .child(
          S.list()
            .title('Site settings')
            .items([
              singleton(S, 'Navigation (header)', 'siteNavigation', 'singleton-navigation'),
              singleton(S, 'Footer', 'siteFooter', 'singleton-footer'),
            ])
        ),
    ]);

export const singletonTypes = new Set(Object.keys(SINGLETONS));

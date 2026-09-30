import type { NavigationContent } from '~/lib/content/types';
import { CONTACT, PRIMARY_CTA_HREF, SOCIAL } from '~/config';

export const navigationData: NavigationContent = {
  header: {
    links: [
      {
        text: 'Services',
        href: '/services/',
        links: [
          {
            text: 'Rock Walls',
            href: '/services/rock-walls/',
            links: [
              { text: 'Veneer Rock Walls', href: '/services/rock-walls/veneer/' },
              { text: 'Rock Wall Repair', href: '/services/rock-walls/repair/' },
              { text: 'Rock Retaining Walls', href: '/services/rock-walls/retaining/' },
              { text: 'Planter & Garden Rock Walls', href: '/services/rock-walls/planter-garden/' },
            ],
          },
          { text: 'Retaining Walls', href: '/services/retaining-walls/' },
          { text: 'CMU & Block Walls', href: '/services/cmu-block-walls/' },
          {
            text: 'Concrete Services',
            href: '/services/concrete/',
            links: [
              { text: 'Driveways', href: '/services/concrete/driveways/' },
              { text: 'Sidewalks & Walkways', href: '/services/concrete/sidewalks/' },
              { text: 'Patios', href: '/services/concrete/patios/' },
              { text: 'Steps & Stairways', href: '/services/concrete/steps/' },
              { text: 'Foundations', href: '/services/concrete/foundations/' },
              { text: 'Stem Walls', href: '/services/concrete/stem-walls/' },
              { text: 'Stamped & Decorative', href: '/services/concrete/stamped-decorative/' },
              { text: 'Concrete Sealing', href: '/services/concrete/sealing/' },
            ],
          },
        ],
      },
      {
        text: 'Who We Work With',
        // No href — dropdown label only, not a navigation link
        links: [
          { text: 'Residential Masonry & Concrete', href: '/who-we-work-with/residential/' },
          {
            text: 'Commercial Masonry & Concrete',
            href: '/who-we-work-with/commercial/',
            links: [
              { text: 'Property Managers & Landlords',     href: '/who-we-work-with/commercial/property-managers-landlords/' },
              { text: 'HOA Masonry & Concrete',            href: '/who-we-work-with/commercial/hoa/' },
              { text: 'Masonry & Concrete Subcontracting', href: '/who-we-work-with/commercial/contractors/' },
            ],
          },
        ],
      },
      {
        text: 'Service Areas',
        href: '/service-areas/',
        links: [
          { text: 'Wahiawa', href: '/service-areas/wahiawa/' },
          { text: 'Mililani', href: '/service-areas/mililani/' },
          { text: 'Honolulu', href: '/service-areas/honolulu/' },
          { text: 'Aiea & Pearl City', href: '/service-areas/aiea-pearl-city/' },
          { text: 'Waipahu', href: '/service-areas/waipahu/' },
          { text: 'Ewa Beach', href: '/service-areas/ewa-beach/' },
          { text: 'Kapolei', href: '/service-areas/kapolei/' },
          { text: 'Kailua', href: '/service-areas/kailua/' },
          { text: 'Kaneohe', href: '/service-areas/kaneohe/' },
          { text: 'North Shore & Haleiwa', href: '/service-areas/north-shore/' },
        ],
      },
      { text: 'Reviews', href: '/reviews/' },
      { text: 'Blog', href: '/blog/' },
      { text: 'About', href: '/about/' },
      { text: 'Contact', href: '/contact/' },
    ],
    actions: [],
  },

  footer: {
    links: [
      {
        title: 'SERVICES',
        links: [
          { text: 'Rock Walls', href: '/services/rock-walls/' },
          { text: 'Retaining Walls', href: '/services/retaining-walls/' },
          { text: 'CMU & Block Walls', href: '/services/cmu-block-walls/' },
          { text: 'Concrete Services', href: '/services/concrete/' },
        ],
      },
      {
        title: 'SERVICE AREAS',
        links: [
          { text: 'Wahiawa', href: '/service-areas/wahiawa/' },
          { text: 'Mililani', href: '/service-areas/mililani/' },
          { text: 'Honolulu', href: '/service-areas/honolulu/' },
          { text: 'Aiea & Pearl City', href: '/service-areas/aiea-pearl-city/' },
          { text: 'Waipahu', href: '/service-areas/waipahu/' },
          { text: 'Ewa Beach', href: '/service-areas/ewa-beach/' },
          { text: 'Kapolei', href: '/service-areas/kapolei/' },
          { text: 'Kailua', href: '/service-areas/kailua/' },
          { text: 'Kaneohe', href: '/service-areas/kaneohe/' },
          { text: 'North Shore & Haleiwa', href: '/service-areas/north-shore/' },
        ],
      },
      {
        title: 'WHO WE SERVE',
        links: [
          { text: 'Residential Homeowners',      href: '/who-we-work-with/residential/' },
          { text: 'Commercial & Civil',          href: '/who-we-work-with/commercial/' },
        ],
      },
      {
        title: 'COMPANY',
        links: [
          { text: 'Reviews', href: '/reviews/' },
          { text: 'Blog', href: '/blog/' },
          { text: 'About', href: '/about/' },
          { text: 'Contact', href: '/contact/' },
          { text: 'Closed on Sundays' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Privacy Policy', href: '/privacy-policy/' },
      { text: 'Terms',          href: '/terms/' },
      { text: 'Accessibility',  href: '/accessibility/' },
    ],
    socialLinks: SOCIAL.nav as unknown as NavigationContent['footer']['socialLinks'],
    footNote: `&copy; ${new Date().getFullYear()} ${CONTACT.businessName} LLC. All rights reserved.`,
  },
};

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
          { text: 'Residential Masonry & Concrete', href: '/residential/' },
          {
            text: 'Commercial Masonry & Concrete',
            href: '/commercial/',
            links: [
              { text: 'Property Managers & Landlords',     href: '/commercial/property-managers-landlords/' },
              { text: 'HOA Masonry & Concrete',            href: '/commercial/hoa/' },
              { text: 'Masonry & Concrete Subcontracting', href: '/commercial/contractors/' },
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
      { text: 'Projects', href: '/projects/' },
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
          { text: 'All Services', href: '/services/' },
          { text: 'Rock Walls', href: '/services/rock-walls/' },
          { text: 'Veneer Rock Walls', href: '/services/rock-walls/veneer/' },
          { text: 'Rock Wall Repair', href: '/services/rock-walls/repair/' },
          { text: 'Rock Retaining Walls', href: '/services/rock-walls/retaining/' },
          { text: 'Planter & Garden Rock Walls', href: '/services/rock-walls/planter-garden/' },
          { text: 'Retaining Walls', href: '/services/retaining-walls/' },
          { text: 'CMU & Block Walls', href: '/services/cmu-block-walls/' },
          { text: 'Concrete Services', href: '/services/concrete/' },
          { text: 'Driveways', href: '/services/concrete/driveways/' },
          { text: 'Sidewalks & Walkways', href: '/services/concrete/sidewalks/' },
          { text: 'Patios', href: '/services/concrete/patios/' },
          { text: 'Steps & Stairways', href: '/services/concrete/steps/' },
          { text: 'Foundations', href: '/services/concrete/foundations/' },
          { text: 'Stem Walls', href: '/services/concrete/stem-walls/' },
          { text: 'Stamped & Decorative Concrete', href: '/services/concrete/stamped-decorative/' },
          { text: 'Concrete Sealing', href: '/services/concrete/sealing/' },
        ],
      },
      {
        title: 'SERVICE AREAS',
        links: [
          { text: "All O'ahu Service Areas", href: '/service-areas/' },
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
        title: 'WHO WE WORK WITH',
        links: [
          { text: 'Residential Masonry & Concrete',    href: '/residential/' },
          { text: 'Commercial Masonry & Concrete',     href: '/commercial/' },
          { text: 'Property Managers & Landlords',     href: '/commercial/property-managers-landlords/' },
          { text: 'HOA Masonry & Concrete',            href: '/commercial/hoa/' },
          { text: 'Masonry & Concrete Subcontracting', href: '/commercial/contractors/' },
        ],
      },
      {
        title: 'VAIFOOU CONSTRUCTION',
        links: [
          { text: 'Our Story', href: '/about/' },
          { text: 'Projects & Gallery', href: '/projects/' },
          { text: 'Reviews', href: '/reviews/' },
          { text: 'Blog', href: '/blog/' },
          { text: 'Contact / Request an Estimate', href: '/contact/' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Privacy Policy', href: '/privacy-policy/' },
      { text: 'Terms', href: '/terms/' },
      { text: 'Accessibility', href: '/accessibility/' },
    ],
    socialLinks: SOCIAL.nav as unknown as NavigationContent['footer']['socialLinks'],
    footNote: `&copy; ${new Date().getFullYear()} ${CONTACT.businessName} LLC. All rights reserved. O&#x2019;ahu, Hawai&#x02BB;i.`,
  },
};

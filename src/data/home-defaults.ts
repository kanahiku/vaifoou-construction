import type { HomePageContent } from '../lib/content/types';

/**
 * Baseline homepage copy.
 *
 * - `scripts/seed-home-to-sanity.ts` uses it to fill empty fields in the Sanity `homePage` document.
 * - `getHomeContent()` falls back to it per field, so the page still renders if a field is empty
 *   or Sanity is unreachable.
 *
 * Images are intentionally absent — they come only from Sanity.
 * Editors change copy in Studio; this file is not the source of truth once seeded.
 */
export const HOME_DEFAULTS: HomePageContent = {
  seo: {
    title: "Vaifoou Construction | O'ahu Masonry & Concrete Contractor",
    description:
      "Family-owned masonry and concrete contractor serving all of O'ahu. Backed by a 25+ year family legacy in the trade. Request your free estimate today.",
  },

  hero: {
    heading: "O'ahu Masonry & Concrete Specialists",
    subheading: 'Concrete – Rockwall – CMU. Backed by a 25+ year family legacy in the masonry trade.',
    trustBadges: ['Licensed & Insured', "Serving All of O'ahu"],
  },

  intro: {
    heading: 'Built to last. Built right.',
    body: "We are a locally owned family business specializing in concrete and masonry. Our work rests on a 25+ year family legacy in the masonry trade that goes back to around 2000. We build rock walls, CMU and block walls, and concrete for O'ahu homeowners, property owners and contractors. Every project comes with our workmanship guarantee.",
    audienceCards: [
      {
        label: 'Residential',
        title: 'Working on your home?',
        ctaLabel: 'View Residential Masonry & Concrete',
        href: '/who-we-work-with/residential/',
      },
      {
        label: 'Commercial & civil',
        title: 'Managing a commercial property, an HOA or a job site?',
        ctaLabel: 'View Commercial Masonry & Concrete',
        href: '/who-we-work-with/commercial/',
      },
    ],
  },

  services: {
    heading: 'Core Masonry Services',
    items: [
      {
        title: 'Rock Walls',
        icon: 'rock-wall',
        description: 'Custom boundaries built with hand-selected volcanic basalt.',
        ctaLabel: 'View Rock Wall Services',
        href: '/services/rock-walls/',
      },
      {
        title: 'Retaining Wall',
        icon: 'retaining-wall',
        description: "Rock and CMU retaining walls built for O'ahu hillsides and elevation changes.",
        ctaLabel: 'View Retaining Wall Services',
        href: '/services/retaining-walls/',
      },
      {
        title: 'CMU & Block Walls',
        icon: 'walls',
        description: 'Retaining walls and block fences built for long-term stability.',
        ctaLabel: 'View CMU & Block Walls',
        href: '/services/cmu-block-walls/',
      },
      {
        title: 'Concrete Services',
        icon: 'hammer',
        description: 'Custom driveways, sidewalks, and flatwork poured for long-term durability.',
        ctaLabel: 'View Concrete Services',
        href: '/services/concrete/',
      },
    ],
  },

  highlightBanner: {
    heading: 'Custom Veneer Rock Walls',
    body: 'Veneer rock walls arrive on pallets and feature flat corners for a clean finish. The material is lighter to carry, and compared with standard block, it can save roughly two feet of property space.',
    ctaLabel: 'View Veneer Rock Walls',
    ctaHref: '/services/rock-walls/veneer/',
  },

  serviceAreas: {
    heading: "Serving All of O'ahu",
    body: 'Our crews manage residential and commercial masonry projects across the entire island. We work in Wahiawa, Mililani, Honolulu, Aiea and Pearl City, Waipahu, Ewa Beach, Kapolei, Kailua, Kaneohe, and the North Shore and Haleiwa.',
    ctaLabel: "View All O'ahu Service Areas",
    ctaHref: '/service-areas/',
    areas: [
      { label: 'Wahiawa', href: '/service-areas/wahiawa/' },
      { label: 'Mililani', href: '/service-areas/mililani/' },
      { label: 'Honolulu', href: '/service-areas/honolulu/' },
      { label: 'Aiea & Pearl City', href: '/service-areas/aiea-pearl-city/' },
      { label: 'Waipahu', href: '/service-areas/waipahu/' },
      { label: 'Ewa Beach', href: '/service-areas/ewa-beach/' },
      { label: 'Kapolei', href: '/service-areas/kapolei/' },
      { label: 'Kailua', href: '/service-areas/kailua/' },
      { label: 'Kaneohe', href: '/service-areas/kaneohe/' },
      { label: 'North Shore & Haleiwa', href: '/service-areas/north-shore/' },
    ],
  },

  reviews: {
    heading: "Trusted by O'ahu Property Owners",
    count: 3,
    ctaLabel: 'Read Reviews',
    ctaHref: '/reviews/',
  },

  cta: {
    heading: "Start Your O'ahu Masonry Project",
    note: 'Connect with our team to discuss your concrete or rock wall requirements. Please note we are closed on Sundays.',
  },
};

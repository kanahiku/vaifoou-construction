/**
 * Social and directory profile links.
 * Replace every URL when setting up a new site.
 */
export const SOCIAL = {
  nav: [],

  sameAs: [],
} as const;

/** Public review profiles. Omit a platform until a real listing URL exists. */
export const REVIEW_PROFILES = [
  {
    title: 'Google',
    note: 'Read customer ratings and reviews for Vaifoou Construction on Google.',
    href: '#',
    linkText: 'View Vaifoou on Google',
    icon: 'tabler:brand-google',
  },
  {
    title: 'Yelp',
    note: 'Browse customer feedback and star ratings for Vaifoou Construction on Yelp.',
    href: '#',
    linkText: 'View Vaifoou on Yelp',
    icon: 'tabler:star-filled',
  },
  {
    title: 'Thumbtack',
    note: 'See Vaifoou Construction reviews and project history on Thumbtack.',
    href: '#',
    linkText: 'View Vaifoou on Thumbtack',
    icon: 'tabler:pin',
  },
] as const;

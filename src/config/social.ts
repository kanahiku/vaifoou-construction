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
    title: 'BBB',
    note: 'Current BBB profile and rating information are shown on the live listing.',
    href: 'https://www.bbb.org/us/hi/wahiawa/profile/construction/vaifoou-construction-llc-1296-1000160782',
    linkText: 'View Vaifoou on BBB',
    icon: 'tabler:shield-check',
  },
] as const;

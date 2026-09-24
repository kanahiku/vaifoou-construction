import type { NavigationContent } from '~/lib/content/types';
import { CONTACT, PRIMARY_CTA_LABEL, PRIMARY_CTA_HREF, SOCIAL } from '~/config';

export const navigationData: NavigationContent = {
  header: {
    links: [
      { text: 'services', href: '/#services' },
      { text: 'process', href: '/#process' },
      { text: 'reviews', href: '/reviews' },
      { text: 'blog', href: '/blog' },
      { text: 'contact', href: '/contact' },
    ],
    actions: [{ variant: 'primary', text: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF }],
  },

  footer: {
    links: [
      {
        title: 'site',
        links: [
          { text: 'Home', href: '/' },
          { text: 'Services', href: '/#services' },
          { text: 'Process', href: '/#process' },
        ],
      },
      {
        title: 'company',
        links: [
          { text: 'Reviews', href: '/reviews' },
          { text: 'Blog', href: '/blog' },
          { text: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'contact',
        links: [
          { text: CONTACT.phone.display, href: CONTACT.phone.href },
          { text: CONTACT.email, href: `mailto:${CONTACT.email}` },
          { text: 'Request a Quote', href: PRIMARY_CTA_HREF },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Privacy Policy', href: '/privacy-policy' },
      { text: 'Terms', href: '/terms' },
      { text: 'Accessibility', href: '/accessibility' },
    ],
    socialLinks: SOCIAL.nav as unknown as NavigationContent['footer']['socialLinks'],
    footNote: `&copy; ${new Date().getFullYear()} ${CONTACT.businessName}. All rights reserved.`,
  },
};

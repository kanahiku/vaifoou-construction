/**
 * Phone, email, address, and hours.
 * Business name comes from `src/config/site.ts` so it is not duplicated.
 */
import { site } from './site';

export const CONTACT = {
  /** Legal / display business name used in footer, legal pages, CTABanner. */
  businessName: site.name,

  /** Contractor license shown in footer or legal copy (set null if none). */
  license: null as string | null,

  phone: {
    /** Human-readable label — used in nav, footer, CTABanner, CTA buttons. */
    display: '(555) 000-0000',
    /** HTML tel: href — used in all anchor href attributes. */
    href: 'tel:+15550000000',
    /** E.164 format — used in schema.org telephone field. */
    schema: '+1-555-000-0000',
  },

  /** Primary contact email shown in legal pages and schema.org. */
  email: 'hello@example.com',

  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    /** "City, ST ZIP" — used in footer and CTABanner one-liner. */
    get cityLine() {
      const zip = this.zip ? ` ${this.zip}` : '';
      return `${this.city}, ${this.state}${zip}`;
    },
    /** Full one-line address — used as Google Maps query string. */
    get oneLiner() {
      return [this.street, this.city, this.state, this.zip].filter(Boolean).join(', ');
    },
    /** Google Maps embed URL. */
    get mapsEmbedSrc() {
      return `https://maps.google.com/maps?q=${encodeURIComponent(this.oneLiner)}&z=16&output=embed`;
    },
    /** Google Maps directions URL. */
    get mapsDirectionsHref() {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.oneLiner)}`;
    },
  },

  hours: [
    {
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '20:00',
    },
  ],

  areaServed: 'Service Area',
} as const;

import type { BusinessSchema } from './types';
import { CONTACT } from '~/config/contact';
import { SOCIAL } from '~/config/social';
import { site } from '~/config/site';

/**
 * Client-specific business entity for schema.org JSON-LD.
 * Replace fields when setting up a new site.
 */
export const business: BusinessSchema = {
  idFragment: 'business',
  name: CONTACT.businessName,
  businessType: 'LocalBusiness',
  telephone: CONTACT.phone.schema,
  email: CONTACT.email,
  priceRange: '$$',
  address: {
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.city,
    addressRegion: CONTACT.address.state,
    postalCode: CONTACT.address.zip,
    addressCountry: CONTACT.address.country,
  },
  openingHoursSpecification: CONTACT.hours as BusinessSchema['openingHoursSpecification'],
  description: site.description,
  hasCredential: [],
  memberOf: null,
  award: [],
  sameAs: SOCIAL.sameAs as unknown as string[],
  areaServed: { '@type': 'AdministrativeArea', name: CONTACT.areaServed },
};

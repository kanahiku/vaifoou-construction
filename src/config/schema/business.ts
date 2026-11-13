import type { BusinessSchema } from './types';
import { CONTACT } from '~/config/contact';
import { SOCIAL } from '~/config/social';
import { site } from '~/config/site';
import type { SiteSettingsContent } from '~/lib/content/sanity';

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
  openingHoursSpecification: CONTACT.hours as unknown as BusinessSchema['openingHoursSpecification'],
  description: site.description,
  hasCredential: [],
  memberOf: null,
  award: [],
  sameAs: SOCIAL.sameAs as unknown as string[],
  areaServed: { '@type': 'AdministrativeArea', name: CONTACT.areaServed },
};

/**
 * Sanity Site Settings → schema.org business fields. Only non-empty Studio values override
 * the config defaults above, so an unfilled Site Settings document changes nothing.
 */
export function businessFromSettings(settings: SiteSettingsContent | null | undefined): Partial<BusinessSchema> {
  if (!settings) return {};
  const out: Partial<BusinessSchema> = {};
  const a = settings.address;

  if (settings.businessName) out.name = settings.businessName;
  if (settings.businessType) out.businessType = settings.businessType;
  if (settings.description) out.description = settings.description;
  if (settings.phone) out.telephone = settings.phone;
  if (settings.email) out.email = settings.email;
  if (settings.priceRange) out.priceRange = settings.priceRange;
  if (a?.city || a?.street) {
    out.address = {
      streetAddress: a.street ?? business.address.streetAddress,
      addressLocality: a.city ?? business.address.addressLocality,
      addressRegion: a.state ?? business.address.addressRegion,
      postalCode: a.zip ?? business.address.postalCode,
      addressCountry: a.country ?? business.address.addressCountry,
    };
  }
  const hours = (settings.hours ?? []).filter((h) => h.days?.length && h.opens && h.closes);
  if (hours.length) {
    out.openingHoursSpecification = hours.map((h) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: h.days as string[],
      opens: h.opens as string,
      closes: h.closes as string,
    }));
  }
  if (settings.serviceAreas?.length) {
    out.areaServed = settings.serviceAreas.map((name) => ({ '@type': 'AdministrativeArea' as const, name }));
  }
  if (settings.logo) out.logo = settings.logo;
  if (settings.mapUrl) out.hasMap = settings.mapUrl;
  if (settings.geo?.latitude != null && settings.geo?.longitude != null) {
    out.geo = { latitude: settings.geo.latitude, longitude: settings.geo.longitude };
  }
  if (settings.socialLinks?.length) out.sameAs = settings.socialLinks;
  return out;
}

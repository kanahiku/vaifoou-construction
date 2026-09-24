/**
 * Contact page helpers. Phone and address come from ~/config/contact.
 */
import { CONTACT } from '~/config/contact';

export const contactPhone = {
  text: CONTACT.phone.display,
  href: CONTACT.phone.href,
};

export const contactAddress = {
  line1: CONTACT.address.street,
  city: CONTACT.address.cityLine,
  mapsQuery: CONTACT.address.oneLiner,
};

export const contactMapEmbedSrc = CONTACT.address.mapsEmbedSrc;
export const contactDirectionsHref = CONTACT.address.mapsDirectionsHref;

export function mapsEmbedSrc(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}

export function mapsDirectionsHref(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export const contactHelpOptions = [
  { label: 'General inquiry', value: 'general' },
  { label: 'New project', value: 'new-project' },
  { label: 'Estimate request', value: 'estimate' },
  { label: 'Other', value: 'other' },
];

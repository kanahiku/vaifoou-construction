import { getReviewProviderConfig } from './config';
import type { Review } from './types';

/** Used when a provider has no API key yet. */
export function getFallbackReviews(): Review[] {
  const googleUrl = getReviewProviderConfig('google').viewAllUrl;
  const yelpUrl = getReviewProviderConfig('yelp').viewAllUrl;

  return [
    {
      id: 'fallback-1',
      authorName: 'Alex M.',
      text: 'Placeholder review. Connect Google Places or Yelp, or replace this fallback for the new site.',
      rating: 5,
      date: '',
      source: 'google',
      sourceUrl: googleUrl,
    },
    {
      id: 'fallback-2',
      authorName: 'Jordan P.',
      text: "Placeholder review. Swap these quotes when the client's review APIs are connected.",
      rating: 5,
      date: '',
      source: 'yelp',
      sourceUrl: yelpUrl,
    },
  ];
}

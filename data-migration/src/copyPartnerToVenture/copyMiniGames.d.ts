import type { Environment, Entry, Collection } from 'contentful-management';


/**
 * Copies site games categories and related entries from a source venture to a target partner.
 * @param environment - Contentful environment instance.
 * @param locale - Locale code string (e.g., 'en-GB').
 * @param venture - Source venture name string.
 * @param sourceVenture - Source venture entries collection.
 * @param partner - Target partner name string.
 * @param targetPartner - Target partner entry.
 */
export default function copyMiniGames(
  environment: Environment,
  locale: string,
  venture: string,
  sourceVenture: Collection<Entry, Entry>,
  partner: string,
  targetPartner: Entry
): Promise<void>;

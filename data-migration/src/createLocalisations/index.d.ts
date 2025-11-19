// index.d.ts

import type { Environment, Entry } from 'contentful-management';

export interface Localisations {
  [key: string]: {
    [locale: string]: string | undefined;
  };
}

export interface VentureEntry extends Entry {
  fields: {
    name: {
      'en-GB': string;
      [locale: string]: string | undefined;
    };
    [key: string]: any;
  };
}

export interface ProcessResult {
  isArchived?: boolean;
  isDraft?: boolean;
  isUpdated?: boolean;
  isPublished?: boolean;
  failed?: {
    title: string;
    id: string;
    error: string;
  };
}

/**
 * Retrieves a venture entry by name from the given environment.
 * @param venture - The venture name to find.
 * @param environment - The Contentful environment to query.
 * @returns A Promise resolving to the venture Entry or undefined if not found.
 */
export function getVenture(
  venture: string,
  environment: Environment
): Promise<VentureEntry | undefined>;

/**
 * Creates localisation entries linked to a given venture.
 * @param localisations - Localisations to create.
 * @param environment - The Contentful environment to create entries in.
 * @param venture - The venture entry to link localisations to.
 */
export function createVentureLocalisations(
  localisations: Localisations,
  environment: Environment,
  venture: VentureEntry
): Promise<void>;

/**
 * Creates default localisation entries not linked to any venture.
 * @param localisations - Localisations to create.
 * @param environment - The Contentful environment to create entries in.
 */
export function createDefaultLocalisations(
  localisations: Localisations,
  environment: Environment
): Promise<void>;

/**
 * Main script function that runs the localisation creation process.
 * @param params - Parameters object.
 * @param params.accessToken - Contentful access token.
 * @param params.env - Target environment name.
 */
export default function script(params: {
  accessToken: string;
  env: string;
}): Promise<void>;

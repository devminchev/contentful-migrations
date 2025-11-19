import { Collection, Entry } from "contentful-management";

/**
 * Extracts content entries of specified models from Contentful and writes them to a file.
 * @param accessToken - Contentful management API access token.
 * @param env - Environment ID.
 * @param spaceId - Contentful space ID.
 * @param filePath - Path to the output file.
 * @param models - Array of content model IDs to export.
 */
export const extractToFile: (
  accessToken: string,
  env: string,
  spaceId: string,
  filePath: string,
  models: string[]
) => Promise<void>;

/**
 * Extracts content entries of a specified model from Contentful and returns them as an EntryCollection.
 * @param accessToken - Contentful management API access token.
 * @param spaceID - Contentful space ID.
 * @param env - Environment ID.
 * @param model - Content model ID.
 * @param options - Additional query options to filter entries.
 * @returns Promise resolving to EntryCollection of entries.
 */
export const extractToArray: (
  accessToken: string,
  spaceID: string,
  env: string,
  model: string,
  options?: {[key: string]: any; }
) => Promise<Collection<Entry, Entry>>;

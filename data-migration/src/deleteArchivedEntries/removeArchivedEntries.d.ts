import type {
  Environment,
  Entry,
} from "contentful-management";

/**
 * Main script function that deletes archived entries from a Contentful environment after user confirmation.
 *
 * @param accessToken - Contentful management API access token.
 * @param env - Environment ID.
 * @param spaceID - Contentful space ID.
 */
export function script(
  accessToken: string,
  env: string,
  spaceID: string
): Promise<void>;

/**
 * Checks references of archived entries and removes references to them in other entries.
 *
 * @param archivedEntries - Array of archived entries to check references for.
 * @param environment - Contentful environment instance.
 * @param LOCALE - Locale code string (e.g., 'en-GB').
 */
export function checkReferences(
  archivedEntries: Entry[],
  environment: Environment,
  LOCALE: string
): Promise<void>;

/**
 * Updates references in a parent entry by removing references to archived child entries.
 *
 * @param parentId - ID of the parent entry to update.
 * @param archivedEntriesIds - Array of archived entries IDs.
 * @param childId - ID of the archived child entry to remove references to.
 * @param LOCALE - Locale code string.
 * @param environment - Contentful environment instance.
 */
export function updateReferences(
  parentId: string,
  archivedEntriesIds: string[],
  childId: string,
  LOCALE: string,
  environment: Environment
): Promise<void>;

/**
 * Removes archived entries from a field that contains an array of linked entries.
 *
 * @param archivedEntriesIds - Array of archived entries IDs.
 * @param parentEntryFieldLocale - Array of linked entries in a localized field.
 * @param parentEntryField - The parent field object to update.
 * @returns The updated parent field with archived entries removed.
 */
export function getAllArchivedEntriesInField(
  archivedEntriesIds: string[],
  parentEntryFieldLocale: any[],
  parentEntryField: any
): any;

/**
 * Removes references from parent entries with large linked arrays.
 *
 * @param idOfParentEntry - ID of the parent entry to update.
 * @param environment - Contentful environment instance.
 * @param archivedEntriesIds - Array of archived entries IDs.
 * @param LOCALE - Locale code string.
 */
export function removeReferencesFromLargeLinks(
  idOfParentEntry: string,
  environment: Environment,
  archivedEntriesIds: string[],
  LOCALE: string
): Promise<void>;

/**
 * Updates a parent entry if changes were made, including publishing if needed.
 *
 * @param updated - Boolean indicating if the entry was updated.
 * @param entryToUpdate - The entry object to update.
 * @param environment - Contentful environment instance.
 */
export function updateParent(
  updated: boolean,
  entryToUpdate: Entry,
  environment: Environment
): Promise<void>;

/**
 * Utility function to delay execution for a specified number of milliseconds.
 *
 * @param ms - Milliseconds to delay.
 * @returns Promise that resolves after the delay.
 */
export function delay(ms: number): Promise<void>;


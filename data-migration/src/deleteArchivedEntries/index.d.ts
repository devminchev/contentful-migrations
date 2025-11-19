// index.d.ts

/**
 * Parameters for the default exported function.
 */
export interface Params {
  accessToken: string;
  env: string;
  spaceID: string;
}

/**
 * Default export function that calls removeArchivedEntries with given parameters.
 * @param params - Object containing accessToken, env, and spaceID.
 */
export default function (params: Params): void;

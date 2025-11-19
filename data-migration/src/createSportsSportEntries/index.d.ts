import type { Environment } from 'contentful-management';

export interface SportData {
  id: string;
  name: string;
  __typename?: string;
  [key: string]: any;
}

export interface LocalizedField<T> {
  [locale: string]: T | null;
}

export interface SportFields {
  entryTitle: LocalizedField<string | null>;
  name: LocalizedField<string | null>;
  id: LocalizedField<string | null>;
  type: LocalizedField<string | null>;
  [key: string]: any;
}

export interface ScriptParams {
  accessToken: string;
  env: string;
}

export declare const LOCALE: string;

export declare function createSportFields(data: SportData): SportFields;

export declare function createSport(fields: SportFields, environment: Environment): Promise<void>;

export declare function createSports(
  environment: Environment,
  sports: SportData[],
  entriesIds: (string | null)[]
): void;

/**
 * Main script function to create sports entries in Contentful.
 * @param params - Object containing accessToken and environment name.
 */
export default function script(params: ScriptParams): Promise<void>;

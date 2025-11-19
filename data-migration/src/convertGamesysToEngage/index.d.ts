// index.d.ts

import type { Entry } from 'contentful-management';

export interface GameFields {
  vendor: {
    [locale: string]: string;
  };
  name: {
    [locale: string]: string;
  };
  entryTitle: {
    [locale: string]: string;
  };
  chat?: {
    [locale: string]: {
      isEnabled: boolean;
      controlMobileChat: boolean;
    };
  };
  [key: string]: any;
}

export interface SiteGameEntry extends Entry {}

export interface ScriptParams {
  accessToken: string;
  env: string;
}

/**
 * Main exported async function that converts Gamesys games to roxor-rgp vendor.
 * @param params - Object containing accessToken and environment name.
 */
export const script: (params: ScriptParams) => Promise<void>;

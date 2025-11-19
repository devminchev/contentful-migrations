import { Collection, Entry } from "contentful-management";

export const publishFile: (
  accessToken: string,
  spaceID: string,
  env: string,
  filePath: string
) => Promise<void>;

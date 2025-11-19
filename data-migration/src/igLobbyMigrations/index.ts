import { log as logSection } from "./utils/logging";
import { apiSetup } from "./api/managementApi";
import { script as extractGameModels } from "./extract";
import { updateData } from "./load/update";
import { PRODUCTION_SPACE, SITE_GAME_V2 } from "./constants";

import { publishData } from "./load";
import { updateSiteGamesV2 } from "./transform/updateSiteGamesV2";


interface RunnerParams {
  accessToken: string;
  env: string;
  space: string;
}

interface TransformParams extends RunnerParams {
  spaceLocale: string;
  spaceFolder: string;
}

export default async ({ accessToken, env, space }: RunnerParams) => {
  const spaceLocale = space === PRODUCTION_SPACE ? "en-GB" : "en-US";
  const spaceFolder = space === PRODUCTION_SPACE ? "production" : "na";

  logSection("SETTING UP MANAGEMENT API");
  await apiSetup(accessToken, env, space, spaceLocale);

  logSection("STARTING EXTRACTION");
  await extractGameModels(accessToken, env, space, spaceFolder);

  logSection("STARTING TRANSFORMATIONS");
  await runTransformations({ accessToken, env, space, spaceLocale, spaceFolder });
};

const runTransformations = async ({ accessToken, env, space, spaceLocale, spaceFolder }: TransformParams) => {

  /* --------------------------------- SiteGame V2 Update -------------------------------- */
  logSection("UPDATING SITE GAME V2 MODEL");
  await updateSiteGamesV2(spaceLocale, spaceFolder);

  logSection("PUBLISHING UPDATED SITE GAME V2 ENTRIES");
  await updateData(`${SITE_GAME_V2}-updated`, spaceFolder, spaceLocale, env, space, SITE_GAME_V2, accessToken);
}

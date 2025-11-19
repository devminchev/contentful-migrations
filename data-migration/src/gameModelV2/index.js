import { logSection } from "./utils/logging.js";
import { apiSetup } from "./api/managementApi.js";
import extractGameModels from "./extract/index.js";
import transformGameModel from "./transform/transformGames.js";
import transformSiteGameModel from "./transform/transformSiteGames.js";
import publishData from "./load/index.js";
import { GAME_V2, SITE_GAME_V2, PRODUCTION_SPACE } from "./constants.js";

export default async ({ accessToken, env, space }) => {
  const spaceLocale = space === PRODUCTION_SPACE ? "en-GB" : "en-US";
  const spaceFolder = space === PRODUCTION_SPACE ? "production" : "na";

  logSection("SETTING UP MANAGEMENT API");
  await apiSetup(accessToken, env, space, spaceLocale);

  logSection("STARTING EXTRACTION");
  await extractGameModels(accessToken, env, space, spaceFolder);

  logSection("TRANSFORMING GAME MODEL");
  await transformGameModel(spaceLocale, spaceFolder);

  logSection("PUBLISHING GAME V2 ENTRIES");
  // await publishData(GAME_V2, spaceFolder, spaceLocale, env, space);

  logSection("TRANSFORMING SITEGAME MODEL");
  await transformSiteGameModel(spaceLocale, spaceFolder);

  logSection("PUBLISHING SITE GAME V2 ENTRIES");
  // await publishData(SITE_GAME_V2, spaceFolder, spaceLocale, env, space);
};

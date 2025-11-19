import { logSection } from "./utils/logging.js";
import { apiSetup } from "./api/managementApi.js";
import extractGameModels from "./extract/index.js";
import transformGameAndSiteGame from "./transform/transformGames.js";
import updateData from "./load/update.js";
import { GAME_V2, SITE_GAME_V2, PRODUCTION_SPACE } from "./constants.js";

export default async ({ accessToken, env, space }) => {
  const spaceLocale = space === PRODUCTION_SPACE ? "en-GB" : "en-US";
  const spaceFolder = space === PRODUCTION_SPACE ? "production" : "na";

  logSection("SETTING UP MANAGEMENT API");
  await apiSetup(accessToken, env, space, spaceLocale);

  logSection("STARTING EXTRACTION");
  await extractGameModels(accessToken, env, space, spaceFolder);

  logSection("TRANSFORMING GAME MODEL");
  await transformGameAndSiteGame(spaceLocale, spaceFolder);

  logSection("UPDATING GAME V2 ENTRIES");
  await updateData(`${GAME_V2}-updated`, spaceFolder, spaceLocale, env, space, GAME_V2, accessToken);


  logSection("UPDATING SITE GAME V2 ENTRIES");
  await updateData(`${SITE_GAME_V2}`, spaceFolder, spaceLocale, env, space, GAME_V2, accessToken);
};

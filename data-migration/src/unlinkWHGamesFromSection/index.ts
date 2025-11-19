import { log as logSection } from "../naNewLobbyDesign/utils/logging";
import { apiSetup } from "../naNewLobbyDesign/api/managementApi";
import { script as extractGameModels } from "../naNewLobbyDesign/extract/index";
import { PRODUCTION_SPACE } from "../naNewLobbyDesign/constants";
import { unlinkWHSiteGames } from "./transform/unlinkWHSiteGames";

//Cant rely on naLobby update function need to change path specific to this script 
import { updateData } from "./load/update";

export default async ({ accessToken, env, space }) => {
  const spaceLocale = space === PRODUCTION_SPACE ? "en-GB" : "en-US";
  const spaceFolder = space === PRODUCTION_SPACE ? "production" : "na";

  logSection("SETTING UP MANAGEMENT API");
  await apiSetup(accessToken, env, space, spaceLocale);

  logSection("STARTING EXTRACTION");
  await extractGameModels(accessToken, env, space, spaceFolder);

  logSection("STARTING TRANSFORMATIONS");
  await runTransformations({ accessToken, env, space, spaceLocale, spaceFolder });
};

const runTransformations = async ({ accessToken, env, space, spaceLocale, spaceFolder }) => {

  // /* --------------------------------- UPDATE: UNLINK WHITEHAT GAMES ON SECTIONS-------------------------------- */
  logSection("UNLINKING WHITEHAT SITE GAMES FROM SECTION");
  await unlinkWHSiteGames(spaceLocale, spaceFolder);

  logSection("UPDATING WH SITE GAMES UNLINKED FROM SECTIONS");
  await updateData('updatedSections', spaceFolder, spaceLocale, env, space, 'section', accessToken);
}

import { log as logSection } from "./utils/logging";
import { apiSetup } from "./api/managementApi";
import { script as extractGameModels } from "./extract";
import { fn as populateVentures } from "./transform/populateVentures";
import { updateData } from "./load/update";
import {
  PRODUCTION_SPACE,
  CATEGORIES_MODEL,
  IG_NAVIGATION_MODEL,
  VENTURE,
  GAME_V2,
  SITE_GAME_V2,
  IG_GRID_A_SECTION,
  DX_PLACEHOLDER,
  IG_VIEW,
  DX_VIEW,
  IG_BRAZE_PROMO_SECTION,
  IG_GRID_B_SECTION,
  IG_GRID_C_SECTION,
  IG_GRID_E_SECTION,
  IG_DFG_SECTION,
  IG_JACKPOT_SECTION,
  IG_CAROUSEL_A_SECTIONS,
  IG_SEARCH_RESULTS,
  IG_QUICK_LINKS_MODEL,
  IG_LINK_MODEL,
  DX_LINK,
  DX_QUICK_LINKS,
  IG_CAROUSEL_B_SECTIONS,
  IG_GRID_D_SECTION,
  IG_GRID_F_SECTION,
  IG_GRID_G_SECTION,
  IG_JACKPOTS_SECTION,
  IG_SIMILARITY_SECTIONS,
  IG_COLLAB_BASED_SECTIONS
} from "./constants";

import { getWhitehatGames } from './api/whitehat/api';
import { GAMES_SITE_GAMES_MIGRATION_PATH, PREVIOUS_MIGRATIONS_FILE_NAME } from './api/whitehat/constants';
import { transformGames } from './transform/gameSiteGameModels/transformWhitehatGames';
import { transformSiteGames } from './transform/gameSiteGameModels/transformWhitehatSiteGames';
import { transformViewFromDx } from './transform/transformViewFromDx';
import { transformPromoDxPlaceholder } from './transform/transformPromoDxPlaceholder';
import { transformCarouselDxPlaceholder } from './transform/transformCarouselDxPlaceholder';
import { createIgSearchSections } from './transform/createIgSearchSections';

import { publishData } from "./load";

import transformNavigation from './transform/transformNavigation';
import { transform as transformGridAFromDx } from "./transform/transformGridAFromDx";
import { transform as transformGridBFromDx } from "./transform/transformGridBFromDx";
import { transform as transformGridCFromDx } from "./transform/transformGridCFromDx";
import { transform as transformGridEFromDx } from "./transform/transformGridEFromDx";
import { transformDfgFromDx } from "./transform/transformDfgFromDx";
import { transformJackpotFromDx } from "./transform/transformJackpotFromDx";
import { linkQuickLinksToView } from "./transform/linkQuickLinksToView";
import transformLinks from "./transform/transformLinks";
import transformQuickLinks from "./transform/transformQuickLinks";
import { getUpdatedWhGames } from "./transform/gameSiteGameModels/getUpdatedWhGames";
import { updateGamesV2 } from './transform/updateGamesV2';
import { updateSiteGamesV2 } from "./transform/updateSiteGamesV2";
import { updateUniqueSlugsOnSection } from "./transform/updateUniqueSlugsOnSection";
import findDuplicateSiteGames from "./transform/findDuplicateSiteGames";
import updateGameInfoDetailsFormWh from "./transform/updateGameInfoDetailsFormWh";

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

  /* --------------------------------- Venture MODEL -------------------------------- */
  logSection("Populate Ventures MODEL");
  await populateVentures(spaceLocale, spaceFolder);

  const extraParamsVenture = {
    outputFiles: {
      data: `./src/naNewLobbyDesign/data/${VENTURE}/${spaceFolder}/${VENTURE}-data.json`,
      failed: `./src/naNewLobbyDesign/data/${VENTURE}/${spaceFolder}/${VENTURE}-failed.json`,
      transformed: `./src/naNewLobbyDesign/data/${VENTURE}/${spaceFolder}/${VENTURE}-transformed.json`
    }
  }

  logSection("PUBLISHING VENTURE ENTRIES");
  await publishData(VENTURE, spaceFolder, spaceLocale, env, space, VENTURE, accessToken, extraParamsVenture);

  /* --------------------------------- Game and SiteGame Models -------------------------------- */
  logSection("Retrieve all games from WhiteHat API");
  await getWhitehatGames();

  logSection("Sanitise and transform records for gameV2 model");
  transformGames(spaceLocale);


  const extraParamsGame = {
    outputFiles: {
      data: `${GAMES_SITE_GAMES_MIGRATION_PATH}/${GAME_V2}.json`,
      failed: `${GAMES_SITE_GAMES_MIGRATION_PATH}/${GAME_V2}-failed.json`,
      transformed: `${GAMES_SITE_GAMES_MIGRATION_PATH}/${GAME_V2}-transformed.json`
    },
    includeWhitehatDrafts: true
  }

  logSection("PUBLISHING GAME_V2 ENTRIES");
  await publishData(GAME_V2, spaceFolder, spaceLocale, env, space, GAME_V2, accessToken, extraParamsGame);

  logSection("Sanitise and transform records for siteGameV2 model");
  await transformSiteGames(spaceLocale);

  const extraParamsSiteGame = {
    outputFiles: {
      data: `${GAMES_SITE_GAMES_MIGRATION_PATH}/${SITE_GAME_V2}.json`,
      failed: `${GAMES_SITE_GAMES_MIGRATION_PATH}/${SITE_GAME_V2}-failed.json`,
      transformed: `${GAMES_SITE_GAMES_MIGRATION_PATH}/${SITE_GAME_V2}-transformed.json`,
    },
    whitehatGameMigration: true,
    includeWhitehatDrafts: true,
  }

  logSection("PUBLISHING SITE_GAME_V2 ENTRIES");
  await publishData(SITE_GAME_V2, spaceFolder, spaceLocale, env, space, SITE_GAME_V2, accessToken, extraParamsSiteGame);

  /* --------------------------------- GET UPDATED SITE_GAME_V2 WHITEHAT RECORDS FROM CONTENTFUL -------------------------------- */
  logSection("GET UPDATED SITE_GAME_V2 WHITEHAT RECORDS FROM CONTENTFUL");
  await getUpdatedWhGames(spaceFolder);

  /* --------------------------------- SEARCH SECTION PLACEHOLDER -------------------------------- */
  logSection("CREATING IG_SEARCH_RESULTS SECTION");
  await createIgSearchSections(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_SEARCH_RESULTS SECTION ENTRIES");
  await publishData(IG_SEARCH_RESULTS, spaceFolder, spaceLocale, env, space, IG_SEARCH_RESULTS, accessToken);

  /* --------------------------------- BRAZE PROMO MODEL -------------------------------- */
  logSection("TRANSFORMING DX_PLACEHOLDER FOR PROMOTIONS MODEL");
  await transformPromoDxPlaceholder(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_BRAZE_PROMO_SECTION ENTRIES");
  await publishData(IG_BRAZE_PROMO_SECTION, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken);

  /* --------------------------------- DFG MODEL -------------------------------- */
  logSection("TRANSFORMING DX_PLACEHOLDER FOR DFG MODEL");
  await transformDfgFromDx(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_DFG_SECTION ENTRIES");
  await publishData(IG_DFG_SECTION, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken);

  /* --------------------------------- JACKPOT MODEL -------------------------------- */
  logSection("TRANSFORMING DX_PLACEHOLDER FOR JACKPOT MODEL");
  await transformJackpotFromDx(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_JACKPOT_SECTION ENTRIES");
  await publishData(IG_JACKPOT_SECTION, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken);

  /* --------------------------------- CAROUSEL-A MODEL -------------------------------- */
  logSection("TRANSFORMING DX_PLACEHOLDER FOR IG_CAROUSEL_A MODEL");
  await transformCarouselDxPlaceholder(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_CAROUSEL_A ENTRIES");
  await publishData(IG_CAROUSEL_A_SECTIONS, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken);

  /* --------------------------------- Grid-A MODEL -------------------------------- */
  logSection("TRANSFORMING DX Placeholder Grid A MODEL");
  await transformGridAFromDx(spaceLocale, spaceFolder);

  const extraParamsGridA = {
    outputFiles: {
      data: `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${IG_GRID_A_SECTION}.json`,
      failed: `./src/naNewLobbyDesign/data/${IG_GRID_A_SECTION}/${spaceFolder}/${IG_GRID_A_SECTION}-failed.json`,
      transformed: `./src/naNewLobbyDesign/data/${IG_GRID_A_SECTION}/${spaceFolder}/${IG_GRID_A_SECTION}-transformed.json`
    }
  }

  logSection("PUBLISHING IG Grid A Section ENTRIES");
  await publishData(IG_GRID_A_SECTION, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken, extraParamsGridA);

  /* --------------------------------- Grid-B MODEL -------------------------------- */
  logSection("TRANSFORMING DX Placeholder Grid B MODEL");
  await transformGridBFromDx(spaceLocale, spaceFolder);

  const extraParamsGridB = {
    outputFiles: {
      data: `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${IG_GRID_B_SECTION}.json`,
      failed: `./src/naNewLobbyDesign/data/${IG_GRID_B_SECTION}/${spaceFolder}/${IG_GRID_B_SECTION}-failed.json`,
      transformed: `./src/naNewLobbyDesign/data/${IG_GRID_B_SECTION}/${spaceFolder}/${IG_GRID_B_SECTION}-transformed.json`
    }
  }

  logSection("PUBLISHING IG Grid B Section ENTRIES");
  await publishData(IG_GRID_B_SECTION, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken, extraParamsGridB);


  /* --------------------------------- Grid-C MODEL -------------------------------- */
  logSection("TRANSFORMING DX Placeholder Grid C MODEL");
  await transformGridCFromDx(spaceLocale, spaceFolder);

  const extraParamsGridC = {
    outputFiles: {
      data: `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${IG_GRID_C_SECTION}.json`,
      failed: `./src/naNewLobbyDesign/data/${IG_GRID_C_SECTION}/${spaceFolder}/${IG_GRID_C_SECTION}-failed.json`,
      transformed: `./src/naNewLobbyDesign/data/${IG_GRID_C_SECTION}/${spaceFolder}/${IG_GRID_C_SECTION}-transformed.json`
    }
  }

  logSection("PUBLISHING IG Grid C Section ENTRIES");
  await publishData(IG_GRID_C_SECTION, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken, extraParamsGridC);

  /* --------------------------------- Grid-E MODEL -------------------------------- */
  logSection("TRANSFORMING DX Placeholder Grid E MODEL");
  await transformGridEFromDx(spaceLocale, spaceFolder);

  const extraParamsGridE = {
    outputFiles: {
      data: `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${IG_GRID_E_SECTION}.json`,
      failed: `./src/naNewLobbyDesign/data/${IG_GRID_E_SECTION}/${spaceFolder}/${IG_GRID_E_SECTION}-failed.json`,
      transformed: `./src/naNewLobbyDesign/data/${IG_GRID_E_SECTION}/${spaceFolder}/${IG_GRID_E_SECTION}-transformed.json`
    }
  }

  logSection("PUBLISHING IG Grid E Section ENTRIES");
  await publishData(IG_GRID_E_SECTION, spaceFolder, spaceLocale, env, space, DX_PLACEHOLDER, accessToken, extraParamsGridE);

  /* --------------------------------- VIEW MODEL -------------------------------- */
  logSection("TRANSFORMING DX_VIEW MODEL");
  await transformViewFromDx(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_VIEW ENTRIES");
  await publishData(IG_VIEW, spaceFolder, spaceLocale, env, space, DX_VIEW, accessToken);

  /* --------------------------------- LINK MODEL -------------------------------- */
  logSection("TRANSFORMING QUICKLINKS MODEL");
  await transformLinks(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_LINK_MODEL ENTRIES");
  await publishData(IG_LINK_MODEL, spaceFolder, spaceLocale, env, space, DX_LINK, accessToken);

  /* --------------------------------- QUICKLINKS MODEL -------------------------------- */
  logSection("TRANSFORMING QUICKLINKS MODEL");
  await transformQuickLinks(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG QUICKLINKS ENTRIES");
  await publishData(IG_QUICK_LINKS_MODEL, spaceFolder, spaceLocale, env, space, DX_QUICK_LINKS, accessToken);

  /* --------------------------------- VIEW MODEL LINK QUICK_LINKS -------------------------------- */
  logSection("TRANSFORMING DX_VIEW MODEL");
  await linkQuickLinksToView(spaceLocale, spaceFolder);

  logSection("UPDATING IG_VIEW ENTRIES");
  await updateData(IG_VIEW, spaceFolder, spaceLocale, env, space, IG_VIEW, accessToken);

  /* --------------------------------- NAVIGATION MODEL -------------------------------- */

  logSection("TRANSFORMING NAVIGATIONS MODEL");
  await transformNavigation(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG NAVIGATION ENTRIES");
  await publishData(IG_NAVIGATION_MODEL, spaceFolder, spaceLocale, env, space, IG_NAVIGATION_MODEL, accessToken);

  /* --------------------------------- GAME V2 Update Images -------------------------------- */
  logSection("UPDATING GAME V2 MODEL");
  await updateGamesV2(spaceLocale, spaceFolder);

  logSection("PUBLISHING UPDATED GAME V2 ENTRIES");
  await updateData(GAME_V2, spaceFolder, spaceLocale, env, space, GAME_V2, accessToken);

  /* --------------------------------- SiteGame V2 Update -------------------------------- */
  logSection("UPDATING SITE GAME V2 MODEL");
  await updateSiteGamesV2(spaceLocale, spaceFolder);

  logSection("PUBLISHING UPDATED SITE GAME V2 ENTRIES");
  await updateData(SITE_GAME_V2, spaceFolder, spaceLocale, env, space, SITE_GAME_V2, accessToken);

  // /* --------------------------------- UPDATE SLUGS ON ALL SECTIONS-------------------------------- */
  logSection("UPDATING ALL IG SECTION MODEL");
  await updateUniqueSlugsOnSection(spaceLocale, spaceFolder);

  logSection("PUBLISHING ALL UPDATED IG_CAROUSEL_A_SECTIONS ENTRIES");
  await updateData(IG_CAROUSEL_A_SECTIONS, spaceFolder, spaceLocale, env, space, IG_CAROUSEL_A_SECTIONS, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_CAROUSEL_B_SECTIONS ENTRIES");
  await updateData(IG_CAROUSEL_B_SECTIONS, spaceFolder, spaceLocale, env, space, IG_CAROUSEL_B_SECTIONS, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_GRID_A_SECTION ENTRIES");
  await updateData(IG_GRID_A_SECTION, spaceFolder, spaceLocale, env, space, IG_GRID_A_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_GRID_B_SECTION ENTRIES");
  await updateData(IG_GRID_B_SECTION, spaceFolder, spaceLocale, env, space, IG_GRID_B_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_GRID_C_SECTION ENTRIES");
  await updateData(IG_GRID_C_SECTION, spaceFolder, spaceLocale, env, space, IG_GRID_C_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_GRID_D_SECTION ENTRIES");
  await updateData(IG_GRID_D_SECTION, spaceFolder, spaceLocale, env, space, IG_GRID_D_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_GRID_E_SECTION ENTRIES");
  await updateData(IG_GRID_E_SECTION, spaceFolder, spaceLocale, env, space, IG_GRID_E_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_GRID_F_SECTION ENTRIES");
  await updateData(IG_GRID_F_SECTION, spaceFolder, spaceLocale, env, space, IG_GRID_F_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_GRID_G_SECTION ENTRIES");
  await updateData(IG_GRID_G_SECTION, spaceFolder, spaceLocale, env, space, IG_GRID_G_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_JACKPOTS_SECTION ENTRIES");
  await updateData(IG_JACKPOTS_SECTION, spaceFolder, spaceLocale, env, space, IG_JACKPOTS_SECTION, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_COLLAB_BASED_SECTIONS ENTRIES");
  await updateData(IG_COLLAB_BASED_SECTIONS, spaceFolder, spaceLocale, env, space, IG_COLLAB_BASED_SECTIONS, accessToken);

  logSection("PUBLISHING ALL UPDATED IG_SIMILARITY_SECTIONS ENTRIES");
  await updateData(IG_SIMILARITY_SECTIONS, spaceFolder, spaceLocale, env, space, IG_SIMILARITY_SECTIONS, accessToken);

  /* --------------------------------- FIND DUPLICATE SITEGAMES -------------------------------- */
  logSection("LOOKING FOR DUPLICATE SITEGAMES");
  await findDuplicateSiteGames(spaceLocale, spaceFolder);

  /* --------------------------------- FIND DUPLICATE SITEGAMES -------------------------------- */
  logSection("LOOKING FOR WH GAMES WITHOUT INFO");
  await updateGameInfoDetailsFormWh(spaceLocale, spaceFolder);

  logSection("UPDATING WHITEHAT GAMES WITHOUT INFO");
  await updateData(`${GAME_V2}-updated`, spaceFolder, spaceLocale, env, space, GAME_V2, accessToken);
  
}

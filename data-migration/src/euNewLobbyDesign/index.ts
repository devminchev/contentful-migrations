import { logSection } from "./utils/logging";
import { apiSetup } from "./api/managementApi";
import { script as extractGameModels } from "./extract";
import {
  IG_MINI_GAMES,
  MINI_GAMES, PRODUCTION_SPACE, IG_COLLAB_BASED_SECTIONS, LOBBY_COLLAB_BASED_SECTIONS, IG_LOBBY_SUGGESTED_GAMES, LOBBY_SUGGESTED_GAMES, IG_SIMILARITY_SECTIONS, SIMILARITY_SECTIONS, LAYOUT_MODEL, IG_VIEW_MODEL, IG_SECTION_WITHOUT_CAROUSEL, SECTION, IG_CAROUSEL_A_SECTIONS, IG_CAROUSEL_B_SECTIONS, CAROUSEL_A_SECTIONS, IG_DFG_SECTION, DFG_SECTION, IG_LINK_MODEL, CATEGORY_MODEL, CATEGORIES_MODEL, IG_NAVIGATION_MODEL, IG_JACKPOTS_SECTION, GAME_V2, SITE_GAME_V2,
  IG_BANNER_SECTION,
  BANNER_SECTION,
  IG_MARKETING_SECTION,
  IG_GRID_A_SECTION,
  IG_GRID_B_SECTION,
  IG_GRID_C_SECTION,
  IG_GRID_D_SECTION,
  IG_GRID_E_SECTION,
  IG_GRID_F_SECTION,
  IG_GRID_G_SECTION,
  MARKETING_SECTION,
  IG_PROMOTIONS_GRID,
  IG_SEARCH_RESULTS,
  IG_GAME_SHUFFLE_SECTION,
  IG_BRAZE_PROMO_SECTION
} from "./constants";
import { contentfulImport } from './contentfulCLI';
import transformCollabModel from './transform/transformCollabModel';
import transformSuggestedGames from "./transform/transformSuggestedGames";
import transformMiniGamesModel from './transform/transformMiniGames';
import transformLayoutstoViews from './transform/transformLayoutstoViews';
import transformCategoryToLink from './transform/transformCategoryToLink';
import transformGridASection from './transform/transformGridA';
import publishData from "./load";
import updateData from "./load/update";
import transformSimiliaritySections from "./transform/transformSimiliaritySections";
import transformGameV2Model from './transform/transformGameModelV2';
import transformCategoriesToNav from './transform/transformCategoriesToNav';
import transformCarouselSections from "./transform/transformCarouselSections";
import transformDFGSection from "./transform/transformDFGSection";
import transformJackpotSections from "./transform/transformJackpotSections";
import transformSiteGameModelV2 from './transform/transformSiteGameModelV2';
import transformBannerSections from "./transform/transformBannerSections";
import transformMarketingSections from "./transform/transformMarketingSections";
import { updateUniqueSlugsOnSection } from "./transform/updateUniqueSlugsOnSection";
import { transformPromoGridToIgPromoSections } from "./transform/transformPromoGridToIgPromoSections"
import { createIgSearchSections } from "./transform/createIgSearchSections";
import { updateIgBannerSection } from "./transform/updateIgBannerSection";
import transformHeroBannerSection from "./transform/transformHeroBannerSection";
import transformGameShuffleSection from "./transform/transformGameShuffleSection";
import transformPersonalPromoSection from "./transform/transformPersonalPromoSection";
import cleanupGameModelV2 from "./transform/cleanupGameModelV2";
import createNewSimilaritySections from "./transform/createNewSimilaritySections";
import transformSpanishSiteGameV2SNP from "./transform/transformSpanishSiteGameV2SNP";
import transformUKSiteGameV2SNP from "./transform/transformUKSiteGameV2SNP"

export default async ({ accessToken, env, space }) => {
  const spaceLocale = space === PRODUCTION_SPACE ? "en-GB" : "en-US";
  const spaceFolder = space === PRODUCTION_SPACE ? "production" : "na";

  logSection("SETTING UP MANAGEMENT API");
  await apiSetup(accessToken, env, space, spaceLocale);

  logSection("STARTING EXTRACTION");
  await extractGameModels(accessToken, env, space, spaceFolder);

  /* ------------------------------------- GRID A SECTION -------------------------------- */
  logSection("TRANSFORMING GRID A SECTION MODEL");
  await transformGridASection(spaceLocale, spaceFolder);

  logSection("PUBLISHING GRID A SECTION MODEL ENTRIES");
  await publishData(IG_SECTION_WITHOUT_CAROUSEL, spaceFolder, spaceLocale, env, space, SECTION, accessToken);

  /* ------------------------------------- Carousel A MODEL -------------------------------- */
  logSection("TRANSFORMING CAROUSEL A SECTION MODEL");
  await transformCarouselSections(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG CAROUSEL A SECTIONS ENTRIES");
  await publishData(IG_CAROUSEL_A_SECTIONS, spaceFolder, spaceLocale, env, space, CAROUSEL_A_SECTIONS, accessToken);

  /* --------------------------------------- MINI GAMES ---------------------------------------- */
  logSection("TRANSFORMING MINI GAMES MODEL");
  await transformMiniGamesModel(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG MINI GAMES ENTRIES");
  await publishData(IG_MINI_GAMES, spaceFolder, spaceLocale, env, space, MINI_GAMES, accessToken);

  /* --------------------------------- COLLAB BASED SECTION MODEL ------------------------------------------- */

  logSection("TRANSFORMING COLLAB BASED SECTION MODEL");
  await transformCollabModel(spaceLocale, spaceFolder);

  logSection("PUBLISHING iGamingCollabSection");
  await publishData(IG_COLLAB_BASED_SECTIONS, spaceFolder, spaceLocale, env, space, LOBBY_COLLAB_BASED_SECTIONS, accessToken);

  /* --------------------------------- SUGGESTED GAMES MODEL ------------------------------------------- */

  logSection("TRANSFORMING SUGGESTED GAMES MODEL");
  await transformSuggestedGames(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG SUGGESTED GAMES ENTRIES");
  await publishData(IG_LOBBY_SUGGESTED_GAMES, spaceFolder, spaceLocale, env, space, LOBBY_SUGGESTED_GAMES, accessToken);

  /* --------------------------------- SIMILARITY SECTION MODEL -------------------------------- */
  logSection("TRANSFORMING SIMILARITY SECTIONS MODEL");
  await transformSimiliaritySections(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG SIMILARITY SECTIONS ENTRIES");
  await publishData(IG_SIMILARITY_SECTIONS, spaceFolder, spaceLocale, env, space, SIMILARITY_SECTIONS, accessToken);


  /* ------------------------------------- DFG MODEL -------------------------------- */
  logSection("TRANSFORMING DFG TYPE SECTION MODEL");
  await transformDFGSection(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG DFG SECTION ENTRIES");
  await publishData(IG_DFG_SECTION, spaceFolder, spaceLocale, env, space, DFG_SECTION, accessToken);

  /* ----------------------------- JACKPOT SECTION ---------------------------- */

  logSection("TRANSFORMING JACKPOT SECTIONS");
  await transformJackpotSections(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG JACKPOTS SECTION ENTRIES");
  await publishData(IG_JACKPOTS_SECTION, spaceFolder, spaceLocale, env, space, SECTION, accessToken);

  /* --------------------------------- BANNER SECTION -------------------------------- */
  logSection("TRANSFORMING SECTION MODEL");
  await transformBannerSections(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG BANNER ENTRIES");
  await publishData(IG_BANNER_SECTION, spaceFolder, spaceLocale, env, space, BANNER_SECTION, accessToken);

  /* --------------------------------- MARKETING SECTION -------------------------------- */
  logSection("TRANSFORMING SECTION MODEL");
  await transformMarketingSections(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG MARKETING ENTRIES");
  await publishData(IG_MARKETING_SECTION, spaceFolder, spaceLocale, env, space, MARKETING_SECTION, accessToken);

  /* ------------------------------------- PROMOTIONS GRID SECTION -------------------------------- */
  logSection("TRANSFORMING PROMOTIONS GRID SECTION MODEL");
  await transformPromoGridToIgPromoSections(spaceLocale, spaceFolder);

  logSection("PUBLISHING PROMOTIONS GRID SECTION MODEL ENTRIES");
  await publishData(IG_PROMOTIONS_GRID, spaceFolder, spaceLocale, env, space, IG_PROMOTIONS_GRID, accessToken);

  /* --------------------------------- SEARCH SECTION PLACEHOLDER -------------------------------- */
  logSection("CREATING IG_SEARCH_RESULTS SECTION");
  await createIgSearchSections(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG_SEARCH_RESULTS SECTION ENTRIES");
  await publishData(IG_SEARCH_RESULTS, spaceFolder, spaceLocale, env, space, IG_SEARCH_RESULTS, accessToken);

  /* ------------------------------------- VIEW MODEL / OLD LAYOUTS -------------------------------- */
  logSection("TRANSFORMING LAYOUTS MODEL");
  await transformLayoutstoViews(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG VIEW ENTRIES");
  await publishData(IG_VIEW_MODEL, spaceFolder, spaceLocale, env, space, LAYOUT_MODEL, accessToken);

  /* --------------------------------- LINK MODEL / OLD CATEGORY -------------------------------- */
  logSection("TRANSFORMING CATEGORY MODEL");
  await transformCategoryToLink(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG LINK ENTRIES");
  await publishData(IG_LINK_MODEL, spaceFolder, spaceLocale, env, space, CATEGORY_MODEL, accessToken);

  /* --------------------------------- NAVIGATION MODEL / OLD CATEGORIES -------------------------------- */
  logSection("TRANSFORMING CATEGORIES MODEL");
  await transformCategoriesToNav(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG NAVIGATION ENTRIES");
  await publishData(IG_NAVIGATION_MODEL, spaceFolder, spaceLocale, env, space, CATEGORIES_MODEL, accessToken);

  /* --------------------------------- UPDATE SLUGS ON ALL SECTIONS-------------------------------- */
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

  /* --------------------------------- GAME V2 -------------------------------- */
  logSection("TRANSFORMING GAME V2 MODEL");
  await transformGameV2Model(spaceLocale, spaceFolder);

  logSection("PUBLISHING TRANSFORMED GAME V2 ENTRIES");
  await updateData(`${GAME_V2}-import`, spaceFolder, spaceLocale, env, space, GAME_V2, accessToken);

  /* --------------------------------- SITE GAME V2 -------------------------------- */
  logSection("TRANSFORMING SITE GAME V2 MODEL");
  await transformSiteGameModelV2(spaceLocale, spaceFolder);

  logSection("PUBLISHING TRANSFORMED SITE GAME V2 ENTRIES");
  await updateData(`${SITE_GAME_V2}-import`, spaceFolder, spaceLocale, env, space, SITE_GAME_V2, accessToken);

  /* --------------------------------- UPDATE IG BANNER SECTION -------------------------------- */
  logSection("UPDATING IG BANNER SECTION");
  await updateIgBannerSection(spaceLocale, spaceFolder);

  logSection("PUBLISHING ALL IG BANNER");
  await updateData(IG_BANNER_SECTION, spaceFolder, spaceLocale, env, space, IG_BANNER_SECTION, accessToken);

  /* --------------------------------- BANNER SECTION (HERO)-------------------------------- */
  logSection("TRANSFORMING SECTION MODEL (HERO BANNER)");
  await transformHeroBannerSection(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG BANNER ENTRIES (HERO)");
  await publishData(IG_BANNER_SECTION, spaceFolder, spaceLocale, env, space, BANNER_SECTION, accessToken);

  /* --------------------------------- IG GAME SHUFFLE SECTION-------------------------------- */
  logSection("TRANSFORMING IG GAME SHUFFLE SECTION");
  await transformGameShuffleSection(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG GAME SHUFFLE ENTRIES");
  await publishData(IG_GAME_SHUFFLE_SECTION, spaceFolder, spaceLocale, env, space, SECTION, accessToken);

  /* --------------------------------- PERSONAL PROMO SECTION-------------------------------- */
  logSection("TRANSFORMING PERSONAL PROMO SECTION");
  await transformPersonalPromoSection(spaceLocale, spaceFolder);

  logSection("PUBLISHING IG GAME SHUFFLE ENTRIES");
  await publishData(IG_BRAZE_PROMO_SECTION, spaceFolder, spaceLocale, env, space, SECTION, accessToken);

  /* --------------------------------- GAME V2 CLEANUP WRONG PROPERTY IN GAME PLATFORM CONFIG-------------------------------- */
  logSection("Updating Game Platform Config Properties");
  await cleanupGameModelV2(spaceLocale, spaceFolder);

  logSection("UPDATING GameV2 with updated Platform Config");
  await updateData(`${GAME_V2}-clean`, spaceFolder, spaceLocale, env, space, GAME_V2, accessToken);

  /* --------------------------------- NEW SIMILARITY SECTION MODELS (Y/Z) -------------------------------- */
  logSection("TRANSFORMING SIMILARITY SECTIONS MODEL");
  await createNewSimilaritySections(spaceLocale, spaceFolder);

  logSection("PUBLISHING NEW IG SIMILARITY SECTIONS ENTRIES (Y/Z)");
  await publishData(IG_SIMILARITY_SECTIONS, spaceFolder, spaceLocale, env, space, SIMILARITY_SECTIONS, accessToken);

  /* --------------------------------- SiteGame V2 change ShowNetPosition False on Spanish ventures  -------------------------------- */

  logSection("SCRIPT CHECKING SITE GAME V2 PROPERTIES ON SPANISH VENTURES ");
  await transformSpanishSiteGameV2SNP(spaceLocale, spaceFolder);

  logSection("UPDATING SPANISH SITE GAMES ");
  await updateData(`${SITE_GAME_V2}-Spanish`, spaceFolder, spaceLocale, env, space, SITE_GAME_V2, accessToken);

  /* --------------------------------- SiteGame V2 change ShowNetPosition True on UK ventures  -------------------------------- */

  logSection("SCRIPT CHECKING SITE GAME V2 PROPERTIES ON UK VENTURES ");
  await transformUKSiteGameV2SNP(spaceLocale, spaceFolder);

  logSection("UPDATING UK SITE GAMES ");
  await updateData(`${SITE_GAME_V2}-UK`, spaceFolder, spaceLocale, env, space, SITE_GAME_V2, accessToken);
};

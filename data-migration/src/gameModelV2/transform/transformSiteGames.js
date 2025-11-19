import { readJSONFile, writeJSONFile } from "../utils/fileOperations.js";
import {SITE_GAME, GAME_V2, SITE_GAME_V2, GAME, ALL_VENTURES_LIST} from "../constants.js";

import { log } from "../utils/logging.js";

const BROKEN_SITEGAMES = [];

export default async (spaceLocale, spaceFolder) => {
  try {
    const siteGames = await readFileV1Data(`${spaceFolder}/${SITE_GAME}.json`);
    const gamesV1 = await readFileV1Data(`${spaceFolder}/${GAME}.json`);
    const gamesV2Transformed = await readFileV2Data(`${spaceFolder}/${GAME_V2}-transformed.json`);
    const VENDOR_SITEGAMES = await readFileV2Data(`${spaceFolder}/VENDOR_SITEGAMES.json`);

    const siteGameV2Entries = [];
    const siteGameEntries = filterMobileSiteGames(siteGames.entries);

    console.log('siteGameEntries.length: ', siteGameEntries.length);

    for (let i = 0; i < siteGameEntries.length; i++) {
      console.log('Sitegames Transformation Iterator: ', i);
      const siteGame = siteGameEntries[i];
      if (isDuplicateSiteGame(siteGameV2Entries, siteGame)) continue;

      const game = await findGameInGameV2(siteGame, gamesV1.entries, gamesV2Transformed.entries, spaceLocale, VENDOR_SITEGAMES);
      if (game) {
        const newSiteGameEntry = createSiteGameEntry(siteGame, game, spaceLocale);

        siteGameV2Entries.push(newSiteGameEntry);
      }
    }

    await storeFiles(siteGameV2Entries, SITE_GAME_V2, spaceFolder);
  } catch (error) {
    log(`Error processing games: ${error}`);
    throw error;
  }
};

const readFileV1Data = async (filePath) => {
  try {
    return await readJSONFile(`./src/gameModelV2/data/gamev1/${filePath}`);
  } catch (error) {
    log(`Error reading file ${filePath}: ${error}`);
    return null;
  }
};

const readFileV2Data = async (filePath) => {
  try {
    return await readJSONFile(`./src/gameModelV2/data/gamev2/${filePath}`);
  } catch (error) {
    log(`Error reading file ${filePath}: ${error}`);
    return null;
  }
};

const findGameInGameV2 = async (siteGame, gamesV1List, gamesV2List, spaceLocale, VENDOR_SITEGAMES) => {
  const siteGameGame = siteGame?.fields?.game;
  if (!siteGameGame) return "";

  const gameToMapID = siteGameGame[spaceLocale]?.sys?.id;
  const venture = getSitegameVenture(siteGame.fields?.entryTitle[spaceLocale]);
  const gameToMapEntryTitle = gamesV1List
    .find(game => game?.sys?.id === gameToMapID)
    ?.fields?.entryTitle[spaceLocale]
    .replace(new RegExp(ALL_VENTURES_LIST.join("|"), "g"), "")
    .replace(/\[.*?\]/g, "")
    .trim();

  const gameVendor = VENDOR_SITEGAMES.entries[gameToMapEntryTitle]?.find(i => i.sitegame === venture)?.vendor;
  const TITLE = gameVendor ? `${gameToMapEntryTitle}_${gameVendor}` : gameToMapEntryTitle;
  const sysId = gamesV2List.find(gameV2 => gameV2?.fields?.entryTitle[spaceLocale] === TITLE)?.sys?.id;

  return sysId ? { [spaceLocale]: { sys: { type: "Link", linkType: "Entry", id: sysId } } } : "";
};

const createSiteGameEntry = (siteGame, game, spaceLocale) => {
  const defaultEntry = { [spaceLocale]: "" };
  const defaultEnvironment = { [spaceLocale]: ["staging"] };

  return {
    fields: {
      entryTitle: siteGame.fields?.entryTitle,
      game,
      venture: siteGame.fields?.venture,
      environment: siteGame.fields.environment || defaultEnvironment,
      maxBet: defaultEntry,
      minBet: defaultEntry,
      sash: defaultEntry,
      chat: siteGame.fields?.chat,
    },
  };
};

const isDuplicateSiteGame = (siteGameV2Entries, siteGame) => {
  return siteGameV2Entries.some(siteGameV2 => siteGame?.sys?.id === siteGameV2?.sys?.id);
};

const storeFiles = async (entries, model, spaceFolder) => {
  log(`Writing ${model}...`);
  await writeJSONFile(`./src/gameModelV2/data/gamev2/${spaceFolder}/${model}.json`, { entries });
};

const filterMobileSiteGames = (siteGames) => {
  return siteGames.filter((siteGame, i) => {
    if (typeof siteGame?.fields?.name === 'object' && siteGame?.fields?.name !== null) {
      const locale = Object.keys(siteGame?.fields?.name)[0];
      if (locale && siteGame.fields?.name[locale].endsWith("-m")) {
        return false;
      }
    } else {
      BROKEN_SITEGAMES.push(siteGame?.sys.id);
      log(`Skipping an item with invalid or missing 'name' property at index ${i}:  ${JSON.stringify(siteGame)}`);
    }
    return true;
  });
};

const getSitegameVenture = (str) => {
  const match = str.match(/\[(.*?)\]/);
  return match ? match[1] : null;
};

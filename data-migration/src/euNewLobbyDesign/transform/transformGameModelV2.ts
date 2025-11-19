// transform/transformGameV2.js

import { readJSONFile, writeJSONFile } from "../utils/fileOperations";
import { GAME_V2 } from "../constants";
import { transformPlatform } from "../utils/igPropertyUtils";


export default async (spaceLocale, spaceFolder) => {
  try {
    const gamesV2 = await readJSONFile(`./src/euNewLobbyDesign/data/${GAME_V2}/${spaceFolder}/${GAME_V2}.json`);
    const TEST_MODE = process.env.TEST_MODE === 'true';
    const limitedEntries = TEST_MODE ? gamesV2.entries.slice(0, 400) : gamesV2.entries;

    const updatedGamesV2 = updateGamesV2(limitedEntries, spaceLocale);
    gamesV2.entries = updatedGamesV2;


    const importData = {
      entries: updatedGamesV2,
    };

    await writeJSONFile(`./src/euNewLobbyDesign/data/${GAME_V2}/${spaceFolder}/${GAME_V2}-import.json`, importData);
  } catch (error) {
    console.error(`Error processing GameV2: ${error}`);
    throw error;
  }
};

const updateGamesV2 = (gamesV2, spaceLocale) => {
  return gamesV2.map(game => {
    const updatedGameFields = { ...game.fields, platformVisibility: transformPlatform(spaceLocale)};

    return {
      ...game,
      fields: updatedGameFields
    }
  });
};

// transform/transformGameV2.js
import { readJSONFile, writeJSONFile } from "../utils/fileOperations.js";
import { SITE_GAME_V2 } from "../constants.js";
import { transformPlatform, createEnvironmentVisibility } from "../utils/igPropertyUtils.js";

export default async (spaceLocale, spaceFolder) => {
  try {
    const gamesV2 = await readJSONFile(`./src/euNewLobbyDesign/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}.json`);
    const TEST_MODE = process.env.TEST_MODE === 'true';
    const limitedEntries = TEST_MODE ? gamesV2.entries.slice(0, 400) : gamesV2.entries;
    
    const updatedGamesV2 = updateSiteGamesV2(limitedEntries, spaceLocale);
    gamesV2.entries = updatedGamesV2;

    const importData = {
      entries: updatedGamesV2,
    };

    await writeJSONFile(`./src/euNewLobbyDesign/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}-import.json`, importData);
  } catch (error) {
    console.error(`Error processing SiteGameV2: ${error}`);
    throw error;
  }
};

const updateSiteGamesV2 = (gamesV2, spaceLocale) => {
  return gamesV2.map((game) => {
    // Copy existing fields and add the new fields/overrides
    const updatedGameFields = {
      ...game.fields,
      platformVisibility: transformPlatform(spaceLocale),
      environmentVisibility: createEnvironmentVisibility(spaceLocale),

      // Set liveHidden to false for the current locale
      liveHidden: { [spaceLocale]: false },
    };

    return {
      ...game,
      fields: updatedGameFields,
    };
  });
};

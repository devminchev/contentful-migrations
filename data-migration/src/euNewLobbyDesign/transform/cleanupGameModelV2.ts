// transform/transformGameV2.js
import { readJSONFile, writeJSONFile } from "../utils/fileOperations.js";
import { GAME_V2 } from "../constants.js";
import { transformPlatform, createEnvironmentVisibility, retrieveModelRecords } from "../utils/igPropertyUtils.js";

export default async (spaceLocale, spaceFolder) => {
  try {
    const gamesV2 = await retrieveModelRecords(GAME_V2);
    const TEST_MODE = process.env.TEST_MODE === 'true';
    const limitedEntries = TEST_MODE ? gamesV2.slice(0, 400) : gamesV2;
    
    // Find games with the falseisJackpotInGameProgressive property
    const gamesWithProperty = limitedEntries.filter(game => {
      return game.fields?.gamePlatformConfig?.[spaceLocale]?.gameType?.falseisJackpotInGameProgressive !== undefined;
    });

    console.log(`Found ${gamesWithProperty.length} games with 'falseisJackpotInGameProgressive' property:`);

    // Clean up the games by removing the falseisJackpotInGameProgressive property
    const cleanedGames = gamesWithProperty.map((game) => {
      console.log(`Cleaning game ID: ${game.sys.id}`);
      
      const gamePlatformConfig = game.fields.gamePlatformConfig[spaceLocale];
      // Use destructuring to exclude the unwanted property
      const { falseisJackpotInGameProgressive, ...cleanedPlatformConfig } = gamePlatformConfig?.gameType;

      const updatedGamePlatformConfig = {
        ...gamePlatformConfig,
        gameType: cleanedPlatformConfig
      }
      
      // Create updated game with the cleaned config
      return {
        ...game,
        fields: {
          ...game.fields,
          gamePlatformConfig: { [spaceLocale]: {
            ...updatedGamePlatformConfig
          }
          }
        }
      };
    });

    const importData = {
      entries: cleanedGames,
    };

    await writeJSONFile(`./src/euNewLobbyDesign/data/${GAME_V2}/${spaceFolder}/${GAME_V2}-clean.json`, importData);
    
    
  } catch (error) {
    console.error(`Error processing GameV2 cleanup: ${error}`);
    throw error;
  }
};

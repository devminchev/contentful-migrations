// transform/updateGameInfoDetailsFormWh.ts
import { writeJSONFile } from "../utils/fileOperations.js";
import { GAME_V2 } from "../constants.js";
import { retrieveModelRecords } from "../utils/igPropertyUtils.js";
import { getGameDetails } from "../api/whitehat/whitehatClient.js";
import { log } from "../utils/logging.js";
import { getEntries } from "../api/managementApi.js";

export default async (spaceLocale: string, spaceFolder: string) => {
  try {
    log("Retrieving gameV2 records...");
    const gamesV2 = await getEntries(GAME_V2);

    // Filter for whitehat games with empty introductionContent
    const filteredWhGames = gamesV2.filter(game => {
      const vendor = game.fields?.vendor?.[spaceLocale];
      const introductionContent = game.fields?.introductionContent?.[spaceLocale] || null;

      const isWhitehat = vendor === "whitehat";
      const hasEmptyContent = !introductionContent || introductionContent === "";
      const shouldInclude = isWhitehat && hasEmptyContent;

      return shouldInclude;
    });

    const updatedGames: any[] = [];
    const skippedGames: any[] = [];

    for (const [index, game] of filteredWhGames.entries()) {
      const launchCode = game.fields?.launchCode?.[spaceLocale];

      if (!launchCode || typeof launchCode !== 'string' || launchCode.trim() === '') {
        log(`Skipping game ${game.sys.id} - no valid launch code found`);
        skippedGames.push({
          ...game,
          skipReason: "No valid launch code found"
        });
        continue;
      }

      try {
        log(`Processing game ${index + 1}/${filteredWhGames.length}: ${launchCode}`);

        const gameDetails = await getGameDetails(launchCode);

        const description = gameDetails?.description?.description;

        if (description && typeof description === 'string' && description.trim() !== "") {
          // Update the game with the new introduction content
          const updatedGame = {
            ...game,
            fields: {
              ...game.fields,
              introductionContent: {
                ...game.fields.introductionContent,
                [spaceLocale]: description
              }
            }
          };

          updatedGames.push(updatedGame);
          log(`✓ Updated game ${launchCode} with description`);
        }

      } catch (error) {
        log(`✗ Error processing game ${launchCode}: ${error.message}`);
        skippedGames.push({
          ...game,
          skipReason: `API error: ${error.message}`
        });
      }
    }

    log(`Successfully processed ${updatedGames.length} games`);
    log(`Skipped ${skippedGames.length} games`);
    
    await writeJSONFile(
      `./src/naNewLobbyDesign/data/${GAME_V2}/${spaceFolder}/${GAME_V2}-updated.json`,
      { entries: updatedGames }
    );
    if (skippedGames.length > 0) {
      await writeJSONFile(
        `./src/naNewLobbyDesign/data/${GAME_V2}/${spaceFolder}/${GAME_V2}-skipped.json`,
        skippedGames
      );
    }
  } catch (error) {
    console.error(`Error processing whitehat game info details: ${error}`);
    throw error;
  }
};

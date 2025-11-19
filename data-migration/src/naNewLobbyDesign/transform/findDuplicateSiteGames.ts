// transform/transformGameV2.js
import { writeJSONFile } from "../../naNewLobbyDesign/utils/fileOperations.js";
import { SITE_GAME_V2 } from "../../naNewLobbyDesign/constants.js";
import { retrieveModelRecords } from "../../naNewLobbyDesign/utils/igPropertyUtils.js";

// Regex to exclude specific vendor tags in entryTitle
const EXCLUDE_TAGS = /\[(?:tropicana|virgincasino|ballycasinoontario|ballycasinonj)\]/i;

export default async (spaceLocale, spaceFolder) => {
  try {
    const siteGamesV2 = await retrieveModelRecords(SITE_GAME_V2);

    // Group games by venture + game.id combination
    const groups: Record<string, Array<{sysId: string, ventureId: string, gameId: string, entryTitle: string}>> = {};
    console.log(siteGamesV2.length);

    siteGamesV2.forEach(siteGame => {
      const ventureId = siteGame.fields?.venture?.[spaceLocale]?.sys?.id;
      const gameId = siteGame.fields?.game?.[spaceLocale]?.sys?.id;
      const entryTitle = siteGame.fields?.entryTitle?.[spaceLocale];

      // Skip items missing IDs or matching excluded vendor tags
      if (!ventureId || !gameId || !entryTitle || EXCLUDE_TAGS.test(entryTitle)) return;

      const key = `${ventureId}|${gameId}`;

      if (!groups[key]) groups[key] = [];
      groups[key].push({
        sysId: siteGame.sys.id,
        ventureId,
        gameId,
        entryTitle
      });
    });

    // Get all duplicates (groups with more than 1 game)
    const duplicates = Object.values(groups)
      .filter(group => group.length > 1)
      .flat();

    console.log(`Found ${Object.values(groups).filter(g => g.length > 1).length} duplicate groups`);

    await writeJSONFile(
      `./src/naNewLobbyDesign/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}-duplicates.json`,
      duplicates
    );

  } catch (error) {
    console.error(`Error processing Site Game duplicate search: ${error}`);
    throw error;
  }
};

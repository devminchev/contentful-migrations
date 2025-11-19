import { readJSONFile, writeJSONFile } from "../utils/fileOperations.js";
import { LOBBY_SUGGESTED_GAMES, IG_LOBBY_SUGGESTED_GAMES } from "../constants.js";

export default async (spaceLocale, spaceFolder) => {
  try {
    const suggestedGamesSrc = await readJSONFile(`./src/euNewLobbyDesign/data/${LOBBY_SUGGESTED_GAMES}/${spaceFolder}/${LOBBY_SUGGESTED_GAMES}.json`);
    const transformedGames = transformSuggestedGames(suggestedGamesSrc.entries, spaceLocale);
    await writeJSONFile(`./src/euNewLobbyDesign/data/${LOBBY_SUGGESTED_GAMES}/${spaceFolder}/${IG_LOBBY_SUGGESTED_GAMES}.json`, { entries: transformedGames });
  } catch (error) {
    console.error(`Error processing suggested games: ${error}`);
    throw error;
  }
};

const transformSuggestedGames = (suggestedGames, spaceLocale) => {
  return suggestedGames.map(suggested => ({
    fields: {
      entryTitle: suggested.fields.entryTitle,
      venture: suggested.fields.venture,
      games: suggested.fields.games,
      environmentVisibility: suggested.fields.environment || {
        [spaceLocale]: ["staging", "production"]
      }
    }
  }));;
};

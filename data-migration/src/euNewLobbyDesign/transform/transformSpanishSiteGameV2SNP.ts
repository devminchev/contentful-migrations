import { readJSONFile, writeJSONFile } from "../utils/fileOperations.js";
import { SITE_GAME_V2 } from "../constants.js";
import { transformShowNetPositionAsFalse } from "../utils/igPropertyUtils.js";

const MONOPOLYCASINO_SPAIN = '01NyOW99hTiEzi540sY14g';
const BOTEMANIA = '500dSHbQQy1qKai7P0ODy6';

/**
 * ShowNetPosition transformation to false for all spanish ventures 
 */
export default async (spaceLocale, spaceFolder) => {
    try {
        const gamesV2 = await readJSONFile(`./src/euNewLobbyDesign/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}.json`);

        const updatedSpanishSiteGames = updateSpanishSiteGamesV2(gamesV2.entries, spaceLocale)
        const updatedSpanishEntries = {
            entries: updatedSpanishSiteGames
        }

        await writeJSONFile(`./src/euNewLobbyDesign/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}-Spanish.json`, updatedSpanishEntries);
    } catch (error) {
        console.error(`Error processing SiteGameV2: ${error}`);
        throw error;
    }
};

const updateSpanishSiteGamesV2 = (gamesV2, spaceLocale) => {
    return gamesV2
        .filter(game => {
            const venture = game?.fields?.venture?.[spaceLocale]?.sys?.id;
            return venture === BOTEMANIA || venture === MONOPOLYCASINO_SPAIN;
        })
        .map(game => {
            const showNetPosition = game?.fields?.showNetPosition?.[spaceLocale];
            const venture = game?.fields?.venture?.[spaceLocale]?.sys?.id;

            if (showNetPosition === true || showNetPosition === undefined) {
                console.log(`Parsing Spanish ventures: ${game?.sys?.id}, ${showNetPosition}, ${venture}`);

                const updatedGameFields = {
                    ...game.fields,
                    showNetPosition: transformShowNetPositionAsFalse(spaceLocale)
                };

                return {
                    ...game,
                    fields: updatedGameFields,
                };
            }
            return game;
        });
};

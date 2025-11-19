import { readJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { retrieveModelRecords, transformPlatform } from "../utils/igPropertyUtils";
import { VENTURE, JURISDICTION, SITE_GAME_V2, GAME_V2 } from "../constants";
import {storeFile} from "../save";
import { getEntries } from "../api/managementApi";


const createNaImgPattern = (launchCode: string, spaceLocale: string) => {
    return {[spaceLocale]: `/assets/common/images/casino/tiles/${launchCode}/scale-2/game-tile-15-444.jpg`};
}

export const updateGamesV2 = async (spaceLocale: string, spaceFolder: string) => {
    try {
        const gamesV2 = await getEntries(GAME_V2);


        // Filter out ventures already present, and build payloads for those to add
        const updatedGameEntries: any[] = gamesV2?.map(item => {
            const launchCode = item?.fields?.launchCode?.[spaceLocale];

            if (!launchCode?.trim()) {
                const updatedFields = {
                    ...item.fields,
                    platformVisibility: transformPlatform(spaceLocale),
                    showNetPosition: { [spaceLocale]: item?.fields?.showNetPosition?.[spaceLocale] || false }
                };
                return {
                    ...item,
                    fields: updatedFields
                };
            }

            const sharedImagePattern = createNaImgPattern(launchCode, spaceLocale);

            const updatedFields = {
                ...item.fields,
                imgUrlPattern: sharedImagePattern,
                loggedOutImgUrlPattern: sharedImagePattern,
                infoImgUrlPattern: sharedImagePattern,
                // funPanelBackgroundImage: sharedImagePattern,
                dfgWeeklyImgUrlPattern: sharedImagePattern,
                platformVisibility: transformPlatform(spaceLocale),
                showNetPosition: { [spaceLocale]: item?.fields?.showNetPosition?.[spaceLocale] || false }
            }

            return {
                ...item,
                fields: updatedFields
            }

        });

        await storeFile(updatedGameEntries, `./src/naNewLobbyDesign/data/${GAME_V2}/${spaceFolder}/${GAME_V2}.json`);
    } catch (error) {
        log(`Error processing ventures: ${error}`);
        throw error;
    }
};

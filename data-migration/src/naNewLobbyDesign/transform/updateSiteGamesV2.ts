import { log } from "../utils/logging";
import { SITE_GAME_V2 } from "../constants";
import { storeFile } from "../save";
import { getEntries } from "../api/managementApi";
import { createEnvironmentVisibility, transformPlatform } from "../utils/igPropertyUtils";

// Add a currency symbol if there's a value and make sure there's only one currency symbol added in.
const formatBet = value => value ? `$${value.replace(/^\$+/, '')}` : '';

export const updateSiteGamesV2 = async (spaceLocale: string, spaceFolder: string) => {
    try {
        const siteGameV2 = await getEntries(SITE_GAME_V2);

       const updatedSiteGameEntries: any[] = siteGameV2?.map(item => {

            const updatedFields = {
                ...item.fields,
                minBet: {
                    [spaceLocale]: formatBet(item?.fields?.minBet?.[spaceLocale])
                },
                maxBet: {
                    [spaceLocale]: formatBet(item?.fields?.maxBet?.[spaceLocale])
                },
                environmentVisibility: item.fields.EnvironmentVisibility
                    ? item.fields.EnvironmentVisibility
                    : createEnvironmentVisibility(spaceLocale),
                platformVisibility: item.fields.platformVisibility
                    ? item.fields.platformVisibility
                    : transformPlatform(spaceLocale),
                showNetPosition: {
                    [spaceLocale]: item?.fields?.showNetPosition?.[spaceLocale]
                        ? item.fields.showNetPosition[spaceLocale]
                        : false
                }
            }

            return {
                ...item,
                fields: updatedFields
            } 
        });

        await storeFile(updatedSiteGameEntries, `./src/naNewLobbyDesign/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}.json`);
    } catch (error) {
        log(`Error processing ventures: ${error}`);
        throw error;
    }
};

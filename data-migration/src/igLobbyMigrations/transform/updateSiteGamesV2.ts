import { log } from "../utils/logging";
import { SITE_GAME_V2 } from "../constants";
import { storeFile } from "../save";
import { retrieveModelRecords } from "../utils/commonUtils";

// virgingames: 4ZeOyVdXGdQbGMxlaSARbl, rainbowriches: UbTtyvgOxKLUeMZxQ6NZX, ballyuk: 3urSIt78Np8B1ALw5uEqPN, monopolycasino: 25B0krO16l6CXyMfUUAZCY
const VENTURES_TO_FILTER = ["4ZeOyVdXGdQbGMxlaSARbl", "UbTtyvgOxKLUeMZxQ6NZX", "3urSIt78Np8B1ALw5uEqPN", "25B0krO16l6CXyMfUUAZCY"];

const RESULT_CHAT_VALUE = {
    "en-GB": null
}

export const updateSiteGamesV2 = async (spaceLocale: string, spaceFolder: string) => {
    try {
        const siteGameV2 = await retrieveModelRecords(SITE_GAME_V2, spaceFolder);

        console.log(`Retrieved ${siteGameV2?.length} siteGameV2 records`);
        

        const filteredSiteGames = siteGameV2?.filter(item => {
            const itemVentureId = item.fields.venture?.[spaceLocale]?.sys?.id;
            return itemVentureId ? VENTURES_TO_FILTER.includes(itemVentureId) : false;
        });

        console.log(`${filteredSiteGames?.length} siteGameV2 records matching the venture criteria to transform`);


        const updatedSiteGameEntries: any[] = filteredSiteGames?.map((item: { fields: any; }) => {

            const updatedFields = {
                ...item.fields,
                chat: RESULT_CHAT_VALUE
            }

            return {
                ...item,
                fields: updatedFields
            }
        });

        await storeFile(updatedSiteGameEntries, `./src/igLobbyMigrations/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}-updated.json`);
    } catch (error) {
        log(`Error processing ventures: ${error}`);
        throw error;
    }
};

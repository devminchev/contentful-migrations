import { log } from "../../utils/logging";
import { SITE_GAME_V2 } from "../../constants";
import { storeFile } from "../../save";
import { getEntries } from "../../api/managementApi";


export const getUpdatedWhGames = async (spaceFolder) => {
    try {
        const freshWhSiteGames = await getEntries(SITE_GAME_V2);
        await storeFile(freshWhSiteGames, `./src/naNewLobbyDesign/data/${SITE_GAME_V2}/${spaceFolder}/${SITE_GAME_V2}.json`);
    } catch (error) {
        log(`Error trying to fetch updated SiteGames from WhiteHat : ${error}`);
        throw error;
    }
};

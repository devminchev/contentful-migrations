import { log } from "../utils/logging";
import { IG_BANNER_SECTION } from "../constants";
import { storeFile } from "../save";
import { getEntries } from "../api/managementApi";

export const updateIgBannerSection = async (spaceLocale: string, spaceFolder: string) => {
    try {
        const igBanner = await getEntries(IG_BANNER_SECTION);

        const updatedSiteGameEntries: any[] = igBanner?.map(item => {

            const updatedFields = {
                ...item.fields,
                bannerType: {
                    [spaceLocale]: "media"
                }
            }

            return {
                ...item,
                fields: updatedFields
            }
        });

        await storeFile(updatedSiteGameEntries, `./src/euNewLobbyDesign/data/${IG_BANNER_SECTION}/${spaceFolder}/${IG_BANNER_SECTION}.json`);
    } catch (error) {
        log(`Error processing ventures: ${error}`);
        throw error;
    }
};

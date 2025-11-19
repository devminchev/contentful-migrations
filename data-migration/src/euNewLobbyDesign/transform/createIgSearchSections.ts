import { log } from "../utils/logging.js";
import { IG_SEARCH_RESULTS, VENTURE, CURRENT_EU_VENTURES } from "../constants.js";
import { storeFile } from "../save/index.js";
import { venturesKeyNameMaps, createEnvironmentVisibility, transformPlatform, createSessionVisibility } from "../utils/igPropertyUtils.js";
import { getEntries } from "../api/managementApi.js";

export const createIgSearchSections = async (spaceLocale, spaceFolder) => {
    let searchSectionEntries = [];

    try {
        const ventures = await getEntries(VENTURE);

        let ventures_map = venturesKeyNameMaps(spaceLocale, ventures).ventureByName;

        CURRENT_EU_VENTURES.forEach(item => {
            const ventureId = ventures_map[item];
            const entryTitle = `Search [${item}]`;

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: entryTitle },
                    title: { [spaceLocale]: 'Search' },
                    slug: { [spaceLocale]: 'search' },
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                    layoutType: { [spaceLocale]: 'grid-a' },
                    classification: { [spaceLocale]: 'SearchResultsSection' }
                }
            };

            searchSectionEntries.push(payload);
        });

        await storeFile(searchSectionEntries, `./src/euNewLobbyDesign/data/${IG_SEARCH_RESULTS}/${spaceFolder}/${IG_SEARCH_RESULTS}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

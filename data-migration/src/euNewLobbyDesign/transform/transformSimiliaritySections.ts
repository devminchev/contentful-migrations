import { readJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { SIMILARITY_SECTIONS, IG_SIMILARITY_SECTIONS } from "../constants";
import { transformPlatform, createSingleLayoutType, createExpandedSectionLayoutType, createViewAllActionText, createViewAllType, createEnvironmentVisibility} from "../utils/igPropertyUtils";
import storeFile from "../save";

export default async (spaceLocale, spaceFolder) => {
    try {
        const similaritySections = await readJSONFile(`./src/euNewLobbyDesign/data/${SIMILARITY_SECTIONS}/production/${SIMILARITY_SECTIONS}.json`)

        let similaritySectionsEntries = [];

        const slug = 'because-you-played-suggestions';

        for (const item of similaritySections.entries) {

            const payload = {
                fields: {
                    entryTitle: item.fields.entryTitle,
                    title: item.fields.title,
                    slug: { [spaceLocale]: slug },
                    venture: item.fields.venture,
                    platformVisibility: transformPlatform(spaceLocale),
                    environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                    sessionVisibility: item.fields.show,
                    layoutType: createSingleLayoutType(spaceLocale, 'carousel-a'),
                    type: item.fields.type,
                    viewAllActionText: createViewAllActionText(spaceLocale, 'View All'),
                    viewAllType: createViewAllType(spaceLocale),
                    expandedSectionLayoutType: createExpandedSectionLayoutType(spaceLocale, 'grid-a'),
                }
            }

            similaritySectionsEntries.push(payload);
        }

        await storeFile(similaritySectionsEntries, `./src/euNewLobbyDesign/data/${SIMILARITY_SECTIONS}/${spaceFolder}/${IG_SIMILARITY_SECTIONS}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

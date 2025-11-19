import { readJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { SIMILARITY_SECTIONS, IG_SIMILARITY_SECTIONS } from "../constants";
import { transformPlatform, createSingleLayoutType, createExpandedSectionLayoutType, createViewAllActionText, createViewAllType, createEnvironmentVisibility} from "../utils/igPropertyUtils";
import storeFile from "../save";

export default async (spaceLocale, spaceFolder) => {
    try {
        const similaritySections = await readJSONFile(`./src/euNewLobbyDesign/data/${SIMILARITY_SECTIONS}/production/${SIMILARITY_SECTIONS}.json`)

        let similaritySectionsEntries = [];

        const slugY = 'because-you-played-y';
        const slugZ = 'because-you-played-z';
        
        createSection(slugY, similaritySections, spaceLocale, similaritySectionsEntries);
        createSection(slugZ, similaritySections, spaceLocale, similaritySectionsEntries);


        await storeFile(similaritySectionsEntries, `./src/euNewLobbyDesign/data/${SIMILARITY_SECTIONS}/${spaceFolder}/${IG_SIMILARITY_SECTIONS}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

const createSection = (slug, similaritySections, spaceLocale, out ) => {
    for (const item of similaritySections.entries) {

        const entryTitle = item.fields.entryTitle?.[spaceLocale].replace(/^because-you-played-x\s*/, '')
        const newEntryTitle = `${slug} ${entryTitle}`

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: newEntryTitle },
                    title: item.fields.title,
                    slug: { [spaceLocale]: slug },
                    venture: item.fields.venture,
                    platformVisibility: transformPlatform(spaceLocale),
                    environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                    sessionVisibility: item.fields.show,
                    layoutType: createSingleLayoutType(spaceLocale, 'carousel-a'),
                    type: { [spaceLocale]: slug },
                    viewAllActionText: createViewAllActionText(spaceLocale, 'View All'),
                    viewAllType: { [spaceLocale]: 'none' },
                    expandedSectionLayoutType: createExpandedSectionLayoutType(spaceLocale, 'grid-a'),
                }
            }

            out.push(payload);
        }

        return out
}

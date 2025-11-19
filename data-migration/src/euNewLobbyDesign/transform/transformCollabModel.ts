import { readJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { LOBBY_COLLAB_BASED_SECTIONS, IG_COLLAB_BASED_SECTIONS } from "../constants";
import { transformPlatform, createSingleLayoutType, createExpandedSectionLayoutType, createViewAllActionText, createViewAllType, createEnvironmentVisibility } from "../utils/igPropertyUtils";
import storeFile from "../save";

export default async (spaceLocale, spaceFolder) => {
    try {
        const collabSections = await readJSONFile(`./src/euNewLobbyDesign/data/${LOBBY_COLLAB_BASED_SECTIONS}/production/${LOBBY_COLLAB_BASED_SECTIONS}.json`)

        let collabSectionEntries = [];

        const slug = 'suggested-for-you-games';

        for (const item of collabSections.entries) {

            const payload = {
                fields: {
                    entryTitle: item.fields.entryTitle,
                    title: item.fields.title,
                    slug: { [spaceLocale]: slug },
                    venture: item.fields.venture,
                    platformVisibility: transformPlatform(spaceLocale),
                    environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                    sessionVisibility: item.fields.show,
                    games: item.fields.games,
                    type: item.fields.type,
                    layoutType: createSingleLayoutType(spaceLocale, 'carousel-a'),
                    viewAllActionText: createViewAllActionText(spaceLocale, 'View All'),
                    viewAllType: createViewAllType(spaceLocale),
                    expandedSectionLayoutType: createExpandedSectionLayoutType(spaceLocale, 'grid-a'),
                }
            }

            collabSectionEntries.push(payload);

        }

        await storeFile(collabSectionEntries, `./src/euNewLobbyDesign/data/${LOBBY_COLLAB_BASED_SECTIONS}/${spaceFolder}/${IG_COLLAB_BASED_SECTIONS}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

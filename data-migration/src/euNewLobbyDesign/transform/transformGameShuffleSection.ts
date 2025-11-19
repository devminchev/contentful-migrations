import { log } from "../utils/logging";
import storeFile from "../save";
import { readJSONFile } from "../utils/fileOperations";
import { IG_GAME_SHUFFLE_SECTION, SECTION, VENTURE } from "../constants";
import { transformPlatform, filterTitle, retrieveModelRecords, venturesKeyNameMaps, filterOutNonDesktopEntries, extractVentureFromTitle, createSessionVisibility, createEnvironmentVisibility } from "../utils/igPropertyUtils";

const filterGameShuffleSection = (entryTitle: string | undefined): boolean => {
    return entryTitle?.includes("game-shuffle-widget") || false;
}

export default async (spaceLocale: string | number, spaceFolder: any) => {
    try {
        const section = await readJSONFile(`./src/euNewLobbyDesign/data/${SECTION}/${spaceFolder}/${SECTION}.json`);
        const ventures = await retrieveModelRecords(VENTURE);
        const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;
        let gameShuffleEntries = [];

        const desktopSections = section.entries.filter(entry =>
            filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
        );

        const gameShuffleSection = desktopSections.filter(entry =>
            filterGameShuffleSection(entry.fields?.entryTitle?.[spaceLocale])
        );

        for (const item of gameShuffleSection) {
            const entryTitle = item.fields.entryTitle[spaceLocale].toLowerCase();
            const ventureId = extractVentureFromTitle(entryTitle, ventures_map);

            let filteredEntryTitle = filterTitle(spaceLocale, item);
            let title = filteredEntryTitle[spaceLocale];

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: title },
                    title: item.fields.title,
                    name: item.fields.name,
                    classification: { [spaceLocale]: "GameShuffleSection" },
                    environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: item.fields.show || createSessionVisibility(spaceLocale),
                    venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                }
            };
            gameShuffleEntries.push(payload);

        }
        await storeFile(gameShuffleEntries, `./src/euNewLobbyDesign/data/${SECTION}/${spaceFolder}/${IG_GAME_SHUFFLE_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

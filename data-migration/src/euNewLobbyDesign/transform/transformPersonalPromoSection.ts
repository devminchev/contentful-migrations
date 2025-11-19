import { log } from "../utils/logging";
import storeFile from "../save";
import { readJSONFile } from "../utils/fileOperations";
import { BANNER_SECTION, IG_BRAZE_PROMO_SECTION, SECTION, VENTURE } from "../constants";
import { transformPlatform, filterTitle, retrieveModelRecords, venturesKeyNameMaps, filterOutNonDesktopEntries, extractVentureFromTitle, createSessionVisibility, createEnvironmentVisibility } from "../utils/igPropertyUtils";

const filterPersonalPromotionSection = (entryTitle: string | undefined): boolean => {
    return entryTitle?.includes("personal-promotions") || false;
}

const containsUnwantedSubstrings = (title: string): boolean => {
    const unwantedSubstrings = ["TEST", "[PARTNER]"];
    return unwantedSubstrings.some(substring => title.includes(substring.toLowerCase()));
}
const getLoggedInEntries = (sessionVisibility: string): boolean => {
    const notLoggedIn = ["loggedOut", ""];
    return notLoggedIn.some(substring => sessionVisibility.includes(substring.toLowerCase()));
}

export default async (spaceLocale, spaceFolder) => {
    try {
        const section = await readJSONFile(`./src/euNewLobbyDesign/data/${SECTION}/${spaceFolder}/${SECTION}.json`);
        const ventures = await retrieveModelRecords(VENTURE);
        const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;
        let personalPromotionSectionEntries = [];
        let titleCount = {};



        const desktopSections = section.entries.filter(entry =>
            filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
        );

        const personalPromotionSections = desktopSections.filter(entry =>
            filterPersonalPromotionSection(entry.fields?.entryTitle?.[spaceLocale])
        );

        const filteredSections = personalPromotionSections.filter(entry => {
            const entryTitle = entry.fields.entryTitle[spaceLocale].toLowerCase();
            return !containsUnwantedSubstrings(entryTitle);
        });

        const filteredLoggedInSection = filteredSections.filter(entry => {
            const sessionVisibility = entry?.fields?.show?.[spaceLocale];

            if (!sessionVisibility) {
                return false;
            }

            return getLoggedInEntries(sessionVisibility.toString());
        });

        for (const item of filteredLoggedInSection) {
            const entryTitle = item.fields.entryTitle[spaceLocale].toLowerCase();
            const ventureId = extractVentureFromTitle(entryTitle, ventures_map);

            let filteredEntryTitle = filterTitle(spaceLocale, item);
            let finalTitle = filteredEntryTitle[spaceLocale];

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: finalTitle },
                    title: item.fields.title,
                    environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: item.fields.show,
                    venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                    classification: { [spaceLocale]: "BrazePromosSection" },
                }
            };
            personalPromotionSectionEntries.push(payload);

        }
        await storeFile(personalPromotionSectionEntries, `./src/euNewLobbyDesign/data/${BANNER_SECTION}/${spaceFolder}/${IG_BRAZE_PROMO_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

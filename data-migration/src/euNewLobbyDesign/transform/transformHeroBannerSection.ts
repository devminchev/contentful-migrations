import { log } from "../utils/logging";
import storeFile from "../save";
import { readJSONFile } from "../utils/fileOperations";
import { BANNER_SECTION, IG_BANNER_SECTION, VENTURE } from "../constants";
import { transformPlatform, filterTitle, retrieveModelRecords, venturesKeyNameMaps, filterOutNonDesktopEntries, extractVentureFromTitle, createSessionVisibility, createEnvironmentVisibility } from "../utils/igPropertyUtils";

// Same as banner but only for hero banner related transformation

// function to add parenthesis increments if titles are duplicates since we are extracting multiple banners from same section at times
const incrementTitleCount = (spaceLocale, baseTitle, titleCount) => {
    if (!titleCount[spaceLocale]) {
        titleCount[spaceLocale] = {};
    }

    if (!titleCount[spaceLocale][baseTitle]) {
        titleCount[spaceLocale][baseTitle] = 1;
    } else {
        titleCount[spaceLocale][baseTitle]++;
    }

    return titleCount[spaceLocale][baseTitle] > 1
        ? `${baseTitle} (${titleCount[spaceLocale][baseTitle] - 1})`
        : baseTitle;
};

const filterHeroBanners = (entryTitle: string | undefined): boolean => {
    return entryTitle?.includes("hero-promotion") || false;
}

export default async (spaceLocale, spaceFolder) => {
    try {
        const section = await readJSONFile(`./src/euNewLobbyDesign/data/${BANNER_SECTION}/${spaceFolder}/${BANNER_SECTION}.json`);
        const ventures = await retrieveModelRecords(VENTURE);
        const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;
        let bannerSectionEntries = [];
        let titleCount = {};

        const desktopSections = section.entries.filter(entry =>
            filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
        );

        const heroBannerSection = desktopSections.filter(entry =>
            filterHeroBanners(entry.fields?.entryTitle?.[spaceLocale])
        );

        for (const item of heroBannerSection) {
            const entryTitle = item.fields.entryTitle[spaceLocale].toLowerCase();
            const ventureId = extractVentureFromTitle(entryTitle, ventures_map);

            let filteredEntryTitle = filterTitle(spaceLocale, item);
            let baseTitle = filteredEntryTitle[spaceLocale];
            let finalTitle = incrementTitleCount(spaceLocale, baseTitle, titleCount);

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: finalTitle },
                    title: item.fields.title,
                    environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: item.fields.show || createSessionVisibility(spaceLocale),
                    venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                    classification: { [spaceLocale]: "BannerSection" },
                    bannerType: { [spaceLocale]: "hero" }
                }
            };
            bannerSectionEntries.push(payload);

        }
        await storeFile(bannerSectionEntries, `./src/euNewLobbyDesign/data/${BANNER_SECTION}/${spaceFolder}/${IG_BANNER_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

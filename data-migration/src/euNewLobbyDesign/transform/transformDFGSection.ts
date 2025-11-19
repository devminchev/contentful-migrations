import { readJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { SITE_GAME_V2, VENTURE, SECTION, IG_DFG_SECTION, DFG_SECTION } from "../constants";
import { filterTitle, venturesKeyNameMaps, retrieveModelRecords, filterOutNonDesktopEntries, transformPlatform, createSessionVisibility, createEnvironmentVisibility } from "../utils/igPropertyUtils";
import storeFile from "../save";

const createSiteGamesV2Type = (spaceLocale, filteredGameIDs) => ({
    [spaceLocale]: filteredGameIDs
});

const createMediaType = (spaceLocale, entry) => {
    let mediaType = { ...entry.fields.slides[spaceLocale][0] };
    mediaType = mediaType.image;
    return {
        [spaceLocale]: mediaType
    }
};

const createLinkType = (spaceLocale, entry) => {
    let mediaType = { ...entry.fields.slides[spaceLocale][0] };
    mediaType = mediaType.link;
    return {
        [spaceLocale]: mediaType
    }
};

const filterSiteGamesV2 = (games, siteGamesV2IDs, carouselGameIds) => {
    return games.filter(game => siteGamesV2IDs.has(game.sys.id) && carouselGameIds.has(game.sys.id));
};

export default async (spaceLocale, spaceFolder) => {
    try {
        const TEST_MODE = process.env.TEST_MODE === 'true';

        const siteGamesV2 = await retrieveModelRecords(SITE_GAME_V2);
        const allSections = await readJSONFile(`./src/euNewLobbyDesign/data/${DFG_SECTION}/production/${DFG_SECTION}.json`);
        const dfg_section = allSections.entries.filter(item => item.fields.type?.[spaceLocale] === 'dynamic-daily-free-games');
        const ventures = await retrieveModelRecords(VENTURE);

        const limitedEntries = TEST_MODE ? dfg_section.slice(0, 10) : dfg_section;

        const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;

        let dfgSectionEntries = [];

        const siteGamesV2IDs = new Set(siteGamesV2.map(item => item.sys.id));
        const carouseGameIds = new Set(dfg_section.flatMap(item =>
            (item.fields?.games?.[spaceLocale] || []).map(game => game.sys?.id)
        ));

        const excludedRegexDFGEntries = limitedEntries.filter(entry =>
            filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
        );

        for (const item of excludedRegexDFGEntries) {
            if (Object.keys(item.fields?.carousel ?? {}).length && Object.keys(item.fields?.games ?? {}).length) {
                //Get ventures from entry title
                const ventures_name = Object.keys(ventures_map);
                const pattern = new RegExp(`\\[(${ventures_name.map(param => param.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join("|")})\\]`, "g");
                const entryTitle = item.fields.entryTitle[spaceLocale];
                const matches = [...entryTitle.matchAll(pattern)].map(match => match[1]);
                const ventureId = (matches.length && matches[0] in ventures_map) ? ventures_map[matches[0]] : null;

                const gameFields = item.fields?.games?.[spaceLocale] || [];
                const filteredSiteGames = filterSiteGamesV2(gameFields, siteGamesV2IDs, carouseGameIds);

                const payload = {
                    fields: {
                        entryTitle: filterTitle(spaceLocale, item),
                        title: item.fields.title,
                        environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                        platformVisibility: transformPlatform(spaceLocale),
                        sessionVisibility: item.fields.show || createSessionVisibility(spaceLocale),
                        venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                        media: createMediaType(spaceLocale, item),
                        link: createLinkType(spaceLocale, item),
                        games: createSiteGamesV2Type(spaceLocale, filteredSiteGames),
                    }
                };

                dfgSectionEntries.push(payload);
            }
        }
        await storeFile(dfgSectionEntries, `./src/euNewLobbyDesign/data/${DFG_SECTION}/${spaceFolder}/${IG_DFG_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

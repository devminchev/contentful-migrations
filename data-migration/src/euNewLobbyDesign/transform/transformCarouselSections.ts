import { readJSONFile } from "../utils/fileOperations.js";
import { log } from "../utils/logging.js";
import { CAROUSEL_A_SECTIONS, IG_CAROUSEL_A_SECTIONS, SITE_GAME_V2, VENTURE } from "../constants.js";
import { transformPlatform, createSingleLayoutType, filterTitle, retrieveModelRecords, venturesKeyNameMaps, createViewAllType, desktopEntriesOnly, JACKPOT_SECTION_NAMES, transformNameToSlug, createViewAllActionText, createExpandedSectionLayoutType, extractVentureFromTitle, excludeNonDesktopEntries, createSessionVisibility, createEnvironmentVisibility } from "../utils/igPropertyUtils.js";
import storeFile from "../save/index.js";

const createSiteGamesV2Type = (spaceLocale, filteredGameIDs) => ({
    [spaceLocale]: filteredGameIDs
});

const filterSiteGamesV2 = (games, siteGamesV2IDs, carouselGameIds) => {
    return games.filter(game => siteGamesV2IDs.has(game.sys.id) && carouselGameIds.has(game.sys.id));
};

export default async (spaceLocale, spaceFolder) => {
    try {
        const siteGamesV2 = await retrieveModelRecords(SITE_GAME_V2);
        const carouselASections = await readJSONFile(`./src/euNewLobbyDesign/data/${CAROUSEL_A_SECTIONS}/production/${CAROUSEL_A_SECTIONS}.json`);
        const ventures = await retrieveModelRecords(VENTURE);

        const desktopCarouselASections = excludeNonDesktopEntries(carouselASections, spaceLocale);

        const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;
        let carouselASectionsEntries = [];

        const siteGamesV2IDs = new Set(siteGamesV2.map(item => item.sys.id));
        const carouseGameIds = new Set(desktopCarouselASections.flatMap(item =>
            (item.fields?.games?.[spaceLocale] || []).map(game => game.sys?.id)
        ));

        const gameSectionWithCarousel = desktopCarouselASections.filter(item => {
            const hasCarousel = item.fields?.carousel?.[spaceLocale];
            const hasGames = item.fields?.games;
            const isJackpot = (item.fields.type && item.fields.type?.[spaceLocale] && item.fields.type?.[spaceLocale].includes('-jackpots')) ||
                (item.fields.name && JACKPOT_SECTION_NAMES.includes(item.fields.name[spaceLocale]))

            return hasCarousel && hasGames && !isJackpot;
        });
        
        console.log('Found desktop games sections with carousels: ', gameSectionWithCarousel.length);
        
        for (const item of gameSectionWithCarousel) {    
                //Get ventures from entry title
                const entryTitle = item.fields.entryTitle[spaceLocale];  
                const ventureId = extractVentureFromTitle(entryTitle, ventures_map);

                
                const gameFields = item.fields?.games?.[spaceLocale] || [];
                const filteredSiteGames = filterSiteGamesV2(gameFields, siteGamesV2IDs, carouseGameIds);
                const hasDesktopString = entryTitle.includes("[desktop]");
                const sectionName = item.fields?.name?.[spaceLocale];
                const validatedSlug = transformNameToSlug(sectionName);
                

                const payload = {
                    fields: {
                        entryTitle: filterTitle(spaceLocale, item),
                        title: item.fields.title,
                        environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                        platformVisibility: transformPlatform(spaceLocale),
                        sessionVisibility: item.fields.show || createSessionVisibility(spaceLocale),
                        venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                        games: createSiteGamesV2Type(spaceLocale, filteredSiteGames),
                        layoutType: createSingleLayoutType(spaceLocale, 'carousel-a'),
                        viewAllType: createViewAllType(spaceLocale),
                        viewAllActionText: createViewAllActionText(spaceLocale, 'View All'),
                        expandedSectionLayoutType: createExpandedSectionLayoutType(spaceLocale, 'grid-a'),
                        slug: { [spaceLocale]: validatedSlug }
                    }
                };
                
                carouselASectionsEntries.push(payload);
        }
        console.log('Converted entries: ', gameSectionWithCarousel.length);
            
        // carouselASectionsEntries = carouselASectionsEntries.slice(0, 3);
        await storeFile(carouselASectionsEntries, `./src/euNewLobbyDesign/data/${CAROUSEL_A_SECTIONS}/${spaceFolder}/${IG_CAROUSEL_A_SECTIONS}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

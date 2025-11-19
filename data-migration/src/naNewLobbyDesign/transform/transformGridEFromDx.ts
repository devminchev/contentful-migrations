import { readJSONFile, safeReadJSONFile, writeJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { DX_PLACEHOLDER, IG_GRID_E_SECTION, SITE_GAME_V2, UNMATCHED_WHITEHAT_GAMES, VENTURE } from "../constants";
import { storeFile, storeDXMapFile } from "../save";
import { formatSlug, venturesKeyNameMaps, createViewAllType, createSectionTruncation, filterDxEntryTitle, createVentureWithJursidction, retrieveModelRecords, createEnvironmentVisibility, extractVentureFromTitle, transformPlatform, createSessionVisibility, createLayoutType, createViewAllActionText, createExpandedSectionLayoutType, linkSiteGamesToSections } from "../utils/igPropertyUtils";
import { WHITEHAT_ALL_GAMES_FILE_NAME, WHITEHAT_MERGED_OUT_PATH, WHITEHAT_SITE_GAME_FILE_NAME } from "../api/whitehat/constants";
import { getEntries } from "../api/managementApi";

export const transform = async (spaceLocale, spaceFolder) => {
    let gridESectionEntries = [];
    let dxPlaceholderEntryID_newTitle_entires = {};

    try {
        const dxPlaceHolder = await readJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${DX_PLACEHOLDER}.json`);

        const ventures = await getEntries(VENTURE);
        const siteGamesV2 = await retrieveModelRecords(SITE_GAME_V2);
        const unmatchedGamesToLink = await safeReadJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${UNMATCHED_WHITEHAT_GAMES}`, []);
        const whitehatSiteGames = await safeReadJSONFile(`${WHITEHAT_MERGED_OUT_PATH}/${WHITEHAT_ALL_GAMES_FILE_NAME}`, []);

        const dxGridEPlaceHolder = dxPlaceHolder.entries.filter(entry => {
            const entryTitle = entry.fields.entryTitle[spaceLocale];
            return entryTitle.includes("(casino-grid-e)");
        });

        let ventures_map = venturesKeyNameMaps(spaceLocale, ventures).ventureByName;

        for (const item of dxGridEPlaceHolder) {
            const fields = item.fields;
            const sys = item.sys;
            const props = item.fields.props;

            const ventureFromTitle = fields.entryTitle[spaceLocale].match(/\[(.*?)\]/g)[0].replace(/[\[\]]/g, '');
            const venture = ventureFromTitle.toLowerCase();
            const jurisdiction = props[spaceLocale].config.jurisdiction;
            const ventureWithJurisdiction = createVentureWithJursidction(venture, jurisdiction);
            const ventureId = ventures_map[ventureWithJurisdiction];

            const entryTitle = fields.entryTitle[spaceLocale];
            const filteredEntryTitle = filterDxEntryTitle(entryTitle, jurisdiction, venture, ventureWithJurisdiction, "(casino-grid-e)");

            const dxPlaceholderEntryID_newTitle = `${sys.id}_${filteredEntryTitle}`;
            const desktopCategoryID = props[spaceLocale].config.categoryId.desktop;
            dxPlaceholderEntryID_newTitle_entires[dxPlaceholderEntryID_newTitle] = desktopCategoryID;

            const { foundGamesIds, unmatchedTitles = [] } = linkSiteGamesToSections({spaceLocale, ventureName: ventureWithJurisdiction, desktopCategoryID, siteGamesV2, whitehatSiteGames });
            unmatchedGamesToLink.push(...unmatchedTitles);
            
            const truncatedConfig = props[spaceLocale].contentConfig.truncated;

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: filteredEntryTitle },
                    title: { [spaceLocale]: props[spaceLocale].contentConfig.title },
                    slug: { [spaceLocale]: formatSlug(props[spaceLocale].contentConfig.title) },
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    games: {[spaceLocale]: foundGamesIds },
                    venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                    sectionTruncation: createSectionTruncation(spaceLocale, truncatedConfig),
                    layoutType: createLayoutType(spaceLocale, 'grid-e'),
                    viewAllActionText: createViewAllActionText(spaceLocale, 'View All'),
                    viewAllType: createViewAllType(spaceLocale),
                    expandedSectionLayoutType: createExpandedSectionLayoutType(spaceLocale, 'grid-a'),
                }
            };

            gridESectionEntries.push(payload);
        }

        await storeDXMapFile(dxPlaceholderEntryID_newTitle_entires, {}, `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/mappedCategoryIDs.json`);
        await writeJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${UNMATCHED_WHITEHAT_GAMES}`, unmatchedGamesToLink);
        await storeFile(gridESectionEntries, `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${IG_GRID_E_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

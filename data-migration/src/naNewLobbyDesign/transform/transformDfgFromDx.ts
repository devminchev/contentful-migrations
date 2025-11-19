import { readJSONFile, safeReadJSONFile, writeJSONFile  } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { DX_PLACEHOLDER, VENTURE, IG_DFG_SECTION, UNMATCHED_WHITEHAT_GAMES, SITE_GAME_V2 } from "../constants";
import { storeFile, storeDXMapFile } from "../save";
import { formatSlug, venturesKeyNameMaps, filterDxEntryTitle, createVentureWithJursidction, retrieveModelRecords, createEnvironmentVisibility, transformPlatform, createSessionVisibility, linkSiteGamesToSections } from "../utils/igPropertyUtils";
import { WHITEHAT_ALL_GAMES_FILE_NAME, WHITEHAT_MERGED_OUT_PATH, WHITEHAT_SITE_GAME_FILE_NAME } from '../api/whitehat/constants';
import { getEntries } from "../api/managementApi";


export const transformDfgFromDx = async (spaceLocale, spaceFolder) => {
    let dfgSectionEntries = [];
    let dxPlaceholderEntryID_newTitle_entires = {};

    try {
        const dxPlaceHolder = await readJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${DX_PLACEHOLDER}.json`);
        const ventures = await getEntries(VENTURE);
        const siteGamesV2 = await retrieveModelRecords(SITE_GAME_V2);
        const unmatchedGamesToLink = await safeReadJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${UNMATCHED_WHITEHAT_GAMES}`, []);
        const whitehatSiteGames = await safeReadJSONFile(`${WHITEHAT_MERGED_OUT_PATH}/${WHITEHAT_ALL_GAMES_FILE_NAME}`, []);
        

        let ventures_map = venturesKeyNameMaps(spaceLocale, ventures).ventureByName;

        const dxGridBPlaceHolder = dxPlaceHolder.entries.filter(entry => {
            const entryTitle = entry.fields.entryTitle[spaceLocale];
            return entryTitle.includes("(casino-dfgs)");
        });

        for (const item of dxGridBPlaceHolder) {
            const fields = item.fields;
            const sys = item.sys;
            const props = item.fields.props;

            const ventureFromTitle = fields.entryTitle[spaceLocale].match(/\[(.*?)\]/g)[0].replace(/[\[\]]/g, '');
            const venture = ventureFromTitle.toLowerCase();
            const jurisdiction = props[spaceLocale].config.jurisdiction;
            const ventureWithJurisdiction = createVentureWithJursidction(venture, jurisdiction);
            const ventureId = ventures_map[ventureWithJurisdiction];

            const entryTitle = fields.entryTitle[spaceLocale];
            const filteredEntryTitle = filterDxEntryTitle(entryTitle, jurisdiction, venture, ventureWithJurisdiction, `(casino-grid-b)`);

            const dxPlaceholderEntryID_newTitle = `${sys.id}_${filteredEntryTitle}`;
            const desktopCategoryID = props[spaceLocale].config.categoryId.desktop;
            const {image = null, dynamicBackground = null, dynamicLogo = null} = props[spaceLocale]?.contentConfig || {};
            dxPlaceholderEntryID_newTitle_entires[dxPlaceholderEntryID_newTitle] = desktopCategoryID;

            const { foundGamesIds, unmatchedTitles = [] } = linkSiteGamesToSections({spaceLocale, ventureName: ventureWithJurisdiction, desktopCategoryID, siteGamesV2, whitehatSiteGames });
            unmatchedGamesToLink.push(...unmatchedTitles);

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: filteredEntryTitle },
                    title: { [spaceLocale]: props[spaceLocale]?.contentConfig?.title || filteredEntryTitle },
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                    classification: { [spaceLocale]: 'DFGSection' },
                    media: { [spaceLocale]: image },
                    ...(dynamicBackground && { dynamicBackground: { [spaceLocale]: dynamicBackground } }),
                    ...(dynamicLogo && { dynamicLogo: { [spaceLocale]: dynamicLogo } }),
                    games: {[spaceLocale]: foundGamesIds },
                }
            };

            dfgSectionEntries.push(payload);
        }

        await storeDXMapFile(dxPlaceholderEntryID_newTitle_entires, {}, `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/mappedCategoryIDs.json`);
        await writeJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${UNMATCHED_WHITEHAT_GAMES}`, unmatchedGamesToLink);
        await storeFile(dfgSectionEntries, `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${IG_DFG_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

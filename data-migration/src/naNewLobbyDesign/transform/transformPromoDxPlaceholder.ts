import { readJSONFile } from "../utils/fileOperations";
import * as fs from 'node:fs';
import { log } from "../utils/logging";
import { DX_PLACEHOLDER, IG_BRAZE_PROMO_SECTION, VENTURE } from "../constants";
import { storeDXMapFile, storeFile } from "../save";
import { createSessionVisibility, createEnvironmentVisibility, venturesKeyNameMaps, retrieveModelRecords, remapVentureAndJurisdiction, extractRawVentureAndJurisdiction, transformPlatform } from "../utils/igPropertyUtils";
import { getEntries } from "../api/managementApi";

const getVentures = async (spaceLocale) => {
    const ventures = await getEntries(VENTURE);

    return venturesKeyNameMaps(spaceLocale, ventures);
};

const getMappedVentureAndJurisdiction = (title) => {
    const { rawVenture, rawJurisdiction } = extractRawVentureAndJurisdiction(title);
    return remapVentureAndJurisdiction(rawVenture, rawJurisdiction);
}

export const transformPromoDxPlaceholder = async (spaceLocale, spaceFolder) => {
    let igBrazeEntries = [];
    let dxPlaceholderEntryID_newTitle_entires = {};

    try {
        const dxPlacholder = await readJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${DX_PLACEHOLDER}.json`)

        const filteredDxPlaceholder = dxPlacholder?.entries?.filter(entry => {
            const title = entry.fields.entryTitle['en-US'] || '';
            return title.includes('promotions-carousel') && title.includes('[web]');
        });

        for (const item of filteredDxPlaceholder) {
            const fields = item.fields;
            const entryTitle = fields?.entryTitle?.[spaceLocale];

            const dxPlaceholderEntryID_newTitle = `${item?.sys.id}_${entryTitle}`;
            dxPlaceholderEntryID_newTitle_entires[dxPlaceholderEntryID_newTitle] = '';

            const payload = {
                fields: {
                    entryTitle: {
                        [spaceLocale]: entryTitle
                    },
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    classification: {
                        [spaceLocale]: 'BrazePromosSection'
                    }
                }
            };

            igBrazeEntries.push(payload);

        }
        // igViewEntries = igViewEntries.slice(0, 3);
        await storeDXMapFile(dxPlaceholderEntryID_newTitle_entires, {}, `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/mappedCategoryIDs.json`);
        await storeFile(igBrazeEntries, `./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/${IG_BRAZE_PROMO_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
}

import { log } from "../utils/logging";
import { IG_PROMOTIONS_GRID, VENTURE, SECTION } from "../constants";
import { storeFile } from "../save";
import { venturesKeyNameMaps, createEnvironmentVisibility, transformPlatform, filterOutNonDesktopEntries, retrieveModelRecords, createSessionVisibility, extractVentureFromTitle } from "../utils/igPropertyUtils";

export const transformPromoGridToIgPromoSections = async (spaceLocale, spaceFolder) => {
    try {
        const ventures = await retrieveModelRecords(VENTURE);
        const sections = await retrieveModelRecords(SECTION);
        let ventures_map = venturesKeyNameMaps(spaceLocale, ventures).ventureByName;

        const desktopSections = sections?.filter(entry =>
            filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
        );
        const promoGridSections = desktopSections.filter(item => item?.fields?.name?.[spaceLocale] === 'promotions-grid');

        let promotionsSectionEntries = [];

        for (const item of promoGridSections) {
            const entryTitle = item.fields.entryTitle[spaceLocale].toLowerCase();
            const title = item?.fields?.title?.[spaceLocale] || 'Current Promotions'
            const ventureId = extractVentureFromTitle(entryTitle, ventures_map);

            const payload = {
                fields: {
                    entryTitle: { [spaceLocale]: entryTitle },
                    title: { [spaceLocale]: title },
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
                    classification: { [spaceLocale]: 'PromotionsGridSection' }
                }
            };
            promotionsSectionEntries.push(payload);
        }


        await storeFile(promotionsSectionEntries, `./src/euNewLobbyDesign/data/${IG_PROMOTIONS_GRID}/${spaceFolder}/${IG_PROMOTIONS_GRID}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

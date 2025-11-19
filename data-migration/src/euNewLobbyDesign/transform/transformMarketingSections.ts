import { log } from "../utils/logging";
import storeFile from  "../save";
import { readJSONFile } from "../utils/fileOperations";
import { IG_BANNER_SECTION, VENTURE, MARKETING_SECTION, IG_MARKETING_SECTION } from "../constants";
import { transformPlatform, filterTitle, retrieveModelRecords, venturesKeyNameMaps, filterOutNonDesktopEntries, extractVentureFromTitle, createViewAllType, createViewAllActionText, createExpandedSectionLayoutType, createSessionVisibility, createEnvironmentVisibility} from "../utils/igPropertyUtils";

export default async (spaceLocale: string | number, spaceFolder: any) => {
    try {
        const section = await readJSONFile(`./src/euNewLobbyDesign/data/${MARKETING_SECTION}/${spaceFolder}/${MARKETING_SECTION}.json`);
        const igBannerSection = await retrieveModelRecords(IG_BANNER_SECTION); //readJSONFile(`./src/euNewLobbyDesign/data/${IG_BANNER_SECTION}/${spaceFolder}/${IG_BANNER_SECTION}.json`);
        const ventures = await retrieveModelRecords(VENTURE);
        const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;
        let marketingSectionEntries = [];

        // Normalize itle by removing numbers in parentheses as we have IG banners incrememnted to avoid duplications 
        const normalizeTitle = (title) => title.replace(/\(\d+\)$/, '').trim();

        const igEntryTitlesSet = new Set(
            igBannerSection.map(igItem => normalizeTitle(filterTitle(spaceLocale, igItem)[spaceLocale]))
        );

        const desktopSectionEntries = section.entries.filter(entry =>
            filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
        );

        for (const item of desktopSectionEntries) {
            const entryTitle = item.fields.entryTitle[spaceLocale].toLowerCase();  
            const ventureId = extractVentureFromTitle(entryTitle, ventures_map);
            const sectionEntryTitle = normalizeTitle(filterTitle(spaceLocale, item)[spaceLocale]);
            let bannerIdEntries = [];

            if (igEntryTitlesSet.has(sectionEntryTitle)) {
                const matchingIgItems = igBannerSection?.filter(
                    igItem => normalizeTitle(filterTitle(spaceLocale, igItem)[spaceLocale]) === sectionEntryTitle
                );
                bannerIdEntries = matchingIgItems.map(igItem => igItem.sys.id);
            }
            
            /**
             * Context: 
             * Old section with slides > 1 object are treated as marketing, a slide object is treated as an IG banner
             * So where we banner entries > 1 are considered marketing 
             */
            if (bannerIdEntries.length > 1) {
                const payload = {
                    fields: {
                        entryTitle: filterTitle(spaceLocale, item),
                        title: item.fields.title,
                        environmentVisibility: item.fields.environment || createEnvironmentVisibility(spaceLocale),
                        platformVisibility: transformPlatform(spaceLocale),
                        sessionVisibility: item.fields.show || createSessionVisibility(spaceLocale),
                        venture: { 
                            [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } 
                        },
                        banners: {
                            [spaceLocale]: bannerIdEntries.map(bannerId => ({
                                "sys": { "type": "Link", "linkType": "Entry", "id": bannerId }
                            }))
                        },
                        viewAllType: {[spaceLocale]: 'none'},
                        viewAllActionText: createViewAllActionText(spaceLocale, 'Go To')
                    }
                };

                marketingSectionEntries.push(payload);
            }
        }
        await storeFile(marketingSectionEntries, `./src/euNewLobbyDesign/data/${MARKETING_SECTION}/${spaceFolder}/${IG_MARKETING_SECTION}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

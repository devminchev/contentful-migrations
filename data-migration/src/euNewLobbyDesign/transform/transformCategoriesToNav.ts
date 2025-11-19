import { readJSONFile } from "../utils/fileOperations.js";
import { log } from "../utils/logging.js";
import { filterOutPartnerAndNativeEntries, retrieveModelRecords, extractVentureFromTitle, venturesKeyNameMaps } from "../utils/igPropertyUtils.js";
import { CATEGORIES_MODEL, CATEGORY_MODEL, IG_NAVIGATION_MODEL, IG_LINK_MODEL, VENTURE } from "../constants.js";
import storeFile from "../save/index.js";
import { getEntries } from "../api/managementApi.js";

const retrieveLinks = async (spaceLocale, ventures_map) => {
    const links = await getEntries(IG_LINK_MODEL);

    const linksMap = links.reduce((acc, item) => {
        const linkId = item.sys.id;
        const linkEntryTitle = item.fields?.entryTitle?.[spaceLocale] || '';
        const linkVentureId = extractVentureFromTitle(linkEntryTitle, ventures_map);

        if (!linkVentureId) return acc; // Skip if no venture ID

        // Initialize array if ventureId is not in the map
        if (!acc[linkVentureId]) {
            acc[linkVentureId] = [];
        }

        // Push link ID to the correct ventureId group
        acc[linkVentureId].push({
            id: linkId,
            entryTitle: linkEntryTitle
        });

        return acc;
    }, {});
    return linksMap;
};

export default async (spaceLocale, spaceFolder) => {
    try {
        const categories = await retrieveModelRecords(CATEGORIES_MODEL);
        const category = await retrieveModelRecords(CATEGORY_MODEL);
        const ventures = await retrieveModelRecords(VENTURE);

        const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;

        const desktopCategoriesEntries = categories?.filter(entry =>
            filterOutPartnerAndNativeEntries(entry.fields?.entryTitle?.[spaceLocale])
        );
        let categoriesEntries = [];

        const links = await retrieveLinks(spaceLocale, ventures_map);

        for (const item of desktopCategoriesEntries) {
            const currentVentureForItem = item.fields.venture?.[spaceLocale]?.sys.id;
            const linkIds = links[currentVentureForItem] || [];
            const itemLinkedCategories = item?.fields?.categories?.[spaceLocale]?.map(i => i?.sys?.id);

            const oGLinkedCategoryEntries = itemLinkedCategories
                .map(id => category.find(item => item?.sys?.id === id))
                .filter(Boolean);


            const orderedLinks = oGLinkedCategoryEntries
                .map(({ fields }) => {
                    const title = fields?.entryTitle?.[spaceLocale];
                    const match = linkIds.find(link => link.entryTitle === title);
                    return match && {
                        sys: {
                            type: "Link",
                            linkType: "Entry",
                            id: match.id
                        }
                    };
                })
                .filter(Boolean);

            const payload = {
                fields: {
                    entryTitle: item.fields.entryTitle,
                    venture: item.fields.venture,
                    links: { [spaceLocale]: orderedLinks }
                }
            };

            categoriesEntries.push(payload);
        }

        await storeFile(categoriesEntries, `./src/euNewLobbyDesign/data/${CATEGORIES_MODEL}/${spaceFolder}/${IG_NAVIGATION_MODEL}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

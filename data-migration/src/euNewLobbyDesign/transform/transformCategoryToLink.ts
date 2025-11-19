import { readJSONFile } from "../utils/fileOperations.js";
import { log } from "../utils/logging.js";
import { transformPlatform, createSessionVisibility, createEnvironmentVisibility, venturesKeyNameMaps, extractVentureFromTitle, filterOutNonDesktopEntries, retrieveModelRecords } from "../utils/igPropertyUtils.js";
import { CATEGORY_MODEL, IG_LINK_MODEL, IG_VIEW_MODEL, VENTURE } from "../constants.js";
import storeFile from "../save/index.js";
import { getEntries } from "../api/managementApi.js";

const retrieveViews = async (spaceLocale, ventureMap) => {
    const views = await getEntries(IG_VIEW_MODEL);

    const viewsMap = views.reduce((acc, item) => {

        const viewId = item.sys.id;
        const viewName = item.fields?.name?.[spaceLocale];

        const viewVentureId = item.fields?.venture?.[spaceLocale]?.sys?.id;

        const viewVentureName = ventureMap.ventureById[viewVentureId];

        const viewKey = `${viewName}_${viewVentureName}`;

        acc[viewKey] = viewId;

        return acc;
    }, {});

    return viewsMap;
    // only need the viewID: ventureID
}

const getVentures = async (spaceLocale) => {
    const ventures = await retrieveModelRecords(VENTURE);

    return venturesKeyNameMaps(spaceLocale, ventures);
};

const getVentureFromEntryTitle = (venturesMap, categoriesList, spaceLocale) => {

    return categoriesList.map(item => {
        const entryTitle = item.fields?.entryTitle?.[spaceLocale];
        const ventureId = extractVentureFromTitle(entryTitle, venturesMap.ventureByName);

        const iconsLength = item.fields.icons?.[spaceLocale]?.length;
        const iconRecord = iconsLength > 0 && item.fields.icons?.[spaceLocale][0];

        return {
            entryTitle: item.fields.entryTitle,
            title: item.fields.title,
            name: item.fields.name,
            id: item.fields.id,
            url: item.fields.url,
            backgroundImgUrl: item.fields.backgroundImgUrl,
            icon: { [spaceLocale]: iconsLength > 0 ? iconRecord?.pattern : '' },
            ventureName: venturesMap.ventureById[ventureId],
            ventureId: ventureId || null
        };
    })
}

// category.id = layout.name
export default async (spaceLocale, spaceFolder) => {
    try {
        const categories = await readJSONFile(`./src/euNewLobbyDesign/data/${CATEGORY_MODEL}/production/${CATEGORY_MODEL}.json`)

        const desktopCategoryEntries = categories.entries.filter(entry =>
            filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
        );
        let categoryEntries = [];

        const ventures = await getVentures(spaceLocale);
        const views = await retrieveViews(spaceLocale, ventures);
        const categoriesWithVentures = getVentureFromEntryTitle(ventures, desktopCategoryEntries, spaceLocale)

        for (const item of categoriesWithVentures) {
            const key = `${item.id[spaceLocale]}_${item.ventureName}`;

            const payload = {
                fields: {
                    entryTitle: item.entryTitle,
                    label: item.title,
                    platformVisibility: transformPlatform(spaceLocale),
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    view: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": views[key] } } },
                    externalUrl: item.url,
                    image: item.backgroundImgUrl || item.icon,
                    liveHidden: { [spaceLocale]: false }
                }
            }

            categoryEntries.push(payload);
        }

        await storeFile(categoryEntries, `./src/euNewLobbyDesign/data/${CATEGORY_MODEL}/${spaceFolder}/${IG_LINK_MODEL}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

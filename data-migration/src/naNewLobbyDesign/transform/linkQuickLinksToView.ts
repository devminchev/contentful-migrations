import { safeReadJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { DX_VIEW, IG_VIEW, IG_QUICK_LINKS_MODEL, DX_QUICK_LINKS, VENTURE } from "../constants";
import { storeFile } from "../save";
import { retrieveModelRecords, venturesKeyNameMaps } from "../utils/igPropertyUtils";
import { getEntries } from "../api/managementApi";

const getQuicklinkRecord = (spaceLocale, topContentIdMatches, dxQuickLinks, igQuickLinks, venturesMap, ventureId) => {
    if (!topContentIdMatches?.length) return null;

    // Step 1: Find the matching dxQuickLink record from Contentful by sys.id
    const dxMatch = dxQuickLinks.find(item =>
        topContentIdMatches.includes(item?.sys?.id)
    );

    // Step 2: Extract the entryTitle for the matched record
    const entryTitle = dxMatch?.fields?.entryTitle?.[spaceLocale]?.toLowerCase();

    if (!entryTitle) return null;

    // Step 3: Match that title against IG quick links, ensures we're pulling the correct IG record using title-to-title match
    const igMatch = igQuickLinks?.find(item => {
        const rawTitle = item?.fields?.entryTitle?.[spaceLocale] || '';
        const match = rawTitle.match(/\{(.*?)\}/);
        const ventureName = match ? match[1].trim() : '';
        const igQuickLinkVentureId = venturesMap.ventureByName[ventureName];
        const cleanedTitle = rawTitle.replace(/\{.*?\}/g, '').trim().toLowerCase();

        return (cleanedTitle === entryTitle) && (ventureId === igQuickLinkVentureId)
    });

    if (!igMatch) return null;

    return {
        sys: {
            type: "Link",
            linkType: "Entry",
            id: igMatch.sys.id,
        },
    };
};


export const linkQuickLinksToView = async (spaceLocale, spaceFolder) => {
    let igViewEntries = [];

    try {
        const ventures = await getEntries(VENTURE);
        const venturesMap = venturesKeyNameMaps(spaceLocale, ventures);
        const igViews = await getEntries(IG_VIEW);
        const viewTopContentMap: { top?: any[] } = await safeReadJSONFile(`./src/naNewLobbyDesign/data/${DX_VIEW}/${spaceFolder}/${IG_VIEW}_placeholderMap.json`, {});
        const viewTopContentDxEntries = viewTopContentMap?.top || [];
        const igQuickLinks = await getEntries(IG_QUICK_LINKS_MODEL);
        const dxQuickLinks = await retrieveModelRecords(DX_QUICK_LINKS);

        for (const item of igViews) {
            const viewSlug = item?.fields?.viewSlug?.[spaceLocale];
            const ventureId = item?.fields?.venture?.[spaceLocale]?.sys?.id;
            const matchKey = `${viewSlug}_${ventureId}`;

            let updatedTopContent = item?.fields?.topContent?.[spaceLocale] || [];
            const topContentIdMatches = viewTopContentDxEntries[matchKey];

            const quickLinkTopContentRecord = getQuicklinkRecord(
                spaceLocale,
                topContentIdMatches,
                dxQuickLinks,
                igQuickLinks,
                venturesMap,
                ventureId
            );

            // Only build + push payload if we found a quick link
            if (quickLinkTopContentRecord) {

                updatedTopContent.unshift(quickLinkTopContentRecord);

                const fields = {
                    ...item?.fields,
                    topContent: {
                        [spaceLocale]: updatedTopContent
                    },
                };

                const payload = {
                    ...item,
                    fields
                };

                igViewEntries.push(payload);
            }
        }
        // igViewEntries = igViewEntries.slice(0, 3);
        await storeFile(igViewEntries, `./src/naNewLobbyDesign/data/${IG_VIEW}/${spaceFolder}/${IG_VIEW}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
}

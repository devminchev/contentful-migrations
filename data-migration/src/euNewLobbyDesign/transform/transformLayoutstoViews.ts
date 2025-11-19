import { readJSONFile } from "../utils/fileOperations";
import { log } from "../utils/logging";
import { LAYOUT_MODEL, IG_VIEW_MODEL, VENTURE, IG_COLLAB_BASED_SECTIONS, IG_SIMILARITY_SECTIONS, IG_SECTION_WITHOUT_CAROUSEL, IG_CAROUSEL_A_SECTIONS, IG_JACKPOTS_SECTION, IG_DFG_SECTION, SECTION, LOBBY_COLLAB_BASED_SECTIONS, SIMILARITY_SECTIONS, IG_BANNER_SECTION, IG_MARKETING_SECTION, EU_JACKPOT_SECTIONS, IG_PROMOTIONS_GRID } from "../constants";
import { transformPlatform, filterTitle, retrieveModelRecords, filterDesktopRelevantEntries, formatSlug, createSessionVisibility } from "../utils/igPropertyUtils";
import storeFile from "../save";

const entriesToMap = (spaceLocale, records, countTracker) => records.reduce((acc, item) => {
    const entryTitle = item.fields.entryTitle?.[spaceLocale];
    const contentType = item.sys.contentType.sys.id;
    const venture = item.fields.venture?.[spaceLocale]?.sys?.id;
    const id = item.sys.id;

    if (!venture) {
        return acc;
    }

    const key = `${venture}_${entryTitle}`;

    acc[key] = id;

    countTracker[contentType] = (countTracker[contentType] || 0) + 1;

    return acc;
}, {});


const retrieveOldSections = async () => ([
    ...await retrieveModelRecords(SECTION),
    ...await retrieveModelRecords(LOBBY_COLLAB_BASED_SECTIONS),
    ...await retrieveModelRecords(SIMILARITY_SECTIONS),
    ...await retrieveModelRecords(EU_JACKPOT_SECTIONS),
]);

const createLookupMap = (records, spaceLocale) => {
    const filteredEntries = filterDesktopRelevantEntries(records, spaceLocale);

    return filteredEntries.reduce((acc, item) => {
        const entryTitle = filterTitle(spaceLocale, item)?.[spaceLocale];
        const id = item.sys.id;
        if (entryTitle) {
            acc[id] = entryTitle;
        }
        return acc;
    }, {});
};


const retrieveFromLookup = (ids, lookupMap, venture, draftOldSectionEntries) => (ids.reduce((acc, item) => {
    const lookupValue = lookupMap[item];
    if (lookupValue) acc.push(`${venture}_${lookupValue}`);
    else {
        draftOldSectionEntries.push(item);
    }
    return acc;
}, []));

/* 
    fetch all section types Grid A, Jackpot, Carousel A, Collab, Similarity, DFG
    return a lookup of all the  [venture_entryTitle]: id
*/
const createNewSectionsMap = async (spaceLocale) => {

    const sectionTypesCount = {};

    const gridASections = await retrieveModelRecords(IG_SECTION_WITHOUT_CAROUSEL) || [];
    const carouselASections = await retrieveModelRecords(IG_CAROUSEL_A_SECTIONS)|| [];
    const collabSections = await retrieveModelRecords(IG_COLLAB_BASED_SECTIONS)|| [];
    const similaritySections = await retrieveModelRecords(IG_SIMILARITY_SECTIONS)|| [];
    const dfgSections = await retrieveModelRecords(IG_DFG_SECTION)|| [];
    const jackpotsSections = await retrieveModelRecords(IG_JACKPOTS_SECTION)|| [];
    const bannerSections = await retrieveModelRecords(IG_BANNER_SECTION) || [];
    const marketingSection = await retrieveModelRecords(IG_MARKETING_SECTION) || [];
    const promotionsGridSection = await retrieveModelRecords(IG_PROMOTIONS_GRID) || [];

    const igSections = {
        ...entriesToMap(spaceLocale, gridASections, sectionTypesCount),
        ...entriesToMap(spaceLocale, carouselASections, sectionTypesCount),
        ...entriesToMap(spaceLocale, collabSections, sectionTypesCount),
        ...entriesToMap(spaceLocale, similaritySections, sectionTypesCount),
        ...entriesToMap(spaceLocale, dfgSections, sectionTypesCount),
        ...entriesToMap(spaceLocale, jackpotsSections, sectionTypesCount),
        ...entriesToMap(spaceLocale, bannerSections, sectionTypesCount),
        ...entriesToMap(spaceLocale, marketingSection, sectionTypesCount),
        ...entriesToMap(spaceLocale, promotionsGridSection, sectionTypesCount)
    }

    console.log("Section Counts:", JSON.stringify(sectionTypesCount, null, 2));
    return igSections;
}

const createNewSectionEntriesLinks = (oldEntryTitleKeys, newSectionRecordsMap, unmatchedEntries) =>
    oldEntryTitleKeys.reduce((acc, item) => {
        const legitItemRecord = newSectionRecordsMap[item];
        if (legitItemRecord) {
            acc.push({
                "sys": {
                    type: "Link",
                    linkType: "Entry",
                    id: legitItemRecord
                }
            });
        }
        else {
            unmatchedEntries.push(item)
        }
        return acc;
    }, []);

/*
    1. get all old section records from Contentful
    2. create a lookup map - {[id]: entryTitle, }
    3. get all new section Records from Contentul
    4. create a lookup map = { [ventureId_entryTitle]: id}
    5. for each layout entry:
            - get all sectionids for that layout entry in an array
            - compare them to the lookupMap made from the old section entries and for the matching ones make a key - `layout.venture_title`
            - use the venture_title keys and use that against the newSections lookup map to grab the new ids.
*/
export default async (spaceLocale, spaceFolder) => {
    try {

        let layoutEntries = [];
        let draftOldSectionEntries = [];
        let unmatchedOldToNewEntries = [];
        const layouts = await readJSONFile(`./src/euNewLobbyDesign/data/${LAYOUT_MODEL}/production/${LAYOUT_MODEL}.json`)
        const oldSectionRecords = await retrieveOldSections();
        const oldSectionsLookupMap = createLookupMap(oldSectionRecords, spaceLocale);
        const newSectionRecordsMap = await createNewSectionsMap(spaceLocale);

        for (const item of layouts.entries) {

            const currentVenture = item.fields.venture;
            const currentVentureId = currentVenture?.[spaceLocale]?.sys?.id;
            const filteredTitle = filterTitle(spaceLocale, item);
            const layoutSectionIds = item.fields?.sections?.[spaceLocale].map(item => item.sys.id) || [];
            
            const oldEntryTitleKeys = retrieveFromLookup(layoutSectionIds, oldSectionsLookupMap, currentVentureId, draftOldSectionEntries);
            const newSectionEntriesTOLink = createNewSectionEntriesLinks(oldEntryTitleKeys, newSectionRecordsMap, unmatchedOldToNewEntries);

            const slug = formatSlug(item.fields.name?.[spaceLocale]) || ''

            const payload = {
                fields: {
                    entryTitle: filteredTitle,
                    name: item.fields.name,
                    platformVisibility: transformPlatform(spaceLocale),
                    environmentVisibility: item.fields.environment,
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    venture: currentVenture,
                    primaryContent: {[spaceLocale]: newSectionEntriesTOLink},
                    liveHidden: { [spaceLocale]: false },
                    viewSlug: { [spaceLocale]: slug.toLowerCase()},
                    classification: { [spaceLocale]: 'general'}
                }
            }

            layoutEntries.push(payload);
        }

        await storeFile(unmatchedOldToNewEntries, `./src/euNewLobbyDesign/data/${LAYOUT_MODEL}/${spaceFolder}/${IG_VIEW_MODEL}-unmatched.json`);
        await storeFile(draftOldSectionEntries, `./src/euNewLobbyDesign/data/${LAYOUT_MODEL}/${spaceFolder}/${IG_VIEW_MODEL}-oldSectionDrafts.json`);

        await storeFile(layoutEntries, `./src/euNewLobbyDesign/data/${LAYOUT_MODEL}/${spaceFolder}/${IG_VIEW_MODEL}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

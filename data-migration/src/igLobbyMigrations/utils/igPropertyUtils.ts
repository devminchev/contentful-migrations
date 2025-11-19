import { PRODUCTION_VENTURES_TYPOS } from "../constants";
import { getEntries } from "../api/managementApi";
import { readJSONFile } from "./fileOperations";
import contentful from "contentful-management";

const filterTitle = (spaceLocale: string, entry: contentful.Entry) => {
    const matchDesktopEntries = /\[[^\]]*desktop[^\]]*\]/gi;

    const obj = {
        [spaceLocale]: entry.fields.entryTitle[spaceLocale].replace(matchDesktopEntries, '').trim()
    };
    return obj;
};

const setDefaultDisplayInline = (spaceLocale: string) => ({
    [spaceLocale]: false
});

const createViewAllType = (spaceLocale: string) => ({
    [spaceLocale]: 'auto'
});

const createExpandedSectionLayoutType = (spaceLocale: string, type: string) => ({
    [spaceLocale]: type
});

const createViewAllActionText = (spaceLocale: string, text: string) => ({
    [spaceLocale]: text
});

const createLayoutType = (spaceLocale: string, type: string) => ({
    [spaceLocale]: type
});

const createSingleLayoutType = (spaceLocale: string, type: any) => ({
    [spaceLocale]: type
});

const createSectionTruncation = (spaceLocale: string, truncatedConfig: boolean) => {
    if (truncatedConfig === false) {
        const sectionTruncationObj = { [spaceLocale]: ['never'] }
        return sectionTruncationObj;
    } else {
        return
    }
};

const transformPlatform = (spaceLocale: string) => ({
    [spaceLocale]: ['web', 'ios', 'android']
});

const createSessionVisibility = (spaceLocale: string) => ({
    [spaceLocale]: ['loggedIn', 'loggedOut']
});

const createEnvironmentVisibility = (spaceLocale: string) => ({
    [spaceLocale]: ['staging', 'production']
});

// Includes support for some typos
const venturesKeyNameMaps = (spaceLocale: string, venturesList: any[]) => {

    const { ventureById, ventureByName } = venturesList.reduce((acc, item) => {
        const ventureId = item.sys.id;
        const ventureName = item.fields?.name?.[spaceLocale];

        // Store ID -> Name mapping
        acc.ventureById[ventureId] = ventureName;

        // Store Name -> ID mapping (normal case)
        acc.ventureByName[ventureName] = ventureId;

        // If this venture name is a known typo, store the typo too
        if (PRODUCTION_VENTURES_TYPOS.includes(ventureName)) {
            acc.ventureByName[ventureName] = ventureId;
        }

        return acc;
    }, { ventureById: {}, ventureByName: {} });

    return { ventureById, ventureByName };
};

// Matches [ventureName] pattern
const extractVentureFromTitle = (entryTitle: string, ventureByName: Map<string, any>) => {
    // Match all values inside square brackets []
    const bracketMatches = entryTitle.match(/\[([^\]]+)\]/g);

    if (!bracketMatches) return null; // No brackets found

    for (let match of bracketMatches) {
        const ventureName = match.replace(/\[|\]/g, ""); // Remove brackets

        if (ventureByName[ventureName]) {
            return ventureByName[ventureName];
        }
    }

    return null; // No valid venture found
};

const desktopEntriesOnlyStrict = (records: any, spaceLocale: string) => {
    // Match only desktop, discard any other combinations
    const matchDesktopEntries = /\[desktop\]/i;
    return records.entries.filter(item => matchDesktopEntries.test(item?.fields?.entryTitle?.[spaceLocale]));
}

const desktopEntriesOnly = (records: any, spaceLocale: string) => {
    // Matches any tag that contains "desktop", even if combined with other words
    const matchDesktopEntries = /\[.*?desktop.*?\]/i;

    return records?.entries?.filter(item => {
        const entryTitle = item?.fields?.entryTitle?.[spaceLocale];
        return entryTitle ? matchDesktopEntries.test(entryTitle) : false;
    }) || [];
};

const formatSlug = (title: string) => {
    if (typeof title !== "string") return "";

    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // keep only a-z, 0-9, spaces, and dashes
        .replace(/\s+/g, "-")         // spaces → dashes
        .replace(/-+/g, "-")          // collapse multiple dashes
        .replace(/^-|-$/g, "");       // trim leading/trailing dashes
};

export { filterTitle, transformPlatform, createSessionVisibility, desktopEntriesOnlyStrict, createSectionTruncation, createEnvironmentVisibility, venturesKeyNameMaps, extractVentureFromTitle, createLayoutType, createViewAllType, desktopEntriesOnly, setDefaultDisplayInline, createSingleLayoutType, formatSlug, createExpandedSectionLayoutType, createViewAllActionText };

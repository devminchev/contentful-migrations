import { PRODUCTION_VENTURES_TYPOS, VENTURE, LAYOUT_MODEL, IG_VIEW_MODEL, IG_COLLAB_BASED_SECTIONS, IG_SIMILARITY_SECTIONS, IG_SECTION_WITHOUT_CAROUSEL, IG_CAROUSEL_A_SECTIONS, IG_JACKPOTS_SECTION, IG_DFG_SECTION, KNOWN_EU_VENTURES, PRODUCTION_VENTURES_TYPOS_MAP } from "../constants";
import { getEntries } from "../api/managementApi.js";
import { readJSONFile } from "./fileOperations.js";

const JACKPOT_SECTION_NAMES = [
    'Rapid-Fire', 'Bubble-Pots', 'Age Of The Gods Jackpots', 'blueprint-jackpots',
    'red-tiger-jackpots', 'Stellar', 'casino-jackpots', 'Diamond-Link-Jackpots',
    'double-bubbles', 'exclusive-jackpots', 'Classic-Jackpots', 'mega-drop',
    'diamond-link', 'phoenix-jackpot'
];

const filterTitle = (spaceLocale, entry) => {
    // const matchDesktopEntries = /\[desktop\]/i;
    const matchDesktopEntries = /\[[^\]]*desktop[^\]]*\]/gi;


    const obj = {
        [spaceLocale]: entry.fields.entryTitle[spaceLocale].replace(matchDesktopEntries, '').trim()
    };
    return obj;
};

const setDefaultDisplayInline = (spaceLocale) => ({
    [spaceLocale]: false
});

const createViewAllType = (spaceLocale) => ({
    [spaceLocale]: 'auto'
});

const createLayoutType = (spaceLocale, type) => ({
    [spaceLocale]: [type]
});

const createSingleLayoutType = (spaceLocale, type) => ({
    [spaceLocale]: type
});

const transformPlatform = (spaceLocale) => ({
    [spaceLocale]: ['web', 'ios', 'android']
});

const transformShowNetPositionAsFalse = (spaceLocale) => ({
    [spaceLocale]: false
});

const transformShowNetPositionAsTrue = (spaceLocale) => ({
    [spaceLocale]: true
});

const createSessionVisibility = (spaceLocale) => ({
    [spaceLocale]: ['loggedIn', 'loggedOut']
});

const createEnvironmentVisibility = (spaceLocale) => ({
    [spaceLocale]: ['staging', 'production']
});

const retrieveModelRecords = async (model) => {
    let data;
    try {
        const fileData = await readJSONFile(`./src/euNewLobbyDesign/data/${model}/production/${model}.json`);
        data = fileData?.entries;

    } catch (err) {
        // console.warn('ERROR reading from file: ', err);
        // No log needed, this is just a safety catch so we know if we need to fetch venture records or not.
    }
    finally {
        if (!data) {
            data = await getEntries(model);
        }
    }
    return data;
};

const transformNameToSlug = (input) => {
    const validRegex = /^(?!-)[a-z0-9-]{2,60}$/;

    if (validRegex.test(input)) {
        return input;
    }

    let str = input.toLowerCase();

    // Replace spaces and square brackets with dashes first
    str = str.replace(/\s+/g, '-'); // spaces -> dashes
    str = str.replace(/[\[\]]/g, ''); // remove [ and ]

    // Remove any other invalid characters (keep a-z, 0-9, and dashes)
    str = str.replace(/[^a-z0-9-]/g, '');

    // Collapse multiple dashes into one
    str = str.replace(/-+/g, '-');

    // Remove leading or trailing dashes
    str = str.replace(/^-+|-+$/g, '');

    // Trim to a maximum of 60 characters
    if (str.length > 60) {
        str = str.substring(0, 60);
    }

    return str;
}

const venturesKeyNameMaps = (spaceLocale, venturesList) => {
    const { ventureById, ventureByName } = venturesList.reduce(
        (acc, item) => {
            const ventureId = item.sys.id;
            const ventureName = item.fields?.name?.[spaceLocale];

            if (!ventureName) return acc;

            const canonicalName = ventureName.toLowerCase();

            // ID -> canonical name
            acc.ventureById[ventureId] = canonicalName;

            // Canonical name -> ID
            acc.ventureByName[canonicalName] = ventureId;

            // Add typo aliases → ventureId
            for (const [typo, correct] of PRODUCTION_VENTURES_TYPOS_MAP) {
                if (correct.toLowerCase() === canonicalName) {
                    acc.ventureByName[typo.toLowerCase()] = ventureId;
                }
            }

            return acc;
        },
        { ventureById: {}, ventureByName: {} }
    );

    return { ventureById, ventureByName };
};
const extractVentureFromTitle = (entryTitle, ventureByName) => {
    const lowerTitle = entryTitle.toLowerCase();
    const bracketMatches = lowerTitle.match(/\[([^\]]+)\]/g);

    if (!bracketMatches) return null;

    for (const match of bracketMatches) {
        const clean = match.replace(/\[|\]/g, '');
        if (KNOWN_EU_VENTURES.includes(clean) && ventureByName[clean]) {
            return ventureByName[clean];
        }
    }

    // fallback: match raw string (outside of brackets)
    for (const venture of KNOWN_EU_VENTURES) {
        if (lowerTitle.includes(venture) && ventureByName[venture]) {
            return ventureByName[venture];
        }
    }

    return null;
};


const desktopEntriesOnlyStrict = (records, spaceLocale) => {
    // Match only desktop, discard any other combinations
    const matchDesktopEntries = /\[desktop\]/i;
    return records.entries.filter(item => matchDesktopEntries.test(item?.fields?.entryTitle?.[spaceLocale]));
}

const desktopEntriesOnly = (records, spaceLocale) => {
    // Matches any tag that contains "desktop", even if combined with other words
    const matchDesktopEntries = /\[.*?desktop.*?\]/i;

    return records?.entries?.filter(item => {
        const entryTitle = item?.fields?.entryTitle?.[spaceLocale];
        return entryTitle ? matchDesktopEntries.test(entryTitle) : false;
    }) || [];
};

const excludeNonDesktopEntries = (records, spaceLocale) => {
    const unwantedPlatforms = ['tablet', 'phone', 'mobile', 'native', 'ios'];
    const safe = str => str?.toLowerCase() || '';

    return records?.entries?.filter(item => {
        const title = safe(item?.fields?.entryTitle?.[spaceLocale]);
        if (!title) return false;

        const hasDesktop = title.includes('desktop');
        const hasUnwanted = unwantedPlatforms.some(p =>
            title.includes(`[${p}`) || title.includes(`${p}]`) || title.includes(p)
        );

        return hasDesktop || !hasUnwanted;
    }) || [];
};


const filterDesktopRelevantEntries = (records, spaceLocale) => {
    return records?.filter(item => {
        const entryTitle = item?.fields?.entryTitle?.[spaceLocale];

        if (!entryTitle) return true; // Keep entries with no title (just in case)

        // Match platform tags (case insensitive)
        const hasDesktop = /\[.*?desktop.*?\]/i.test(entryTitle);
        const hasExcludedPlatform = /\[tablet\]|\[phone\]|\[mobile\]|\[native\]|\[IOS\]/i.test(entryTitle);

        // Keep if:
        // - It has [desktop] (even if mixed with others like [tablet])
        // - OR it has no platform tags at all
        return hasDesktop || !hasExcludedPlatform;
    }) || [];
};

const createViewAllActionText = (spaceLocale, text) => ({
    [spaceLocale]: text
});

const formatSlug = (title) => {
    if (typeof title !== "string") return "";

    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // keep only a-z, 0-9, spaces, and dashes
        .replace(/\s+/g, "-")         // spaces → dashes
        .replace(/-+/g, "-")          // collapse multiple dashes
        .replace(/^-|-$/g, "");       // trim leading/trailing dashes
};

const filterOutNonDesktopEntries = (entryText) => {
    const excludeRegex = /\[tablet\]|\[phone\]|\[mobile\]|\[native\]|\[IOS\]/i;
    return !excludeRegex.test(entryText)
};

const createExpandedSectionLayoutType = (spaceLocale, type) => ({
    [spaceLocale]: type
});

const filterOutPartnerAndNativeEntries = (entryText) => {
    const excludeRegex = /\[partner\]|\[native\]/i;
    return !excludeRegex.test(entryText)
};

export { filterTitle, transformPlatform, transformShowNetPositionAsFalse, transformShowNetPositionAsTrue, createSessionVisibility, createEnvironmentVisibility, venturesKeyNameMaps, extractVentureFromTitle, filterOutNonDesktopEntries, filterOutPartnerAndNativeEntries, createLayoutType, createViewAllType, retrieveModelRecords, desktopEntriesOnly, setDefaultDisplayInline, createSingleLayoutType, filterDesktopRelevantEntries, JACKPOT_SECTION_NAMES, transformNameToSlug, formatSlug, createViewAllActionText, createExpandedSectionLayoutType, excludeNonDesktopEntries };

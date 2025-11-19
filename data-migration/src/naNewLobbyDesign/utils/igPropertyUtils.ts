import { PRODUCTION_VENTURES_TYPOS, VENTURE, LAYOUT_MODEL, IG_VIEW_MODEL, IG_COLLAB_BASED_SECTIONS, IG_SIMILARITY_SECTIONS, IG_SECTION_WITHOUT_CAROUSEL, IG_CAROUSEL_A_SECTIONS, IG_JACKPOTS_SECTION, IG_DFG_SECTION, DX_PLACEHOLDER, UNMATCHED_WHITEHAT_GAMES } from "../constants";
import { getEntries } from "../api/managementApi";
import { readJSONFile } from "./fileOperations";
import { WHITEHAT_MERGED_OUT_PATH, WHITEHAT_SITE_GAME_FILE_NAME } from '../api/whitehat/constants';
import contentful from "contentful-management";

const JACKPOT_SECTION_NAMES = [
    'Rapid-Fire', 'Bubble-Pots', 'Age Of The Gods Jackpots', 'blueprint-jackpots',
    'red-tiger-jackpots', 'Stellar', 'casino-jackpots', 'Diamond-Link-Jackpots',
    'double-bubbles', 'exclusive-jackpots', 'Classic-Jackpots', 'mega-drop',
    'diamond-link', 'phoenix-jackpot'
];

const filterTitle = (spaceLocale, entry: contentful.Entry) => {
    // const matchDesktopEntries = /\[desktop\]/i;
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

const retrieveModelRecords = async (model: string, filepath?: string) => {
    let data;
    const path = filepath || `./src/naNewLobbyDesign/data/${model}/na/${model}.json`;

    try {
        const fileData = await readJSONFile(path);
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

const filterDesktopRelevantEntries = (records: any, spaceLocale: string) => {
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

const filterOutNonDesktopEntries = (entryText: string) => {
    const excludeRegex = /\[tablet\]|\[phone\]|\[mobile\]|\[native\]|\[IOS\]/i;
    return !excludeRegex.test(entryText)
};

const filterOutPartnerAndNativeEntries = (entryText: string) => {
    const excludeRegex = /\[partner\]|\[native\]/i;
    return !excludeRegex.test(entryText)
};

const whitehatPlatformToPlatformVisibility = (deviceTypes = []) => {
    const platformsMap = {
        Desktop: "web",
        MobileHtml: "web",
        MobileAndroid: "android",
        MobileIOS: "ios"
    };

    const mappedSet = new Set();
    deviceTypes.forEach(item => {
        if (platformsMap[item]) {
            mappedSet.add(platformsMap[item]);
        }
    });

    const preferredOrder = ['web', 'ios', 'android'];
    const orderedPlatforms = preferredOrder.filter(platform => mappedSet.has(platform));

    return orderedPlatforms;
}

const formatSlug = (title: string) => {
    if (typeof title !== "string") return "";

    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // keep only a-z, 0-9, spaces, and dashes
        .replace(/\s+/g, "-")         // spaces → dashes
        .replace(/-+/g, "-")          // collapse multiple dashes
        .replace(/^-|-$/g, "");       // trim leading/trailing dashes
};


const JURISDICTION_MAP = {
    'us-nj': 'nj',
    'us-ri': 'ri',
    'us-pa': 'pa',
    'ca-on': 'on'
};

const VENTURE_JUR_MAP = {
    'ballybet_ri': 'ballybetri',
    'ballybet_nj': 'ballybetnj',
    'ballybet_pa': 'ballybetpa',
    'ballybet_on': 'ballybeton',
    'monopolycasino_nj': 'monopolycasinonj',
    'monopolycasino_on': 'monopolycasinoon',
    'monopolycasino_pa': 'monopolycasinopa'
};

const KNOWN_NA_VENTURES = ['ballybetri', 'ballybetnj', 'ballybetpa', 'ballybeton', 'monopolycasinonj', 'monopolycasinoon', 'monopolycasinopa'];
const KNOWN_VENTURES = ['ballybet', 'monopolycasino'];
const KNOWN_JURISDICTIONS = ['us-nj', 'us-ri', 'us-pa', 'ca-on'];

const extractRawVentureAndJurisdiction = (title) => {
    const lowerTitle = title.toLowerCase();

    const rawVenture = KNOWN_VENTURES.find(v => lowerTitle.includes(`[${v}]`))
        ?? KNOWN_VENTURES.find(v => lowerTitle.includes(v));

    const rawJurisdiction = KNOWN_JURISDICTIONS.find(j => lowerTitle.includes(`[${j}]`))
        ?? KNOWN_JURISDICTIONS.find(j => lowerTitle.includes(j));

    return { rawVenture, rawJurisdiction };
};

const remapVentureAndJurisdiction = (rawVenture, rawJurisdiction) => {
    const jurisdiction = rawJurisdiction && JURISDICTION_MAP[rawJurisdiction]
        ? JURISDICTION_MAP[rawJurisdiction]
        : rawJurisdiction;

    const key = rawVenture && jurisdiction ? `${rawVenture.toLowerCase()}_${jurisdiction}` : null;

    const venture = key && VENTURE_JUR_MAP[key]
        ? VENTURE_JUR_MAP[key]
        : rawVenture;

    return { venture, jurisdiction };
}
// This is for linking migrated whitehatSiteGames to all igSections
const linkSiteGamesToSections = ({
    spaceLocale,
    ventureName,
    desktopCategoryID,
    siteGamesV2,
    whitehatSiteGames
}) => {
    const foundGamesIds = [];
    const unmatchedTitles = []; // make sure we don't mutate original

    // Step 1: Filter whitehat sitegames by venture + category
    const games = whitehatSiteGames
        .filter(item => item.venture === ventureName && item.categories?.includes(desktopCategoryID))
        .map(item => ({
            sitegameName: `${item.game.seoName} [${ventureName}]`,
            ...item
        }));

    if (games.length === 0) {
        unmatchedTitles.push({
            whitehatDesktopCategoryId: desktopCategoryID,
            gameTitle: 'not found',
            venture: ventureName
        });
    }
    // Step 2: Match sitegames from Contentful
    games.forEach(element => {
        const match = siteGamesV2.find(item => {
            const title = item?.fields?.entryTitle?.[spaceLocale];
            return title?.toLowerCase() === element.sitegameName?.toLowerCase();
        });

        if (match && match.sys.id) {
            foundGamesIds.push({
                sys: {
                    type: 'Link',
                    linkType: 'Entry',
                    id: match.sys?.id
                }
            });
        } else {
            console.log('❌ UNMATCHED:', element.sitegameName);
            unmatchedTitles.push({
                whitehatDesktopCategoryId: desktopCategoryID,
                gameTitle: element.sitegameName
            });
        }
    });

    return { foundGamesIds, unmatchedTitles };
};

const VENTURE_NAME_RESOLVER = {
    'monopoly': 'monopolycasino',
    'monopolycasino': 'monopolycasino',
    'bally': 'ballybet',
    'ballybet': 'ballybet'
};
const createVentureWithJursidction = (ventureFromTitle: string, jurisdiction: string) => {
    const ventureName = VENTURE_NAME_RESOLVER[ventureFromTitle.toLowerCase()];
    const formattedJurisdiction = jurisdiction.split('-').pop().toLowerCase();
    return `${ventureName}${formattedJurisdiction}`;
};

const filterDxEntryTitle = (
    entryTitle: string,
    jurisdiction: string,
    venture: string,
    ventureWithJurisdiction: string,
    layoutTypeA: string,
    layoutTypeB: string = ""
) => {
    return entryTitle
        .replace(jurisdiction, '')
        .replace(venture, `${ventureWithJurisdiction}`)
        .replace(/\[casino\]/g, '')
        .replace(/\[web\]/g, '')
        .replace(layoutTypeA, '')
        .replace(layoutTypeB, '')
        .replace(/\[\]/g, '')
        .trim();
}

export { filterTitle, transformPlatform, createSessionVisibility, desktopEntriesOnlyStrict, remapVentureAndJurisdiction, createSectionTruncation, extractRawVentureAndJurisdiction, createEnvironmentVisibility, venturesKeyNameMaps, extractVentureFromTitle, filterOutNonDesktopEntries, filterOutPartnerAndNativeEntries, createLayoutType, createViewAllType, retrieveModelRecords, desktopEntriesOnly, setDefaultDisplayInline, createSingleLayoutType, filterDesktopRelevantEntries, JACKPOT_SECTION_NAMES, formatSlug, createExpandedSectionLayoutType, createViewAllActionText, whitehatPlatformToPlatformVisibility, createVentureWithJursidction, filterDxEntryTitle, KNOWN_NA_VENTURES, linkSiteGamesToSections };

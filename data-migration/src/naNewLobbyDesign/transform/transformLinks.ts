import { log } from "../utils/logging";
import { readJSONFile } from "../utils/fileOperations";
import * as contentful from "contentful-management";
import * as fs from 'node:fs';
import { IG_LINK_MODEL, DX_LINK, VENTURE, IG_VIEW, DX_VIEW, DX_QUICK_LINKS } from "../constants";
import { storeFile } from "../save";
import { createEnvironmentVisibility, createSessionVisibility, extractRawVentureAndJurisdiction, KNOWN_NA_VENTURES, remapVentureAndJurisdiction, retrieveModelRecords, transformPlatform, venturesKeyNameMaps } from "../utils/igPropertyUtils";
import { createDirectoryIfNotExists } from "../extract";
import { getEntries } from "../api/managementApi";

interface Navigation {
    name: string;
    url: string;
    key: string;
    iconUrl: string;
    iconName: string;
    visibility: string[];
    environmentVisibility?: string[];
    sessionVisibility?: string[];
    platformVisibility?: string[];
}


const NAVIGATIONS: Navigation[] = [
    {
        "name": "Home",
        "url": "/casino/",
        "key": "home",
        "iconUrl": "/assets/common/images/casino/icons/home.svg",
        "iconName": "home",
        "visibility": [
            "xs",
            "sm"
        ]
    },
    {
        "name": "Slots",
        "url": "/casino/category/slots",
        "key": "slots",
        "iconUrl": "/assets/common/images/casino/icons/blackjack.svg",
        "iconName": "blackjack",
        "visibility": [
            "xs",
            "sm"
        ]
    },
    {
        "name": "Live Dealer",
        "url": "/casino/category/live-dealer",
        "key": "live-dealer",
        "iconUrl": "/assets/common/images/casino/icons/dice.svg",
        "iconName": "dice",
        "visibility": [
            "xs",
            "sm"
        ]
    },
    {
        "name": "Jackpots",
        "url": "/casino/category/jackpots",
        "key": "jackpots",
        "iconUrl": "/assets/common/images/casino/icons/dice.svg",
        "iconName": "dice",
        "visibility": [
            "xs",
            "sm"
        ]
    },
    {
        "name": "Search",
        "url": "/casino/search",
        "key": "search",
        "iconUrl": "/assets/common/images/casino/icons/search.svg",
        "iconName": "search",
        "visibility": []
    }
];

type SlimView = {
    id: string;
    slug: string;
    ventureId: string;
};

function extractSuffix(url: string): string {
    // For example, if the URL is "/casino/category/slots", it should return "slots"
    // If the URL is "/casino/", it should return an empty string
    // If the URL is "/casino/category/", it should return an category
    // If the URL is "/casino/category/slots/", it should return "slots"  
    const regex = /\/casino\/(?:category\/)?([^/]*)(?:\/)?$/;
    const match = url.match(regex);
    return match ? match[1] : "";
}

const findViewWithPrefix = (url: string, slugLookup: Map<string, SlimView>, ventureId: string) => {
    let suffix = extractSuffix(url);
    if (!suffix) {
        suffix = "casino-home"; // Default to "home" if no suffix is found
        console.log('suffix', suffix, 'id: ', `${suffix}_${ventureId}`);
    }
    
    const suffixKey = `${suffix}_${ventureId}`;

    const viewEntry = slugLookup.get(suffixKey);
    if (viewEntry) {
        return {
            sys: {
                type: "Link",
                linkType: "Entry",
                id: viewEntry.id
            }
        }
    }
    // If no matching venture is found, return null or handle accordingly
    log(`No matching venture found for the URL: ${url}`);
    return null;
}

const isExternalUrl = (url: string) => {
    const regex = new RegExp("^(http|https)://", "i");
    return regex.test(url);
}

const getMappedVentureAndJurisdiction = (title) => {
    const { rawVenture, rawJurisdiction } = extractRawVentureAndJurisdiction(title);
    return remapVentureAndJurisdiction(rawVenture, rawJurisdiction);
}

const getCorrectVentureFromDxView = async (spaceLocale, venturesMap) => {
    const dxView = await retrieveModelRecords(DX_VIEW) || [];
    const filteredDxView = dxView.filter(entry => {
        const title = entry.fields.entryTitle['en-US'] || '';
        return title.includes('[casino]') && title.includes('[web]');
    });

    const byVentureId = filteredDxView.reduce((acc, item) => {
        const fields = item.fields || {};
        const entryTitle = fields.entryTitle?.[spaceLocale] || '';
        const { venture } = getMappedVentureAndJurisdiction(entryTitle);
        const venture_id = venturesMap.ventureByName[venture];
        if (!venture_id) return acc;

        // pull out this entry’s IDs
        const ids = (fields.topContent?.[spaceLocale] || [])
            .map(ci => ci.sys?.id)
            .filter(id => typeof id === 'string');

        if (!ids.length) return acc;

        // ensure we have an array to accumulate into
        if (!acc[venture_id]) {
            acc[venture_id] = [];
        }

        // append & dedupe in one go
        acc[venture_id] = Array.from(
            new Set(acc[venture_id].concat(ids))
        );

        return acc;
    }, /** initial */ {});

    return byVentureId;
};


type VentureTopSections = Record<string, string[]>;

interface DXQuickLinkRecord {
    sys: { id: string };
    fields: {
        dxLinks?: Record<string, Array<{ sys: { id: string } }>>;
    };
}

async function buildQuickLinkData(
    spaceLocale: string
): Promise<{
    quickLinkSet: Set<string>;
    quickLinkToLinksMap: Record<string, string[]>;
}> {
    const dxQuickLinks = (await retrieveModelRecords(DX_QUICK_LINKS)) as DXQuickLinkRecord[] || [];

    // initialize accumulators
    const quickLinkSet = new Set<string>();
    const quickLinkToLinksMap: Record<string, string[]> = {};

    dxQuickLinks.forEach(({ sys: { id }, fields }) => {
        quickLinkSet.add(id);

        // safely extract the array of linked sys.ids (or empty array)
        const linkedIds =
            fields.dxLinks?.[spaceLocale]
                ?.map(link => link.sys.id)
                .filter(Boolean) /*<-- drop undefined*/
            || [];

        if (linkedIds.length) {
            quickLinkToLinksMap[id] = linkedIds;
        }
    });

    return { quickLinkSet, quickLinkToLinksMap };
}

type VentureToQuickLinksMap = Record<string, string[]>;
type QuickLinkToLinksMap = Record<string, string[]>;
type LinkIdToUrlMap = Record<string, string>;
interface VentureLinkInfo {
    ventureId: string;
    url: string;
}
type LinkIdToVentureAndUrlMapping = Record<string, VentureLinkInfo>;

function buildLinkIdToVentureMap(
    filteredMap: VentureToQuickLinksMap,
    quickLinkToLinksMap: QuickLinkToLinksMap,
    linkIdToUrl: LinkIdToUrlMap
): LinkIdToVentureAndUrlMapping {
    const ventureLinkMap = {};

    // now TS knows each entry is [string, string[]]
    for (const [ventureId, quickLinkIds] of Object.entries(filteredMap)) {
        for (const qlId of quickLinkIds) {
            const childLinkIds = quickLinkToLinksMap[qlId] || [];
            for (const linkId of childLinkIds) {
                const url = linkIdToUrl[linkId];
                if (!url) {
                    console.warn(`No URL for linkId ${linkId}`);
                    continue;
                }

                // composite key guarantees uniqueness per (venture, link) pair
                const key = `${ventureId}_${linkId}`;
                ventureLinkMap[key] = {
                    ventureId,
                    url
                };
            }
        }
    }

    return ventureLinkMap;
}
// removes any [] and hte text inside.
const cleanTitle = s => s.replace(/\s*\[[^\]]*]/g, '').trim();


export default async (spaceLocale: string, spaceFolder: string) => {
    try {
        const ventures: contentful.Entry[] = await getEntries(VENTURE);
        const dxLinks = await retrieveModelRecords(DX_LINK);
        const dxLinksEntries = dxLinks.filter((entry: contentful.Entry) => {
            const title = entry.fields.entryTitle[spaceLocale] || '';
            return title.includes('[casino] [web]');
        });

        const venturesMap = venturesKeyNameMaps(spaceLocale, ventures);

        const ventureToTopSectionsMap: VentureTopSections = await getCorrectVentureFromDxView(spaceLocale, venturesMap);

        const { quickLinkSet, quickLinkToLinksMap } = await buildQuickLinkData(spaceLocale);

        // Filter to only leave the quicklinks in the ventureToQuickLinksMap
        const filteredMap = Object.fromEntries(
            Object.entries(ventureToTopSectionsMap)
                // Map each venture → its filtered array
                .map(([ventureId, linkIds]) => [
                    ventureId,
                    linkIds.filter(id => quickLinkSet.has(id))
                ])
                // Remove any entries where the array is now empty
                .filter(([, filteredIds]) => filteredIds.length > 0)
        );

        // build a map of linkId: link.url
        const linkIdToUrl: Record<string, string> = dxLinksEntries.reduce((acc, entry) => {
            const linkId = entry?.sys?.id;
            const url = entry?.fields.url?.[spaceLocale];

            // only assign if we haven't seen this linkId before, and url exists
            if (linkId && url && !(linkId in acc)) {
                acc[linkId] = url;
            }

            return acc;
        }, {});

        const ventureLinkMap = buildLinkIdToVentureMap(filteredMap, quickLinkToLinksMap, linkIdToUrl)

        const venturesEntries = ventures.filter((entry: contentful.Entry) => {
            const title = entry.fields?.name?.[spaceLocale] || '';
            return KNOWN_NA_VENTURES.includes(title);
        });

        // Get the igView for this venture 
        const igViews: contentful.Entry[] = await getEntries(IG_VIEW);
        const slugLookup = igViews.reduce(
            (acc: Map<string, SlimView>, entry: contentful.Entry) => {
                const slug = entry.fields.viewSlug?.[spaceLocale];
                const ventureId = entry.fields.venture?.[spaceLocale]?.sys?.id;
                if (!slug || !ventureId) return acc;

                // ←– only include if this ventureId is in your filtered venturesEntries
                // if (!venturesEntries.some(v => v.sys.id === ventureId)) return acc;

                const key = `${slug}_${ventureId}`;
                acc.set(key, {
                    id: entry.sys.id,
                    slug,
                    ventureId
                });
                return acc;
            },
            new Map<string, SlimView>()
        );

        const regex = new RegExp("^/casino/", "i");

        const allavailableVentureIds = ventures?.map(item => item?.sys?.id);

        const igLinksEntries = dxLinksEntries
            .map((item: contentful.Entry) => {
                const fields = item.fields;
                const entryTitle = fields.entryTitle[spaceLocale];
                const title = fields.title[spaceLocale];
                const url = fields?.url?.[spaceLocale];
                const image = fields?.image?.[spaceLocale];
                const bynderImage = fields?.bynderImage?.[spaceLocale];

                let view = null;
                let internalUrl: string | null = null;
                let externalUrl: string | null = null;

                const itemId = item.sys.id;
                const testedUrl = regex.test(url || "");

                // 1) Find **any** venture that owns this link record
                const match = allavailableVentureIds.find(ventureId =>
                    Boolean(ventureLinkMap[`${ventureId}_${itemId}`])
                );
                if (!match) {
                    // this link doesn't belong under any venture → skip entirely
                    return null;
                }

                // grab the rec for later URL check
                const rec = ventureLinkMap[`${match}_${itemId}`]!;

                switch (testedUrl) {
                    case true:
                        // must find a view _and_ rec.url must match
                        const foundView = findViewWithPrefix(url, slugLookup, match);
                        if (!foundView || rec.url !== url) {
                            return null;
                        }
                        view = foundView;
                        break;

                    case false:
                        // non-view URLs still get classified
                        if (isExternalUrl(url)) {
                            externalUrl = url;
                        } else {
                            internalUrl = url;
                        }
                        break;

                    default:
                        log(`No view found for the url ${url}`);
                        return null;
                }

                const ventureName = venturesMap.ventureById[match];
                const cleanedIgLinkEntryTitle = cleanTitle(entryTitle);
                const payload = {
                    fields: {
                        entryTitle: {
                            [spaceLocale]: `${cleanedIgLinkEntryTitle} [${ventureName}]`
                        },
                        label: {
                            [spaceLocale]: title
                        },
                        view: {
                            [spaceLocale]: view
                        },
                        internalUrl: {
                            [spaceLocale]: internalUrl
                        },
                        externalUrl: {
                            [spaceLocale]: externalUrl
                        },
                        platformVisibility: transformPlatform(spaceLocale),
                        environmentVisibility: createEnvironmentVisibility(spaceLocale),
                        sessionVisibility: createSessionVisibility(spaceLocale),
                        image: {
                            [spaceLocale]: image
                        },
                        bynderImage: {
                            [spaceLocale]: bynderImage
                        },
                    }
                }
                return payload;

            }).filter(Boolean);

        // Add more additional links to be referenced in the navigation

        const additionalLinks = KNOWN_NA_VENTURES.flatMap((venture) => {
            const navLinks = NAVIGATIONS.map((item: Navigation) => {

                const ventureId = venturesMap.ventureByName[venture];
                
                let view = null;
                let externalUrl = null;

                switch (regex.test(item.url)) {
                    case true:
                        view = findViewWithPrefix(item.url, slugLookup, ventureId);
                        break;
                    case false:
                        externalUrl = item.url;
                        break;
                    default:
                        log(`No view found for the url ${item.url}`);
                        break;
                }
                const payload = {
                    fields: {
                        entryTitle: {
                            [spaceLocale]: `${item.name} [${venture}]`
                        },
                        label: {
                            [spaceLocale]: item.key
                        },
                        view: {
                            [spaceLocale]: view
                        },
                        externalUrl: {
                            [spaceLocale]: externalUrl
                        },
                        image: {
                            [spaceLocale]: item.iconUrl
                        },
                        platformVisibility: transformPlatform(spaceLocale),
                        environmentVisibility: createEnvironmentVisibility(spaceLocale),
                        sessionVisibility: createSessionVisibility(spaceLocale),
                    }
                }
                return payload;
            });
            return navLinks;
        });
        const igLinksEntriesWithAdditionalLinks = [...igLinksEntries, ...additionalLinks];
        // Store the transformed data

        await createDirectoryIfNotExists(DX_LINK, spaceFolder);
        await storeFile(igLinksEntriesWithAdditionalLinks, `./src/naNewLobbyDesign/data/${DX_LINK}/${spaceFolder}/${IG_LINK_MODEL}.json`);
        log(`Quick links transformed and stored successfully.`);
    } catch (error) {
        log(`Error processing quick links: ${error}`);
        throw error;
    }
}

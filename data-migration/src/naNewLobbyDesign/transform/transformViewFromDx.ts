import { readJSONFile, safeReadJSONFile } from "../utils/fileOperations";
import * as fs from 'node:fs';
import { log } from "../utils/logging";
import { DX_VIEW, IG_VIEW, VENTURE, JURISDICTION, DX_PLACEHOLDER, IG_GRID_A_SECTION, IG_GRID_B_SECTION, IG_GRID_C_SECTION, IG_GRID_E_SECTION, IG_CAROUSEL_A_SECTIONS, IG_DFG_SECTION, IG_JACKPOTS_SECTION, IG_BRAZE_PROMO_SECTION, IG_SEARCH_RESULTS } from "../constants";
import { storeFile } from "../save";
import { createSessionVisibility, createEnvironmentVisibility, venturesKeyNameMaps, retrieveModelRecords, remapVentureAndJurisdiction, extractRawVentureAndJurisdiction, transformPlatform } from "../utils/igPropertyUtils";
import { getEntries } from "../api/managementApi";

const getVentures = async (spaceLocale) => {
    const ventures = await getEntries(VENTURE);

    return venturesKeyNameMaps(spaceLocale, ventures);
};

const getMappedVentureAndJurisdiction = (title) => {
    const { rawVenture, rawJurisdiction } = extractRawVentureAndJurisdiction(title);
    return remapVentureAndJurisdiction(rawVenture, rawJurisdiction);
}

const cleanDisplayTitle = (title) => {
    return title
        .replace(/Casino Category\s*/i, '')           // remove "Casino Category" prefix
        .replace(/\[[^\]]*\]/g, '')                    // remove [anything inside brackets]
        .replace(/\S*\[|\]\S*/g, '')                   // remove partial bracket-words
        .replace(/\s+/g, ' ')                          // collapse extra spaces
        .trim();                                       // final trim
};

const getSearchSection = async (spaceLocale, ventureId) => {
    const searchRecords = await getEntries(IG_SEARCH_RESULTS);

    const record = searchRecords.find(item => item?.fields?.venture?.[spaceLocale]?.sys?.id === ventureId) || {};

    return ({
        sys: {
            type: "Link",
            linkType: "Entry",
            id: record?.sys?.id || '',
        },
    })
}

const getAllIgSections = async () => {
    const igGridA = await retrieveModelRecords(IG_GRID_A_SECTION);
    const igGridB = await retrieveModelRecords(IG_GRID_B_SECTION);
    const igGridC = await retrieveModelRecords(IG_GRID_C_SECTION);
    const igCarouselA = await retrieveModelRecords(IG_CAROUSEL_A_SECTIONS);
    const igGridE = await retrieveModelRecords(IG_GRID_E_SECTION);
    const igDfg = await retrieveModelRecords(IG_DFG_SECTION);
    const igJackpots = await retrieveModelRecords(IG_JACKPOTS_SECTION);
    const igBraze = await retrieveModelRecords(IG_BRAZE_PROMO_SECTION);

    return { igGridA, igGridB, igGridC, igGridE, igCarouselA, igDfg, igJackpots, igBraze }
}

const createIgSectionMap = async (spaceLocale) => {
    const { igGridA = [], igGridB = [], igGridC = [], igGridE = [], igCarouselA = [], igDfg = [], igJackpots = [], igBraze = [] } = await getAllIgSections();

    const allSections = [
        igGridA, igGridB, igGridC, igGridE,
        igCarouselA, igDfg, igJackpots, igBraze
    ];

    const flattened = allSections.flatMap(sectionList =>
        sectionList.map(item => ({
            id: item.sys.id,
            title: item.fields.entryTitle[spaceLocale]
        }))
    );

    return flattened;
}

const getSectionsFromPlaceholders = (igSectionsMap, linkedPlaceholdersPrimaryContent = [], linkedPlaceholdersTopContent = []) => {
    const foundPrimary = [];
    const foundTop = [];

    for (const key in igSectionsMap?.sections) {
        processLinkedContent(key, linkedPlaceholdersPrimaryContent, foundPrimary, igSectionsMap);
        processLinkedContent(key, linkedPlaceholdersTopContent, foundTop, igSectionsMap);
    }

    return { foundPrimary, foundTop };
};

const processLinkedContent = (key, idsToFind, matches = [], igSectionsMap) => {
    const underscoreIndex = key.indexOf('_');
    if (underscoreIndex === -1) return;

    const idPart = key.slice(0, underscoreIndex);
    if (idsToFind.includes(idPart)) {
        const titlePart = key.slice(underscoreIndex + 1);
        matches.push({
            id: idPart,
            title: titlePart,
            categoryId: igSectionsMap[key]
        });
    }
};

const getIgSectionsForAView = (allPublishedIgSections, igSectionsMap, linkedPlaceholdersPrimaryContent = [], linkedPlaceholdersTopContent = []) => {
    const { foundPrimary, foundTop } = getSectionsFromPlaceholders(igSectionsMap, linkedPlaceholdersPrimaryContent, linkedPlaceholdersTopContent);

    const primary = linkedPlaceholdersPrimaryContent
        .map(id => {
            const match = foundPrimary.find(fp => fp.id === id);
            if (!match) return null;

            const published = allPublishedIgSections.find(
                p => p.title.toLowerCase() === match.title.toLowerCase()
            );
            if (!published) return null;
            
            return {
                sys: {
                    type: "Link",
                    linkType: "Entry",
                    id: published.id,
                },
            };
        })
        .filter(Boolean);

    const top = linkedPlaceholdersTopContent
        .map(id => {
            const match = foundTop.find(fp => fp.id === id);
            if (!match) return null;

            const published = allPublishedIgSections.find(
                p => p.title.toLowerCase() === match.title.toLowerCase()
            );
            if (!published) return null;

            return {
                sys: {
                    type: "Link",
                    linkType: "Entry",
                    id: published.id,
                },
            };
        })
        .filter(Boolean);

    return { primary, top };
}


export const transformViewFromDx = async (spaceLocale, spaceFolder) => {
    let igViewEntries = [];
    let viewSectionsEntriesMap = { top: {}, primary: {} };

    try {
        const dxView = await readJSONFile(`./src/naNewLobbyDesign/data/${DX_VIEW}/${spaceFolder}/${DX_VIEW}.json`)
        const venturesMap = await getVentures(spaceLocale);
        const jurisdictions = await retrieveModelRecords(JURISDICTION);
        // Read sectionsMapFile and store into sections
        const igSectionsMap = await safeReadJSONFile(`./src/naNewLobbyDesign/data/${DX_PLACEHOLDER}/${spaceFolder}/mappedCategoryIDs.json`, []);
        // get all IG Sections and extract title and id from them
        const allPublishedIgSections = await createIgSectionMap(spaceLocale);

        const filteredDxView = dxView?.entries?.filter(entry => {
            const title = entry.fields.entryTitle['en-US'] || '';
            return title.includes('[casino]') && title.includes('[web]');
        });

        for (const item of filteredDxView) {
            const fields = item.fields;
            // const props = item.fields.props;
            const entryTitle = fields?.entryTitle?.[spaceLocale];

            const isSearchView = entryTitle.toLowerCase().includes("casino category search");

            const { venture, jurisdiction } = getMappedVentureAndJurisdiction(entryTitle);
            const ventureId = venturesMap.ventureByName[venture] || '';

            const platformVisibility = fields?.platform?.[spaceLocale].map(item => item.toLowerCase());
            const slug = fields?.key?.[spaceLocale].toLowerCase();

            const linkedPlaceholdersPrimaryContent = fields?.primaryContent?.[spaceLocale]?.map(item => item?.sys?.id);
            const linkedPlaceholdersTopContent = fields?.topContent?.[spaceLocale]?.map(item => item?.sys?.id);
            viewSectionsEntriesMap.top[`${slug}_${ventureId}`] = linkedPlaceholdersTopContent;
            viewSectionsEntriesMap.primary[`${slug}_${ventureId}`] = linkedPlaceholdersPrimaryContent;

            let primaryContent = [];
            let topContent = [];
            if (isSearchView) {
                const entry = await getSearchSection(spaceLocale, ventureId);
                primaryContent.push(entry);
            } else {
                const { primary, top } = getIgSectionsForAView(allPublishedIgSections, igSectionsMap, linkedPlaceholdersPrimaryContent, linkedPlaceholdersTopContent);
                primaryContent.push(...primary);
                topContent.push(...top);
            }

            const payload = {
                fields: {
                    entryTitle: {
                        [spaceLocale]: isSearchView ? `Casino Search [${venture}]` : entryTitle
                    },
                    name: {
                        [spaceLocale]: cleanDisplayTitle(entryTitle)
                    },
                    viewSlug: {
                        [spaceLocale]: fields?.key?.[spaceLocale]
                    },
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    venture: {
                        [spaceLocale]: {
                            sys: {
                                type: "Link",
                                linkType: "Entry",
                                id: ventureId
                            }
                        }
                    },
                    primaryContent: {
                        [spaceLocale]: primaryContent
                    },
                    topContent: {
                        [spaceLocale]: topContent
                    },
                    liveHidden: {
                        [spaceLocale]: false
                    },
                    classification: {
                        [spaceLocale]: isSearchView ? 'search' : 'general'
                    }
                }
            };

            igViewEntries.push(payload);
        }
        // igViewEntries = igViewEntries.slice(0, 3);
        await storeFile(igViewEntries, `./src/naNewLobbyDesign/data/${DX_VIEW}/${spaceFolder}/${IG_VIEW}.json`);
        fs.writeFileSync(`./src/naNewLobbyDesign/data/${DX_VIEW}/${spaceFolder}/${IG_VIEW}_placeholderMap.json`, JSON.stringify(viewSectionsEntriesMap, null, 2));
        
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
}

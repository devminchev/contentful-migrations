import { log } from "../utils/logging";
import { KNOWN_NA_VENTURES } from "../utils/igPropertyUtils";
import { IG_NAVIGATION_MODEL, IG_LINK_MODEL, VENTURE } from "../constants";
import { storeFile } from "../save";
import { getEntries } from "../api/managementApi";
import * as contentful from "contentful-management";
import { createDirectoryIfNotExists } from "../extract";

interface LinkMap {
    [ventureId: string]: contentful.Entry[];
}

const NAVIGATION_LINKS = new Set(["Home", "Slots", "Live Dealer", "Jackpots", "Search"]);

const retrieveLinks = async (spaceLocale: string, ventureLookUp: Map<string, string>): Promise<LinkMap> => {
    const links = await getEntries(IG_LINK_MODEL);

    const linksMap = links.reduce((acc, item) => {
        const entryTitle = item.fields?.entryTitle?.[spaceLocale];
        
        // Extract the venture name from the entry title example "Slots [ballybetri]"
        const match = entryTitle?.match(/^([A-Z][a-zA-Z\s]+)\s\[(.*?)\]$/);
        const navName = match ? match[1] : null;
        const ventureName = match ? match[2] : null;
        // If the entry title is in the navigation links, skip it
        if (!NAVIGATION_LINKS.has(navName)) {
            return acc;
        }
        if (!ventureLookUp.has(ventureName)) return acc; // Skip if entryTitle is not in the lookup
        const linkVentureId = ventureLookUp.get(ventureName);

        // Initialize array if ventureId is not in the map
        if (!acc[linkVentureId]) {
            acc[linkVentureId] = [];
        }

        // Push link entry to the correct ventureId group
        acc[linkVentureId].push(item);

        return acc;
    }, {});
    return linksMap;
    //returns {[ventureId]: [link1, link2]}
};

export default async (spaceLocale: string, spaceFolder: string) => {
    try {
        const ventures: contentful.Entry[] = await getEntries(VENTURE);
        const venturesEntries = ventures.filter((entry: contentful.Entry) => {
            const title = entry.fields?.name?.[spaceLocale] || '';
            return KNOWN_NA_VENTURES.includes(title); 
        });
        
        const ventureLookUp = new Map(venturesEntries.map(entry => [entry.fields.name?.[spaceLocale], entry.sys.id]));
        let igNavLinks = await retrieveLinks(spaceLocale, ventureLookUp);
        let navigationEntries = [];
        for (const item of venturesEntries) {
            const ventureId = item.sys.id;
            const igLinkEntries = igNavLinks[ventureId] || [];
            let navLinks = [];
            for (const igLinkEntry of igLinkEntries) {
                const linkId = igLinkEntry.sys.id;
                const payload = {
                    "sys": {
                        "type": "Link",
                        "linkType": "Entry",
                        "id": linkId
                    }
                };
                navLinks.push(payload);
            }
            
            const payload = {
                fields: {
                    entryTitle: {
                        [spaceLocale]: item.fields.entryTitle?.[spaceLocale]
                    },
                    venture: {
                        [spaceLocale]: {
                            "sys": {
                                "type": "Link",
                                "linkType": "Entry",
                                "id": ventureId
                            }
                        }
                    },
                    links: {
                        [spaceLocale]: navLinks
                    },
                    bottomNavLinks: {
                        [spaceLocale]: []
                    },  
                }
            }

            navigationEntries.push(payload);
        }

        await createDirectoryIfNotExists(IG_NAVIGATION_MODEL, spaceFolder);
        await storeFile(navigationEntries, `./src/naNewLobbyDesign/data/${IG_NAVIGATION_MODEL}/${spaceFolder}/${IG_NAVIGATION_MODEL}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

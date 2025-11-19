import { log } from "../utils/logging";
import * as contentful from "contentful-management";
import { IG_QUICK_LINKS_MODEL, IG_LINK_MODEL, DX_QUICK_LINKS, DX_LINK, VENTURE, DX_VIEW } from "../constants";
import { storeFile } from "../save";
import { createDirectoryIfNotExists, createFile } from "../extract/index";
import { getEntries } from "../api/managementApi";
import * as path from "node:path";
import { createEnvironmentVisibility, createSessionVisibility, extractRawVentureAndJurisdiction, KNOWN_NA_VENTURES, remapVentureAndJurisdiction, retrieveModelRecords, transformPlatform, venturesKeyNameMaps } from "../utils/igPropertyUtils";

const getMappedVentureAndJurisdiction = (title) => {
    const { rawVenture, rawJurisdiction } = extractRawVentureAndJurisdiction(title);
    return remapVentureAndJurisdiction(rawVenture, rawJurisdiction);
}

// returns a mapping { ventureId_dxQuickLinkId: {dxEntryTitle, dxLinks[]}}
function getDxQuickLinkMapFromDxView(
    spaceLocale: string,
    dxViewRecords: contentful.Entry[],
    dxQuickLinksEntries: contentful.Entry[],
    venturesMap: { ventureByName: Record<string, string> }
): Record<string, { dxQuickLinkEntryTitle: string, dxLinks: string[] }> {
    const dxQuickLinkIds = new Set(dxQuickLinksEntries.map(e => e.sys.id));
    const dxQuickLinkEntryById = dxQuickLinksEntries.reduce((acc, entry) => {
        acc[entry.sys.id] = entry;
        return acc;
    }, {} as Record<string, contentful.Entry>);

    const output: Record<string, { dxQuickLinkEntryTitle: string, dxLinks: string[] }> = {};

    for (const item of dxViewRecords) {
        const fields = item.fields || {};
        const entryTitle = fields.entryTitle?.[spaceLocale] || '';
        const { venture } = getMappedVentureAndJurisdiction(entryTitle);
        const ventureId = venturesMap.ventureByName[venture];
        if (!ventureId) continue;

        const topContentRefs = fields.topContent?.[spaceLocale] || [];
        for (const ref of topContentRefs) {
            const refId = ref?.sys?.id;
            if (!refId || !dxQuickLinkIds.has(refId)) continue;

            const dxQuickLink = dxQuickLinkEntryById[refId];
            if (!dxQuickLink) continue;

            const key = `${refId}_${ventureId}`;
            const qlFields = dxQuickLink.fields || {};
            const dxQuickLinkEntryTitle = qlFields.entryTitle?.[spaceLocale] || '';
            const dxLinks = (qlFields.dxLinks?.[spaceLocale] || [])
                .map((link: any) => link?.sys?.id)
                .filter((id: string) => typeof id === 'string');

            output[key] = {
                dxQuickLinkEntryTitle,
                dxLinks
            };
        }
    }

    return output;
}


export const retrieveAndFilterModelByEntryTitle = async (model, spaceLocale) => {
    const dxModel = await retrieveModelRecords(model);
    return dxModel.filter(entry => {
        const title = entry.fields.entryTitle?.[spaceLocale] ?? '';
        // ensure it has *both* [casino] AND [web], anywhere in the string
        return title.includes('[casino]') && title.includes('[web]');
    });
}

const extractTitleAndVenture = (title: string): { baseTitle: string, ventureName: string | null } => {
    const match = title.match(/^(.*?)\s*\[(.*?)\]\s*$/);
    if (!match) return { baseTitle: title.trim(), ventureName: null };
    return { baseTitle: match[1].trim(), ventureName: match[2].trim() };
};

// Description: This file contains the function to transform quick links in the new lobby design.
export default async (spaceLocale: string, spaceFolder: string) => {
    try {
        // get the ventures and make a venture map
        const ventures: contentful.Entry[] = await getEntries(VENTURE);
        const igLinks: contentful.Entry[] = await getEntries(IG_LINK_MODEL);
        const dxLinks = await retrieveAndFilterModelByEntryTitle(DX_LINK, spaceLocale);

        const venturesMap = venturesKeyNameMaps(spaceLocale, ventures);
        // get and filter the dxQuickLinks
        const dxQuickLinks = await retrieveAndFilterModelByEntryTitle(DX_QUICK_LINKS, spaceLocale);
        const dxView = await retrieveAndFilterModelByEntryTitle(DX_VIEW, spaceLocale);
        // Gets the dxViews and make an object map
        const ventureDxQuckLinkMapping = await getDxQuickLinkMapFromDxView(spaceLocale, dxView, dxQuickLinks, venturesMap);

        // make a new igLinkObject (from the dxQuickLink)

        const knownVentureIds = new Set(
            KNOWN_NA_VENTURES.map(v => venturesMap.ventureByName[v]).filter(Boolean)
        );

        // Pre-index IG Links by venture and cleaned title
        const igLinkIndex = igLinks.reduce((acc, entry) => {
            const rawTitle = entry?.fields?.entryTitle?.[spaceLocale];
            if (!rawTitle) return acc;

            const { baseTitle, ventureName } = extractTitleAndVenture(rawTitle);
            if (!ventureName) return acc;

            acc[ventureName] = acc[ventureName] || {};
            acc[ventureName][baseTitle] = entry;

            return acc;
        }, {} as Record<string, Record<string, contentful.Entry>>);

        // Now build igQuickLinks, injecting links inline
        const igQuickLinks = [];

        for (const [key, data] of Object.entries(ventureDxQuckLinkMapping)) {
            const [dxQuickLinkId, ventureId] = key.split('_');
            const ventureName = venturesMap.ventureById[ventureId];
            if (!knownVentureIds.has(ventureId) || !ventureName) continue;

            // resolve IG Links from DX links
            const resolvedIgLinks = data.dxLinks.map((dxLinkId: string) => {
                const dxLink = dxLinks.find(d => d.sys.id === dxLinkId);
                if (!dxLink) return null;

                const dxLinkTitle = dxLink.fields?.title?.[spaceLocale];
                if (!dxLinkTitle) return null;

                const { baseTitle } = extractTitleAndVenture(dxLinkTitle);
                const matchedIgLink = igLinkIndex?.[ventureName]?.[baseTitle];

                return matchedIgLink
                    ? {
                        sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: matchedIgLink.sys.id,
                        }
                    }
                    : null;
            }).filter(Boolean); // remove nulls

            const igQuickLink = {
                fields: {
                    entryTitle: {
                        [spaceLocale]: `${data.dxQuickLinkEntryTitle} {${ventureName}}`
                    },
                    layoutType: {
                        [spaceLocale]: 'carousel-pill'
                    },
                    links: {
                        [spaceLocale]: resolvedIgLinks
                    },
                    environmentVisibility: createEnvironmentVisibility(spaceLocale),
                    platformVisibility: transformPlatform(spaceLocale),
                    sessionVisibility: createSessionVisibility(spaceLocale),
                }
            };

            igQuickLinks.push(igQuickLink);
        }

        await createDirectoryIfNotExists(IG_QUICK_LINKS_MODEL, spaceFolder);
        const fileName = path.join(`./src/naNewLobbyDesign/data/${DX_QUICK_LINKS}/${spaceFolder}`, `${IG_QUICK_LINKS_MODEL}.json`);
        await createFile(fileName);
        await storeFile(igQuickLinks, fileName);
        log(`Quick links transformed and stored successfully.`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
}

// transform/transformGridA.js

import { readJSONFile, writeJSONFile } from "../utils/fileOperations";
import { SECTION, IG_SECTION_WITHOUT_CAROUSEL, VENTURE, SITE_GAME_V2 } from "../constants";
import { getEntries } from "../api/managementApi";
import { transformPlatform, createSingleLayoutType, filterTitle, retrieveModelRecords, venturesKeyNameMaps, createViewAllType, desktopEntriesOnly, transformNameToSlug, createViewAllActionText, createExpandedSectionLayoutType, extractVentureFromTitle, createEnvironmentVisibility, createSessionVisibility } from "../utils/igPropertyUtils";

const filterSiteGamesV2 = (games: any[], siteGamesV2IDs: { has: (arg0: any) => any; }) => {
  return games.filter(game => siteGamesV2IDs.has(game.sys.id));
};

export default async (spaceLocale: any, spaceFolder: any) => {
  try {
    const siteGamesV2 = await retrieveModelRecords(SITE_GAME_V2);
    const sections = await readJSONFile(`./src/euNewLobbyDesign/data/${SECTION}/${spaceFolder}/${SECTION}.json`);
    const ventures = await retrieveModelRecords(VENTURE);

    const desktopGameSections = desktopEntriesOnly(sections, spaceLocale);

    const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;

    const siteGamesV2IDs = new Set(siteGamesV2.map(item => item.sys.id));
    const transformedSectionGridA = transformGridA(desktopGameSections, siteGamesV2IDs, spaceLocale, ventures_map);
    await writeJSONFile(`./src/euNewLobbyDesign/data/${SECTION}/${spaceFolder}/${IG_SECTION_WITHOUT_CAROUSEL}.json`, { entries: transformedSectionGridA });
  } catch (error) {
    console.error(`Error processing section games for GridA: ${error}`);
    throw error;
  }
};

const transformGridA = (sections, siteGamesV2IDs, spaceLocale, ventures_map) => {
  return sections
    .filter(section => {
      // Ignore sections that meet any of these conditions
      if (!section.fields.games || section.fields.games?.[spaceLocale].length === 0) return false;
      if (section.fields?.carousel?.[spaceLocale]) return false;
      if (section.fields.type?.[spaceLocale] === "personal-suggested-games") return false;

      return true;
    })
    .map(section => {

      // This can be in the format "onsite-video-banner-video [helloworld] [Desktop] [jackpotjoy]"
      const entryTitle = section.fields.entryTitle[spaceLocale];
      const ventureId = extractVentureFromTitle(entryTitle, ventures_map);

      // Find matches
      const gameFields = section.fields?.games?.[spaceLocale] || [];
      const filteredSiteGames = filterSiteGamesV2(gameFields, siteGamesV2IDs);
      const sectionName = section.fields?.name?.[spaceLocale];
      const validatedSlug = transformNameToSlug(sectionName);

      return {
        fields: {
          entryTitle: filterTitle(spaceLocale, section),
          title: section.fields.title,
          platformVisibility: transformPlatform(spaceLocale),
          environmentVisibility: section.fields.environment || createEnvironmentVisibility(spaceLocale),
          venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
          games: { [spaceLocale]: filteredSiteGames },
          sessionVisibility: section.fields?.show || createSessionVisibility(spaceLocale),
          layoutType: createSingleLayoutType(spaceLocale, 'grid-a'),
          viewAllType: createViewAllType(spaceLocale),
          viewAllActionText: createViewAllActionText(spaceLocale, 'View All'),
          expandedSectionLayoutType: createExpandedSectionLayoutType(spaceLocale, 'grid-a'),
          slug: { [spaceLocale]: validatedSlug }
        }
      }
    });
};

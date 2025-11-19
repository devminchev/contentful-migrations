// transform/transformJackpotSections.js

import { readJSONFile, writeJSONFile } from "../utils/fileOperations";
import { VENTURE, SITE_GAME_V2, SECTION, IG_JACKPOTS_SECTION, EU_JACKPOT_SECTIONS, JACKPOT_TYPES }  from "../constants";
import { filterTitle, transformPlatform, retrieveModelRecords, venturesKeyNameMaps, createViewAllType, createEnvironmentVisibility, filterOutNonDesktopEntries, setDefaultDisplayInline, extractVentureFromTitle, JACKPOT_SECTION_NAMES, transformNameToSlug, createViewAllActionText, createExpandedSectionLayoutType } from '../utils/igPropertyUtils';

export default async (spaceLocale, spaceFolder) => {
  try {
    const siteGamesV2 = await retrieveModelRecords(SITE_GAME_V2);
    const sections = await readJSONFile(`./src/euNewLobbyDesign/data/${SECTION}/${spaceFolder}/${SECTION}.json`);
    const ventures = await retrieveModelRecords(VENTURE);
    const jackpotSections = await retrieveModelRecords(EU_JACKPOT_SECTIONS);

    const allJackpotSections = [...sections.entries, ...jackpotSections];

    const transformedJackpotSections = transformJackpotSections(allJackpotSections, spaceLocale, siteGamesV2, ventures);
    await writeJSONFile(`./src/euNewLobbyDesign/data/${SECTION}/${spaceFolder}/${IG_JACKPOTS_SECTION}.json`, { entries: transformedJackpotSections });
  } catch (error) {
    console.error(`Error processing jackpot sections: ${error}`);
    throw error;
  }
};

const transformJackpotSections = (sections, spaceLocale, siteGamesV2, ventures) => {
  const jackpotSections = sections.filter(section =>
    (section.fields.type && section.fields.type?.[spaceLocale] && section.fields.type?.[spaceLocale].includes('-jackpots')) ||
    (section.fields.name && JACKPOT_SECTION_NAMES.includes(section.fields.name[spaceLocale]))
  );

  console.log(`Found ${jackpotSections.length} jackpot sections to transform.`);

  const desktopJackpotEntries = jackpotSections.filter(entry =>
    filterOutNonDesktopEntries(entry.fields?.entryTitle?.[spaceLocale])
  );

  console.log(`Found ${desktopJackpotEntries.length} jackpot desktop sections to transform.`);

  const siteGamesV2IDs = new Set(siteGamesV2.map(item => item.sys.id));
  const modelGameIds = new Set(desktopJackpotEntries.flatMap(item =>
    (item.fields?.games?.[spaceLocale] || []).map(game => game.sys?.id)
  ));

  const ventures_map = (venturesKeyNameMaps(spaceLocale, ventures)).ventureByName;


  return desktopJackpotEntries.map(section => {
    const gameFields = section.fields?.games?.[spaceLocale] || [];
    const filteredSiteGames = filterSiteGamesV2(gameFields, siteGamesV2IDs, modelGameIds);

    const entryTitle = section.fields.entryTitle[spaceLocale];

    const ventureId = extractVentureFromTitle(entryTitle, ventures_map);
    const sectionName = section.fields?.name?.[spaceLocale] || '';
    const validatedSlug = transformNameToSlug(sectionName);

    return ({
      fields: {
        entryTitle: filterTitle(spaceLocale, section),
        title: section.fields.title,
        slug: { [spaceLocale]: validatedSlug },
        jackpotType: { [spaceLocale]: jpType(section.fields.type?.[spaceLocale]) },
        ...(section?.fields?.headlessJackpot && { headlessJackpot: section.fields.headlessJackpot }),
        environmentVisibility: createEnvironmentVisibility(spaceLocale),
        platformVisibility: transformPlatform(spaceLocale),
        sessionVisibility: section.fields.show || { [spaceLocale]: ['loggedIn', 'loggedOut'] },
        venture: { [spaceLocale]: { "sys": { "type": "Link", "linkType": "Entry", "id": ventureId } } },
        games: { [spaceLocale]: filteredSiteGames },
        viewAllActionText: createViewAllActionText(spaceLocale, 'View All'),
        viewAllType: createViewAllType(spaceLocale),
        expandedSectionLayoutType: createExpandedSectionLayoutType(spaceLocale, 'grid-a-expanded-jackpot'),
      }
    })
  });
};

const jpType = (type) => {
  if (JACKPOT_TYPES.includes(type)) {
    return type;
  }

  return 'generic';
};


const filterSiteGamesV2 = (games, siteGamesV2IDs, modelGameIds) => {
  return games.filter(game => siteGamesV2IDs.has(game.sys.id) && modelGameIds.has(game.sys.id));
};

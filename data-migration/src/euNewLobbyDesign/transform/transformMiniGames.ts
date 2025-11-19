// transform/transformMiniGames.js

import { readJSONFile, writeJSONFile } from "../utils/fileOperations";
import { MINI_GAMES, IG_MINI_GAMES, CAROUSEL_A_SECTIONS, IG_CAROUSEL_A_SECTIONS } from "../constants";
import { transformPlatform, retrieveModelRecords } from "../utils/igPropertyUtils";

export default async (spaceLocale: string | number, spaceFolder: any) => {
  try {
    const miniGames = await readJSONFile(`./src/euNewLobbyDesign/data/${MINI_GAMES}/${spaceFolder}/${MINI_GAMES}.json`);
    const carouselASections = await readJSONFile(`./src/euNewLobbyDesign/data/${CAROUSEL_A_SECTIONS}/production/${CAROUSEL_A_SECTIONS}.json`);
    const igCarouselA = await retrieveModelRecords(IG_CAROUSEL_A_SECTIONS) || [];

    const transformedMiniGames = transformMiniGames(miniGames.entries, carouselASections.entries, igCarouselA, spaceLocale);
    await writeJSONFile(`./src/euNewLobbyDesign/data/${MINI_GAMES}/${spaceFolder}/${IG_MINI_GAMES}.json`, { entries: transformedMiniGames });
  } catch (error) {
    console.error(`Error processing mini games: ${error}`);
    throw error;
  }
};

const createNewMiniGamesSectionsMap = (spaceLocale, linkedTitles, igCarouselA) => {
  const igSections = igCarouselA?.filter(item => {
    const entryTitle = item?.fields?.entryTitle?.[spaceLocale];

    return linkedTitles.includes(entryTitle);
  })?.map(item => ({ "sys": { "type": "Link", "linkType": "Entry", "id": item?.sys?.id } }))
    .filter(Boolean);

  return igSections;
};


const transformMiniGames = (miniGames, carouselASections, igCarouselA, spaceLocale) => {
  return miniGames.map(miniGame => {

    const sectionIds = miniGame?.fields?.sections?.[spaceLocale]?.map(item => item?.sys?.id);
    const linkedTitles = carouselASections
      .filter(section => sectionIds.includes(section?.sys?.id))
      .map(section => section?.fields?.entryTitle?.[spaceLocale])
      .filter(Boolean); // remove null/undefined titles if needed

    const igLinkedCarousel = createNewMiniGamesSectionsMap(spaceLocale, linkedTitles, igCarouselA);

    return {
      fields: {
        entryTitle: miniGame.fields.entryTitle,
        venture: miniGame.fields.venture,
        sections: { [spaceLocale]: igLinkedCarousel },
        platformVisibility: transformPlatform(spaceLocale),
        environmentVisibility: miniGame.fields.environment || {
          [spaceLocale]: ["staging"]
        }
      }
    }
  });
};

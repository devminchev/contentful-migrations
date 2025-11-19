import { SECTION } from "../constants.js";
import { readFile } from "node:fs/promises";

export default async (spaceFolder, spaceLocale, siteGames) => {
  const sections = JSON.parse(
    await readFile(
      `./src/gameModelV2/data/gamev1/${spaceFolder}/${SECTION}.json`,
      "utf-8"
    )
  );
  sections.entries = sections.entries
    .filter(
      (sectionEntry) =>
        sectionEntry.fields.games &&
        sectionEntry.fields.games[spaceLocale].length
    )
    .map((sectionEntry) => {
      if (sectionEntry.fields.games) {
        sectionEntry.fields.games = {
          [spaceLocale]: sectionEntry.fields.games[spaceLocale]
            .map((sectionGame) => {
              const matchedSiteGame = siteGames.entries.find(
                (siteGame) => siteGame.sys.id === sectionGame.sys.id
              );
              return matchedSiteGame;
            })
            .filter((sectionGame) => sectionGame),
        };
      }
      return sectionEntry;
    });

  return sections;
};

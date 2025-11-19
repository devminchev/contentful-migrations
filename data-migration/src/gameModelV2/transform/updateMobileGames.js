import { readFile } from "node:fs/promises";
import { SITE_GAME, GAME_CONFIG, GAME } from "../constants.js";

export default async (gamesV2, spaceFolder) => {
  const siteGames = JSON.parse(
    await readFile(
      `./src/gameModelV2/data/gamev1/${spaceFolder}/${SITE_GAME}.json`,
      "utf-8"
    )
  );

  console.log(`--------------------------------`);
  console.log("Comparing mobile games");
  console.log(`--------------------------------`);

  // A list of games with fields needed to populate Game Platform Config
  const mobileOverrideGames = await getMobileOverrideGames(spaceFolder);

  // A list of mobile games and it's desktop game equivalent
  const mobileGameMapping = mapMobileGamesToDesktopGames(
    mobileOverrideGames,
    siteGames
  );

  // Update V2 Games with it's mobile fields
  const updatedMobileGames = updateMobileOverrideGames(
    gamesV2,
    mobileGameMapping
  );

  // Filter any mobile specific games (1284)
  const updatedGames = filterMobileSpecificGames(updatedMobileGames);

  return updatedGames;
};

const getMobileOverrideGames = async (spaceFolder) => {
  const mobileSiteGames = JSON.parse(
    await readFile(
      `./src/gameModelV2/data/gamev1/${spaceFolder}/${SITE_GAME}-mobile.json`,
      "utf-8"
    )
  );
  const gameConfigs = JSON.parse(
    await readFile(
      `./src/gameModelV2/data/gamev1/${spaceFolder}/${GAME_CONFIG}.json`,
      "utf-8"
    )
  );
  const games = JSON.parse(
    await readFile(
      `./src/gameModelV2/data/gamev1/${spaceFolder}/${GAME}.json`,
      "utf-8"
    )
  );

  const mobileOverrideGames = []; // A list of games with fields needed to populate Game Platform Config

  // Get GameLoaderFileName (found within GameConfig) for each Site-Game and add it to mobileOverrideGames
  for (siteGame of mobileSiteGames.entries) {
    if (!siteGame.fields.game) continue;

    const localeKey = Object.keys(siteGame?.fields?.game).find(
      (key) => key !== "sys"
    );

    if (!siteGame.fields.game[localeKey]) continue;
    const gameId = siteGame?.fields?.game?.[localeKey]?.sys?.id ?? undefined;

    let gameSkin;

    if (gameId) {
      const matchingGame = games.entries.find((game) => {
        return game?.sys?.id === gameId;
      });

      const matchingGameConfig = matchingGame?.fields?.gameConfig;
      if (!matchingGameConfig) continue;

      const matchingGameConfigLocale = Object.keys(matchingGameConfig).find(
        (key) => key !== "sys"
      );
      const matchingGameConfigID =
        matchingGameConfig?.[matchingGameConfigLocale]?.sys?.id ?? undefined;

      if (matchingGameConfigID) {
        const matchingGameConfig = gameConfigs.entries.find((gameConfig) => {
          return gameConfig?.sys?.id === matchingGameConfigID;
        });

        gameSkin = matchingGameConfig.fields?.gameSkin[localeKey][0];
      }
    }
    const { name, demoUrl, realUrl, gameLoaderFileName } = siteGame?.fields;

    mobileOverrideGames.push({
      name: name && name[localeKey] ? name[localeKey] : "",
      demoUrl: demoUrl && demoUrl[localeKey] ? demoUrl[localeKey] : "",
      realUrl: realUrl && realUrl[localeKey] ? realUrl[localeKey] : "",
      gameLoaderFileName:
        gameLoaderFileName && gameLoaderFileName[localeKey]
          ? gameLoaderFileName[localeKey]
          : "",
      gameSkin,
      sysID: siteGame?.sys?.id,
    });
  }

  // Filter for any duplicates
  for (const mobileGame of mobileOverrideGames) {
    const currentIndex = mobileOverrideGames.indexOf(mobileGame);
    const foundIndex = mobileOverrideGames.findIndex(
      (currentMobileGame, index) => {
        if (index !== currentIndex) {
          // Compare games without considering sysID
          const { sysID, ...gameFields } = mobileGame;
          const currGame = {
            name: currentMobileGame.name,
            demoUrl: currentMobileGame.demoUrl,
            realUrl: currentMobileGame.realUrl,
            gameLoaderFileName: currentMobileGame.gameLoaderFileName,
            gameSkin: currentMobileGame.gameSkin,
          };
          return JSON.stringify(currGame) === JSON.stringify(gameFields);
        }
      }
    );

    if (foundIndex !== -1) {
      mobileOverrideGames.splice(currentIndex, 1);
    }
  }

  return mobileOverrideGames;
};

const mapMobileGamesToDesktopGames = (mobileGames, siteGames) => {
  const mapping = [];

  // filter out mobile games
  const filteredSiteGames = siteGames.entries.filter((siteGame) => {
    const nameValues = Object.values(siteGame.fields.name);
    return !nameValues.some((name) => name.endsWith("-m"));
  });

  for (const mobileGame of mobileGames) {
    const { name, sysID } = mobileGame;

    const matchingDesktopSiteGame = filteredSiteGames.find((game) => {
      const gameName = Object.values(game?.fields?.name)[0];

      // example
      // play-gonzos-quest-m with
      // play-gonzos-quest-megaways

      // play-gonzos-double-bubble-m with
      // play-gonzos-double-bubble

      // compare play-double-bubble-m (without the -m) with play-double-bubble
      return name.slice(0, -2) === gameName;
    });

    if (matchingDesktopSiteGame) {
      mapping.push({
        ...mobileGame,
        desktopGame: Object.values(matchingDesktopSiteGame.fields.name)[0],
        desktopSysID: matchingDesktopSiteGame.sys.id,
      });
    } else {
      // special edge cases for inconsistent naming in contentful :-(
      const matchingGame = filteredSiteGames.find((game) => {
        const gameName = Object.values(game?.fields?.name)[0];
        const lastIndex = gameName.lastIndexOf("-");
        const result = gameName.substring(0, lastIndex);

        // example
        // play-gonzos-quest-m with
        // play-gonzos-quest-megaways
        return name.slice(0, -2) === result;
      });

      if (matchingGame) {
        mapping.push({
          ...mobileGame,
          desktopGame: Object.values(matchingGame.fields.name)[0],
          desktopSysID: matchingGame.sys.id,
        });
      }
    }
  }

  return mapping;
};

const updateMobileOverrideGames = (gamesV2, mobileGameMapping) => {
  // Go through each mobileGame
  for (mobileGame of mobileGameMapping) {
    const { desktopGame, desktopSysID } = mobileGame;

    // Find the game in gamesV2
    const matchingV2Game = gamesV2.find((gameV2) => {
      const { gamePlatformConfig } = gameV2.fields;
      const locale = Object.keys(gamePlatformConfig)[0];
      const name = gamePlatformConfig[locale]?.name;

      return name && name === desktopGame;
    });

    if (matchingV2Game) {
      // Update that game with mobile game mappings
      Object.entries(matchingV2Game.fields.gamePlatformConfig).forEach(
        ([language, value]) => {
          if (value.name) {
            matchingV2Game.fields.gamePlatformConfig[language] = {
              mobileOverride: true,
              name: value.name,
              demoUrl: value.demoUrl,
              realUrl: value.realUrl,
              gameSkin: value.gameSkin,
              gameLoaderFileName: value.gameLoaderFileName,
              mobileName: mobileGame.name,
              mobileDemoUrl: mobileGame.demoUrl,
              mobileRealUrl: mobileGame.realUrl,
              mobileGameSkin: mobileGame.gameSkin,
              mobileGameLoaderFileName: mobileGame.gameLoaderFileName,
            };
          }
        }
      );

      Object.entries(matchingV2Game.fields.platform).forEach(([language]) => {
        matchingV2Game.fields.platform[language] = [
          "Phone",
          "Tablet",
          "Desktop",
        ];
      });
    }
  }

  return gamesV2;
};

const filterMobileSpecificGames = (updatedMobileGames) => {
  for (let i = 0; i < updatedMobileGames.length; i++) {
    const object = updatedMobileGames[i];
    const gamePlatformConfig = object.fields.gamePlatformConfig;

    let shouldRemove = Object.entries(gamePlatformConfig).some(([language]) => {
      return (
        gamePlatformConfig[language]?.name &&
        gamePlatformConfig[language]?.name.endsWith("-m")
      );
    });

    if (shouldRemove) {
      updatedMobileGames.splice(i, 1);
      i--; // Adjust the index to account for the removed element
    }
  }

  return updatedMobileGames;
};

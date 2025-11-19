import { readJSONFile } from "../utils/fileOperations.js";
import { log } from "../utils/logging.js";
import { GAME, GAME_INFO, GAME_CONFIG, GAME_V2, ES_VENTURES, NA_VENTURES, CA_VENTURES, SITE_GAME, LOCALIZED_GAME_FIELDS } from "../constants.js";

import { getGameSkin, getGameInfo, getPlatformFromGame, getSiteGameDetailsFromGame, getGamePlatformConfig } from "./getFields.js";
import getSections from "./getSections.js";
import storeFile from "../save/index.js";
import updateMobileGames from "./updateMobileGames.js";

const GAMES_VENDOR_MAP = new Map();
const VENDOR_SITEGAMES = {};
const BROKEN_GAMES = [
    'play-white-rabbit-megaways',
    'play-medusa-queen-of-stone',
    'play-stellar-7s',
    'play-area-cash-thor',
    'play-9-enchanted-beans',
    'ORY_GAM_BOOKS_AND_BULLS',
    'play-canales-rivera-feria-de-abril',
    'play-area-link-piggy-bank',
    'play-fish-em-up',
    'play-amazing-link-medusa'
];

const BROKEN_GAMES_TITLES = {
    'play-white-rabbit-megaways': 'White Rabbit Megaways',
    'play-medusa-queen-of-stone': 'Medusa: Queen of Stone',
    'play-stellar-7s': `Stellar 7's`,
    'play-area-cash-thor': 'Area Cash Thor',
    'play-9-enchanted-beans': '9 Enchanted Beans',
    'ORY_GAM_BOOKS_AND_BULLS': 'Books and Bulls',
    'play-canales-rivera-feria-de-abril': 'Canales Rivera Feria De Abril',
    'play-area-link-piggy-bank': 'Area Link Piggy Bank',
    'play-fish-em-up': 'Fish Em Up',
    'play-amazing-link-medusa': 'Amazing Link Medusa',
}

const getLocaleFromEntryTitle = (entryTitle) => {
    const esRegex = new RegExp(ES_VENTURES.join("|"), "i");
    const naRegex = new RegExp(NA_VENTURES.join("|"), "i");
    const caRegex = new RegExp(CA_VENTURES.join("|"), "i");

    if (esRegex.test(entryTitle)) {
        return "es";
    }

    if (naRegex.test(entryTitle)) {
        return "en-US";
    }

    if (caRegex.test(entryTitle)) {
        return "en-CA";
    }

    return "en-GB";
};

const removeVentureAndLocaleInEntryTitle = (entryTitle, spaceLocale) => {
    if (!entryTitle) {
        return "";
    }

    return { [spaceLocale]: entryTitle.replace(/\[.*?\]/g, "").trim() };
};

const mergeGameEntries = (gamesV2Entries, spaceLocale) => {
    const mergedGameEntries = gamesV2Entries.reduce((acc, curr) => {
        const keys = Object.keys(curr.fields).filter((key) => key !== "gameLocale");

        keys.forEach((keyToMerge) => {
            const entryTitle = curr.fields.entryTitle[spaceLocale];

            if (!acc[entryTitle]) {
                acc[entryTitle] = {
                    entryTitle: { [spaceLocale]: entryTitle },
                };
            }

            if (!acc[entryTitle][keyToMerge]) {
                acc[entryTitle][keyToMerge] = {
                    ...curr.fields[keyToMerge],
                };
            }

            if (
                curr.fields[keyToMerge] &&
                curr.fields[keyToMerge].hasOwnProperty(curr.fields.gameLocale)
            ) {
                acc[entryTitle][keyToMerge][curr.fields.gameLocale] =
                    curr.fields[keyToMerge][curr.fields.gameLocale];
            }
        });
        return acc;
    }, {});

    return Object.values(removeInvalidRegionFields(mergedGameEntries, spaceLocale)).map(item => ({ fields: item }));
};

const removeInvalidRegionFields = (mergedGameEntries, spaceLocale) => {
    return Object.values(mergedGameEntries).map((game) => {
        const updatedGame = { ...game };

        Object.entries(updatedGame).forEach(([key, value]) => {
            if (key === "maxBet" && value[spaceLocale]) {
                if (value[spaceLocale].includes("€")) {
                    Object.entries(updatedGame).forEach(([key, value]) => {
                        if (LOCALIZED_GAME_FIELDS.includes(key)) {
                            value[spaceLocale] = "TBC - Game not available in this region";
                        }
                    });
                }
            }
        });

        return updatedGame;
    });
};

const expandGamesByVendor = (gamesArr, GAMES_VENDOR_MAP, spaceLocale) => {
    const expandedGames = [];

    gamesArr.forEach(game => {
        const title = game.fields.entryTitle[spaceLocale];
        if (GAMES_VENDOR_MAP.has(title)) {
            if (GAMES_VENDOR_MAP.get(title).size > 1) {
                GAMES_VENDOR_MAP.get(title).forEach(vendor => {
                    expandedGames.push({
                        ...game,
                        fields: {
                            ...game.fields,
                            entryTitle: {
                                [spaceLocale]: `${title}_${vendor}`
                            },
                            vendor: {
                                [spaceLocale]: vendor
                            }
                        }
                    });
                });
            } else {
                expandedGames.push(game);
            }
        }
    });

    return expandedGames;
};

const getSitegameVenture = (str) => {
    const match = str.match(/\[(.*?)\]/);
    return match ? match[1] : null;
};

const removeSingleVendors = (vendorMap) => {
    Object.keys(vendorMap).forEach(key => {
        const vendors = vendorMap[key].map(entry => entry.vendor);
        if (new Set(vendors).size === 1) {
            delete vendorMap[key];
        }
    });
};

export default async (spaceLocale, spaceFolder) => {
    try {
        const gameInfos = await readJSONFile(`./src/gameModelV2/data/gamev1/${spaceFolder}/${GAME_INFO}.json`);
        const gameConfigs = await readJSONFile(`./src/gameModelV2/data/gamev1/${spaceFolder}/${GAME_CONFIG}.json`);
        const games = await readJSONFile(`./src/gameModelV2/data/gamev1/${spaceFolder}/${GAME}.json`);
        const siteGames = await readJSONFile(`./src/gameModelV2/data/gamev1/${spaceFolder}/${SITE_GAME}.json`);
        const sections = await getSections(spaceFolder, spaceLocale, siteGames);

        let gamesV2Entries = [];
        let totalTime = 0;

        for (const game of games.entries) {
            // const gameEntryTitle = game.fields.entryTitle[spaceLocale];
            // const isBrokenGame = BROKEN_GAMES.some(brokenGame => gameEntryTitle.includes(brokenGame));
            // if (!isBrokenGame) {
            //     continue;
            // };

            const i = games.entries.indexOf(game);
            const start = new Date();
            const gameLocale = getLocaleFromEntryTitle(game?.fields?.entryTitle[spaceLocale]);
            const siteGameDetails = getSiteGameDetailsFromGame(game, siteGames.entries, spaceLocale);
            const platform = getPlatformFromGame(siteGameDetails, sections, spaceLocale);

            const originalGameEntryTitle = game?.fields?.entryTitle[spaceLocale];
            const entryTitle = removeVentureAndLocaleInEntryTitle(originalGameEntryTitle, spaceLocale);

            if (siteGameDetails.fields?.vendor && siteGameDetails.fields?.entryTitle) {
                if (!VENDOR_SITEGAMES[entryTitle[spaceLocale]]) {
                    VENDOR_SITEGAMES[entryTitle[spaceLocale]] = [{
                        vendor: siteGameDetails.fields.vendor[spaceLocale],
                        sitegame: getSitegameVenture(siteGameDetails.fields.entryTitle[spaceLocale])
                    }];
                } else {
                    VENDOR_SITEGAMES[entryTitle[spaceLocale]].push({
                        vendor: siteGameDetails.fields.vendor[spaceLocale],
                        sitegame: getSitegameVenture(siteGameDetails.fields.entryTitle[spaceLocale])
                    });
                }
            }

            if (!(game.fields.gameConfig && game.fields.gameInfo) || !platform) {
                continue;
            }

            const gameSkin = getGameSkin(game.fields.gameConfig, gameConfigs.entries, spaceLocale);
            const gameInfo = getGameInfo(game.fields.gameInfo, gameInfos.entries, gameLocale, spaceLocale, gameSkin[spaceLocale]);
            const gamePlatformConfig = getGamePlatformConfig(gameSkin, siteGameDetails, spaceLocale);

            if (!GAMES_VENDOR_MAP.has(entryTitle[spaceLocale])) {
                GAMES_VENDOR_MAP.set(entryTitle[spaceLocale], new Set([siteGameDetails.fields.vendor[spaceLocale]]));
            } else {
                GAMES_VENDOR_MAP.get(entryTitle[spaceLocale]).add(siteGameDetails.fields.vendor[spaceLocale]);
            }

            // if (!gameInfo.title) {
            //     continue;
            // };
            const newGamePayload = {
                fields: {
                    gameLocale,
                    entryTitle,
                    gamePlatformConfig,
                    platform,
                    vendor: siteGameDetails.fields.vendor || { [spaceLocale]: false },
                    showGameName: siteGameDetails.fields.showGameName || { [spaceLocale]: false },
                    progressiveJackpot: gameInfo.progressiveJackpot || { [spaceLocale]: false },
                    operatorBarDisabled: siteGameDetails.fields.operatorBarDisabled || { [spaceLocale]: false },
                    rgpEnabled: siteGameDetails.fields.rgpEnabled || { [spaceLocale]: false },
                    funPanelEnabled: siteGameDetails.fields.funPanelEnabled || { [spaceLocale]: false },
                    funPanelDefaultCategory: siteGameDetails.fields.funPanelDefaultCategory,
                    representativeColor: gameInfo.representativeColor,
                    progressiveBackgroundColor: gameInfo.progressiveBackgroundColor,
                    imgUrlPattern: gameInfo.imgUrlPattern,
                    infoImgUrlPattern: gameInfo.infoImgUrlPattern,
                    loggedOutImgUrlPattern: gameInfo.loggedOutImgUrlPattern,
                    funPanelBackgroundImage: siteGameDetails.fields.funPanelBackgroundImage,
                    dfgWeeklyImgUrlPattern: gameInfo.dfgWeeklyImgUrlPattern,
                    videoUrlPattern: gameInfo.videoUrlPattern,
                    title: gameInfo.title,
                    maxBet: gameInfo.maxBet,
                    minBet: gameInfo.minBet,
                    infoDetails: gameInfo.infoDetails,
                    howToPlayContent: gameInfo.howToPlayContent,
                    introductionContent: gameInfo.introductionContent,
                    webComponentData: gameInfo.webComponentData,
                    tags: siteGameDetails.fields.tags,
                    launchCode: '',
                    nativeRequirement: { [spaceLocale]: null }
                }
            };

            gamesV2Entries.push(newGamePayload);

            const end = new Date();
            totalTime += end.getTime() - start.getTime();
            log(`----- Game Progress: ${(((i + 1) / games.entries.length) * 100).toFixed(2)}% - Total Time Taken: ${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s -----`);
        }

        const mergedGameEntries = mergeGameEntries(gamesV2Entries, spaceLocale);
        const updatedMobileAndDesktopGames = await updateMobileGames(mergedGameEntries, spaceFolder);
        const generatedGameV2List = expandGamesByVendor(updatedMobileAndDesktopGames, GAMES_VENDOR_MAP, spaceLocale);

        removeSingleVendors(VENDOR_SITEGAMES);

        await storeFile(VENDOR_SITEGAMES, `./src/gameModelV2/data/gamev2/${spaceFolder}/VENDOR_SITEGAMES.json`);
        await storeFile(generatedGameV2List, `./src/gameModelV2/data/gamev2/${spaceFolder}/${GAME_V2}.json`);
    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

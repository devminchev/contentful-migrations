import { LOCALIZED_GAME_FIELDS }  from "../constants.js";

const getGameSkin = (gameConfigData, allGamesConfig, spaceLocale) => {
    const gameConfig = gameConfigData[spaceLocale];
    if (!gameConfig) {
        return {};
    }

    const { sys: { id: configId } = {} } = gameConfig;
    const game = allGamesConfig.find(({ sys: { id } }) => id === configId);

    if (!game) {
        return {};
    }

    const { fields: { gameSkin } = {} } = game;
    if (!gameSkin || !gameSkin[spaceLocale] || !gameSkin[spaceLocale][0]) {
        return {};
    }

    return { [spaceLocale]: [gameSkin[spaceLocale][0]] };
};

const PLATFORM_MAPPING = {
    'Desktop': ['desktop'],
    'Tablet': ['tablet', 'ipad'],
    'Phone': ['phone', 'native', 'mobile', 'ios'],
};

const getPlatformFromGame = (siteGameDetails, sections, spaceLocale) => {
    const gameNameField = siteGameDetails?.fields?.name;
    if (!gameNameField) {
        return '';
    }

    const siteGameName = gameNameField[spaceLocale];
    if (!siteGameName) {
        return '';
    }

    const sectionsForGame = sections.entries.filter(sectionEntry => {
        try {
            const games = sectionEntry.fields.games[spaceLocale];
            if (!games) {
                console.log('No games', sectionEntry);
                return false;
            }
            return games.some(sectionGame => sectionGame.fields.name[spaceLocale] === siteGameName);
        } catch (error) {
            console.error('Error processing section entry:', error);
            return false;
        }
    });

    const sectionNames = sectionsForGame.map(sectionEntry => sectionEntry.fields.entryTitle[spaceLocale]);

    const arrayOfPlatforms = sectionNames.flatMap(sectionName =>
        Object.entries(PLATFORM_MAPPING)
            .filter(([, values]) => values.some(value => sectionName.includes(`[${value}]`)))
            .map(([key]) => key)
    ).filter((item, index, self) => self.indexOf(item) === index);

    return {
        [spaceLocale]: arrayOfPlatforms.length > 0 ? arrayOfPlatforms : ['Desktop']
    };
};

const populateRequiredLocales = (field, locale) => {
    if (!field) return field;
    if (!field.hasOwnProperty(locale)) {
        field[locale] = field[Object.keys(field)[0]];
    }
    return field;
};

const getUpdatedGameInfo = (gameInfo, gameLocale) => {
    const updatedGameInfo = {};

    for (const key in gameInfo) {
        if (gameInfo.hasOwnProperty(key)) {
            updatedGameInfo[key] = LOCALIZED_GAME_FIELDS.includes(key)
                ? populateRequiredLocales(gameInfo[key], gameLocale)
                : gameInfo[key];
        }
    }

    return updatedGameInfo;
};

const getGameInfo = (gameInfoData, allGamesInfo, gameLocale, spaceLocale, entryTitle) => {
    const gameData = gameInfoData[gameLocale];
    if (!gameData) {
        return {};
    }

    const gameInfo = allGamesInfo.find((game) => game.sys.id === gameData.sys.id)?.fields;
    if (!gameInfo) {
        return {};
    }

    return getUpdatedGameInfo(gameInfo, gameLocale);
};

const getGamePlatformConfig = (gameSkin, siteGame, locale) => {
    const { name, demoUrl, realUrl, gameLoaderFileName } = siteGame.fields;
    const gamePlatformConfig = {};

    gamePlatformConfig[locale] = {
        name: name[locale],
        demoUrl: demoUrl && demoUrl[locale] ? demoUrl[locale] : "",
        realUrl: realUrl && realUrl[locale] ? realUrl[locale] : "",
        gameLoaderFileName: gameLoaderFileName[locale],
        gameSkin: gameSkin && gameSkin[locale] ? gameSkin[locale][0] : "",
    };

    return gamePlatformConfig;
};


const getSiteGameDetailsFromGame = (game, siteGames, spaceLocale) => {
    if (!game?.sys?.id) return {};

    const linkedSiteGame = siteGames.find(siteGame => {
        const siteGameGame = siteGame?.fields?.game?.[spaceLocale];
        return siteGameGame?.sys?.id === game.sys.id;
    });

    return linkedSiteGame ?? {};
};

export {
    getGameSkin,
    getPlatformFromGame,
    getGameInfo,
    getGamePlatformConfig,
    getSiteGameDetailsFromGame
}

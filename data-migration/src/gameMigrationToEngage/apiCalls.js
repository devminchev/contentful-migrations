import { getVentureFromEntryTitle, mergeEntryResponses } from './utils.js';
import { ventures, locales, defaultLocale } from './constants.js';

const getGameEntriesInAllVentures = (title, environment) => {
    const promises = [];
    for (const venture of ventures) {
        promises.push(environment.getEntries({
            'content_type': 'game',
            'fields.entryTitle': `${title} [${venture}]`,
            'sys.archivedAt[exists]': false,
            'include': 10,
            'limit': 1000
        }
        ))
    }
    return Promise.all(promises);
}

function setField(obj, fieldName, locale, value) {
    if (obj[fieldName] && obj[fieldName][locale]) {
        obj[fieldName][locale] = value;
    } else {
        obj[fieldName] = {
            [locale]: value
        }
    }
}

const createSiteGames = async (environment, newEntryTitle, newGameKey, gameKey, games, chatEnabledList) => {
    const siteGames = [];
    const isChatEnabled = !!chatEnabledList;
    const gameEntries = await environment.getEntries({
        'content_type': 'siteGame',
        'fields.name': gameKey,
        'sys.archivedAt[exists]': false,
    }).then((response) => mergeEntryResponses([response]));
    for (const gameEntry of gameEntries) {
        const newGameSiteGameEntry = { ...gameEntry.fields };

        setField(newGameSiteGameEntry, 'entryTitle', defaultLocale, gameEntry.fields.entryTitle[defaultLocale].replace(gameKey, newGameKey));
        setField(newGameSiteGameEntry, 'environment', defaultLocale, ['staging']);
        setField(newGameSiteGameEntry, 'name', defaultLocale, newGameKey);
        setField(newGameSiteGameEntry, 'demoUrl', defaultLocale, (newGameSiteGameEntry.demoUrl && newGameSiteGameEntry.demoUrl[defaultLocale] || "").replace(gameKey, newGameKey));
        setField(newGameSiteGameEntry, 'realUrl', defaultLocale, (newGameSiteGameEntry.realUrl && newGameSiteGameEntry.realUrl[defaultLocale] || "").replace(gameKey, newGameKey));

        setField(newGameSiteGameEntry, 'vendor', defaultLocale, 'engage');

        newGameSiteGameEntry.rgpEnabled = { 'en-GB': true };
        newGameSiteGameEntry.operatorBarDisabled = { 'en-GB': false };

        const venture = getVentureFromEntryTitle(newGameSiteGameEntry.entryTitle[defaultLocale]);

        if (isChatEnabled) {
            for (const chatEnabledVenture of chatEnabledList) {
                if (venture === chatEnabledVenture) {
                    newGameSiteGameEntry.chat = { 'en-GB': { isEnabled: true, controlMobileChat: true } };
                }
            }
        }

        setField(newGameSiteGameEntry, 'gameLoaderFileName', defaultLocale, newEntryTitle);

        for (const game of games) {
            if (game.fields.entryTitle[defaultLocale] === `${newEntryTitle} [${venture}]`) {
                newGameSiteGameEntry.game[defaultLocale].sys.id = game.sys.id;
            }
        }

        const siteGame = await environment.createEntry('siteGame', { fields: newGameSiteGameEntry });
        await siteGame.publish();
        console.log(`Created siteGame: ${newGameSiteGameEntry.entryTitle[defaultLocale]}`);
        siteGames.push(siteGame);
    }
    return siteGames;
}


const createGames = async (gameTitle, newGameTitle, gameEntries, gameConfig, gameInfos, environment) => {
    const games = [];
    for (const gameEntry of gameEntries) {
        const currentFields = gameEntry.fields;
        const newFields = { ...gameEntry.fields };

        newFields.entryTitle[defaultLocale] = currentFields.entryTitle[defaultLocale].replace(gameTitle, newGameTitle);
        newFields.gameConfig[defaultLocale].sys.id = gameConfig.sys.id;

        for (const gameInfo of gameInfos) {
            if (gameInfo.fields.entryTitle[defaultLocale].includes(newFields.entryTitle[defaultLocale])) {
                for (const locale of locales) {
                    if (newFields.gameInfo[locale]) {
                        newFields.gameInfo[locale].sys.id = gameInfo.sys.id;
                    }
                }
            }
        }
        const game = await environment.createEntry('game', { fields: newFields });
        await game.publish();
        console.log(`Created game: ${newFields.entryTitle[defaultLocale]}`)
        games.push(game);
    }
    return games;
}

const createGameConfig = async (newGameTitle, environment) => {
    const gameConfig = await environment.createEntry('gameConfig', {
        fields: {
            entryTitle: { 'en-GB': newGameTitle },
            gameSkin: { 'en-GB': [newGameTitle] }
        }
    });

    await gameConfig.publish();
    console.log(`Created game config: ${newGameTitle}`);
    return gameConfig;
}

const createGameInfos = async (gameTitle, newGameTitle, gameEntries, environment) => {
    const newGameInfos = []
    for (const gameEntry of gameEntries) {
        for (const locale of locales) {
            if (gameEntry.fields.gameInfo[locale]) {
                const gameInfoEntry = await environment.getEntry(gameEntry.fields.gameInfo[locale].sys.id)
                const newGameInfoEntryFields = { ...gameInfoEntry.fields };
                newGameInfoEntryFields.entryTitle[defaultLocale] = gameInfoEntry.fields.entryTitle[defaultLocale].replace(`${gameTitle}`, newGameTitle);
                const newlyCreatedEntry = await environment.createEntry('gameInfo', { fields: newGameInfoEntryFields });
                await newlyCreatedEntry.publish();
                console.log(`Created game info: ${newGameInfoEntryFields.entryTitle[defaultLocale]}`);
                newGameInfos.push(newlyCreatedEntry);
            }
        }
    }
    return newGameInfos;
}

export {
    getGameEntriesInAllVentures,
    createSiteGames,
    createGames,
    createGameConfig,
    createGameInfos
}

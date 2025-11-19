
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import contentful from 'contentful-management';
import { getGameEntriesInAllVentures, createGameConfig, createGameInfos, createGames, createSiteGames } from './apiCalls.js';
import { mergeEntryResponses } from './utils.js';

const script = (async ({ accessToken, env }) => {
    const client = contentful.createClient({
        accessToken: accessToken
    });
    try {
        const space = await client.getSpace('nw2595tc1jdx');
        const environment = await space.getEnvironment(env);
        const inputData = JSON.parse(readFileSync(resolve('src/gameMigrationToEngage/games.json'), 'utf8')).games;

        if (!existsSync('src/gameMigrationToEngage/data')) {
            mkdirSync('src/gameMigrationToEngage/data');
        }

        for (const data of inputData) {
            const { gameSkin, newGameSkin, newGameKey, gameKey, chatEnabledVentures = false } = data;
            const gameEntries = await getGameEntriesInAllVentures(gameSkin, environment).then(mergeEntryResponses) // rename entries
            const gameConfig = await createGameConfig(newGameSkin, environment);
            const gameInfos = await createGameInfos(gameSkin, newGameSkin, gameEntries, environment);
            const games = await createGames(gameSkin, newGameSkin, gameEntries, gameConfig, gameInfos, environment);
            const siteGames = await createSiteGames(environment, newGameSkin, newGameKey, gameKey, games, chatEnabledVentures);
            writeFileSync(`src/gameMigrationToEngage/data/${gameSkin}.json`, JSON.stringify({
                data: {
                    gameSkin: newGameSkin,
                    gameKey: newGameKey,
                    gameConfig,
                    gameInfos,
                    games,
                    siteGames
                }
            }));
            console.log(`Migrated game with: 
                gameSkin: ${gameSkin} to ${newGameSkin}
                gameKey: ${gameKey} to ${newGameKey}
            `);
        }

    } catch (e) {
        console.error(e)
    }
})

export default script;

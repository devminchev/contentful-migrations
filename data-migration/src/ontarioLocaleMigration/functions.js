import { enUSRegex, delay } from './utils.js';

async function getGameInfoEntry(environment, gameInfoId) {
    let gameInfo;
    try {
        gameInfo = await environment.getEntry(gameInfoId);
        console.log(`GI: Retrieved ${gameInfo.fields.entryTitle['en-US']}`);
    } catch (error) {
        console.log(`ERR: GI: Failed to retrieve '${gameInfoId}'`);
    }

    return gameInfo;
}

async function updateGameInfoEntry(gameInfo) {
    let updatedGameInfo;
    try {
        updatedGameInfo = await gameInfo.update();
        console.log(`GI: Updated ${gameInfo.fields.entryTitle['en-US']} v${gameInfo.sys.version} -> v${updatedGameInfo.sys.version}`)
    } catch (error) {
        console.log(`ERR: Failed to update '${gameInfo.fields.entryTitle['en-US']}'`);
    }

    return updatedGameInfo;
}

async function publishGameInfoEntry(gameInfo) {
    try {
        await gameInfo.publish();
        console.log(`GI: Published ${gameInfo.fields.entryTitle['en-US']}`)
    } catch (error) {
        console.log(`ERR: Failed to publish '${gameInfo.fields.entryTitle['en-US']}'`);
    }
}

export async function retrieveUpdateAndPublishGameInfoEntries(environment, gameInfoIds) {
    console.log('////////// Retrieving, Updating and Publishing Game Infos //////////');
    const filteredGameInfoIds = gameInfoIds.filter((id, index) => gameInfoIds.indexOf(id) === index);

    let totalTime = 0;
    for (let i = 0; i < filteredGameInfoIds.length; i++) {
        const start = new Date();
        const gameInfoId = filteredGameInfoIds[i];

        await delay(500);
        const gameInfo = await getGameInfoEntry(environment, gameInfoId);
        const gameInfoEntryTitle = gameInfo.fields.entryTitle['en-US'];
        gameInfo.fields.entryTitle['en-US'] = gameInfoEntryTitle.replace(enUSRegex, '[en-CA]').trim();

        await delay(500);
        let updatedGameInfo = await updateGameInfoEntry(gameInfo);

        if (!updatedGameInfo) {
            console.log('ERR: No updatedGameInfo');
            continue;
        }

        await delay(500);
        await publishGameInfoEntry(updatedGameInfo);

        const end = new Date();
        totalTime += (end.getTime() - start.getTime());
        console.log(`GI: Iteration ${i + 1}/${filteredGameInfoIds.length} '${gameInfo.fields.entryTitle['en-US']}' took: ${(end.getTime() - start.getTime()) / 1000}s`);
        console.log(`----- GI Progress: ${(((i + 1) / filteredGameInfoIds.length) * 100).toFixed(2)}% - Total Time Taken: ${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s -----`);
    }
}

export async function updateAndPublishGameEntries(gameEntriesToUpdate) {
    console.log('////////// Updating and Publishing Games //////////');
    let totalTime = 0;
    for (let i = 0; i < gameEntriesToUpdate.length; i++) {
        const start = new Date();
        const game = gameEntriesToUpdate[i];

        await delay(1000);
        let updatedGame;
        try {
            updatedGame = await game.update();
            console.log(`G: Updated '${game.fields.entryTitle['en-US']}' v${game.sys.version} -> v${updatedGame.sys.version}`)
        } catch (error) {
            console.log(`ERR: Failed to update '${gameEntryTitle}'`);
            console.error(error);
            continue;
        }

        if (!updatedGame) {
            console.log('ERR: No updatedGame');
            continue;
        }
        await delay(1000);
        try {
            await updatedGame.publish();
            console.log(`G: Published '${game.fields.entryTitle['en-US']}'`)
        } catch (error) {
            console.log(`ERR: Failed to publish '${gameEntryTitle}' v${updatedGame.sys.version}`);
            continue;
        }

        const end = new Date();
        totalTime += (end.getTime() - start.getTime());
        console.log(`G: Iteration ${i + 1}/${gameEntriesToUpdate.length} '${game.fields.entryTitle['en-US']}' took: ${(end.getTime() - start.getTime()) / 1000}s`);
        console.log(`----- G Progress: ${(((i + 1) / gameEntriesToUpdate.length) * 100).toFixed(2)}% - Total Time Taken: ${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s -----`);
    }
}


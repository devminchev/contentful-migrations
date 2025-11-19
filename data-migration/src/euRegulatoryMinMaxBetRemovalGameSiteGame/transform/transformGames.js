import { retrieveModelRecords, writeJSONFile } from "../utils/fileOperations.js";
import { log } from "../utils/logging.js";
import { GAME_V2, SITE_GAME_V2 } from "../constants.js";

const UK_LOCALE = 'en-GB';

export default async (spaceLocale, spaceFolder) => {
    try {
        const games = await retrieveModelRecords(GAME_V2);
        const siteGames = await retrieveModelRecords(SITE_GAME_V2);

        let gamesV2Entries = [];
        let siteGameV2Entries = [];
        let totalTime = 0;

        //1. filterOut all non-slot type games;
        const onlySlotGames = games.filter(item => {
            const type = item.fields
                ?.gamePlatformConfig
                ?.[spaceLocale]
                ?.gameType
                ?.type;
            return type?.toLowerCase() === 'slots';
        });
        //2.  get gameIds of all the slotGames so we can grab the siteGames that link to them
        const onlySlotGameIds = onlySlotGames
            .map(item => item.sys?.id)
            .filter(Boolean); // drop any undefined
        //3.  find all the siteGame records for those slot games
        const slotSiteGames = siteGames.filter(siteGame => {
            return siteGame.fields?.game?.[spaceLocale]?.sys?.id || {};
        });

        for (const game of onlySlotGames) {
            const i = onlySlotGames.indexOf(game);
            const start = new Date();

            const gameFields = game?.fields;
            const gameMinBet = gameFields?.minBet
            const gameMaxBet = gameFields?.maxBet
            const updatedMinBet = gameMinBet?.[UK_LOCALE] !== '' ? { ...gameMinBet, [UK_LOCALE]: '' } : gameMinBet;
            const updatedMaxBet = gameMaxBet?.[UK_LOCALE] !== '' ? { ...gameMaxBet, [UK_LOCALE]: '' } : gameMaxBet;

            const updatedGameFields = {
                ...gameFields,
                minBet: updatedMinBet,
                maxBet: updatedMaxBet
            };

            const newGamePayload = {
                ...game,
                fields: updatedGameFields,
            };

            gamesV2Entries.push(newGamePayload);

            const end = new Date();
            totalTime += end.getTime() - start.getTime();
            log(`----- Game Progress: ${(((i + 1) / games.entries.length) * 100).toFixed(2)}% - Total Time Taken: ${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s -----`);
        }

        for (const siteGame of slotSiteGames) {
            const i = slotSiteGames.indexOf(siteGame);
            const start = new Date();

            const siteGameFields = siteGame?.fields;
            const siteGameMinBet = siteGameFields?.minBet
            const siteGameMaxBet = siteGameFields?.maxBet
            const updatedMinBet = siteGameMinBet?.[UK_LOCALE] !== '' ? { ...siteGameMinBet, [UK_LOCALE]: '' } : siteGameMinBet;
            const updatedMaxBet = siteGameMaxBet?.[UK_LOCALE] !== '' ? { ...siteGameMaxBet, [UK_LOCALE]: '' } : siteGameMaxBet;

            const updatedSiteGameFields = {
                ...siteGameFields,
                minBet: updatedMinBet,
                maxBet: updatedMaxBet
            };

            const newSiteGamePayload = {
                ...siteGame,
                fields: updatedSiteGameFields,
            };

            siteGameV2Entries.push(newSiteGamePayload);

            const end = new Date();
            totalTime += end.getTime() - start.getTime();
            log(`----- Game Progress: ${(((i + 1) / games.entries.length) * 100).toFixed(2)}% - Total Time Taken: ${Math.floor(totalTime / 60000)}m ${Math.floor((totalTime % 60000) / 1000)}s -----`);
        }

        await writeJSONFile(`./src/euRegulatoryMinMaxBetRemovalGameSiteGame/data/${GAME_V2}/${spaceFolder}/${GAME_V2}-updated.json`, { entries: gamesV2Entries });
        await writeJSONFile(`./src/euRegulatoryMinMaxBetRemovalGameSiteGame/data/${GAME_V2}/${spaceFolder}/${SITE_GAME_V2}.json`, { entries: siteGameV2Entries });

    } catch (error) {
        log(`Error processing games: ${error}`);
        throw error;
    }
};

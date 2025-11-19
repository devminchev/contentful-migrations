import * as fs from 'node:fs';
import * as path from 'node:path';
import { log } from "../../utils/logging";
import { VENTURE, GAME_V2 } from "../../constants";
import { WHITEHAT_MERGED_OUT_PATH, GAMES_SITE_GAMES_MIGRATION_PATH, WHITEHAT_SITE_GAME_FILE_NAME } from '../../api/whitehat/constants';
import { whitehatPlatformToPlatformVisibility, retrieveModelRecords } from '../../utils/igPropertyUtils';
import { getEntries } from '../../api/managementApi';

const determineVenture = (ventureName, ventures, spaceLocale) => {
    const ventureId = ventures?.find(item => item?.fields?.name?.[spaceLocale] === ventureName)?.sys?.id || '';
    return ventureId;
}

const createSiteGameV2Payload = (gameRecord = {}, spaceLocale, ventureId, ventureName, gameId) => {
    const envVisibility = gameRecord?.whitehatEnv || ['staging'];
    const venturesWithNetPosition = ['ballybeton', 'monopolycasinoon'];
    const shouldShowNetPos = venturesWithNetPosition.includes(ventureName);

    const entryTitle = `${gameRecord?.game?.seoName} [${ventureName}]`
    const siteGamePayload = {
        metadata: {
            tags: [gameRecord.uniqueGameVentureKey],
            publishedStatus: gameRecord?.publishedStatus
        },
        fields: {
            "entryTitle": {
                [spaceLocale]: entryTitle
            },
            "venture": {
                [spaceLocale]: {
                    "sys": {
                        "type": "Link",
                        "linkType": "Entry",
                        "id": ventureId
                    }
                }
            },
            "game": {
                [spaceLocale]: {
                    "sys": {
                        "type": "Link",
                        "linkType": "Entry",
                        "id": gameId
                    }
                }
            },
            "maxBet": {
                [spaceLocale]: gameRecord?.game?.maxStake.toString() ?? '',
            },
            "minBet": {
                [spaceLocale]: gameRecord?.game?.minStake.toString() ?? '',
            },
            "environmentVisibility": {
                [spaceLocale]: envVisibility
            },
            environment: {
                [spaceLocale]: envVisibility
            },
            "platformVisibility": {
                [spaceLocale]: whitehatPlatformToPlatformVisibility(gameRecord?.game?.deviceType)
            },
            "showNetPosition": {
                [spaceLocale]: shouldShowNetPos
            },
        }
    };

    return siteGamePayload;
}

export const prepareSiteGameRecords = async (spaceLocale) => {
    const siteGamesFilePath = path.join(WHITEHAT_MERGED_OUT_PATH, WHITEHAT_SITE_GAME_FILE_NAME);
    const CONTENTFUL_GAME_V2_RECORDS_PATH = `${GAMES_SITE_GAMES_MIGRATION_PATH}/gameV2FromContentful.json`
    // fetch ventures
    const ventures = await getEntries(VENTURE);
    // fetch games
    const games = await retrieveModelRecords(GAME_V2, CONTENTFUL_GAME_V2_RECORDS_PATH);

    if (!fs.existsSync(siteGamesFilePath)) {
        console.error(`File not found: ${siteGamesFilePath}`);
        return;
    }

    const siteGamesData = JSON.parse(fs.readFileSync(siteGamesFilePath, 'utf8'));

    const siteGamePayloads = [];

    for (const siteGameRecord of siteGamesData) {
        const connectedGame = games.find(item => item?.fields?.launchCode?.[spaceLocale]
            === siteGameRecord?.game?.launchCode
        ) || {};
        const connectedGameId = connectedGame?.sys?.id
        const ventureName = siteGameRecord?.venture || '';
        const ventureId = determineVenture(ventureName, ventures, spaceLocale);
        const payload = createSiteGameV2Payload(siteGameRecord, spaceLocale, ventureId, ventureName, connectedGameId);
        const uniqueKey = siteGameRecord?.uniqueGameVentureKey;
        siteGamePayloads.push(payload);
        log(`Prepared site game payload for unique key: ${uniqueKey}`);
    }

    const siteGameEntries = { entries: siteGamePayloads };
    const outputFilePath = path.join(GAMES_SITE_GAMES_MIGRATION_PATH, 'siteGameV2.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(siteGameEntries, null, 2));
}

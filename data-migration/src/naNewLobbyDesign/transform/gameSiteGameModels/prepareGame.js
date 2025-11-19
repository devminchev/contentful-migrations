import fs from 'node:fs';
import path from 'node:path';
import { log } from "../../utils/logging";
import { WHITEHAT_MERGED_OUT_PATH, GAMES_SITE_GAMES_MIGRATION_PATH,
    WHITEHAT_ALL_GAMES_FILE_NAME,
    WHITEHAT_SITE_GAME_FILE_NAME,
    WHITEHAT_GAME_FILE_NAME,
    PREVIOUS_MIGRATIONS_FILE_NAME,
    WHITEHAT_VENDOR,
    GAME_TYPE_MAP
} from '../../api/whitehat/constants';
import { whitehatPlatformToPlatformVisibility } from '../../utils/igPropertyUtils';

const createSlotGameTypeProps = (gameRecord, gameType) => {
    const reels = gameRecord?.slotGameProperties?.reels || '';
    const slotReels = `${reels}-${reels}`;

    return {
        "type": gameType,
        "brand": '',
        "features": [],
        "themes": [],
        "symbolType": [],
        "maxMultiplier": '',
        "reel": slotReels,
        "symbolCount": '',
        "waysToWin": '',
        "winLineType": '',
        "isJackpot": false,
        "isJackpotFixedPrize": false,
        "isJackpotInGameProgressive": false,
        "isJackpotPlatformProgressive": false,
        "isPersistence": false,
        "winLines": gameRecord?.slotGameProperties?.lines
    }
};

const CreateOtherGameTypeProps = (gameRecord, gameType) => {
    // This is because Casino type games have an extra provider property to be filled in
    return gameType === 'Casino' ?
        {
            "type": gameRecord?.gameType,
            "casinoType": 'Other'
        } :
        {
            "type": gameRecord?.gameType
        }
};

const createGameV2Payload = (gameRecord = {}, spaceLocale) => {
    const recordGameType = (gameRecord?.gameType || '').toLowerCase();
    const gameType = GAME_TYPE_MAP[recordGameType] || '';
    const gameTypeProps = recordGameType === 'slots' ? createSlotGameTypeProps(gameRecord, gameType) : CreateOtherGameTypeProps(gameRecord, gameType);
    const gamePayload = {
        metadata: {
            publishedStatus: gameRecord?.publishedStatus
        },
        fields: {
            entryTitle: {
                [spaceLocale]: gameRecord?.seoName || ''
            },
            // Skip for now so we can test the migration
            launchCode: {
                [spaceLocale]: gameRecord?.launchCode
            },
            gamePlatformConfig: {
                [spaceLocale]: {
                    rtp: gameRecord?.rtp, //Skip for now so we can test the migration.
                    mobileOverride: false,
                    gameSkin: gameRecord?.launchCode,
                    name: gameRecord?.launchCode,
                    "demoUrl": '',
                    "realUrl": '',
                    "gameLoaderFileName": '',
                    "mobileName": '',
                    "mobileGameSkin": '',
                    "mobileRealUrl": '',
                    "mobileDemoUrl": '',
                    "mobileGameLoaderFileName": '',
                    "gameStudio": gameRecord?.providerTitle,
                    "gameProvider": gameRecord?.distributor,
                    "gameType": {
                        ...gameTypeProps
                    }
                }
            },
            "vendor": {
                [spaceLocale]: WHITEHAT_VENDOR
            },
            "showGameName": {
                [spaceLocale]: false
            },
            "progressiveJackpot": {
                [spaceLocale]: gameRecord?.jackpot
            },
            "operatorBarDisabled": {
                [spaceLocale]: false
            },
            "rgpEnabled": {
                [spaceLocale]: true
            },
            "funPanelEnabled": {
                [spaceLocale]: false
            },
            // "funPanelDefaultCategory": {
            //     [spaceLocale]: ""
            // },
            // "funPanelBackgroundImage": {
            //     [spaceLocale]: ""
            // },
            // "representativeColor": {
            //     [spaceLocale]: "",
            // },
            "infoImgUrlPattern": {
                [spaceLocale]: "",
            },
            "imgUrlPattern": {
                [spaceLocale]: "",
            },
            "title": {
                [spaceLocale]: gameRecord?.name,
            },
            "maxBet": {
                [spaceLocale]: gameRecord?.maxStake?.toString() ?? '',
            },
            "minBet": {
                [spaceLocale]: gameRecord?.maxStake?.toString() ?? '',
            },
            // "infoDetails": {
            //     [spaceLocale]: "",
            // },
            // "howToPlayContent": {
            //     [spaceLocale]: "",
            // },
            "introductionContent": {
                [spaceLocale]: gameRecord?.description,
            },
            tags: {
                [spaceLocale]: gameRecord?.gameTags || []
            },
            "showNetPosition": {
                [spaceLocale]: false
            },
            "platform": {
                [spaceLocale]: ['Desktop', 'Tablet', 'Phone']
            },
            "platformVisibility": {
                [spaceLocale]: whitehatPlatformToPlatformVisibility(gameRecord?.deviceType)
            }
        }
}
    return gamePayload;
}

export const prepareGameRecords = (spaceLocale) => {
    const entriesFilePath = path.join(WHITEHAT_MERGED_OUT_PATH, WHITEHAT_GAME_FILE_NAME);
    if (!fs.existsSync(entriesFilePath)) {
        console.error(`File not found: ${entriesFilePath}`);
        return;
    }

    const gamesData = JSON.parse(fs.readFileSync(entriesFilePath, 'utf8'));
    const gamePayloads = [];

    for (const gameRecord of gamesData) {
        const payload = createGameV2Payload(gameRecord, spaceLocale);
        gamePayloads.push(payload);
        // console.log(`Prepared game payload for launchCode: ${gameRecord.?launchCode}`);
    }
    const entries = {
        entries: gamePayloads
    };

    const gamePayloadFilePath = path.join(GAMES_SITE_GAMES_MIGRATION_PATH, 'gameV2.json');
    fs.writeFileSync(gamePayloadFilePath, JSON.stringify(entries, null, 2));
    console.log(`Game payloads written to: ${gamePayloadFilePath}`);
}

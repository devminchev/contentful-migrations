import { readExcelFile } from '../utils/fileOperations';
import { getEntries } from '../api/managementApi';
import { logSection, log } from '../utils/logging';
import { SYMBOL_TYPE_MAP, FEATURES_MAP, THEMES_MAP } from './constants';

export const script = async (spaceLocale: string) => {
    try {
        logSection('READ EXCEL METADATA');
        const metadata = readExcelFile('./src/gameModelV2/data/gamesmeta.xlsx');
        const gameV2Data = await getEntries('gameV2');

        logSection('POPULATE GAME METADATA');
        for (let index = 0; index < metadata.length; index++) {
            const game = metadata[index];
            const percentage = ((index + 1) / metadata.length) * 100;
            log(`Metadata Excel Progress: (${percentage.toFixed(2)}%)`, game.__EMPTY);

            if (!game.__EMPTY_4 || !game.__EMPTY_2) {
                log(`Skipping game due to missing gameType or gameProvider: ${game.__EMPTY}`);
                continue;
            }

            const gameV2Entries = gameV2Data.filter(g => g.fields.gamePlatformConfig[spaceLocale].gameSkin === game.__EMPTY);
            if (!gameV2Entries.length) continue;

            const metadataToUpdate = buildMetadata(game);

            for (let v2Entry of gameV2Entries) {
                updateGameEntry(v2Entry, metadataToUpdate, spaceLocale);
                try {
                    const updated = await v2Entry.update();
                    await updated.publish();
                } catch (error) {
                    log(`Error updating and publishing entry: ${v2Entry.sys.id}`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error updating game metadata:', error);
    }
};

const buildMetadata = (game) => {
    let metadata = {
        gameType: {
            type: game.__EMPTY_4,
        },
        gameProvider: game.__EMPTY_2,
        gameStudio: game.__EMPTY_3 || '',
    };

    if (game.__EMPTY_4 === 'Slots') {
        metadata.gameType = {
            ...metadata.gameType,
            reel: slotsReelValue(game.__EMPTY_5),
            winLines: game.__EMPTY_6,
            winLineType: game.__EMPTY_7,
            waysToWin: game.__EMPTY_8,
            symbolCount: game.__EMPTY_9 || '1',
            maxMultiplier: game.__EMPTY_14 || '1',
            isJackpotFixedPrize: Boolean(game.__EMPTY_11),
            isJackpotInGameProgressive: Boolean(game.__EMPTY_12),
            isJackpotPlatformProgressive: Boolean(game.__EMPTY_13),
            isPersistence: Boolean(game.__EMPTY_15),
            brand: game.__EMPTY_16 || '',
            symbolType: setMultiSelects(game, SYMBOL_TYPE_MAP),
            features: setMultiSelects(game, FEATURES_MAP),
            themes: setMultiSelects(game, THEMES_MAP),
        };
    }

    if (game.__EMPTY_4 === 'Casino') {
        metadata.gameType.casinoType = game.__EMPTY_00;
    }

    if (['Instant Win', 'Slingo'].includes(game.__EMPTY_4)) {
        metadata.gameType = {
            ...metadata.gameType,
            features: setMultiSelects(game, FEATURES_MAP),
            themes: setMultiSelects(game, THEMES_MAP),
        };
    }

    return metadata;
};

const updateGameEntry = (gameV2Entry, metadata, spaceLocale) => {
    gameV2Entry.fields.gamePlatformConfig[spaceLocale] = {
        ...gameV2Entry.fields.gamePlatformConfig[spaceLocale],
        ...metadata,
    };
};

const slotsReelValue = (str) => str.includes('~') ? str.replace('~', '-') : str;

const setMultiSelects = (game, map) =>
    Object.keys(map)
        .filter(key => game[key] === 'Yes')
        .map(key => map[key]);

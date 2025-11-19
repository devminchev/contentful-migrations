import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {
    const cashierGameConfig = migration.editContentType('cashierGameConfig');

    cashierGameConfig
        .createField('productTypeAndSubProductType')
        .name('Product Type and SubProduct Type')
        .type('Symbol')
        .validations([
            {
                in: [
                    'BINGO - BINGO ',
                    'FREE - DFG',
                    'FREE - FREE_SPINS',
                    'FREE - MFG',
                    'FREE - MULTIPLAYER',
                    'FREE - OTHER',
                    'INSTANT_WIN - INSTANT_WIN',
                    'LIVE_CASINO - BACCARAT',
                    'LIVE_CASINO - BLACKJACK',
                    'LIVE_CASINO - DICE_GAME',
                    'LIVE_CASINO - GAMESHOW',
                    'LIVE_CASINO - OTHER',
                    'LIVE_CASINO - POKER_VARIANTS',
                    'LIVE_CASINO - ROULETTE',
                    'MINI_GAME - BINGO',
                    'MINI_GAME - CASINO',
                    'MINI_GAME - LIVE_CASINO',
                    'MINI_GAME - POKER',
                    'MINI_GAME - SLOTS',
                    'MULTIPLAYER - MULTIPLAYER',
                    'PACHINKO_HALL - NONE',
                    'POKER - CASH_GAME',
                    'POKER - TOURNAMENT',
                    'POKER - WILD_SEAT',
                    'RNG_CASINO - BACCARAT',
                    'RNG_CASINO - BLACKJACK',
                    'RNG_CASINO - DICE_GAME',
                    'RNG_CASINO - GAMESHOW',
                    'RNG_CASINO - KENO',
                    'RNG_CASINO - OTHER',
                    'RNG_CASINO - POKER_VARIANTS',
                    'RNG_CASINO - ROULETTE',
                    'RNG_CASINO - SOLITAIRE',
                    'SKILL_GAME - SKILL_GAME',
                    'SLOTS - MEGAWAYS',
                    'SLOTS - SLINGO',
                    'SLOTS - SLOTS',
                    'SPORTS - SPORTS',
                    'VIRTUAL_SPORT - NONE'
                ],
            },
        ]);

    cashierGameConfig.changeFieldControl('productTypeAndSubProductType', 'builtin', 'dropdown');

}) as MigrationFunction;


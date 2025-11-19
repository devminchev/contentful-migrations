import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
    const cashierGameConfig = migration.editContentType('cashierGameConfig');

    cashierGameConfig.editField('gameProvider').validations([
        {
            in: [
                'AMAYA',
                'BETWORKS',
                'BLUEPRINT',
                'COLOSSUS',
                'DGC',
                'EVERI',
                'EVOLUTION',
                'EYECON',
                'GAMESYS',
                'GAMESYSGAMES',
                'GAMINGREALMS',
                'GAMOMAT',
                'GOLDENHERO',
                'GREENTUBE',
                'HIGH5GAMES',
                'HUNGRYBEAR',
                'IGT',
                'INSPIRED',
                'KONAMI',
                'METRIC',
                'MICROGAMING',
                'NETENT',
                'NOVOMATIC',
                'PLAYNGO',
                'PLAYSON',
                'PLAYZIDO',
                'PRAGMATICPLAY',
                'PUSHGAMING',
                'RAW',
                'REALISTICGAMES',
                'REDTIGER',
                'RELAXGAMING',
                'ROGUE',
                'SAPPHIRE',
                'SDK',
                'SPIN',
                'SGDIGITAL',
                'THUNDERKICK',
                'WMS',
                '1X2NETWORK',
                '3RADICAL',
            ],
        },
    ]);
}) as MigrationFunction;

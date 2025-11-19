import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const cashierGameConfig = migration.editContentType('cashierGameConfig');

  cashierGameConfig.editField('gameProvider').validations([
    {
      in: [
        'AMAYA',
        'BLUEPRINT',
        'EVOLUTION',
        'EYECON',
        'GAMESYS',
        'GAMESYSGAMES',
        'GAMINGREALMS',
        'GAMOMAT',
        'GOLDENHERO',
        'GREENTUBE',
        'HIGH5GAMES',
        'IGT',
        'METRIC',
        'MICROGAMING',
        'NETENT',
        'PLAYNGO',
        'PLAYSON',
        'PLAYZIDO',
        'PRAGMATICPLAY',
        'PUSHGAMING',
        'REALISTICGAMES',
        'REDTIGER',
        'RELAXGAMING',
        'SGDIGITAL',
        'THUNDERKICK',
        'WMS',
        '1X2NETWORK',
        '3RADICAL',
      ],
    },
  ]);
}) as MigrationFunction;

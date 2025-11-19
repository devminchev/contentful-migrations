import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const cashierGameConfig = migration.editContentType('cashierGameConfig');
  const cashierRegulatoryDataGameConfig = migration.editContentType('cashierRegulatoryDataGameConfig');

  cashierGameConfig.editField('gameProvider').validations([
    {
      in: [
        'GAMESYS',
        'IGT',
        'WMS',
        'HIGH5GAMES',
        'AMAYA',
        'NETENT',
        'EYECON',
        'EVOLUTION',
        'GAMESYSGAMES',
        'GAMINGREALMS',
        '1X2NETWORK',
        'PRAGMATICPLAY',
        'THUNDERKICK',
        'PLAYNGO',
        'GAMOMAT',
        'REALISTICGAMES',
        'RELAXGAMING',
        'PLAYZIDO',
        'PUSHGAMING',
      ],
    },
  ]);
  cashierRegulatoryDataGameConfig.editField('regulatorGameTypeCode').validations([
    {
      in: [
        'AZA - NA',
        'RLT - Francesa',
        'RLT - Americana',
        'BLJ - CL',
        'BLJ - AM',
        'BLJ - PO',
        'BLJ - SU',
        'BLJ - 21',
        'BNG - NA',
        'NA - NA',
      ],
    },
  ]);
}) as MigrationFunction;

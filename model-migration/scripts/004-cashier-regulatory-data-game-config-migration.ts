import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const cashierRegulatoryDataGameConfig = migration
    .createContentType('cashierRegulatoryDataGameConfig')
    .name('Cashier Regulatory Data Game Config')
    .description('Model designed to maintain DW_REGULATED_GAME_DATA')
    .displayField('gameSkinName');
  cashierRegulatoryDataGameConfig
    .createField('gameSkinName')
    .name('Game Skin Name')
    .type('Symbol')
    .required(true)
    .validations([
      {
        unique: true,
      },
    ]);
  cashierRegulatoryDataGameConfig
    .createField('regulatorGameName')
    .name('Regulator Game Name')
    .type('Symbol')
    .required(true);
  cashierRegulatoryDataGameConfig.createField('isFreeGame').name('Free Game').type('Boolean').required(true);
  cashierRegulatoryDataGameConfig
    .createField('regulatorGameTypeCode')
    .name('Regulator Game Type and Variant')
    .type('Symbol')
    .required(true)
    .validations([
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
        ],
      },
    ]);
  cashierRegulatoryDataGameConfig
    .createField('integration')
    .name('INTEGRATION')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['yes'],
        },
      ],
    });
  cashierRegulatoryDataGameConfig
    .createField('pp')
    .name('PP')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['yes'],
        },
      ],
    });
  cashierRegulatoryDataGameConfig
    .createField('live')
    .name('LIVE')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['yes'],
        },
      ],
    });
  cashierRegulatoryDataGameConfig.changeFieldControl('gameSkinName', 'builtin', 'singleLine');
  cashierRegulatoryDataGameConfig.changeFieldControl('regulatorGameName', 'builtin', 'singleLine');
  cashierRegulatoryDataGameConfig.changeFieldControl('isFreeGame', 'builtin', 'boolean');
  cashierRegulatoryDataGameConfig.changeFieldControl('regulatorGameTypeCode', 'builtin', 'dropdown');
  cashierRegulatoryDataGameConfig.changeFieldControl('integration', 'builtin', 'checkbox', {
    helpText: 'Publishing to Integration required?',
  });
  cashierRegulatoryDataGameConfig.changeFieldControl('pp', 'builtin', 'checkbox', {
    helpText: 'Publishing to PP required?',
  });
  cashierRegulatoryDataGameConfig.changeFieldControl('live', 'builtin', 'checkbox', {
    helpText: 'Publishing to Live required?',
  });
}) as MigrationFunction;

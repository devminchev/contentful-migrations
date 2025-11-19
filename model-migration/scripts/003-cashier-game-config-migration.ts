import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const cashierGameConfig = migration
    .createContentType('cashierGameConfig')
    .name('Cashier Game Config')
    .displayField('gameName');
  cashierGameConfig.createField('gameId').name('Game Id').type('Integer').required(true);
  cashierGameConfig
    .createField('gameName')
    .name('Game Name')
    .type('Symbol')
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 30,
        },
      },
    ]);
  cashierGameConfig
    .createField('gameProvider')
    .name('Game Provider')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['GAMESYS', 'IGT', 'HIGH5GAMES', 'AMAYA', 'NETENT', 'EYECON', 'EVOLUTION', 'GAMESYSGAMES'],
      },
    ]);
  cashierGameConfig
    .createField('gameType')
    .name('Game Type')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['CASINO', 'SLOT', 'INSTANT', 'FREE'],
      },
    ]);
  cashierGameConfig
    .createField('gameSkinName')
    .name('Game Skin Name')
    .type('Symbol')
    .required(true)
    .validations([
      {
        unique: true,
      },
      {
        size: {
          min: 1,
          max: 50,
        },
      },
    ]);
  cashierGameConfig
    .createField('gameProductName')
    .name('Game Product Name')
    .type('Symbol')
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 30,
        },
      },
    ]);
  cashierGameConfig
    .createField('ventures')
    .name('Ventures')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          in: [
            'JACKPOTJOY',
            'BOTEMANIA',
            'HEART',
            'STARSPINS',
            'VIRGINGAMES',
            'MONOPOLYCASINO',
            'RAINBOWRICHES',
            'MONOPOLYCASINOSPAIN',
          ],
        },
      ],
    });
  cashierGameConfig
    .createField('gameRtp')
    .name('Game RTP')
    .type('Number')
    .validations([
      {
        range: {
          max: 1,
          min: 0,
        },
      },
    ]);
  cashierGameConfig.createField('spainReportable').name('Spain Reportable').type('Boolean').required(true);
  cashierGameConfig.createField('groupCompliant').name('Group Compliant').type('Boolean').required(true);
  cashierGameConfig.createField('miniGame').name('Mini Game').type('Boolean').required(true);
  cashierGameConfig.createField('progressive').name('Progressive').type('Boolean').required(true);
  cashierGameConfig.createField('thirdPartyNames').name('thirdPartyNames').type('Array').items({
    type: 'Symbol',
    validations: [],
  });
  cashierGameConfig
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
  cashierGameConfig
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
  cashierGameConfig
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
  cashierGameConfig.changeFieldControl('gameId', 'builtin', 'numberEditor');
  cashierGameConfig.changeFieldControl('gameName', 'builtin', 'singleLine');
  cashierGameConfig.changeFieldControl('gameProvider', 'builtin', 'dropdown');
  cashierGameConfig.changeFieldControl('gameType', 'builtin', 'dropdown');
  cashierGameConfig.changeFieldControl('gameSkinName', 'builtin', 'singleLine');
  cashierGameConfig.changeFieldControl('gameProductName', 'builtin', 'singleLine');
  cashierGameConfig.changeFieldControl('ventures', 'builtin', 'checkbox');
  cashierGameConfig.changeFieldControl('gameRtp', 'builtin', 'numberEditor', {
    helpText: '0.0000 - 0.9999',
  });
  cashierGameConfig.changeFieldControl('spainReportable', 'builtin', 'boolean');
  cashierGameConfig.changeFieldControl('groupCompliant', 'builtin', 'boolean');
  cashierGameConfig.changeFieldControl('miniGame', 'builtin', 'boolean');
  cashierGameConfig.changeFieldControl('progressive', 'builtin', 'boolean');
  cashierGameConfig.changeFieldControl('thirdPartyNames', 'builtin', 'tagEditor');
  cashierGameConfig.changeFieldControl('integration', 'builtin', 'checkbox', {
    helpText: 'Publishing to Integration required?',
  });
  cashierGameConfig.changeFieldControl('pp', 'builtin', 'checkbox', {
    helpText: 'Publishing to PP required?',
  });
  cashierGameConfig.changeFieldControl('live', 'builtin', 'checkbox', {
    helpText: 'Publishing to Live required?',
  });
}) as MigrationFunction;

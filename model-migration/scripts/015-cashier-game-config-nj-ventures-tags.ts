import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const cashierGameConfig = migration.editContentType('cashierGameConfig');

  cashierGameConfig.editField('ventures').items({
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
          'TROPICANA',
          'VIRGINCASINO',
        ],
      },
    ],
  });
  cashierGameConfig.createField('w2gReportable').name('W2G Reportable').type('Boolean').required(true);
  cashierGameConfig.moveField('w2gReportable').afterField('spainReportable');
  cashierGameConfig.changeFieldControl('w2gReportable', 'builtin', 'boolean');
}) as MigrationFunction;

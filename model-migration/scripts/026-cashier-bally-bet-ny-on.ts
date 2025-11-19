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
          'BALLYCASINONJ',
          'BALLYBETAZ',
          'BALLYBETNY',
          'BALLYBETON',
        ],
      },
    ],
  });
}) as MigrationFunction;

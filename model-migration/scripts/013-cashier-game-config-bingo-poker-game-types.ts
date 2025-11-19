import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const cashierGameConfig = migration.editContentType('cashierGameConfig');

  cashierGameConfig.editField('gameType').validations([
    {
      in: ['BINGO', 'CASINO', 'FREE', 'INSTANT', 'POKER', 'SLOT'],
    },
  ]);
}) as MigrationFunction;

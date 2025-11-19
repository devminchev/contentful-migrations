import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const cashierGameConfig = migration.editContentType('cashierGameConfig');
  const cashierRegulatoryDataGameConfig = migration.editContentType('cashierRegulatoryDataGameConfig');

  cashierGameConfig.editField('gameName').validations([
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);

  cashierGameConfig.editField('gameSkinName').validations([
    {
      unique: true,
    },
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);

  cashierGameConfig.editField('gameProductName').validations([
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);

  cashierRegulatoryDataGameConfig.editField('gameSkinName').validations([
    {
      unique: true,
    },
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);

  cashierRegulatoryDataGameConfig.editField('regulatorGameName').validations([
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);
}) as MigrationFunction;

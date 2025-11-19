import { MigrationFunction } from "contentful-migration";

export = ((migration) => {
  const cashierGameConfig = migration.editContentType("cashierGameConfig");
  const cashierRegulatoryDataGameConfig = migration.editContentType('cashierRegulatoryDataGameConfig');

  cashierGameConfig.editField("gameId").validations([
    {
      unique: true,
    },
  ]);

  cashierGameConfig.editField("gameName").validations([
    {
      unique: true,
    },
    {
      regexp: {
        pattern: "^[a-zA-Z0-9À-ÿ&_-]*$",
        flags: "",
      },
    },
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);

  cashierGameConfig.editField("gameSkinName").validations([
    {
      unique: true,
    },
    {
      regexp: {
        pattern: "^[a-zA-Z0-9À-ÿ&_-]*$",
        flags: "",
      },
    },
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);

  cashierGameConfig.editField("gameProductName").validations([
    {
      unique: true,
    },
    {
      size: {
        min: 1,
        max: 150,
      },
    },
    {
      regexp: {
        pattern: "^[a-zA-Z0-9À-ÿ&_-]*$",
        flags: "",
      },
    },
  ]);

  cashierRegulatoryDataGameConfig.editField('gameSkinName').validations([
    {
      unique: true,
    },
    {
      regexp: {
        pattern: "^[a-zA-Z0-9À-ÿ&_-]*$",
        flags: "",
      },
    },
    {
      size: {
        min: 1,
        max: 150,
      },
    },
  ]);

}) as MigrationFunction;

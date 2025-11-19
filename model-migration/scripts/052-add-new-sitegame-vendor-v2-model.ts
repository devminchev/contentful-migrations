import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const siteGame = migration.editContentType('gameV2');

  siteGame.editField('vendor').validations([
    {
      in: ['gamesys', 'roxor-rgp', 'lynx', 'engage', 'netent', 'evolution', 'igt', 'infinity'],
    },
  ]);
}) as MigrationFunction;

import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const siteGame = migration.editContentType('siteGame');

  siteGame.editField('vendor').validations([
    {
      in: ['gamesys', 'roxor-rgp', 'lynx', 'engage', 'infinity'],
    },
  ]);
}) as MigrationFunction;

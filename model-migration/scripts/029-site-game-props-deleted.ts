import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const siteGame = migration.editContentType('siteGame');

  siteGame.deleteField('fullscreenDisabled');
  siteGame.deleteField('supportsCommunityJackpot');
  siteGame.deleteField('gameId');
  siteGame.deleteField('page');
  siteGame.deleteField('softwareId');
  siteGame.deleteField('denomAmount');

  siteGame.editField('vendor').validations([
    {
      in: ['gamesys', 'roxor-rgp', 'lynx', 'engage'],
    },
  ]);
}) as MigrationFunction;

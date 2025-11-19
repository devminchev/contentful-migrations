import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsParticipant = migration.editContentType('sportsParticipant');

  sportsParticipant.deleteField('logo');

  sportsParticipant.deleteField('alternativeLogo');

}) as MigrationFunction;
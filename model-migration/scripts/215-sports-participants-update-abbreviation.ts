import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Update Sports Participant
  const sportsParticipant = migration.editContentType('sportsParticipant')

  sportsParticipant
    .editField('abbreviation')
    .validations([]);

}) as MigrationFunction;
import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

    // Update Sports Participant

  const sportsParticipant = migration.editContentType('sportsParticipant')

  sportsParticipant
    .createField('alternativeName')
    .name('Alternative Name')
    .type('Symbol')
 

  sportsParticipant.moveField('alternativeName').afterField('abbreviation')

  sportsParticipant.changeFieldControl('alternativeName', 'builtin', 'singleLine', {
    helpText: 'The alternative name of the Participant Team using an abbreviated location at the beginning e.g NY Jets',
  }); 

}) as MigrationFunction;

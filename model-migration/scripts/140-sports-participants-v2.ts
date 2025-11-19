import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

  const sportsParticipant = migration.editContentType('sportsParticipant')

  sportsParticipant
  .createField('participantPath')
  .name('Participant Path')
  .type('Symbol')
  .localized(false)
  .required(true)

  sportsParticipant.changeFieldControl('participantPath', 'builtin', 'singleLine', {
    helpText: 'Needs to be in the format of "<sport>__<team name>" all in lowercase and any spaces in the sport or team name being replaced with _ e.g american_football__miami_dolphins',
  });

  sportsParticipant.moveField('participantPath').afterField('entryTitle');

}) as MigrationFunction;

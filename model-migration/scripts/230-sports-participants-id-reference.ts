import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

  const sportsParticipant = migration.editContentType('sportsParticipant')

  sportsParticipant
    .createField('participantKeys')
    .name('Participant Keys')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        { 
          regexp: { 
            pattern: '^(dev-|stg-|prod-)',
          } 
        }
      ]
    })
    .localized(false)

  sportsParticipant.changeFieldControl('participantKeys', 'builtin', 'tagEditor', {
    helpText: 'Keys of the participant.',
    disabled: false
  });

}) as MigrationFunction;

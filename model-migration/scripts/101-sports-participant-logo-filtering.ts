import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsParticipantLogo = migration.createContentType('sportsParticipantLogo').name('Sports Participant Logo').description('A Logo that can be used within the Sports Participant model').displayField('entryTitle');

  sportsParticipantLogo
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsParticipantLogo
    .createField('logo')
    .name('Logo')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  sportsParticipantLogo
    .changeFieldControl('logo', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
      helpText: 'The Bynder image used for the Sports Participant logo',
    });

  sportsParticipantLogo
    .createField('jurisdiction')
    .name('Jurisdiction')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['dxJurisdiction']
        }
      ]
    });

  const sportsParticipant = migration.editContentType('sportsParticipant');

  sportsParticipant
    .createField('participantLogo')
    .name('Participant Logo')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsParticipantLogo']
        }
      ]
    });
  sportsParticipant.moveField('participantLogo').afterField('logo');

  sportsParticipant
    .createField('participantAlternativeLogo')
    .name('Participant Alternative Logo')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsParticipantLogo']
        }
      ]
    });
  sportsParticipant.moveField('participantAlternativeLogo').afterField('alternativeLogo');

}) as MigrationFunction;
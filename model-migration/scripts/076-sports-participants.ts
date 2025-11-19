import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsParticipant = migration.createContentType('sportsParticipant').name('Sports Participant').description('Provides information about Sports Participants such as names, logos, colours etc.').displayField('entryTitle');

  sportsParticipant
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');
    
  sportsParticipant
    .createField('englishName')
    .name('English Name')
    .type('Symbol')
    .required(true);

  sportsParticipant
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true);

  sportsParticipant
    .createField('abbreviation')
    .name('Abbreviation')
    .type('Symbol')
    .required(true)
    .validations([
      {
        size: {
          max: 3
        },
        message: 'Abbreviation too long'
      }
    ]);

  sportsParticipant
    .createField('shortName')
    .name('Short Name')
    .type('Symbol')
    .required(true);

  sportsParticipant
    .createField('stadium')
    .name('Stadium')
    .type('Symbol');

  sportsParticipant
    .createField('logo')
    .name('Logo')
    .type('Object');
  // 5KySdUzG7OWuCE2V3fgtIa is the ID for the Bynder Image App
  sportsParticipant.changeFieldControl('logo', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Sports Participant logo',
  });

  sportsParticipant
    .createField('alternativeLogo')
    .name('Alternative Logo')
    .type('Object');
  sportsParticipant.changeFieldControl('alternativeLogo', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the Sports Participant alternative logo',
  });

  sportsParticipant
    .createField('color')
    .name('Color')
    .type('Symbol');
  // 4Vy3oAINwRgnxakoTz06tG is the ID for the Color Picker App
  sportsParticipant.changeFieldControl('color', 'app', '4Vy3oAINwRgnxakoTz06tG', {
    helpText: 'The main color of the participant team.',
  });

  sportsParticipant
    .createField('secondaryColor')
    .name('Secondary Color')
    .type('Symbol');
  sportsParticipant.changeFieldControl('secondaryColor', 'app', '4Vy3oAINwRgnxakoTz06tG', {
    helpText: 'The secondary color of the participant team.',
  });

}) as MigrationFunction;
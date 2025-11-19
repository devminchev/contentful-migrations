import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsParticipantLogo = migration.editContentType('sportsParticipantLogo')

  sportsParticipantLogo
    .createField('color')
    .name('Color')
    .type('Symbol');
  // 4Vy3oAINwRgnxakoTz06tG is the ID for the Color Picker App
  sportsParticipantLogo.changeFieldControl('color', 'app', '4Vy3oAINwRgnxakoTz06tG', {
    helpText: 'The main color of the participant team.',
  });
  sportsParticipantLogo.moveField('color').afterField('logo')

  sportsParticipantLogo
    .createField('secondaryColor')
    .name('Secondary Color')
    .type('Symbol');
    sportsParticipantLogo.changeFieldControl('secondaryColor', 'app', '4Vy3oAINwRgnxakoTz06tG', {
    helpText: 'The secondary color of the participant team.',
  });
  sportsParticipantLogo.moveField('secondaryColor').afterField('color')

  sportsParticipantLogo
    .createField('brand')
    .name('Brand')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['dxBrand']
        }
      ]
    });

}) as MigrationFunction;
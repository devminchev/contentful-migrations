import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxTheme = migration.createContentType('dxTheme').name('Dx Theme').description('The Digital Experience Theme which has the options to use an Image, Colour or JSON object that will be used in the Dx and Sports Models.').displayField('entryTitle');
  dxTheme.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  dxTheme
    .createField('primaryColor')
    .name('Primary Color')
    .type('Symbol');
  dxTheme.changeFieldControl('primaryColor', 'app', '4Vy3oAINwRgnxakoTz06tG', {
    helpText: 'The main color to use in the Dx Theme component.',
  });

  dxTheme
    .createField('image')
    .name('Image')
    .type('Object')
    .validations([
      {
        size: { max: 1 }
      }
    ]);
  dxTheme.changeFieldControl('image', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used as the Dx Theme Image',
  });

  dxTheme
    .createField('props')
    .name('Props')
    .type('Object');
	dxTheme.changeFieldControl('props', 'builtin', 'objectEditor', {
		helpText: 'Generic Json containing any additional theming properties that are not covered by the primaryColor or image fields.',
	});

  const dxView = migration.editContentType('dxView');

  dxView
    .createField('theme')
    .name('Theme')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxTheme']
      }
    ]);

  dxView.moveField('theme').afterField('layout');

}) as MigrationFunction;

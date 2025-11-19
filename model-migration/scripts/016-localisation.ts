import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const localisation = migration
    .createContentType('localisation')
    .name('Localisation')
    .description('')
    .displayField('entryTitle');

  localisation.createField('entryTitle').name('entryTitle').type('Symbol');
  localisation.createField('key').name('key').type('Symbol').required(true);
  localisation.createField('value').name('value').type('Text').localized(true);
  localisation
    .createField('venture')
    .name('venture')
    .type('Link')
    .validations([{ linkContentType: ['venture'] }])
    .linkType('Entry');

  localisation.changeFieldControl('key', 'builtin', 'singleLine', {
    helpText: 'This is the localisation key, for example: my.key.title',
  });
  localisation.changeFieldControl('value', 'builtin', 'singleLine');
}) as MigrationFunction;

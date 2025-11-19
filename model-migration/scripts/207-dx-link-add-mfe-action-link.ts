import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const dxLink = migration.editContentType('dxLink');

  dxLink.createField('mfeActionLink')
    .name('MFE Action Link')
    .type('Object')
    .localized(false)
    .required(false);
  dxLink.changeFieldControl('mfeActionLink', 'builtin', 'objectEditor', {
    helpText: "Setup for MFE Navigation Events"
  })

}) as MigrationFunction;

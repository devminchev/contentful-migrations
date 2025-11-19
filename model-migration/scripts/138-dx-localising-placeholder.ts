import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Digital Experience Placeholder
  const dxPlaceholder = migration.editContentType('dxPlaceholder');

  dxPlaceholder.editField('props')
    .localized(true);

}) as MigrationFunction;
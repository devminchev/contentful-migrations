import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxControlledBanner = migration.editContentType('dxControlledBanner');
  dxControlledBanner.editField('title')
  .required(false);

}) as MigrationFunction;
import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxControlledBanner = migration.editContentType('dxControlledBanner');

  dxControlledBanner.editField('bynderImage')
    .required(false);

}) as MigrationFunction;
import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxBanner = migration.editContentType('dxBanner');

  dxBanner.editField('image')
    .required(false);
  dxBanner.editField('bynderImage')
    .required(true);

}) as MigrationFunction;
import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Remove Product from Dx Footer
  const dxFooter = migration.editContentType('dxFooter');
  dxFooter.deleteField('product');

  // Remove Path from Dx View
  const dxView = migration.editContentType('dxView');
  dxView.deleteField('path');

  // Remove Should Include Vaix from Dx Quick Links
  const dxQuickLinks = migration.editContentType('dxQuickLinks');
  dxQuickLinks.deleteField('shouldIncludeVaix');

}) as MigrationFunction;
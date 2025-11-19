import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

  const dxFooter = migration.editContentType('dxFooter');

  dxFooter.editField('lastLogin').defaultValue({
    'en-US': false
  });

  dxFooter.editField('serverTime').defaultValue({
    'en-US': false
  });

  dxFooter.editField('sessionTime').defaultValue({
    'en-US': false
  });

}) as MigrationFunction;

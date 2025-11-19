import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxView = migration.editContentType('dxView');
  dxView.editField('layout')
  dxView.changeFieldControl('layout', 'builtin', 'singleLine', {
    helpText: "Determines the site layout for the View. Options include: FixedSingleColumn, FullSingleColumn, TheColumnWide. Leave blank to use Debug Layout."
  });

}) as MigrationFunction;
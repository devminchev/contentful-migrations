import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  const dxView = migration.editContentType('dxView');
  dxView.changeFieldControl('layout', 'builtin', 'singleLine', {
    helpText: "Determines the site layout for the View. Options include: FixedSingleColumn, FullSingleColumn, ThreeColumnWide. Leave blank to use Debug Layout."
  });

}) as MigrationFunction;
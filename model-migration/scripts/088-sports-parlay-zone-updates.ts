import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  //SportsPrePackTabItem changes
  const sportsPrePackTabItem = migration.editContentType('sportsPrePackTabItem');

  sportsPrePackTabItem
    .editField('name')
    .localized(true);

  sportsPrePackTabItem
    .createField('image')
    .name('Image')
    .type('Text')
    .localized(false);

  sportsPrePackTabItem
    .changeFieldControl('image', 'builtin', 'singleLine', {
      helpText: 'Absolute or relative URL to the image / icon of the filter.',
    });

  //SportsPrePackTabGroup changes
  const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');
  
  sportsPrePackTabGroup
    .editField('name')
    .localized(true);

  //SportsPrePackGeneratorTabItem changes
  const prePackGeneratorTabItem = migration.editContentType('sportsPrePackGeneratorTabItem');

  prePackGeneratorTabItem
    .changeFieldControl('image', 'builtin', 'singleLine', {
      helpText: 'Absolute or relative URL to the image / icon of the filter.',
    });

  //SportsParlayBuilderTabItem changes
  const sportsParlayBuilderTabItem = migration.editContentType('sportsParlayBuilderTabItem');

  sportsParlayBuilderTabItem
    .changeFieldControl('image', 'builtin', 'singleLine', {
      helpText: 'Absolute or relative URL to the image / icon of the filter.',
    });


}) as MigrationFunction;
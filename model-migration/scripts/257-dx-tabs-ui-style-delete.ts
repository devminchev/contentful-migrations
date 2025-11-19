import { MigrationFunction } from "contentful-migration";

export = (migration => {
  // The models that use the dxTabsUiStyle
  const dxTabs = migration.editContentType('dxTabs');
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');
  const sportsParlayBuilderTabGroup = migration.editContentType('sportsParlayBuilderTabGroup');

  // Remove the old reference fields:
  dxTabs.deleteField('uiStyle');
  dxTabsGroup.deleteField('uiStyle');
  sportsPrePackTabGroup.deleteField('uiStyle');
  sportsParlayBuilderTabGroup.deleteField('uiStyle');

  // Delete the embedded dxTabsUiStyle content:
  migration.deleteContentType('dxTabsUiStyle');
}) as MigrationFunction;

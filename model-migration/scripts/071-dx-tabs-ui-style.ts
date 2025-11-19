import {MigrationFunction} from 'contentful-migration';

export = (migration => {
  // Generate the new Dx Tabs Ui Style
  const dxUiStyle = migration
    .createContentType('dxTabsUiStyle')
    .name('Dx Tabs UI Style')
    .description("Digital Experience (Dx) Tabs UI Style to be used across Digital Experience products. For use on Dx Tabs to configure how it's tabGroups are displayed. And for use on Tab Groups to configure how it's tabItems are displayed.")
    .displayField('entryTitle');

  dxUiStyle
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  dxUiStyle
    .createField('type')
    .name('Type')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['CHIP', 'STANDARD']
      }
    ])

  dxUiStyle.changeFieldControl('type', 'builtin', 'radio', {
    helpText: 'The type of UI Style to apply.',
  });

  // Adding a reference field to the dxTabsUiStyle for dxTabs
  const dxTabs = migration.editContentType('dxTabs');
  dxTabs
    .createField("uiStyle")
    .name("UI Style")
    .type("Link")
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ["dxTabsUiStyle"],
      },
    ])
    .linkType("Entry");

  // Adding a reference field to the dxTabsUiStyle for dxTabsGroup
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  dxTabsGroup
    .createField("uiStyle")
    .name("UI Style")
    .type("Link")
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ["dxTabsUiStyle"],
      },
    ])
    .linkType("Entry");

  // Adding a reference field to the dxTabsUiStyle for sportsPrePackTabGroup
  const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');
  sportsPrePackTabGroup
    .createField("uiStyle")
    .name("UI Style")
    .type("Link")
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ["dxTabsUiStyle"],
      },
    ])
    .linkType("Entry");

  // Adding a reference field to the dxTabsUiStyle for sportsParlayBuilderTabGroup
  const sportsParlayBuilderTabGroup = migration.editContentType('sportsParlayBuilderTabGroup');
  sportsParlayBuilderTabGroup
    .createField("uiStyle")
    .name("UI Style")
    .type("Link")
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ["dxTabsUiStyle"],
      },
    ])
    .linkType("Entry");

}) as MigrationFunction;

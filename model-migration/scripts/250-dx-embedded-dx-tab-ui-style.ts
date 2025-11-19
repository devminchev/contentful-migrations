import { MigrationFunction } from "contentful-migration";

export = ((migration, space) => {
  const LOCALE = space?.spaceId === 'nw2595tc1jdx' ? 'en-GB' : 'en-US';
  // The models that use the dxTabsUiStyle
  const dxTabs = migration.editContentType('dxTabs');
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  const sportsPrePackTabGroup = migration.editContentType('sportsPrePackTabGroup');
  const sportsParlayBuilderTabGroup = migration.editContentType('sportsParlayBuilderTabGroup');

  // Dx Tabs:
  dxTabs.createField('uiStyleType')
    .name('UI Style Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['CHIP', 'STANDARD']
      }
    ])
    .defaultValue({
      [LOCALE]: 'STANDARD'
    });
  dxTabs.changeFieldControl('uiStyleType', 'builtin', 'radio', {
    helpText: 'The type of UI Style to apply.',
  });

  // Dx Tabs Group:
  dxTabsGroup.createField('uiStyleType')
    .name('UI Style Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['CHIP', 'STANDARD']
      }
    ])
    .defaultValue({
      [LOCALE]: 'STANDARD'
    });
    dxTabsGroup.changeFieldControl('uiStyleType', 'builtin', 'radio', {
    helpText: 'The type of UI Style to apply.',
  });

  // Sports PrePack Tab Group:
  sportsPrePackTabGroup.createField('uiStyleType')
    .name('UI Style Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['CHIP', 'STANDARD']
      }
    ])
    .defaultValue({
      [LOCALE]: 'STANDARD'
    });
    sportsPrePackTabGroup.changeFieldControl('uiStyleType', 'builtin', 'radio', {
    helpText: 'The type of UI Style to apply.',
  });

  // Sports Parlay Builder Tab Group:
  sportsParlayBuilderTabGroup.createField('uiStyleType')
    .name('UI Style Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['CHIP', 'STANDARD']
      }
    ])
    .defaultValue({
      [LOCALE]: 'STANDARD'
    });
    sportsParlayBuilderTabGroup.changeFieldControl('uiStyleType', 'builtin', 'radio', {
    helpText: 'The type of UI Style to apply.',
  });
}) as MigrationFunction;
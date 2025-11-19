import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  // Generate the new tabs models 

  // Digital Experience tabs 

  const dxTabs = migration
    .createContentType('dxTabs')
    .name('Dx Tabs')
    .description('A collection of Dx tabs groups')
    .displayField('entryTitle');

  dxTabs
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  // Digital Experience tabs group

  const dxTabsGroup = migration
    .createContentType('dxTabsGroup')
    .name('Dx Tabs Group')
    .description('A group containing each of the different tab items and their defining tab types')
    .displayField('entryTitle');

  dxTabsGroup
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  dxTabsGroup
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  dxTabsGroup.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'To be used as the display name for the Dx tabs group on the frontend',
  });

  dxTabsGroup
    .createField('segmentation')
    .name('Segmentation')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
        }
      ],
    })
    .defaultValue({
      "en-US": [
        "showWhenLoggedIn",
        "showWhenLoggedOut"
      ]
    });
  dxTabsGroup.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Dx tabs group should be active',
  });

  // Sports navigation tab item

  const sportsNavigationTabItem = migration
    .createContentType('sportsNavigationTabItem')
    .name('Sports Navigation Tab Item')
    .description('A sports navigation tab item exposed in the view model that renders the group navigation relative to the current node')
    .displayField('entryTitle');

  sportsNavigationTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsNavigationTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  sportsNavigationTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'To be used as the display name for the sports navigation tab item on the frontend',
  });

  sportsNavigationTabItem
    .createField('image')
    .name('Image')
    .type('Text')
    .localized(false);

  sportsNavigationTabItem
    .changeFieldControl('image', 'builtin', 'singleLine', {
      helpText: 'Absolute or relative URL to the image / icon of the filter.',
    });

  // Adding a reference field to the dxTabsGroups for the dxTabs

  dxTabs
    .createField('dxTabsGroups')
    .name('Tabs Groups')
    .type('Array')
    .localized(false)
    .required(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['dxTabsGroup'],
        }
      ]
    });

  // Adding a reference field to the sportsNavigationTabItem for the dxTabsGroup

  dxTabsGroup
    .createField('dxTabItems')
    .name('Tab Items')
    .type('Array')
    .localized(false)
    .required(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsNavigationTabItem'],
        },
      ],
    });

  // Adding a reference filed to dxTabs for the dxView's primaryContent

  const sportsView = migration.editContentType('dxView');

  sportsView.editField('primaryContent').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: [
          "dxQuickLinks", "dxMarquee", "dxPlaceholder", "dxPromotionDetails", "dxTabs"
        ],
      },
    ],
  });

  // Note - I've left the concept of sports within Contentful for now, as we may use this model in the future. TBC 

}) as MigrationFunction;
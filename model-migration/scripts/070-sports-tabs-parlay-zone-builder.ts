import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  //Sports Parlay Builder Tab Group
  const builderTabGroup = migration
    .createContentType('sportsParlayBuilderTabGroup')
    .name('Sports Parlay Builder Tab Group')
    .description('A sports parlay builder tab group is used to display fixtures for recommended leagues i.e. NFL, NBA, MLB. The number of recommended leagues are configurable.')
    .displayField('entryTitle');

  builderTabGroup
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  builderTabGroup
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);
    
  builderTabGroup
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

  builderTabGroup.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports parlay builder tabs group should be active',
  });
  
  builderTabGroup
    .createField('tabItemCount')
    .name('Tab Item Count')
    .type('Integer')
    .required(true);

  builderTabGroup
    .createField('overrides')
    .name('Overrides')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            "sportsPersonalisedGroupOverride"
          ]
        }
      ]
    });

  // Sports Parlay Builder Tab Item
  const parlayBuilder = migration
    .createContentType('sportsParlayBuilderTabItem')
    .name('Sports Parlay Builder Tab Item')
    .description('A sports parlay builder tab item is used to display to display fixtures for recommended leagues i.e. NFL, NBA, MLB.')
    .displayField('entryTitle');
    
  parlayBuilder
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  parlayBuilder
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  parlayBuilder
    .createField('image')
    .name('Image')
    .type('Text')
    .localized(false);

  parlayBuilder
    .createField('components')
    .name('Components')
    .type('Array')
    .required(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            "sportsParlayBuilderTabGroup"
          ]
        }
      ]
    });

  // Update the Tabs Group to include the Sports Parlay Builder Tab Item
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  dxTabsGroup.editField('dxTabItems').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: [
          "sportsNavigationTabItem", "sportsEventListingTabItem", "sportsPrePackTabItem", "sportsParlayBuilderTabItem"
        ],
      },
    ],
  });

}) as MigrationFunction;

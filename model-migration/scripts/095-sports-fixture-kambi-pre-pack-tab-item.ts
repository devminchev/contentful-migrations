import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  
  // Sports Kambi PrePack Tab Item
const prePackTabItem = migration.createContentType('sportsFixtureKambiPrePackTabItem')
    .name('Sports Fixture Kambi PrePack Tab Item')
    .description('A sports tab item that is used to display Kambi pre-packs on a fixture page')
    .displayField('entryTitle');
    
prePackTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

prePackTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

prePackTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title displayed on the tab item to the end user',
  });

prePackTabItem
    .createField('prePackTags')
    .name('PrePack Tags')
    .type('Array')
    .required(true)
    .items({
      type: 'Symbol',
      validations: [
        {
            "in": [
                "AUTO",
                "AUTO_BUNDLED",
                "CUSTOM"
            ]
        }
      ]
    });

prePackTabItem.changeFieldControl('prePackTags', 'builtin', 'checkbox', {
    helpText: 'AUTO - Created by Kambi with one selection, AUTO_BUNDLED - Created by Kambi with more then one selection, CUSTOM - Created by Ballys',
  });

prePackTabItem
    .createField('image')
    .name('Image')
    .type('Object');

// 5KySdUzG7OWuCE2V3fgtIa is the ID for the Bynder Image App
prePackTabItem.changeFieldControl('image', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the image / icon of the tab item',
  });

  // Update the Tabs Group to include the Sports SGP Tab Item
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  dxTabsGroup.editField('dxTabItems').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: [
          "sportsNavigationTabItem",
          "sportsEventListingTabItem",
          "sportsPrePackTabItem",
          "sportsParlayBuilderTabItem",
          "sportsPrePackGeneratorTabItem",
          "sportsFixtureSgpTabItem",
          "sportsFixtureMarketsTabItem",
          "sportsFixtureKambiPrePackTabItem"
        ],
      },
    ],
  });
  
}) as MigrationFunction;
import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  
  // Sports SGP Tab Item
  const sgpTabItem = migration.createContentType('sportsFixtureSgpTabItem')
    .name('Sports Fixture SGP Tab Item')
    .description('A sports tab item that is used to display SGP markets on a fixture page')
    .displayField('entryTitle');
    
  sgpTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sgpTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  sgpTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title displayed on the tab item to the end user',
  });

  sgpTabItem
    .createField('marketTags')
    .name('Market Tags')
    .type('Array')
    .required(true)
    .items({
      type: 'Symbol',
      validations: [
        {
          "in": [
            "IN_EVENT_COMBINABLE"
          ]
        }
      ]
    })
    .defaultValue({
      "en-US": [
        "IN_EVENT_COMBINABLE"
      ]
    });

  sgpTabItem.changeFieldControl('marketTags', 'builtin', 'checkbox', {
    helpText: 'The market tags used for filtering markets in the SGP tab',
  });

  sgpTabItem
    .createField('image')
    .name('Image')
    .type('Object');

  // 5KySdUzG7OWuCE2V3fgtIa is the ID for the Bynder Image App
  sgpTabItem.changeFieldControl('image', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
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
          "sportsNavigationTabItem", "sportsEventListingTabItem", "sportsPrePackTabItem", "sportsParlayBuilderTabItem", "sportsPrePackGeneratorTabItem", "sportsFixtureSgpTabItem"
        ],
      },
    ],
  });
  
}) as MigrationFunction;

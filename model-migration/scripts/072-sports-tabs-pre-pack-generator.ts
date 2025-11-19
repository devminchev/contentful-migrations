import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  
  // Sports PrePack Generator Tab Item
  const prePackGeneratorTabItem = migration.createContentType('sportsPrePackGeneratorTabItem')
    .name('Sports PrePack Generator Tab Item')
    .description('A sports pre-pack generator tab item is used to display a randomly generated pre-pack for recommended leagues i.e. NFL, NBA, MLB.')
    .displayField('entryTitle');
    
  prePackGeneratorTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  prePackGeneratorTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  prePackGeneratorTabItem
    .createField('image')
    .name('Image')
    .type('Text');

  prePackGeneratorTabItem
    .createField('groupCount')
    .name('Group Count')
    .type('Integer')
    .required(true);

  prePackGeneratorTabItem
    .createField('defaultLegs')
    .name('Default Legs')
    .type('Integer')
    .required(true);

  prePackGeneratorTabItem
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

  // Update the Tabs Group to include the Sports PrePack Generator Tab Item
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  dxTabsGroup.editField('dxTabItems').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: [
          "sportsNavigationTabItem", "sportsEventListingTabItem", "sportsPrePackTabItem", "sportsParlayBuilderTabItem", "sportsPrePackGeneratorTabItem"
        ],
      },
    ],
  });
  
}) as MigrationFunction;

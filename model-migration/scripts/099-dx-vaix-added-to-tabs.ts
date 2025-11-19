import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Vaix Sports Event Tab Items
  const sportsPersonalisedEventListingTabItems = migration.createContentType('sportsPersonalisedEventListingTabItems').name('Sports Personalised Event Listing Tab Item').description('Sports Personalised Event Listing Tab Item will act as an insert in a Tabs Group to allow Vaix created Sports Event Listing Tab Items to be added to a Tab Group with a defined number of Vaix Tab Items returned in that position.').displayField('entryTitle');
  sportsPersonalisedEventListingTabItems.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  sportsPersonalisedEventListingTabItems
    .createField('limit')
    .name('Limit')
    .type('Number')
    .required(true);
  sportsPersonalisedEventListingTabItems.changeFieldControl('limit', 'builtin', 'numberEditor', {
    helpText: 'The number of Personalised Sports Event Listing Tab Items that should appear in the position this tab is placed in.',
  });

  sportsPersonalisedEventListingTabItems
    .createField('groupType')
    .name('Group Type')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['LEAGUES', 'BOTH']
      }
    ]);
  sportsPersonalisedEventListingTabItems.changeFieldControl('groupType', 'builtin', 'radio', {
    helpText: 'The Group Type that should be returned.',
  });

  // Add Vaix Create Sports Event Tabs to accepted Tab Groups
  const dxTabsGroup = migration.editContentType('dxTabsGroup');
  dxTabsGroup.editField('dxTabItems').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [
      {
        linkContentType: [
          "sportsEventListingTabItem",
          "sportsFixtureKambiPrePackTabItem",
          "sportsFixtureMarketsTabItem",
          "sportsFixtureSgpTabItem",
          "sportsNavigationTabItem",
          "sportsParlayBuilderTabItem",
          "sportsPersonalisedEventListingTabItems",
          "sportsPrePackGeneratorTabItem",
          "sportsPrePackTabItem"
        ],
      },
    ],
  });

}) as MigrationFunction;
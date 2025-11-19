import { MigrationFunction } from 'contentful-migration';

export = (migration => {
  // Generate the new sports fixture markets tab item

  const sportsFixtureMarketsTabItem = migration
    .createContentType('sportsFixtureMarketsTabItem')
    .name('Sports Fixture Markets Tab Item')
    .description("A fixture markets tab is used on the event/fixture page only and is used to display a sub-section of markets to the end user. A market switcher may also be shown with this tab subject to the tab's configuration")
    .displayField('entryTitle');

  sportsFixtureMarketsTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsFixtureMarketsTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  sportsFixtureMarketsTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title displayed on the tab item to the end user',
  });

  sportsFixtureMarketsTabItem
    .createField('image')
    .name('Image')
    .type('Object');

  // 5KySdUzG7OWuCE2V3fgtIa is the ID for the Bynder Image App
  sportsFixtureMarketsTabItem.changeFieldControl('image', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image used for the image / icon of the tab item',
  });

  sportsFixtureMarketsTabItem
    .createField('fixtureId')
    .name('Fixture ID')
    .type('Symbol')
    .required(false)
    .localized(false);

  sportsFixtureMarketsTabItem.changeFieldControl('fixtureId', 'builtin', 'singleLine', {
    helpText: "Not required. This represents an override for the fixture ID which the fixture markets tab will be returning sport data for e.g. 1019958146. If not provided, the fixture ID will be derived from the query parameters of the client's request",
  });

  sportsFixtureMarketsTabItem
    .createField("showMarketSwitcher")
    .name("Show Market Switcher")
    .type("Boolean")
    .localized(false)
    .required(true)
    .defaultValue({
      "en-US": true
    });

  sportsFixtureMarketsTabItem.changeFieldControl("showMarketSwitcher", "builtin", "radio", {
    helpText:
      "Used to determine whether to display the market switcher within the tab, as a sub filter, or whether to restrict the display to a long list of markets",
  });

  // Adding a reference field to the sportsFixtureMarketsTabItem for the dxTabsGroup
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
          "sportsFixtureMarketsTabItem"
        ],
      },
    ],
  });

}) as MigrationFunction;
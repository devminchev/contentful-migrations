import { MigrationFunction } from 'contentful-migration';

export = (migration => {

  // Update the sports fixture markets tab item
  const sportsFixtureMarketsTabItem = migration.editContentType('sportsFixtureMarketsTabItem');
  
  sportsFixtureMarketsTabItem
    .createField('marketCategoryEnglishNames')
    .name('Market Category English Names')
    .type('Array')
    .required(false)
    .items({
      type: 'Symbol',
      validations: []
    });

  sportsFixtureMarketsTabItem.changeFieldControl('marketCategoryEnglishNames', 'builtin', 'tagEditor', {
    helpText:
      'Set a list of market categories to be displayed under the tab on the frontend. The order in which these market categories are set, will also determine their display order.',
  });

  sportsFixtureMarketsTabItem
    .createField("includeUnassignedMarketCategories")
    .name("Include Unassigned Market Categories")
    .type("Boolean")
    .localized(false)
    .required(true)
    .defaultValue({
      "en-US": false
    });

  sportsFixtureMarketsTabItem.changeFieldControl("includeUnassignedMarketCategories", "builtin", "radio", {
    helpText:
      "If Include Unassigned Market Categories is true, the tab will also capture any market categories that are not explicitly set in the Market Category English Names field, re the tab group it is placed within. If false, only the market categories set will be displayed per this tab.",
  });

}) as MigrationFunction;
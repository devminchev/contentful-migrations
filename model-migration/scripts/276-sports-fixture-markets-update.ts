import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsFixtureMarketsTabItem = migration.editContentType('sportsFixtureMarketsTabItem');

  sportsFixtureMarketsTabItem.moveField('includeUnassignedMarketCategories').afterField('showMarketSwitcher');
  sportsFixtureMarketsTabItem.changeFieldControl("includeUnassignedMarketCategories", "builtin", "radio", {
    helpText: "If 'YES' is selected, this tab item will display all markets NOT specified in any other tab. If 'NO' is selected, then add the market categories below that should appear in this tab.",
  });

}) as MigrationFunction;

import { MigrationFunction } from 'contentful-migration';

export = ( migration => {

    const sportsFixtureSGPTabItem = migration.editContentType('sportsFixtureSgpTabItem');

    sportsFixtureSGPTabItem
    .createField("showMarketSwitcher")
    .name("Show Market Switcher")
    .type("Boolean")
    .localized(false)
    .required(true)
    .defaultValue({
      "en-US": true
    });

    sportsFixtureSGPTabItem.changeFieldControl("showMarketSwitcher", "builtin", "radio", {
        helpText:
          "Used to determine whether to display the market switcher within the tab, as a sub filter, or whether to restrict the display to a long list of markets",
      });

}) as MigrationFunction;
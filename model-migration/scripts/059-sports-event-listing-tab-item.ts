import { MigrationFunction } from 'contentful-migration';

export = (migration => {
  // Generate the new sports event listing tab item

  const sportsEventListingTabItem = migration
    .createContentType('sportsEventListingTabItem')
    .name('Sports Event Listing Tab Item')
    .description("An event listing tab item is used to display a set of fixtures for a group i.e. sport, region or competition, alongside its configured primary markets. A market switcher may also be shown subject to the tab's configuration")
    .displayField('entryTitle');

  sportsEventListingTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsEventListingTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  sportsEventListingTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title displayed on the tab item to the end user',
  });

  sportsEventListingTabItem
    .createField('image')
    .name('Image')
    .type('Text')
    .localized(false);

  sportsEventListingTabItem
    .changeFieldControl('image', 'builtin', 'singleLine', {
      helpText: 'Absolute or relative URL to the image / icon of the filter.',
    });

  // Long term this could be facilitated via a custom contentful app, but for now a simple path field will suffice

  sportsEventListingTabItem
    .createField('path')
    .name('Path')
    .type('Symbol')
    .required(true)
    .localized(false);

  sportsEventListingTabItem.changeFieldControl('path', 'builtin', 'singleLine', {
    helpText: "Represents the group path or fixture ID the sports data view endpoint will be returning in relation to Kambi data e.g. football/england/premier_league ",
  });

  sportsEventListingTabItem
    .createField('statuses')
    .name('Statuses')
    .type('Array')
    .localized(false)
    .required(true)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['NOT_STARTED', 'STARTED', 'FINISHED', 'UNKNOWN'],
        }
      ],
    })
    .defaultValue({
      "en-US": [
        "NOT_STARTED",
        "STARTED"
      ]
    });

  sportsEventListingTabItem.changeFieldControl('statuses', 'builtin', 'checkbox', {
    helpText: "The accepted statuses of the fixtures' displayed with the sports event listing tab item"
  });

  sportsEventListingTabItem
    .createField("showMarketSwitcher")
    .name("Show Market Switcher")
    .type("Boolean")
    .localized(false)
    .required(true)
    .defaultValue({
      "en-US": true
    });

  sportsEventListingTabItem.changeFieldControl("showMarketSwitcher", "builtin", "radio", {
    helpText:
      "Used to determine whether to display the event listing's market switcher, or whether to restrict the display to the events' sport's primary market",
  });

  // Adding a reference field to the sportsEventListingTabItem for the dxTabsGroup

  const dxTabsGroup = migration.editContentType('dxTabsGroup');

  dxTabsGroup
    .editField('dxTabItems')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: [
            "sportsNavigationTabItem", "sportsEventListingTabItem"
          ],
        },
      ],
    })

}) as MigrationFunction;
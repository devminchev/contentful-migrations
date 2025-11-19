import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {


  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  // Create Sports Dynamic Event Listing Tab Item

  const sportsDynamicEventListingTabItem = migration
    .createContentType('sportsDynamicEventListingTabItem')
    .name('Sports Dynamic Event Listing Tab Item')
    .description("The Sports Dynamic Event Listing Tab Item is used to create code-generated tabs with data that is not available through the CMS, but sourced from the Sports API.")
    .displayField('entryTitle');

  sportsDynamicEventListingTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsDynamicEventListingTabItem.createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['All Live Sports']
      },
    ])
    .defaultValue({
      [LOCALE]: 'All Live Sports'
    })

  sportsDynamicEventListingTabItem
    .changeFieldControl('type', 'builtin', 'radio', {
      helpText: "The accepted types used to inject the necessary data to populate the tab or tabs.",
    });

  sportsDynamicEventListingTabItem
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
      [LOCALE]: [
        "NOT_STARTED",
        "STARTED"
      ]
    });

  sportsDynamicEventListingTabItem.changeFieldControl('statuses', 'builtin', 'checkbox', {
    helpText: "The accepted statuses of the fixtures' displayed with the sports event listing tab item"
  });

  sportsDynamicEventListingTabItem
    .createField("showMarketSwitcher")
    .name("Show Market Switcher")
    .type("Boolean")
    .localized(false)
    .required(true)
    .defaultValue({
      [LOCALE]: true
    });

  sportsDynamicEventListingTabItem.changeFieldControl("showMarketSwitcher", "builtin", "radio", {
    helpText:
      "Used to determine whether to display the event listing's market switcher, or whether to restrict the display to the events' sport's primary market",
  });

  sportsDynamicEventListingTabItem
    .createField('eventGroupings')
    .name('Event Groupings')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['sportsEventGroupings']
      }
    ])

  sportsDynamicEventListingTabItem.createField('clientGrouping')
    .name('Client Grouping')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['sportsClientGrouping']
      }
    ]);

  // Adding a reference field to the sportsDynamicEventListingTabItem for the dxTabsGroup

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
          "sportsFuturesTabItem",
          "sportsNavigationTabItem",
          "sportsParlayBuilderTabItem",
          "sportsPersonalisedEventListingTabItems",
          "sportsDynamicEventListingTabItem",
          "sportsPrePackGeneratorTabItem",
          "sportsPrePackTabItem",
          "sportsMatchList",
          "dxTabItem",
        ],
      },
    ],
  });

}) as MigrationFunction;
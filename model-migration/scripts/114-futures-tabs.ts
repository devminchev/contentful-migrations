import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Sports Fixture Tag
  const sportsFixtureTag = migration
    .createContentType('sportsFixtureTag')
    .name('Sports Fixture Tag')
    .description("An individual Fixture Tag that will be used in MatchDay's view query.")
    .displayField('entryTitle');

  sportsFixtureTag
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsFixtureTag
    .createField('fixtureTag')
    .name('Fixture Tag')
    .type('Symbol')
    .required(true)
    .localized(true);

  sportsFixtureTag.changeFieldControl('fixtureTag', 'builtin', 'singleLine', {
    helpText: 'The name of the Fixture Tag i.e. PARTICIPANT_FIXTURE, TEAM_PARTICIPANT_FIXTURE, TEAM_FIXTURE, TEAM_PARTICIPANTS_FIXTURE, PARTICIPANTS_FIXTURE, TEAMS_FIXTURE or GENERIC_FIXTURE',
  });

  // Sports Fixture Tags
  const sportsFixtureTags = migration
    .createContentType('sportsFixtureTags')
    .name('Sports Fixture Tags')
    .description("A set of Fixture Tags used in the filter when calling MatchDays view query")
    .displayField('entryTitle');

  sportsFixtureTags
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsFixtureTags
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  sportsFixtureTags.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The name of the set of Fixture Tags i.e. Player, Team, Competition or Other',
  });

  sportsFixtureTags
    .createField('fixtureTags')
    .name('Fixture Tags')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsFixtureTag']
        }
      ]
    });

  // Futures Tab
  const sportsFuturesTabItem = migration
    .createContentType('sportsFuturesTabItem')
    .name('Sports Futures Tab Item')
    .description("A tab item used to display any future events relating to players, teams and competitions within the specified sport or group.")
    .displayField('entryTitle');

  sportsFuturesTabItem
    .createField('entryTitle')
    .name('entryTitle')
    .type('Symbol');

  sportsFuturesTabItem
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(true);

  sportsFuturesTabItem.changeFieldControl('name', 'builtin', 'singleLine', {
    helpText: 'The title displayed on the tab item to the end user',
  });

  sportsFuturesTabItem.createField('path')
    .name('Path')
    .type('Symbol')
    .required(true)
    .localized(false);

  sportsFuturesTabItem.changeFieldControl('path', 'builtin', 'singleLine', {
    helpText: "Used to determine which group or sport pages the future tabs should apply to. Example: 'football/england/premier_league'"
  });

  sportsFuturesTabItem
    .createField('categories')
    .name('Categories')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsFixtureTags']
        }
      ]
    });

  sportsFuturesTabItem
    .createField('statuses')
    .name('Statuses')
    .type('Array')
    .localized(false)
    .required(true)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['NOT_STARTED', 'STARTED', 'UNKNOWN'],
        }
      ],
    })
    .defaultValue({
      "en-US": [
        "NOT_STARTED",
        "STARTED"
      ]
    });

  sportsFuturesTabItem.changeFieldControl('statuses', 'builtin', 'checkbox', {
    helpText: "The accepted statuses of the fixtures' displayed with the sports futures tab item"
  });

  // Add Futures Tab to accepted Tab Groups
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
          "sportsPrePackGeneratorTabItem",
          "sportsPrePackTabItem"
        ],
      },
    ],
  });

}) as MigrationFunction;
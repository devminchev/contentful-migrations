import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

  // Create Sports Event Grouping

  const sportsEventGrouping = migration.createContentType('sportsEventGroupings')
  .name('Sports Event Groupings')
  .displayField('entryTitle')
  .description('Component used to encapsulate all properties related to the groupings of Sports Events.');
  
  sportsEventGrouping.createField('entryTitle')
  .name('entryTitle')
  .type('Symbol')
  .required(true)

  sportsEventGrouping.createField('first')
  .name('Number of Groups')
  .type('Number')
  .required(true)
  .defaultValue({
    'en-US': 1,
  })
  .localized(false);

  sportsEventGrouping
  .changeFieldControl('first', 'builtin', 'numberEditor', {
    helpText: `Number of groups to be shown. E.g. Number of sports/regions/competitions to show.`,
  });

  sportsEventGrouping.createField('limitGroupsPerParent')
  .name('Group Limit')
  .type('Number')
  .required(true)
  .defaultValue({
    'en-US': 4,
  })
  .localized(false);

  sportsEventGrouping
  .changeFieldControl('limitGroupsPerParent', 'builtin', 'numberEditor', {
    helpText: `Number of regions/competitions to be shown per sport or leagues/competitions per region.`,
  });

  sportsEventGrouping.createField('limitFixturesPerGroup')
  .name('Fixtures Limit')
  .type('Number')
  .required(true)
  .defaultValue({
    'en-US': 10,
  })
  .localized(false);

  sportsEventGrouping
  .changeFieldControl('limitFixturesPerGroup', 'builtin', 'numberEditor', {
    helpText: 'Number of fixtures to be shown per competition.',
  });

  sportsEventGrouping.createField('orderBy')
  .name('Order By')
  .type('Symbol')
  .localized(false)
  .required(true)
  .validations([
      {
        in: ['START_TIME'],
      },
    ])
  .defaultValue({
      'en-US': 'START_TIME',
    })

  sportsEventGrouping
  .changeFieldControl('orderBy', 'builtin', 'dropdown', {
    helpText: 'Order fixtures by given parameter.',
  });

  sportsEventGrouping.createField('fixtureSearchMarketCategoryGroup')
  .name('Filter Market Category')
  .type('Array')
  .localized(false)
  .items({
    type: 'Symbol',
    validations: [],
  })

  sportsEventGrouping
  .changeFieldControl('fixtureSearchMarketCategoryGroup', 'builtin', 'tagEditor', {
    helpText: 'Ids to filter markets. e.g. ["10864", "10866"].',
  });

  // Update Sports Event Listing Tab Item

  const sportsEventListingTabItem = migration.editContentType('sportsEventListingTabItem');

  sportsEventListingTabItem
  .createField('eventGroupings')
  .name('Event Groupings')
  .type('Link')
  .linkType('Entry')
  .validations([
    {
      linkContentType: ['sportsEventGroupings']
    }
  ])

    // Update Sports Personalised Event Listing Tab Item

  const sportsPersonalisedEventListingTabItems = migration.editContentType('sportsPersonalisedEventListingTabItems');

  sportsPersonalisedEventListingTabItems
  .createField('eventGroupings')
  .name('Event Groupings')
  .type('Link')
  .linkType('Entry')
  .validations([
    {
      linkContentType: ['sportsEventGroupings']
    }
  ])

 
}) as MigrationFunction;
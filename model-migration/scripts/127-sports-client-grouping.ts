import { MigrationFunction } from 'contentful-migration';

export = ((migration, space) => {

  const LOCALE = space?.spaceId === "nw2595tc1jdx" ? "en-GB" : "en-US";

  // Sports Client Grouping component

  const clientGrouping = migration.createContentType('sportsClientGrouping').name('Sports Client Grouping').description('Component to provide multiple configuration options on how the front end should display groups and competitions.').displayField('entryTitle');
  clientGrouping.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  clientGrouping
    .createField('outer')
    .name('Outer Logic')
    .type('Symbol')
    .required(true)
    .defaultValue({ [LOCALE]: 'DEFAULT' })
    .validations([{
      in: ['DEFAULT', 'LIVE']
    }]);

  clientGrouping.changeFieldControl('outer', 'builtin', 'radio', {
    helpText: 'Used to determine the outer grouping logic. DEFAULT: Display fixtures the standard way | LIVE: Display live fixtures with starting soon logic applied',
  });

  clientGrouping
    .createField('inner')
    .name('Inner Logic')
    .type('Symbol')
    .required(true)
    .defaultValue({ [LOCALE]: 'DATE_AND_GROUP' })
    .validations([{
      in: ['GROUP', 'DATE_AND_GROUP']
    }]);

  clientGrouping.changeFieldControl('inner', 'builtin', 'radio', {
    helpText: 'Used to determine the inner grouping logic. GROUP: Organise fixtures on the frontend by group alone | DATE_AND_GROUP: Organise fixtures on the frontend first by date and then by group',
  });

  clientGrouping
  .createField('fixtureCount')
  .name('Fixture Count')
  .type('Integer')
  .required(true)
  .defaultValue({ [LOCALE]: 10 })

  clientGrouping.changeFieldControl('fixtureCount', 'builtin', 'numberEditor', {
    helpText: 'Specifies the number of fixtures to be loaded initially',
  });

  // Sports Event Listing Tab Item
  const sportsEventListingTabItem = migration.editContentType('sportsEventListingTabItem');

  // Add Client Grouping 
  sportsEventListingTabItem.createField('clientGrouping')
    .name('Client Grouping')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([
      {
        linkContentType: ['sportsClientGrouping']
      }
    ]);

  // Sports Personalised Event Listing Tab Item

  const sportsPersonalisedEventListingTabItems = migration.editContentType('sportsPersonalisedEventListingTabItems');

  // Add Client Grouping 
  sportsPersonalisedEventListingTabItems.createField('clientGrouping')
    .name('Client Grouping')
    .type('Link')
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['sportsClientGrouping']
      }
    ]);

}) as MigrationFunction;

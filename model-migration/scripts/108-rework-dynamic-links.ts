import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsPersonalisedLink = migration.createContentType('sportsPersonalisedLink').name('Sports Personalised Link').description('Sports Personalised Link will act as an insert in Quick Links to allow Vaix created Links to be added with a defined number of Vaix Links returned in that position.').displayField('entryTitle');
  sportsPersonalisedLink.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  sportsPersonalisedLink
    .createField('limit')
    .name('Limit')
    .type('Number')
    .required(true);
  sportsPersonalisedLink.changeFieldControl('limit', 'builtin', 'numberEditor', {
    helpText: 'The number of Sports Personalised Links that should appear in the position this Content is placed in.',
  });

  sportsPersonalisedLink
    .createField('groupType')
    .name('Group Type')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['BOTH', 'LEAGUES', 'SPORTS']
      }
    ]);
  sportsPersonalisedLink.changeFieldControl('groupType', 'builtin', 'radio', {
    helpText: 'The Group Type that should be returned.',
  });

  const dxQuickLinks = migration.editContentType('dxQuickLinks');
  dxQuickLinks.editField('dxLinks')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['dxLink', 'sportsPersonalisedLink'],
        },
      ],
    });

  const sportsPersonalisedEventListingTabItems = migration.editContentType('sportsPersonalisedEventListingTabItems');

  sportsPersonalisedEventListingTabItems
    .editField('groupType')
    .name('Group Type')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['BOTH', 'LEAGUES', 'SPORTS']
      }
    ]);
  sportsPersonalisedEventListingTabItems.changeFieldControl('groupType', 'builtin', 'radio', {
    helpText: 'The Group Type that should be returned.',
  });

  sportsPersonalisedEventListingTabItems
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

  sportsPersonalisedEventListingTabItems.changeFieldControl('statuses', 'builtin', 'checkbox', {
    helpText: "The accepted statuses of the fixtures' displayed with the sports event listing tab item"
  });

  sportsPersonalisedEventListingTabItems
    .createField("showMarketSwitcher")
    .name("Show Market Switcher")
    .type("Boolean")
    .localized(false)
    .required(true)
    .defaultValue({
      "en-US": true
    });

  sportsPersonalisedEventListingTabItems.changeFieldControl("showMarketSwitcher", "builtin", "radio", {
    helpText:
      "Used to determine whether to display the event listing's market switcher, or whether to restrict the display to the events' sport's primary market",
  });

}) as MigrationFunction;
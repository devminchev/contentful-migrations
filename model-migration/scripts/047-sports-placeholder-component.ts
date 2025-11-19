import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  // Sports Placeholder
  const sportsPlaceholder = migration
    .createContentType('sportsPlaceholder')
    .name('Sports Placeholder')
    .description('Generic component that can be used when there are no explicitly defined models.')
    .displayField('entryTitle');

  sportsPlaceholder.createField('entryTitle').name('Entry Title').type('Symbol');

  sportsPlaceholder.createField('type').name('Type').type('Symbol').required(true).localized(false);
  sportsPlaceholder.changeFieldControl('type', 'builtin', 'singleLine', {
    helpText: 'The type of the placeholder component which can be interpreted without needing to look inside the props.',
  });

  sportsPlaceholder.createField('props').name('Props').type('Object');
  sportsPlaceholder.changeFieldControl('props', 'builtin', 'objectEditor', {
    helpText: 'Generic Json containing all data required for the placeholder component to function as desired.',
  });

  sportsPlaceholder
    .createField('segmentation')
    .name('Segmentation')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Symbol',
      validations: [
        {
          in: ['showWhenLoggedIn', 'showWhenLoggedOut'],
        },
      ],
    });
  sportsPlaceholder.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Placeholder component should be active',
  });

  // Sports View
  const sportsView = migration.editContentType('sportsView');

  // Top Content
  sportsView.editField('topContent').items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs", "sportsPlaceholder" ],
      }
    ]
  });

  // Left Navigation Content
  sportsView.editField('leftNavigationContent').items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs", "sportsPlaceholder" ],
      }
    ]
  });

  // Primary Content
  sportsView.editField('primaryContent').items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs", "sportsPlaceholder" ],
      }
    ]
  });

  // Secondary Content
  sportsView.editField('secondaryContent').items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs", "sportsPlaceholder" ],
      }
    ]
  });

  // Page Unavailable Content
  sportsView.editField('primaryEmptyContent').items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [ "sportsQuickLinks", "sportsMarquee", "sportsTabs", "sportsPlaceholder" ],
      }
    ]
  });
}) as MigrationFunction;
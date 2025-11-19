import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const sportsQuickLinks = migration.editContentType('sportsQuickLinks');

  sportsQuickLinks
    .createField('type')
    .name('Type')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['carousel', 'grid'],
      },
    ])
    .defaultValue({
      'en-US': 'carousel',
    });

  sportsQuickLinks.changeFieldControl('type', 'builtin', 'dropdown', {
    helpText: 'This will determine the layout for the quick links',
  });

  sportsQuickLinks
    .createField('platform')
    .name('Platform')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['WEB', 'NATIVE', 'ANDROID', 'IOS', 'RETAIL'],
      },
    ]);

  sportsQuickLinks.changeFieldControl('platform', 'builtin', 'radio', {
    helpText: 'The platform where the Sports Quick Links should be active',
  });

  const sportsLink = migration.editContentType('sportsLink');

  sportsLink
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
  sportsLink.changeFieldControl('segmentation', 'builtin', 'checkbox', {
    helpText: 'The segment(s) where the Sports Link should be active',
  });
}) as MigrationFunction;

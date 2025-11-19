import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {
  const sportsQuickLinks = migration
    .createContentType('sportsQuickLinks')
    .name('Sports Quick Links ')
    .description('A collection of Sports Quick Links potentially used on numerous screens across SportsBook')
    .displayField('entryTitle');

  sportsQuickLinks.createField('entryTitle').name('entryTitle').type('Symbol');

  sportsQuickLinks.createField('key').name('Key').type('Symbol').required(true).localized(false);

  sportsQuickLinks
    .createField('sportsLinks')
    .name('Sports Links')
    .type('Array')
    .localized(false)
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsLink'],
        },
      ],
    });

  sportsQuickLinks
    .createField('venture')
    .name('Venture')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['venture'],
      },
    ])
    .linkType('Entry');
}) as MigrationFunction;

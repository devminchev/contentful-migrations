import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsWidget = migration.editContentType('sportsWidget');
  sportsWidget.editField('component')
  .type('Link')
  .linkType('Entry')
  .required(true)
  .localized(true)
  .validations([
    {
      linkContentType: [
        'dxBanners', 
        'dxMarquee', 
        'dxQuickLinks', 
        'sportsPersonalisedFixtures'
      ]
    }
  ]);

}) as MigrationFunction;
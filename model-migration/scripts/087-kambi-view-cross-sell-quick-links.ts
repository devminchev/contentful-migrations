import {MigrationFunction} from 'contentful-migration';

export = ((migration) => {

  const widget = migration.editContentType('sportsWidget');
  // Updating Widget to allow Cross Sell Quick Links
  widget
    .editField('component')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .localized(true)
    .validations([
      {
        linkContentType: ['dxBanners', 'dxQuickLinks']
      }
    ]);
    
  const dxQuickLinks = migration.editContentType('dxQuickLinks');
  dxQuickLinks
    .createField('shouldIncludeVaix')
    .name('Should Include Vaix')
    .type('Boolean')
    .localized(false)
    .required(false)
    .defaultValue({
      'en-US': false
    });

  dxQuickLinks.moveField('shouldIncludeVaix').afterField('type');

}) as MigrationFunction;

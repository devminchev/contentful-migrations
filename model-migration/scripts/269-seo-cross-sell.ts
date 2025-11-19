import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const seoGlobalSettings = migration.editContentType('seoGlobalSettings')
  seoGlobalSettings.createField('gamePageCrossSell')
    .name('Game Page Cross Sell')
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            "dxBanners",
            "dxQuickLinks",
            "seoComponent"
          ],
        }
      ],
    });
  seoGlobalSettings.changeFieldControl('gamePageCrossSell', 'builtin', 'entryLinksEditor', {
    helpText: 'A set of components that are used for Cross Sell on all the Game Pages.'
  });

  seoGlobalSettings.createField('blogPageCrossSell')
    .name('Blog Page Cross Sell')
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            "dxBanners",
            "dxQuickLinks",
            "seoComponent"
          ],
        }
      ],
    });
  seoGlobalSettings.changeFieldControl('blogPageCrossSell', 'builtin', 'entryLinksEditor', {
    helpText: 'A set of components that are used for Cross Sell on all the Blog Pages.'
  });

  seoGlobalSettings.moveField('gamePageCrossSell').afterField('msvalidate01');
  seoGlobalSettings.moveField('blogPageCrossSell').afterField('gamePageCrossSell');

  // Add Cross Sell Override to Game Page
  const seoGame = migration.editContentType('seoGame')
  seoGame.createField('crossSellOverride')
    .name('Cross Sell Override')
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            "dxBanners",
            "dxQuickLinks",
            "seoComponent"
          ],
        }
      ],
    });
  seoGame.changeFieldControl('crossSellOverride', 'builtin', 'entryLinksEditor', {
    helpText: 'A set of components that are used to override the Cross Sell component set in Global Settings for this specific Game Page.'
  });

  seoGame.moveField('crossSellOverride').afterField('numericalOrder');

  // Add Cross Sell Override to Blog Page
  const seoBlog = migration.editContentType('seoBlog')
  seoBlog.createField('crossSellOverride')
    .name('Cross Sell Override')
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            "dxBanners",
            "dxQuickLinks",
            "seoComponent"
          ],
        }
      ],
    });
  seoBlog.changeFieldControl('crossSellOverride', 'builtin', 'entryLinksEditor', {
    helpText: 'A set of components that are used to override the Cross Sell component set in Global Settings for this specific Blog Page.'
  });

  seoBlog.moveField('crossSellOverride').afterField('numericalOrder');

}) as MigrationFunction;

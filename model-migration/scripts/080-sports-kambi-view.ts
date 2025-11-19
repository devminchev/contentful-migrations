import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const sportsKambiView = migration.createContentType('sportsKambiView').name('Sports Kambi View').description('The Sports Kambi View uses the Kambi client setup to create a view.').displayField('entryTitle');
  sportsKambiView.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  sportsKambiView
    .createField('widgets')
    .name('Widgets')
    .type('Array')
    .required(true)
    .localized(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['sportsWidgets']
        }
      ]
    })
    .validations([
      {
        size: { max: 45 }
      }
    ]);

  sportsKambiView
    .createField('brand')
    .name('Brand')
    .type('Link')
    .required(true)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxBrand'],
      }
    ]);

  sportsKambiView
    .createField('jurisdiction')
    .name('Jurisdiction')
    .type('Link')
    .required(false)
    .linkType('Entry')
    .validations([
      {
        linkContentType: ['dxJurisdiction']
      }
    ]);

  sportsKambiView
    .createField("platform")
    .name("Platform")
    .type("Array")
    .localized(false)
    .required(true)
    .validations([])
    .items({
      type: "Symbol",
      validations: [{
        in: ['WEB', 'ANDROID', 'IOS']
      }]
    });

  sportsKambiView.changeFieldControl("platform", "builtin", "checkbox", {
    helpText: "The platform where the Sports Kambi View should be active.",
  });

}) as MigrationFunction;
import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Dx Banner
  const dxBanner = migration.createContentType('dxBanner').name('Dx Banner').description('Digital Experience (Dx) Banner used to populate Dx Banners').displayField('entryTitle');

  dxBanner.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  dxBanner.createField('description').name('Description').type('Symbol').localized(true).required(false);
  dxBanner.createField('image').name('Image').type('Symbol').required(true).localized(true);
  dxBanner.createField('url').name('URL').type('Symbol').required(true);

  dxBanner.changeFieldControl('description', 'builtin', 'singleLine', {
    helpText: 'Enter a description that can be used for alt text and accessibility purposes on the front end for the user.'
  })


  // Dx Banners
  const dxBanners = migration.createContentType('dxBanners').name('Dx Banners').description('Digital Experience (Dx) Banners that will redirect Users to the Casino View').displayField('entryTitle');

  dxBanners.createField('entryTitle').name('entryTitle').type('Symbol').required(true);
  dxBanners.createField('type')
    .name('Type')
    .type("Symbol")
    .required(true)
    .validations([
      {
        in: ['medium', 'slimline', 'multi_tile']
      }
    ]);
  dxBanners.changeFieldControl("type", "builtin", "radio", {
    helpText: "The type of banner styling which the Dx Banners will be using.",
  });

  dxBanners.createField('banners')
    .name('Banners')
    .type('Array')
    .required(true)
    .localized(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['dxBanner']
        }
      ]
    });

}) as MigrationFunction;
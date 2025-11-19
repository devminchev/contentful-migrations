import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const dxBanners = migration.editContentType('dxBanners');

  dxBanners
    .editField('type')
    .validations([
      {
        in: ['medium', 'slimline', 'multi_tile', 'carousel']
      }
    ]);
  dxBanners.changeFieldControl("type", "builtin", "radio", {
    helpText: "The type of banner styling which the Dx Banners will be using.",
  });

}) as MigrationFunction;
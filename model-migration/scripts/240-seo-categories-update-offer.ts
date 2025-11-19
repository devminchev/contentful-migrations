import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const seoCategory = migration.editContentType('seoCategory')

  seoCategory
    .createField('offer')
    .name('Offer')
    .type('Symbol')
    .localized(true)
    .required(false);

  seoCategory.changeFieldControl("offer", "builtin", "singleLine", {
    helpText: "The Offer text to be displayed when attached to a Game.",
  });

}) as MigrationFunction;

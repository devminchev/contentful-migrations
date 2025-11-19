import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  // Seo Provider
  const seoProvider = migration.createContentType('seoProvider').name('SEO Provider').description("SEO Provider contains information on a Company that provides the site's games").displayField('entryTitle');
  seoProvider.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  seoProvider
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true)
    .localized(false)
  seoProvider.changeFieldControl("name", "builtin", "singleLine", {
    helpText: "The Name of the Provider.",
  });

  seoProvider
    .createField("bynderImage")
    .name("Bynder Image")
    .type('Object')
    .required(false)
    .localized(false)
  seoProvider.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image to be used for the Provider.',
  });

  seoProvider
    .createField('legalInfo')
    .name('Legal Info')
    .type('Object')
    .localized(true)
    .required(false);
  seoProvider.changeFieldControl("legalInfo", "app", "z2LsIOTTtkiEsfv1iiqtr", {
    helpText: "Legal Information for the Provider, such as Copyright and All Rights Reserved.",
  });

}) as MigrationFunction;

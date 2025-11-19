import { MigrationFunction } from 'contentful-migration';

export = ((migration) => {

  const bynderAsset = migration.createContentType('bynderAsset').name('Bynder Asset').description("A simple model to be used in the Rich Text Editor to display a single Bynder Image or Video.").displayField('entryTitle');
  bynderAsset.createField('entryTitle').name('entryTitle').type('Symbol').required(true);

  bynderAsset
    .createField("asset")
    .name("Asset")
    .type('Object')
    .required(true);
  bynderAsset.changeFieldControl('asset', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'The Bynder image or video to be used.',
  });

  bynderAsset
    .createField("caption")
    .name("Caption")
    .type('Symbol')
    .required(false)
    .localized(true);
  bynderAsset.changeFieldControl('caption', 'builtin', 'singleLine', {
    helpText: 'A caption for the Bynder asset. This will be returned as a html caption in the response for the Front End.'
  });

}) as MigrationFunction;

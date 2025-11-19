import { MigrationFunction } from "contentful-migration";

export = ((migration) => {

  const seoBlog = migration.editContentType('seoBlog');
  const seoGame = migration.editContentType('seoGame');
  const dxBanner = migration.editContentType('dxBanner');

  seoBlog.createField('bynderImageVariants')
    .name('Bynder Image Variants')
    .type('Object')
    .required(false)
    .localized(true);
  seoBlog.changeFieldControl('bynderImageVariants', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'A set of Bynder images to be used for the different variants of the image based on their screen size metadata.',
  });
  seoBlog.moveField('bynderImageVariants').afterField('bynderImage');

  seoGame.createField('bynderImageVariants')
    .name('Bynder Image Variants')
    .type('Object')
    .required(false)
    .localized(true);
  seoGame.changeFieldControl('bynderImageVariants', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'A set of Bynder images to be used for the different variants of the image based on their screen size metadata.',
  });
  seoGame.moveField('bynderImageVariants').afterField('bynderImage');

  dxBanner.createField('bynderImageVariants')
    .name('Bynder Image Variants')
    .type('Object')
    .required(false)
    .localized(true);
  dxBanner.changeFieldControl('bynderImageVariants', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'A set of Bynder images to be used for the different variants of the image based on their screen size metadata.',
  });
  dxBanner.moveField('bynderImageVariants').afterField('bynderImage');

}) as MigrationFunction;
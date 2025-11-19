import { MigrationFunction } from "contentful-migration";

export = ((migration) => {

  // Seo Blog
  const seoBlog = migration.editContentType('seoBlog');

  seoBlog.editField('bynderImage').required(false);
  seoBlog.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'To be DEPRECATED - use Bynder Image Variants field instead.'
  });

  // Seo Games
  const seoGame = migration.editContentType('seoGame');

  seoGame.editField('bynderImage').required(false);
  seoGame.changeFieldControl('bynderImage', 'app', '5KySdUzG7OWuCE2V3fgtIa', {
    helpText: 'To be DEPRECATED - use Bynder Image Variants field instead.'
  });

  // Dx Banner
  const dxBanner = migration.editContentType('dxBanner');
  dxBanner.editField('bynderImage').required(false);

}) as MigrationFunction;

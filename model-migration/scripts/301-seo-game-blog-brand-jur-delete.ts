import { MigrationFunction } from "contentful-migration";

export = ((migration) => {

  // Seo Blog
  const seoBlog = migration.editContentType('seoBlog');
  seoBlog.deleteField('brand');

  // Seo Game
  const seoGame = migration.editContentType('seoGame');
  seoGame.deleteField('brand');
  seoGame.deleteField('jurisdiction');

}) as MigrationFunction;
